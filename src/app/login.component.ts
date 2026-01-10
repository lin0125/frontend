import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

// 修正路徑：從 ../ 改為 ./
import { ApiService } from './service/api.service';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html', // 確保你有這個 html 檔案
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
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        // 為 res 和 err 加上 : any 類型
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