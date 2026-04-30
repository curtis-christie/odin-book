const requiredEnvVars = ["PORT", "CLIENT_URL", "NODE_ENV"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  port: process.env.PORT,
  clientUrl: process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV,
};
