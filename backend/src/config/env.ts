const requiredEnvVars = [
  "PORT",
  "CLIENT_URL",
  "NODE_ENV",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
] as const;

function getRequiredEnvVar(name: (typeof requiredEnvVars)[number]) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: getRequiredEnvVar("PORT"),
  clientUrl: getRequiredEnvVar("CLIENT_URL"),
  nodeEnv: getRequiredEnvVar("NODE_ENV"),
  databaseUrl: getRequiredEnvVar("DATABASE_URL"),
  jwtSecret: getRequiredEnvVar("JWT_SECRET"),
  jwtExpiresIn: getRequiredEnvVar("JWT_EXPIRES_IN"),
};
