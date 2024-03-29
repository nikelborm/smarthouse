export const appConfig = () => ({
  isDevelopment: process.env.PROJECT_ENV_TYPE === 'development',
  isProduction: process.env.PROJECT_ENV_TYPE === 'production',
  serverPort: parseInt(process.env.SERVER_PORT || '3000', 10),
  authSecret: process.env.JWT_SECRET,
  apiKey: process.env.API_KEY || '',
  mockDataFillerScriptMethodName:
    process.env.MOCK_DATA_FILLER_SCRIPT_METHOD_NAME,
});
