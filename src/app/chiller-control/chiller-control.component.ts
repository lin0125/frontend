import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataRefresherService } from '../service/data-refresher.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
class Example {
  a = 10;
  b = 20;
}



@Component({
  selector: 'app-chiller-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chiller-control.component.html',
  styleUrls: ['./chiller-control.component.scss'],
})
export class ChillerControlComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading = true;
  userHasEditedParams = false;

  hours = Array.from({ length: 24 }, (_, i) => i);  

  modelPath = 'chiller.model';
  mmModelType: 'RT' | 'PW' = 'RT';
  mmModels: string[] = [];
  mmActiveModel?: string;
  mmSelectedModel?: string;

  mmLoadingList = false;
  mmApplying = false;
  mmUploading = false;
  mmModelError = '';
  mmPendingFile?: File;
  mmPickedName = '';


  // 左欄參數設定
  lowerLimit = 0;
  upperLimit = 0;
  baseTemp = 0;
  maxStep = 0;
  updateRate = 0;
  controlStartTime = 0;

  // 右欄狀態資訊
  numberOfChillers = 2;
  currentControlTemp = '';
  chillerTemps: string[] = ['', '']; 
  activeChiller = '';


  getChillers() {
    const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    return Array.from({ length: this.numberOfChillers }, (_, i) => ({
      label: `冰機${chineseNumbers[i]}`,
      temp: this.chillerTemps[i] ?? '--'
    }));
  }

  useBlockLayout(): boolean {
    return this.numberOfChillers <= 2;
  }

  constructor(
    private api: ApiService,
    private refresher: DataRefresherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.tryRefreshData();

    if (isPlatformBrowser(this.platformId)) {
      this.refresher.startInterval(
        'chiller',
        () => this.tryRefreshData(),
        1000
      );
    }
    this.mmFetchModels();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onParamChange() {
    this.userHasEditedParams = true;
  }

  tryRefreshData(): void {
    this.isLoading = true;

    forkJoin({
      Params: this.api.getChillerParams(),
      dataChiller: this.api.getChillersData(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ Params, dataChiller }) => {
          if (!this.userHasEditedParams) {
            this.lowerLimit = Params.min_temperature;    // 控制溫度下限
            this.upperLimit = Params.max_temperature;    // 控制溫度上限
            this.baseTemp = Params.base_temperature;     // 每日初始溫度
            this.maxStep = Params.temp_step;             // 最大調整量
            this.updateRate = Params.update_rate;        // 更新頻率
            this.controlStartTime = Params.control_start_time ?? 0;
          }
        // 1. 強制轉為字串陣列處理
        const activeIds: string[] = (dataChiller.Online_Chiller_ID || []).map((id: any) => id.toString());
        const t1 = dataChiller.Chiller_1_Temp ?? 0;
        const t2 = dataChiller.Chiller_2_Temp ?? 0;

        // 2. 只有在 activeIds 裡面的機台才顯示溫度
        this.chillerTemps[0] = activeIds.includes('1') ? `${t1.toFixed(2)}` : '-- ';
        this.chillerTemps[1] = activeIds.includes('2') ? `${t2.toFixed(2)}` : '-- ';

        // 3. 更新中央的「控制溫度」(Ntemp)
        // 如果機台 2 有開，顯示機台 2 的 SP (10.80)
        if (activeIds.includes('1')) {
          this.currentControlTemp = `${t1.toFixed(2)}`;
        } else if (activeIds.includes('2')) {
          this.currentControlTemp = `${t2.toFixed(2)}`;
        } else {
          this.currentControlTemp = '-- ';
        } 
        this.activeChiller = activeIds.length
          ? activeIds.map((id) => `冰機 ${id}`).join('，')
          : '無啟動冰機';
        },
        error: (err) => {
          console.error('❌ API 呼叫失敗:', err);
        }
      });
  }

  updateParams(): void {
    const body = {
      min_temperature: this.lowerLimit,
      max_temperature: this.upperLimit,
      base_temperature: this.baseTemp,
      temp_step: this.maxStep,
      update_rate: this.updateRate,
      control_start_time: this.controlStartTime,
    };

    this.api.updateChillerParams(body).subscribe({
      next: (res: any) => { // ✅ 加上 : any 解決隱含型別錯誤
        // 注意：如果你後端回傳的 JSON 結構變了 (例如變成 { message: "..." })，這裡的判斷也要改
        // 假設後端現在回傳 { message: "設定更新成功" }
        if (res?.message || res?.Contents === 'success') {
          alert('✅ 參數更新成功');
          this.userHasEditedParams = false;
        } else {
          alert('❌ 參數更新失敗（伺服器回應異常）');
        }
      },
      error: () => alert('❌ 網路錯誤，更新失敗'),
    });
  }

  updateModel(): void {
    alert('模型更新已觸發（實際行為由後端執行）');
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.api.updateChillerModel(formData).subscribe({
      next: () => alert('✅ 模型上傳成功'),
      error: () => alert('❌ 模型上傳失敗'),
    });
  }
  mmOnTypeChange(): void {
    this.mmFetchModels();
  }

  mmFetchModels(): void {
    this.mmLoadingList = true;
    this.mmModelError = '';
    this.api.listModels(this.mmModelType).subscribe({
      next: (res) => {
        this.mmModels = res?.files || [];
        this.mmActiveModel = res?.active || undefined;
        this.mmSelectedModel = this.mmActiveModel || this.mmModels.at(-1);
        this.mmLoadingList = false;
      },
      error: (err) => {
        this.mmLoadingList = false;
        this.mmModelError = '取得模型清單失敗';
        console.error(err);
      }
    });
  }

  mmOnFileUpload(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const ok = /\.p(ickle|kl)$/i.test(file.name);
    if (!ok) {
      alert('請上傳 .pickle 或 .pkl 檔案');
      input.value = '';
      return;
    }

    const form = new FormData();
    form.append('file', file);
    form.append('type', this.mmModelType);

    this.mmUploading = true;
    this.api.updateChillerModel(form).subscribe({
      next: _ => {
        this.mmUploading = false;
        alert('✅ 上傳成功');
        this.mmFetchModels();
        input.value = '';
      },
      error: err => {
        this.mmUploading = false;
        alert('❌ 上傳失敗');
        console.error(err);
      }
    });
  }

  mmApplyModel(): void {
    if (!this.mmSelectedModel) return;
    this.mmApplying = true;
    this.api.selectModel(this.mmModelType, this.mmSelectedModel).subscribe({
      next: _ => {
        this.mmApplying = false;
        alert(`✅ 已切換為：${this.mmSelectedModel}`);
        this.mmFetchModels();
      },
      error: err => {
        this.mmApplying = false;
        alert('❌ 切換失敗');
        console.error(err);
      }
    });
  }

mmOnFilePicked(ev: Event): void {
  const input = ev.target as HTMLInputElement;
  const file = input?.files?.[0];
  this.mmPendingFile = undefined;
  this.mmPickedName = '';

  if (!file) return;

  const ok = /\.p(ickle|kl)$/i.test(file.name);
  if (!ok) {
    alert('請上傳 .pickle 或 .pkl 檔案');
    input.value = '';
    return;
  }
  this.mmPendingFile = file;
  this.mmPickedName = file.name;

  // 若你想「選檔即上傳」，取消註解下一行：
  // this.mmDoUpload();
}

mmDoUpload(): void {
  if (!this.mmPendingFile) return;

  const form = new FormData();
  form.append('file', this.mmPendingFile);
  form.append('type', this.mmModelType);

  this.mmUploading = true;
  this.api.updateChillerModel(form).subscribe({
    next: _ => {
      this.mmUploading = false;
      alert('✅ 上傳成功');
      this.mmFetchModels();
      // reset UI
      this.mmPendingFile = undefined;
      this.mmPickedName = '';
    },
    error: err => {
      this.mmUploading = false;
      alert('❌ 上傳失敗');
      console.error(err);
    }
  });
}

}