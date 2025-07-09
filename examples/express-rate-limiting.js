// examples/express-rate-limiting.js
// Exemple d'utilisation du système de rate limiting avec Express.js

const express = require("express");
const {
  RateLimiter,
  MemoryStore,
  DEFAULT_RATE_LIMIT_CONFIG,
} = require("../src/lib/rate-limiter");

const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Initialiser le rate limiter
const store = new MemoryStore();
const limiter = new RateLimiter(store, DEFAULT_RATE_LIMIT_CONFIG);

// Middleware de rate limiting
const rateLimitMiddleware = async (req, res, next) => {
  try {
    // Obtenir l'identifiant de la requête
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      "unknown";

    const identifier = `${ip}:${req.path}`;

    // Vérifier la limite
    const result = await limiter.checkLimit(identifier);

    if (!result.success) {
      // Limite dépassée
      const errorResponse = limiter.createErrorResponse(result);
      const errorData = await errorResponse.json();

      return res
        .status(errorResponse.status)
        .set(Object.fromEntries(errorResponse.headers.entries()))
        .json(errorData);
    }

    // Ajouter les headers de rate limit
    res.set({
      "X-RateLimit-Limit": DEFAULT_RATE_LIMIT_CONFIG.maxRequests,
      "X-RateLimit-Remaining": result.remaining,
      "X-RateLimit-Reset": result.reset,
    });

    next();
  } catch (error) {
    console.error("Erreur rate limiting:", error);
    next(); // Continuer en cas d'erreur
  }
};

// Appliquer le rate limiting à toutes les routes API
app.use("/api", rateLimitMiddleware);

// Routes d'exemple
app.get("/api/users", (req, res) => {
  res.json({
    message: "Liste des utilisateurs",
    users: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ],
  });
});

app.post("/api/users", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nom requis" });
  }

  res.json({
    message: "Utilisateur créé",
    user: { id: Math.floor(Math.random() * 1000), name },
  });
});

app.get("/api/products", (req, res) => {
  res.json({
    message: "Liste des produits",
    products: [
      { id: 1, name: "Produit A", price: 10.99 },
      { id: 2, name: "Produit B", price: 20.5 },
      { id: 3, name: "Produit C", price: 15.75 },
    ],
  });
});

// Route pour tester le rate limiting
app.get("/api/test-rate-limit", (req, res) => {
  res.json({
    message: "Test de rate limiting",
    timestamp: new Date().toISOString(),
    headers: {
      "X-RateLimit-Limit": req.headers["x-ratelimit-limit"],
      "X-RateLimit-Remaining": req.headers["x-ratelimit-remaining"],
      "X-RateLimit-Reset": req.headers["x-ratelimit-reset"],
    },
  });
});

// Route pour les statistiques
app.get("/api/stats", (req, res) => {
  res.json({
    message: "Statistiques du serveur",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
});

// Route publique (sans rate limiting)
app.get("/", (req, res) => {
  res.json({
    message: "API Express avec Rate Limiting",
    endpoints: [
      "GET /api/users - Liste des utilisateurs",
      "POST /api/users - Créer un utilisateur",
      "GET /api/products - Liste des produits",
      "GET /api/test-rate-limit - Tester le rate limiting",
      "GET /api/stats - Statistiques du serveur",
    ],
    rateLimit: {
      windowMs: DEFAULT_RATE_LIMIT_CONFIG.windowMs,
      maxRequests: DEFAULT_RATE_LIMIT_CONFIG.maxRequests,
    },
  });
});

// Gestionnaire d'erreurs
app.use((err, req, res, next) => {
  console.error("Erreur:", err);
  res.status(500).json({
    error: "Erreur interne du serveur",
    message: err.message,
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur Express démarré sur http://localhost:${port}`);
  console.log(
    `📊 Rate limiting: ${DEFAULT_RATE_LIMIT_CONFIG.maxRequests} requêtes / ${DEFAULT_RATE_LIMIT_CONFIG.windowMs / 1000 / 60} minutes`
  );
  console.log(
    `🔗 Testez avec: curl http://localhost:${port}/api/test-rate-limit`
  );
});

// Nettoyer périodiquement le store mémoire
setInterval(
  () => {
    store.cleanup();
    console.log("🧹 Nettoyage du store mémoire effectué");
  },
  5 * 60 * 1000
); // Toutes les 5 minutes

// Gestion de l'arrêt propre
process.on("SIGINT", () => {
  console.log("\n🛑 Arrêt du serveur...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Arrêt du serveur...");
  process.exit(0);
});
