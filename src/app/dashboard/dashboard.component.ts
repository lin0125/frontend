import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../service/api.service';
import { DataRefresherService } from '../service/data-refresher.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedChart: 'KW' | 'RT' = 'KW';
  grafanaChartUrl!: SafeResourceUrl;
  chartTitle = '即時用電資訊與基線';

  dashboardData = { Ntemp: 0, Ptemp: 0, kwh: 0, count: 0 };

  // [修改 1] 定義主畫面的 Dashboard UID
  private readonly DASHBOARD_UID = 'a84a4847-074d-44c1-a443-30f57410b129'; 

  constructor(
    private sanitizer: DomSanitizer,
    private api: ApiService,
    private refresher: DataRefresherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.refresher.startInterval('dashboard-data', () => this.loadDashboardData(), 4000);
    }

    this.loadDashboardData();
    this.updateChart();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadDashboardData(): void {
    console.log("going")
    this.api.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res;
        console.log(res)
      },
      error: (err) => {
        console.error('🚨 Dashboard 資料載入失敗：', err);
      }
    });
  }

  updateChart(): void {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);

    // const fromUtc = new Date(today).getTime();
    // const to = new Date(today);
    // to.setDate(today.getDate() + 1);
    // const toUtc = new Date(to).getTime();

    const start = new Date("2025-05-16T00:00:00"); // 修改你的開始時間
    const end = new Date("2025-05-16T23:59:59");   // 修改你的結束時間
    const fromUtc = start.getTime();
    const toUtc = end.getTime();

    const panelId = this.selectedChart === 'KW' ? 11 : 10;
  
    this.chartTitle = this.selectedChart === 'KW'
      ? '即時用電資訊與基線'
      : '即時負載資訊與基線';

    // [修改 2] 在呼叫 api 時，把 DASHBOARD_UID 放在第一個參數傳進去
    // (前提是你的 api.service.ts 已經改好接收 uid 參數了)
    this.api.getGrafanaEmbedUrl(this.DASHBOARD_UID, panelId, fromUtc, toUtc).subscribe({
      next: (res) => {

        if (res?.url) {
          this.grafanaChartUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
        } else {
          console.warn('⚠️ 無法取得圖表 URL');
        }
      },
      error: () => console.warn('⚠️ 無法取得圖表連結')
    });
  }

  get currentTemperature(): string {
    return this.dashboardData.Ntemp.toFixed(2);
  }

  get suggestedTemperature(): string {
      const count = this.dashboardData.count;
      if (count > 9 && count <= 18) {
        return `${this.dashboardData.Ptemp.toFixed(2)} °C`;
      } else {
        return '-- °C';
      }
  }

  get currentKWh(): string {
      const count = this.dashboardData.count;
      if (count > 9 && count <= 18) {
        return `${this.dashboardData.kwh.toFixed(2)}`;
      } else {
        return '--';
      }
  }
}