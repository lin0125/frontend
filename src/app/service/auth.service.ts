import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. 使用 BehaviorSubject 保存狀態，預設為 false
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  // 2. 公開的 Observable 供外部訂閱
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, // 保留 SSR 檢查機制
    private router: Router                           // 加入 Router 用於跳轉
  ) {
    // 3. 建構子初始化：只在瀏覽器環境下檢查 localStorage
    // 這樣可以避免 SSR (Server Side Rendering) 時報錯
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwt_token');
      this.loggedIn.next(!!token); // 如果有 token 就設為 true
    }
  }

  // 4. 登入成功處理
  loginSuccess(token?: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('jwt_token', token); // 統一使用 'jwt_token'
      }
    }
    this.loggedIn.next(true); // 更新狀態
    this.router.navigate(['/dashboard']); // 導向主頁
  }

  // 5. 登出處理
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
    }
    this.loggedIn.next(false); // 更新狀態
    this.router.navigate(['/login']); // 導向登入頁
  }

  // (選用) 獲取當前 Token 的方法，方便 Interceptor 使用
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }
}