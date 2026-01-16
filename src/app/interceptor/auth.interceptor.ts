import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../service/auth.service'; // 修正 1: 取消註解，必須匯入類別才能 inject

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID) as Object;
  const authService = inject(AuthService); // 修正 2: 現在 AuthService 已匯入，這行不會報錯
  
  // 修正 3: 將 token 宣告為 let，並且先初始化為 null
  let token: string | null = null;

  // 修正 4: 只有在瀏覽器環境下才去存取 localStorage，並統一 Key 名稱
  if (isPlatformBrowser(platformId)) {
    // 這裡建議確認你的 Key 是 'token' 還是 'jwt_token'，我暫用 'token'
    token = localStorage.getItem('token'); 
  }

  // 1. 如果請求已經有 Authorization Header (例如 Grafana API)，則不覆蓋
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  // 2. 如果請求是登入 API，直接略過
  if (req.url.includes('/auth/google')) {
    return next(req);
  }

  // 3. 如果有 Token，就 Clone 請求並加上 Header
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 4. 沒有 Token 則維持原樣
  return next(req);
};