import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  // 加入一個旗標來控制按鈕顯示
  showButton = false;

  constructor(
    private socialAuthService: SocialAuthService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // 只有在瀏覽器環境才允許顯示按鈕
    this.showButton = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.socialAuthService.authState.subscribe((user) => {
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