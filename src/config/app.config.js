import { appConfig } from './env';

export const APP_CONFIG = {
  name: appConfig.name,
  defaultPageSize: 10,
  maxPageSize: 100,
  debounceMs: 300,
};

export default APP_CONFIG;
