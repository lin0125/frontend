import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
// 導入需要的類別
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    // 修正：確保配置正確注入
    {
      provide: 'SocialAuthServiceConfig', // 必須是這個字串
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '829749553754-n0shre848o0m0pnt2onm2pghu0u5v8j9.apps.googleusercontent.com' // 這是你的 ID
            )
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig
    }
  ]
};