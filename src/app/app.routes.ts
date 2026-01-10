import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history/:dataset', component: HistoryComponent, 
    data: {
      prerender: false // 設定為 false 以避免預渲染
    }
  },
  { path: 'history', component: HistoryComponent },
  {
    path: 'chiller',
    loadComponent: () => import('./chiller-control/chiller-control.component').then(m => m.ChillerControlComponent)
  },
  { path: '**', redirectTo: 'dashboard' }               
];

export const appRoutingProviders = [provideRouter(routes)];
