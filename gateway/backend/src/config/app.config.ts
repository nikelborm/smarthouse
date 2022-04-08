export const appConfig = () => ({
  isDevelopment: process.env.PROJECT_ENV_TYPE === 'development',
  isProduction: process.env.PROJECT_ENV_TYPE === 'production',
  serverPort: parseInt(process.env.SERVER_PORT || '3000', 10),
  apiKey: process.env.API_KEY || '',
  webSocketServerPort: 4999,
  gatewayUUID: process.env.GATEWAY_UUID,
  serialPortPatterns: [/^ttyAMA/i, /^ttyUSB/i, /^ttyACM/i],
  mockDataFillerScriptMethodName:
    process.env.MOCK_DATA_FILLER_SCRIPT_METHOD_NAME,
});
