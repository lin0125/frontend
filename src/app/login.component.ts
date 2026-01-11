// import { Component, OnInit, Inject, PLATFORM_ID ,Optional } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { Router } from '@angular/router';
// import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
// import { ApiService } from './service/api.service';
// import { AuthService } from './service/auth.service';

// console.log('login.component.ts 檔案已載入');
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, GoogleSigninButtonModule],
//   templateUrl: './login.component.html'
// })

// export class LoginComponent implements OnInit {
//   isBrowser: boolean;

//   constructor(
//     private apiService: ApiService,
//     private authService: AuthService,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object,
//     // 修正：必須明確加上 @Optional()，否則找不到 Service 時會報錯導致白屏
//     @Optional() private socialAuthService: SocialAuthService 
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//     console.log('👉 [View Check] isBrowser 的值為:', this.isBrowser); 
//   }

//   ngOnInit(){
//     // 增加防呆：確保是在瀏覽器且 service 存在才訂閱
//     if (this.isBrowser && this.socialAuthService) {
//       this.socialAuthService.authState.subscribe((user: any) => {
//         console.log('Google User:', user); // 建議：加入 log 確認是否有反應
//         if (user && user.idToken) {
//           this.apiService.googleLogin(user.idToken).subscribe({
//             next: (res: any) => {
//               if (res.ok && res.data.token) {
//                 this.authService.setLoginStatus(true, res.data.token);
//                 this.router.navigate(['/dashboard']);
//               }
//             },
//             error: (err: any) => console.error('後端驗證失敗', err)
//           });
//         }
//       });
//     } else {
//         if(this.isBrowser) {
//             console.warn('SocialAuthService 未正確注入，請檢查 app.config.ts');
//         }
//     }
//   }

// }

// ✅ 1. 從 @angular/core 匯入 Inject 和 PLATFORM_ID
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

// ✅ 2. 從 @angular/common 匯入 isPlatformBrowser
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

console.log('✅ login.component.ts 檔案已載入 - SSR 安全版 (含完整 Imports)');

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  isBrowser: boolean;

  // ✅ 這裡需要用到 Inject 和 PLATFORM_ID，所以上方必須匯入
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ✅ 這裡需要用到 isPlatformBrowser，所以上方必須匯入
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('👉 [View Check] isBrowser:', this.isBrowser); 
  }

  ngOnInit() {
    console.log('👉 [View Check] Login ngOnInit 執行了！');
  }
}