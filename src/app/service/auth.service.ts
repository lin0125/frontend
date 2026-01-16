import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  // 🟢 新增：角色的狀態管理
  private roleSubject = new BehaviorSubject<string | null>(null);
  public userRole$ = this.roleSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    @Optional() private socialAuthService: SocialAuthService 
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // 刷新時初始化清空
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role'); // 🟢 新增：清空角色
      
      this.loggedIn.next(false);
      this.roleSubject.next(null); // 🟢 新增：重設角色狀態

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 0);
    }
  }

  // 🟢 修改：支援傳入角色
  loginSuccess(token?: string, role?: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (token) localStorage.setItem('jwt_token', token);
      if (role) {
        localStorage.setItem('user_role', role); // 🟢 保存角色
        this.roleSubject.next(role);             // 🟢 更新 Subject
      }
    }
    this.loggedIn.next(true);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_role'); // 🟢 新增：移除角色存檔
      
      if (this.socialAuthService) {
        this.socialAuthService.signOut().catch(err => {
            console.log('Google signOut completed or failed (ignoring):', err);
        });
      }
    }
    
    this.loggedIn.next(false);
    this.roleSubject.next(null); // 🟢 新增：清空角色狀態通知
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }
}