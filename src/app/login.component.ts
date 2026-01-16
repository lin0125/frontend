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
      
      // 1. 提取 JWT Token (根據您後端的 CommonResponse 結構，通常在 res.data.token)
      const jwt = res.data?.token;
      
      // 2. 提取角色資訊 (對應後端 UserImpl.java 中的 data.put("userRole", userToProcess.getRole()))
      const role = res.data?.userRole; 

      if (jwt) {
        console.log('取得角色:', role);
        
        // 3. 呼叫更新後的 loginSuccess，同時傳入 token 與 role
        // 這會觸發 AuthService 中的 roleSubject，進而更新側邊欄的顯示狀態
        this.authService.loginSuccess(jwt, role); 
        
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
}