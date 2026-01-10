import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { GrafanaApiService } from './grafana-api.service';
import { getAppConfig } from '../global';
import { get } from 'http';




@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = getAppConfig().apiBaseUrl || 'http://10.25.1.191:4243';
  private counter = 0;

  constructor(private http: HttpClient) {}


  getGrafanaEmbedUrl(
    panelId: number,
    from: number,
    to: number,
    theme: 'light' | 'dark' = 'light'
  ): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.BASE_URL}/grafana-embed`, {
      params: {
        panelId: panelId.toString(),
        from: from.toString(),
        to: to.toString(),
        theme
      }
    });
  }

  googleLogin(googleToken: string): Observable<any> {
  // 對應 Swagger 中的 /api/v1/auth/google
  return this.http.post(`${this.BASE_URL}/api/v1/auth/google`, { googleToken });
  }

  getDashboardData(): Observable<any> {
    this.counter+= 1;

    return this.http.get(`${this.BASE_URL}/getDashboardData?ts=${this.counter}`);
  }

  getChillersData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillersData`);
  }

  getChillerParam(chiller_id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillerParam`, {
      params: { chiller_id }
    });
  }

  updateChillerParam(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerParam`, body);
  }

  updateChillerModel(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerModel`, formData);
  }

  // 新增：列出模型
  listModels(type: 'RT' | 'PW' = 'RT'): Observable<{ type: string; active?: string; files: string[] }> {
    const params = new HttpParams().set('type', type);
    return this.http.get<{ type: string; active?: string; files: string[] }>(
      `${this.BASE_URL}/listModels`,
      { params }
    );
  }

  // 新增：切換啟用
  selectModel(type: 'RT' | 'PW', filename: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/selectModel`, { type, filename });
  }


  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getHistoryData`, {
      params: { data_type, start_time, end_time }
    });
  }
}


/*
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = '/api';

  constructor(private http: HttpClient, private grafana: GrafanaApiService) {}

  getDashboardData(count: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getDashboardData`, {
      params: { count }
    });
  }

  getChillersData(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillersData`);
  }

  getChillerParam(chiller_id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getChillerParam`, {
      params: { chiller_id }
    });
  }

  updateChillerParam(body: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerParam`, body);
  }

  updateChillerModel(formData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/updateChillerModel`, formData);
  }


  test_getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return this.grafana.queryGrafana(data_type, start_time,end_time);
  }
  getHistoryData(data_type: string, start_time: string, end_time: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/getHistoryData`, {
      params: { data_type, start_time, end_time }
    });
  }
}

*/