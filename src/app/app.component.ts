import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { RouterModule, RouterOutlet } from '@angular/router'; // **導入 RouterModule！**

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],  // **加上 RouterModule**
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isNavClosed = false;
  isLoggedIn = false; // 追蹤登入狀態

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }
}