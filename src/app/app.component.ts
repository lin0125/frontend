import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router'; // **導入 RouterModule！**

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],  // **加上 RouterModule**
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isNavClosed = false; // **控制側邊欄開關**

  toggleNav() {
    this.isNavClosed = !this.isNavClosed;
  }
}
