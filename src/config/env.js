/**
 * Validated environment configuration.
 */

const env = import.meta.env;

export const appConfig = {
  name: env.VITE_APP_NAME ?? 'Job Portal',
  apiUrl: env.VITE_API_URL ?? 'https://job-portal-backend-1-dv1h.onrender.com/api/v1',
  isDev: env.DEV,
  isProd: env.PROD,
};

export function sanitizeMediaUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return url;
  if (url.startsWith('http://localhost:8080')) {
    const apiBase = appConfig.apiUrl ?? '';
    if (!apiBase.includes('localhost:8080')) {
      const liveBase = apiBase.split('/api/v1')[0];
      return url.replace('http://localhost:8080', liveBase);
    }
  }
  return url;
}

export default appConfig;

