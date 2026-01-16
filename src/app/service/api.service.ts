import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type modeldata = { category: "RT" | "PW"; id: number; is_active: boolean; name: string; version: string; };

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = 'http://localhost:8080';
  
  private counter = 0;

  constructor(private http: HttpClient) {}

  // service/api.service.ts 示例
googleLogin(idToken: string) {
  return this.http.post('/api/v1/auth/google', { googleToken: idToken });
}

  // Grafana (維持原樣)
  getGrafanaEmbedUrl(uid: string, panelId: number, from: number, to: number, theme: 'light' | 'dark' = 'light'): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.BASE_URL}/api/grafana-embed`, {
      params: { 
        dashboardUid: uid, 
        panelId: panelId.toString(), 
        from: from.toString(), 
        to: to.toString(), 
        theme 
      }
    });
  }

  // Dashboard AI 預測數據 (維持原樣)
  getDashboardData(): Observable<any> {
    this.counter += 1;
    return this.http.get(`${this.BASE_URL}/api/getDashboardData?ts=${this.counter}`);
  }

  // ========================================================
  // [修改 1] 冰機即時狀態 (CSV)
  // 對應後端: GetChillersDataController (/api/getChillersData)
  // ========================================================
  getChillersData(): Observable<any> {
    // 加上 /api 前綴
    return this.http.get(`${this.BASE_URL}/api/getChillersData`);
  }

  // ========================================================
  // [修改 2] 讀取控制參數 (JSON)
  // 對應後端: ChillerParamController - GET (/api/chiller/params)
  // 說明: 讀取 config.json，不再需要傳 chiller_id
  // ========================================================
  getChillerParams(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/chiller/params`);
  }

  // ========================================================
  // [修改 3] 更新控制參數 (JSON)
  // 對應後端: ChillerParamController - POST (/api/chiller/update-params)
  // ========================================================
  updateChillerParams(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/chiller/update-params`, body);
  }

  // ========================================================
  // [新增] 更新模擬環境參數 (JSON)
  // 對應後端: UpdateChillerParamController - POST (/api/chiller/update-sim-config)
  // ========================================================
  updateSimConfig(config: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/api/chiller/update-sim-config`, config);
  }

  // ... 以下模型相關 API 若後端沒改動，可維持原樣，或建議一併加上 /api ...

  updateChillerModel(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerModel`, formData);
  }
  

  listModels(type: 'RT' | 'PW' = 'RT'): Observable<{ type: string; active?: modeldata; files: modeldata[] }> {
    const params = new HttpParams().set('type', type);
    return this.http.get<{ type: string; active?: modeldata; files: modeldata[] }>(`${this.BASE_URL}/listModels`, { params });
  }

  selectModel(type: 'RT' | 'PW', filename: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/selectModel`, { type, filename });
  }

  // 歷史資料 (維持原樣)
  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/api/getHistoryData`, { params: { data_type, start_time, end_time } });
  }
}