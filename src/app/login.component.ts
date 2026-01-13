import { Component, OnInit, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
// 引入 Google 登入相關模組
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';
import { Component } from '@angular/core';
import { AuthService } from './service/auth.service'; // 引入 AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  isBrowser: boolean;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private socialAuthService: SocialAuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // 只有在瀏覽器環境才執行登入監聽
    if (this.isBrowser && this.socialAuthService) {
      console.log('👉 初始化 Google 登入監聽...');
      this.socialAuthService.authState.subscribe({
        next: (user: SocialUser) => {
          console.log('👉 Google 登入成功，User:', user);
          
          if (user && user.idToken) {
            console.log('正在傳送 Token 到後端驗證...');
            this.loginToBackend(user.idToken);
          }
        },
        error: (err) => console.error('Google Auth Error:', err)
      });
    }
  }

  loginToBackend(token: string) {
    this.apiService.googleLogin(token).subscribe({
      next: (res: any) => {
        console.log('✅ 後端回應:', res);
        // 嘗試取得 token (相容 res.data.token 或 res.token)
        const jwt = res.data?.token || res.token || (res.data && typeof res.data === 'string' ? res.data : null);
        
        if (jwt) {
          this.authService.setLoginStatus(true, jwt);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('後端回應成功但沒有 Token');
        }
      },
      error: (err: any) => {
        console.error('❌ 後端驗證失敗:', err);
        alert('登入失敗: ' + (err.error?.message || '請檢查後端連線'));
      }
    });
  }
  handleLoginResponse(response: any) {
    console.log('Backend response:', response);

    if (response.success) { // 根據您的後端回應結構判斷
      // 這裡呼叫 AuthService 更新狀態
      // 如果後端有回傳 JWT token，記得傳進去
      const token = response.token || 'dummy-token'; 
      this.authService.loginSuccess(token);
    }
  }
}