import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service'; // 使用現有的 ApiService

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  newUser = { email: '', role: 'user' };
  userList: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // 修正：獲取人員列表
  loadUsers() {
    this.apiService.getField().subscribe({
      next: (res: any) => {
        if (res.ok) {
          this.userList = res.data; // 綁定數據
        }
      },
      error: (err) => console.error('獲取名單失敗', err)
    });
  }

  // 修正：新增人員
  onAddUser() {
    if (!this.newUser.email) return alert('請輸入 Email');
    
    this.apiService.addField(this.newUser).subscribe({
      next: (res: any) => {
        if (res.ok) {
          alert('添加成功！');
          this.loadUsers(); // 重新整理列表
          this.newUser.email = '';
        }
      },
      error: (err) => alert('添加失敗: ' + (err.error?.message || '伺服器錯誤'))
    });
  }

  // 補上 HTML 中缺少的 removeUser 方法
  removeUser(email: string) {
    if (confirm(`確定要移除 ${email} 的權限嗎？`)) {
      // 如果後端有刪除介面，請呼叫 apiService.deleteField(email)
      console.log('執行刪除:', email);
      // 實作刪除邏輯...
    }
  }
}
