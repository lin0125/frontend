import { Component, OnInit } from '@angular/core'; // 合併導入
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // 修正這裡：使用 isLoggedIn$ (與你的 service 定義一致)
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }
}