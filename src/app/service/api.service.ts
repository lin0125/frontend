import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = 'http://localhost:8080'; // 保持不變
  
  private counter = 0;

  constructor(private http: HttpClient) {}

  // ... (googleLogin 維持不變，因為它裡面已經有寫 /api/v1/...)
  googleLogin(googleToken: string): Observable<any> {
    // 這裡路徑原本就有 /api/v1/auth/google，維持原樣
    return this.http.post(`${this.BASE_URL}/api/v1/auth/google`, { googleToken });
  }

  getGrafanaEmbedUrl(uid: string, panelId: number, from: number, to: number, theme: 'light' | 'dark' = 'light'): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.BASE_URL}/api/grafana-embed`, {
      params: { 
        dashboardUid: uid,  // 將 UID 傳給後端
        panelId: panelId.toString(), 
        from: from.toString(), 
        to: to.toString(), 
        theme 
      }
    });
  }

  getDashboardData(): Observable<any> {
    this.counter += 1;
    // [修正] 加上 /api
    return this.http.get(`${this.BASE_URL}/api/getDashboardData?ts=${this.counter}`);
  }

  getChillersData(): Observable<any> {
    // [維持原樣] 後端 Controller 沒有 /api 前綴
    return this.http.get(`${this.BASE_URL}/getChillersData`);
  }

  getChillerParam(chiller_id: number): Observable<any> {
    // [修正] 加上 /api (參考 SecurityConfiguration 白名單)
    return this.http.get(`${this.BASE_URL}/api/getChillerParam`, { params: { chiller_id } });
  }

  updateChillerParam(body: any): Observable<any> {
    // [修正] 加上 /api
    return this.http.post(`${this.BASE_URL}/api/updateChillerParam`, body);
  }

  updateChillerModel(formData: FormData): Observable<any> {
    // [維持原樣] 後端 Controller 沒有 /api 前綴
    return this.http.post(`${this.BASE_URL}/updateChillerModel`, formData);
  }

  listModels(type: 'RT' | 'PW' = 'RT'): Observable<{ type: string; active?: string; files: string[] }> {
    // [維持原樣] 後端 Controller 沒有 /api 前綴
    const params = new HttpParams().set('type', type);
    return this.http.get<{ type: string; active?: string; files: string[] }>(`${this.BASE_URL}/listModels`, { params });
  }

  selectModel(type: 'RT' | 'PW', filename: string): Observable<any> {
    // [維持原樣] 後端 Controller 沒有 /api 前綴
    return this.http.post(`${this.BASE_URL}/selectModel`, { type, filename });
  }

  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    // [修正] 加上 /api
    return this.http.get(`${this.BASE_URL}/api/getHistoryData`, { params: { data_type, start_time, end_time } });
  }
}