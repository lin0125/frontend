import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem('jwt_token');
    this.loggedIn.next(!!token);
  }
}
  setLoginStatus(status: boolean, token?: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (status && token) {
        localStorage.setItem('jwt_token', token);
      } else {
        localStorage.removeItem('jwt_token');
      }
    }
    this.loggedIn.next(status);
  }

  logout() {
    this.setLoginStatus(false);
  }
}