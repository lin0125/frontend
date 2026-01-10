import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./app.component.scss'], // 沿用主樣式或自訂
  imports: [CommonModule, GoogleSigninButtonModule]
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
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      // 修正 TS2345: 確保 idToken 存在才傳送
      if (user && user.idToken) {
        this.apiService.googleLogin(user.idToken).subscribe({
          next: (res: any) => {
            if (res.ok && res.data.token) {
              this.authService.setLoginStatus(true, res.data.token);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (err: any) => console.error('後端驗證失敗', err)
        });
      }
    });
  }

  // 修正 NG9: 補上 HTML 中呼叫的方法
  handleGoogleLogin() {
    console.log('Google login button clicked');
    // 如果使用 asl-google-signin-button，通常按鈕會自行處理觸發，
    // 此方法留空即可讓編譯通過。
  }
}