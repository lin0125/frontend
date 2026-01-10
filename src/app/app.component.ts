import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet, Router } from '@angular/router'; // 注入 Router
import { AuthService } from './service/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router // 注入 Router 以便登出後跳轉
  ) {}

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
    this.authService.logout(); // 清除 Token 並更新狀態
    this.router.navigate(['/login']); // 跳轉回登入頁面
  }
}