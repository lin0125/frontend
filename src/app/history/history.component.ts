import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../service/api.service';
import { DataRefresherService } from '../service/data-refresher.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  private readonly HISTORY_UID = 'a84a4847-074d-44c1-a443-30f57410b129';
  private destroy$ = new Subject<void>();
  selectedDataset: 'RT' | 'PWH' = 'RT';
  grafanaUrl!: SafeResourceUrl;
  analysis = { avg: 0, min: 0, max: 0, std: 0 };
  totalSaved = 0;


  startDate = this.toDatetimeLocalString(new Date("2024-08-20T00:00:00"));
  endDate = this.toDatetimeLocalString(new Date("2024-08-21T00:00:00"));

  constructor(
    private sanitizer: DomSanitizer,
    private api: ApiService,
    private refresher: DataRefresherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const from = new Date(today);
    from.setDate(today.getDate() - 1);
    const fromUtc = new Date(from);
    const toUtc = new Date(today);
    this.startDate = this.toDatetimeLocalString(fromUtc);
    this.endDate = this.toDatetimeLocalString(toUtc);

    this.updateChart();
    this.tryRefreshData();

    if (isPlatformBrowser(this.platformId)) {
      this.refresher.startInterval('history', () => this.tryRefreshData(), 10000);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  tryRefreshData(): void {
    this.loadAnalysis();
  }

  updateChart(): void {
    const from = new Date(this.startDate).getTime();
    const to = new Date(this.endDate).getTime();
    const panelId = this.selectedDataset === 'RT' ? 10 : 11;

    // [修改] 這裡補上第一個參數 this.HISTORY_UID
    this.api.getGrafanaEmbedUrl(this.HISTORY_UID, panelId, from, to).subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.url);
        this.grafanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
      },
      error: (e) => {
        console.log(e)
        console.warn('⚠️ 無法取得圖表連結');
      }
    });
  }

  loadAnalysis(): void {
    const data_type = this.selectedDataset;
    const start_time = this.startDate.replace('T', ' ');
    const end_time = this.endDate.replace('T', ' ');

    this.api.getHistoryData(data_type, start_time, end_time).subscribe({
      next: (res) => {
        // [修正] 直接讀取後端回傳的真實統計值，不再使用模擬公式
        this.analysis = {
          avg: this.formatValue(res.data_average),
          min: this.formatValue(res.data_min),
          max: this.formatValue(res.data_max),
          std: this.formatValue(res.data_std)
        };
        // 讀取後端算好的節能量
        this.totalSaved = this.formatValue(res.carbon_reduction);
      },
      error: (err) => {
        console.error('❌ 歷史資料載入失敗', err);
        this.analysis = { avg: 0, min: 0, max: 0, std: 0 };
        this.totalSaved = 0;
      }
    });
  }
  // 建議新增一個小工具方法來統一處理小數點，讓程式碼更整潔
  private formatValue(val: any): number {
    // 確保 val 是數字，如果是 undefined 或 null 則回傳 0
    const num = Number(val); 
    return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
  }

  toDatetimeLocalString(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 19);
  }
}