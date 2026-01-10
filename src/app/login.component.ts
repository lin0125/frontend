import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ApiService } from '../service/api.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1>AI-COS 系統登入</h1>
        <p>請使用 Google 帳號以繼續</p>
        <asl-google-signin-button type="standard" size="large"></asl-google-signin-button>
      </div>
    </div>
  `,
  styles: [`
    .login-page { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
    .login-card { padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
  `]
})
export class LoginComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // 監聽 Google 登入狀態
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        // 將 Google 提供的 idToken 傳送至後端
        this.apiService.googleLogin(user.idToken).subscribe({
          next: (res) => {
            if (res.ok && res.data.token) {
              // 登入成功，儲存 JWT 並跳轉
              this.authService.setLoginStatus(true, res.data.token);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err) => console.error('後端驗證失敗', err)
        });
      }
    });
  }
}