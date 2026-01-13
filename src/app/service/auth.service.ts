import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core'; // 1. 加入 Optional
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login'; // 2. 引入 SocialAuthService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    // 3. 注入 SocialAuthService (加 @Optional 以防測試環境沒有)
    @Optional() private socialAuthService: SocialAuthService 
  ) {
    // if (isPlatformBrowser(this.platformId)) {
    //   const token = localStorage.getItem('jwt_token');
    //   // ✅ 修改後：如果有 Token，不只更新狀態，還直接跳轉去 Dashboard
    //   if (token) {
    //     this.loggedIn.next(true);
    //     this.router.navigate(['/dashboard']);
    //     }
    // }
    // ✅ 或是強制清除 Token
    if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('jwt_token');
        this.loggedIn.next(false);
    }
  }

  loginSuccess(token?: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('jwt_token', token);
      }
    }
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  // 4. 修改 logout 方法
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      
      // 這裡呼叫 Google 登出
      // 檢查 socialAuthService 是否存在 (避免 SSR 報錯)
      if (this.socialAuthService) {
        this.socialAuthService.signOut().catch(err => {
            // 即使 Google 登出失敗 (例如使用者本來就沒登入 Google)，我們也要繼續執行本地登出
            console.log('Google signOut completed or failed (ignoring):', err);
        });
      }
    }
    
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }
}