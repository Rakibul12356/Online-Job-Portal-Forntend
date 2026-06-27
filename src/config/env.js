/**
 * Validated environment configuration.
 */

const env = import.meta.env;

export const appConfig = {
  name: env.VITE_APP_NAME ?? 'Job Portal',
  isDev: env.DEV,
  isProd: env.PROD,
};

export default appConfig;
