import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isNavClosed = false;
  isLoggedIn$: Observable<boolean>;
  // 新增：用來存儲當前角色的變數
  userRole: string | null = null;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    // 訂閱角色狀態，以便在 HTML 中使用 currentUserRole 判斷權限
    // 假設您的 AuthService 中有一個 userRole$ 的 Observable
    this.authService.userRole$.subscribe((role: string | null) => {
      this.userRole = role;
    });
  }

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }

  logout() {
    this.authService.logout();
    this.userRole = null; // 登出時清空角色
  }
}