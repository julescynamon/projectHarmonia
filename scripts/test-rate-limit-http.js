// scripts/test-rate-limit-http.js
// Script pour tester le rate limiting avec des requêtes HTTP réelles

const http = require("http");

// Configuration
const BASE_URL = "http://localhost:3000";
const TEST_ENDPOINT = "/api/test-rate-limit";
const TOTAL_REQUESTS = 110; // Plus que la limite de 100
const DELAY_BETWEEN_REQUESTS = 50; // 50ms entre les requêtes

// Statistiques
let successCount = 0;
let rateLimitCount = 0;
let errorCount = 0;
let startTime = Date.now();

// Fonction pour faire une requête HTTP
function makeRequest(requestNumber) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${TEST_ENDPOINT}`, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const response = {
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data),
        };

        // Analyser la réponse
        if (res.statusCode === 200) {
          successCount++;
          console.log(
            `✅ Requête ${requestNumber}: Succès (${response.headers["x-ratelimit-remaining"]} restantes)`
          );
        } else if (res.statusCode === 429) {
          rateLimitCount++;
          const retryAfter = response.headers["retry-after"];
          console.log(
            `❌ Requête ${requestNumber}: Rate limit dépassé (retry après ${retryAfter}s)`
          );
        } else {
          errorCount++;
          console.log(`🚨 Requête ${requestNumber}: Erreur ${res.statusCode}`);
        }

        resolve(response);
      });
    });

    req.on("error", (error) => {
      errorCount++;
      console.log(
        `🚨 Requête ${requestNumber}: Erreur réseau - ${error.message}`
      );
      resolve({ error: error.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      errorCount++;
      console.log(`⏰ Requête ${requestNumber}: Timeout`);
      resolve({ error: "Timeout" });
    });
  });
}

// Fonction pour faire des requêtes séquentielles
async function makeSequentialRequests() {
  console.log(`🚀 Début des tests avec ${TOTAL_REQUESTS} requêtes...\n`);

  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    await makeRequest(i);

    // Délai entre les requêtes
    if (i < TOTAL_REQUESTS) {
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_REQUESTS)
      );
    }
  }
}

// Fonction pour faire des requêtes parallèles
async function makeParallelRequests() {
  console.log(
    `🚀 Début des tests parallèles avec ${TOTAL_REQUESTS} requêtes...\n`
  );

  const promises = [];
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    promises.push(makeRequest(i));
  }

  await Promise.all(promises);
}

// Fonction pour afficher les statistiques
function displayStats() {
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log("\n📊 Statistiques finales:");
  console.log("========================");
  console.log(`⏱️  Durée totale: ${duration}ms`);
  console.log(`📈 Requêtes réussies: ${successCount}`);
  console.log(`🚫 Requêtes limitées: ${rateLimitCount}`);
  console.log(`🚨 Requêtes en erreur: ${errorCount}`);
  console.log(`📊 Total: ${successCount + rateLimitCount + errorCount}`);
  console.log(
    `⚡ Moyenne: ${(duration / TOTAL_REQUESTS).toFixed(2)}ms par requête`
  );

  if (rateLimitCount > 0) {
    console.log(`✅ Rate limiting fonctionne correctement!`);
  } else {
    console.log(`⚠️  Aucune limitation détectée - vérifiez la configuration`);
  }
}

// Fonction pour tester différents endpoints
async function testDifferentEndpoints() {
  console.log("\n🔍 Test de différents endpoints...\n");

  const endpoints = [
    "/api/users",
    "/api/products",
    "/api/stats",
    "/api/test-rate-limit",
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint}:`);

    for (let i = 1; i <= 5; i++) {
      const response = await makeRequest(`${endpoint} #${i}`);
      if (response.statusCode === 200) {
        console.log(`  ✅ ${endpoint} #${i}: Succès`);
      } else if (response.statusCode === 429) {
        console.log(`  ❌ ${endpoint} #${i}: Rate limit`);
        break; // Arrêter si rate limit atteint
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log("");
  }
}

// Fonction pour tester avec différents User-Agents
async function testWithDifferentUserAgents() {
  console.log("\n🌐 Test avec différents User-Agents...\n");

  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    "PostmanRuntime/7.29.0",
    "curl/7.68.0",
  ];

  for (const userAgent of userAgents) {
    console.log(`Testing with User-Agent: ${userAgent.substring(0, 50)}...`);

    const response = await new Promise((resolve) => {
      const req = http.get(
        `${BASE_URL}${TEST_ENDPOINT}`,
        {
          headers: {
            "User-Agent": userAgent,
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: JSON.parse(data),
            });
          });
        }
      );

      req.on("error", (error) => {
        resolve({ error: error.message });
      });
    });

    if (response.statusCode === 200) {
      console.log(
        `  ✅ Succès (${response.headers["x-ratelimit-remaining"]} restantes)`
      );
    } else if (response.statusCode === 429) {
      console.log(`  ❌ Rate limit dépassé`);
    } else {
      console.log(`  🚨 Erreur ${response.statusCode}`);
    }
  }
}

// Fonction principale
async function runTests() {
  try {
    // Test 1: Requêtes séquentielles
    console.log("🧪 Test 1: Requêtes séquentielles");
    await makeSequentialRequests();
    displayStats();

    // Réinitialiser les compteurs
    successCount = 0;
    rateLimitCount = 0;
    errorCount = 0;
    startTime = Date.now();

    // Attendre un peu avant le test suivant
    console.log("\n⏳ Attente de 2 secondes avant le test suivant...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Test 2: Requêtes parallèles
    console.log("🧪 Test 2: Requêtes parallèles");
    await makeParallelRequests();
    displayStats();

    // Test 3: Différents endpoints
    await testDifferentEndpoints();

    // Test 4: Différents User-Agents
    await testWithDifferentUserAgents();

    console.log("\n🎉 Tous les tests terminés!");
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
  }
}

// Vérifier si le serveur est accessible
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on("error", () => {
      resolve(false);
    });

    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Point d'entrée
async function main() {
  console.log("🔍 Vérification de l'accessibilité du serveur...");

  const serverAvailable = await checkServer();

  if (!serverAvailable) {
    console.error("❌ Serveur non accessible sur", BASE_URL);
    console.log("💡 Assurez-vous que le serveur Express est démarré:");
    console.log("   node examples/express-rate-limiting.js");
    process.exit(1);
  }

  console.log("✅ Serveur accessible, début des tests...\n");

  await runTests();
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  makeRequest,
  makeSequentialRequests,
  makeParallelRequests,
  testDifferentEndpoints,
  testWithDifferentUserAgents,
};
