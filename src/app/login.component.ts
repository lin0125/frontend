import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
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
    // 使用 Optional 裝飾器防止在 Server 端因為找不到 Provider 而崩潰
    @Inject(SocialAuthService) private socialAuthService: any 
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // 只有在瀏覽器才執行訂閱
    if (this.isBrowser && this.socialAuthService) {
      this.socialAuthService.authState.subscribe((user: any) => {
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
  }
}