import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login.component';
import { ChillerControlComponent } from './chiller-control/chiller-control.component';
// 1. 匯入新組件
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history/:dataset', component: HistoryComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'chiller-control', component: ChillerControlComponent },
  
  // 2. 添加使用者管理路由
  { path: 'user-management', component: UserManagementComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } 
];