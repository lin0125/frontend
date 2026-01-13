import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 🔴 修改這裡：加入 withInterceptors
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { provideClientHydration } from '@angular/platform-browser';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
// 記得引入您剛建立的 interceptor
import { authInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    
    // 修改這裡：註冊 interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ),
    
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '868530418816-q048np79b82kem0ae6j9avqe9bsrpeov.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => console.error(err)
      } as SocialAuthServiceConfig,
    }
  ]
};