import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router'; // 注入 Router
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
  isLoggedIn = false;
  isLoggedIn$: Observable<boolean>; // 定義一個 Observable

  constructor(private authService: AuthService) {
    // 綁定 AuthService 的狀態
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    // 訂閱登入狀態
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }

  // 修正點：新增 logout 方法
  logout() {
    this.authService.logout();
  }
}