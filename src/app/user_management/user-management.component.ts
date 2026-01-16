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

  loadUsers() {
    // 對接後端 FieldController 的 getField 介面
    this.apiService.get('/api/v1/get/field').subscribe(res => {
      if (res.ok) {
        this.userList = res.data;
      }
    });
  }

  onAddUser() {
    // 對接後端 FieldController 的 addField 介面
    this.apiService.post('/api/v1/add/field', this.newUser).subscribe(res => {
      if (res.ok) {
        alert('添加成功！');
        this.loadUsers();
        this.newUser.email = '';
      } else {
        alert('失敗：' + res.error);
      }
    });
  }
}