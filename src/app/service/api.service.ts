import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAppConfig } from '../global';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // 修正重點：
  // 1. Port 改為 8080 (配合你的 application.properties)
  // 2. 使用 nip.io 網址 (這樣手機連線時才不會連到手機自己)
  private BASE_URL = 'http://localhost:8080';
  
  private counter = 0;

  constructor(private http: HttpClient) {}

  // Google 登入驗證
  googleLogin(googleToken: string): Observable<any> {
    // 這會呼叫 http://10.25.2.130.nip.io:8080/api/v1/auth/google
    return this.http.post(`${this.BASE_URL}/api/v1/auth/google`, { googleToken });
  }

  getGrafanaEmbedUrl(panelId: number, from: number, to: number, theme: 'light' | 'dark' = 'light'): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.BASE_URL}/grafana-embed`, {
      params: { panelId: panelId.toString(), from: from.toString(), to: to.toString(), theme }
    });
  }

  getDashboardData(): Observable<any> {
    this.counter += 1;
    return this.http.get(`${this.BASE_URL}/getDashboardData?ts=${this.counter}`);
  }

  getChillersData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillersData`);
  }

  getChillerParam(chiller_id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillerParam`, { params: { chiller_id } });
  }

  updateChillerParam(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerParam`, body);
  }

  updateChillerModel(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerModel`, formData);
  }

  listModels(type: 'RT' | 'PW' = 'RT'): Observable<{ type: string; active?: string; files: string[] }> {
    const params = new HttpParams().set('type', type);
    return this.http.get<{ type: string; active?: string; files: string[] }>(`${this.BASE_URL}/listModels`, { params });
  }

  selectModel(type: 'RT' | 'PW', filename: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/selectModel`, { type, filename });
  }

  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getHistoryData`, { params: { data_type, start_time, end_time } });
  }
}