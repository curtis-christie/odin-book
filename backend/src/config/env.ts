const requiredEnvVars = ["PORT", "CLIENT_URL", "NODE_ENV"] as const;

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
};
