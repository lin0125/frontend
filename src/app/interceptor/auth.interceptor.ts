import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 1. 如果請求已經有 Authorization Header (例如 Grafana API)，則不覆蓋
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  // 2. 如果請求是登入 API (尚未有 Token)，也可以選擇直接略過 (非必須，因為此時 Token 應該是 null)
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