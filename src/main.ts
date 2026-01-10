import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// 載入 config.json 並掛上 globalThis
fetch('/assets/config.json')
  .then((res) => {
    if (!res.ok) throw new Error('Failed to load config.json');
    return res.json();
  })
  .then((config) => {
    globalThis.APP_CONFIG = config;

    return bootstrapApplication(AppComponent, appConfig);
  })
  .catch((err) => console.error('App init error:', err));
