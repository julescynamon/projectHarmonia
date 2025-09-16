import pino from 'pino';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "PUBLIC_CSRF_TOKEN": "9d70b4208a8a0f7c16be138ccc5a4c7723558ce6c7d91a61b70f5230263a810f", "PUBLIC_EMAILJS_KEY": "hYOZPnj8ZGm4yvGPI", "PUBLIC_EMAILJS_SERVICE_ID": "service_xgmpya7", "PUBLIC_EMAILJS_TEMPLATE_ID": "template_w65sa59", "PUBLIC_SITE_URL": "https://project-harmonia.vercel.app", "PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dGh0ZWJqdm11dHV2enZ0dGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTM5NTgsImV4cCI6MjA1MjI2OTk1OH0.gpI9njtvd6Mu_0wTnwfvtx0bFpUDNexuzwu3hgOGDdY", "PUBLIC_SUPABASE_URL": "https://hvthtebjvmutuvzvttdb.supabase.co", "SITE": "https://project-harmonia.vercel.app", "SSR": true};
const isDevelopment = Object.assign(__vite_import_meta_env__, { NODE: process.env.NODE, _: process.env._, NODE_ENV: process.env.NODE_ENV })?.DEV || process.env.NODE_ENV === "development";
const isProduction = Object.assign(__vite_import_meta_env__, { NODE: process.env.NODE, _: process.env._, NODE_ENV: process.env.NODE_ENV })?.PROD || process.env.NODE_ENV === "production";
const baseConfig = {
  level: isDevelopment ? "debug" : "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    }
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err
  }
};
const devConfig = {
  ...baseConfig,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  }
};
const prodConfig = {
  ...baseConfig,
  level: "info"
};
const logger = pino(isDevelopment ? devConfig : prodConfig);
const errorLogger = pino({
  ...baseConfig,
  level: "error",
  name: "error-logger"
});
pino({
  ...baseConfig,
  level: "warn",
  name: "security-logger"
});
const stripeLogger = pino({
  ...baseConfig,
  level: "info",
  name: "stripe-logger"
});
pino({
  ...baseConfig,
  level: "info",
  name: "supabase-logger"
});
function createContextLogger(context) {
  return logger.child(context);
}
function logError(error, context = {}) {
  const errorLog = {
    ...context,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  errorLogger.error(errorLog);
  if (isProduction) {
    console.error("Erreur critique:", errorLog);
  }
}
function logStripeEvent(event, data, context = {}) {
  const stripeLog = {
    ...context,
    event,
    data: {
      id: data.id,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      status: data.status
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  stripeLogger.info(stripeLog);
}

export { logger as a, logStripeEvent as b, createContextLogger as c, logError as l };
