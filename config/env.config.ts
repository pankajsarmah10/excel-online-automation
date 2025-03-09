export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl?: string;
  environment: "dev" | "staging" | "prod";
}

export const environmentConfig: Record<string, EnvironmentConfig> = {
  dev: {
    //Fake values to showcase usage
    baseUrl: "https://dev.office.com",
    apiBaseUrl: "https://dev-api.office.com",
    environment: "dev",
  },
  staging: {
    baseUrl: "https://office.live.com/start/Excel.aspx",
    apiBaseUrl: "https://staging-api.office.com", //Fake URL to showcase usage
    environment: "staging",
  },
  prod: {
    //Fake values to showcase usage
    baseUrl: "https://office.com",
    apiBaseUrl: "https://api.office.com",
    environment: "prod",
  },
};

/**
 * If environment variable 'TEST_ENV' is defined, use that environment. Else use staging environment by default.
 * @returns
 */
export const getCurrentEnvironment = (): EnvironmentConfig => {
  const env = process.env.TEST_ENV || "staging";
  return environmentConfig[env];
};
