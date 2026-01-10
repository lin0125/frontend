import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockApiService {
  getDashboardData(): Observable<any> {
    var data = +(8 + Math.random() * 5).toFixed(0);
    return of({
      Ntemp: data,
      Ptemp: data+0.5,
      kwh: 18.9
    });
  }

  getChillerTempData(chiller_id: number): Observable<any> {
    return of({
      min_temperature: 6,
      max_temperature: 12,
      base_temperature: 8,
      temp_step: 1.0,
      update_rate: 1.0
    });
  }

  getChillersData(): Observable<any> {
    return of({
      chillers_temperature: [6.8, 7.5, 7.1],
      online_chiller_ids: [1, 2]
    });
  }

  updateChillerParam(body: any): Observable<any> {
    console.log('✅ 模擬參數更新成功:', body);
    return of('success');
  }

  updateChillerModel(formData: FormData): Observable<any> {
    console.log('📁 模擬上傳模型檔案:', formData.get('file'));
    return of('success');
  }

  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return of({
      data_average: 52.3,
      data_max: 92.3,
      carbon_reduction: 18.9
    });
  }
}
