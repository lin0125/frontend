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
  newUser = { email: '', role: '' };
  userList: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // 修正：獲取人員列表
  loadUsers() {
  this.apiService.getField().subscribe({
    next: (res: any) => {
      this.userList = res; // 假設後端直接回傳陣列
    },
    error: (err: any) => {
      console.error('獲取名單失敗', err);
    }
  });
}

  onAddUser() {
  if (!this.newUser.email || !this.newUser.role) {
    alert('請填寫完整資訊');
    return;
  }

  // 構造發送給後端的資料
  const payload = {
    email: this.newUser.email,
    role: this.newUser.role // 這裡就會帶上你輸入的文字
  };

  this.apiService.addField(payload).subscribe({
    next: (res: any) => { 
      alert('添加成功');
      this.loadUsers(); // 確保這裡呼叫的是你 component 裡定義的獲取列表方法
      this.newUser = { email: '', role: '' }; // 清空輸入框
    },
    error: (err: any) => {
      console.error(err);
      alert('添加失敗：' + (err.error?.message || err.message));
    }
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
