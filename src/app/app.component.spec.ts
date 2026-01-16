import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';

export class AppComponent implements OnInit {
  userRole: string | null = null; // 用於 HTML 判斷

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    // 🟢 訂閱角色變動
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });
    
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }

  logout() {
    this.authService.logout();
  }
}