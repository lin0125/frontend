import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 初始化檢查 localStorage 是否有 Token
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('jwt_token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  setLoginStatus(status: boolean, token?: string) {
    if (status && token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
    this.loggedIn.next(status);
  }

  logout() {
    this.setLoginStatus(false);
  }
}