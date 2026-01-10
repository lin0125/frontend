export interface AppConfig {
  apiBaseUrl: string;
}

// 注意：定義 globalThis 上的屬性
declare global {
  var APP_CONFIG: AppConfig;
}

export const getAppConfig = (): AppConfig => {
  return globalThis.APP_CONFIG;
};
