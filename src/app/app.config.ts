import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
// 必須加入以下 import
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('868530418816-q048np79b82kem0ae6j9avqe9bsrpeov.apps.googleusercontent.com')
          }
        ],
        onError: (err: any) => console.error(err) // 指定 err 類型
      } as SocialAuthServiceConfig,
    }
  ]
};