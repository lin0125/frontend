import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login.component';
// 👇 必須加入這一行 Import，程式才認得 ChillerControlComponent
import { ChillerControlComponent } from './chiller-control/chiller-control.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  
  // 歷史紀錄路由
  { path: 'history/:dataset', component: HistoryComponent },
  { path: 'history', component: HistoryComponent },

  // 👇 修正這裡：
  // 1. 確保 path 是 'chiller-control' (跟 HTML 的 routerLink 一致)
  // 2. 使用 component: ChillerControlComponent (上面已 import)
  { path: 'chiller-control', component: ChillerControlComponent },

  // 重新導向與萬用路由 (必須放在最後)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' } 
];

export const appRoutingProviders = [provideRouter(routes)];