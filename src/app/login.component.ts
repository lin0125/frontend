import { Component, OnInit, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
// 引入 Google 登入相關模組
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';

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
    // 使用 @Optional 防止在 Server 端渲染時崩潰
    @Optional() private socialAuthService: SocialAuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // 只有在瀏覽器環境才執行登入監聽
    if (this.isBrowser && this.socialAuthService) {
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
        // 請根據你後端實際的回傳結構調整，通常是 res.data.token 或 res.token
        // 假設你的 CommonResponse 結構是 { result: true, data: "JWT_STRING", ... }
        const jwt = res.data || res.token; 
        
        if (jwt) {
          this.authService.setLoginStatus(true, jwt);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('後端回應成功但沒有 Token');
        }
      },
      error: (err: any) => {
        console.error('❌ 後端驗證失敗:', err);
        alert('登入失敗，請檢查後端 Console (CORS 或 500 錯誤)');
      }
    });
  }
}