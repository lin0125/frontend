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
  private destroy$ = new Subject<void>();
  selectedDataset: 'RT' | 'PWH' = 'RT';
  grafanaUrl!: SafeResourceUrl;
  analysis = { avg: 0, min: 0, max: 0, std: 0 };
  totalSaved = 0;


  startDate = this.toDatetimeLocalString(new Date("2025-05-12T00:00:00"));
  endDate = this.toDatetimeLocalString(new Date("2025-05-13T00:00:00"));

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

    this.api.getGrafanaEmbedUrl(panelId, from, to).subscribe({
      next: (res) => {
        this.grafanaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
      },
      error: () => {
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
        this.analysis = {
          avg: parseFloat(res.data_average.toFixed(2)),
          min: parseFloat((res.data_average - 5).toFixed(2)), // 模擬
          max: parseFloat(res.data_max.toFixed(2)),
          std: parseFloat(((res.data_max - res.data_average) / 2).toFixed(2))
        };
        this.totalSaved = parseFloat(res.carbon_reduction.toFixed(2));
      },
      error: (err) => {
        console.error('❌ 歷史資料載入失敗', err);
        this.analysis = { avg: 0, min: 0, max: 0, std: 0 };
        this.totalSaved = 0;
      }
    });
  }

  toDatetimeLocalString(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 19);
  }
}