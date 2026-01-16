// src/app/global.ts

export interface AppConfig {
  apiBaseUrl: string;
}

// 定義 globalThis 上的屬性，防止開發時報錯
declare global {
  var APP_CONFIG: AppConfig;
}

export const getAppConfig = (): AppConfig => {
  // 確保在 globalThis.APP_CONFIG 存在時回傳，否則給予預設值
  return globalThis.APP_CONFIG || { apiBaseUrl: 'http://localhost:8080' };
};

// 🟢 導出 API_URL 常數，供 ApiService 使用
export const API_URL = getAppConfig().apiBaseUrl;