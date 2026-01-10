import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class GrafanaApiService {
  private apiUrl = '/grafana/api/ds/query'; 
  private token = 'glsa_l1lI27UZEXGlfMI6HD48iYtyZXNbOFFC_c63e5333'; 
  private dataSourceUid = 'f162bbe5-6f40-4fef-baa2-e2628684db88'; 

  constructor(private http: HttpClient) {}

  queryGrafana(data_type: string, start: string, end: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      queries: [
        {
          refId: 'A',
          datasource: {
            type: 'influxdb', 
            uid: this.dataSourceUid
          },
          queryType: 'flux',
          rawQuery: true,
          query: `
          from(bucket: "mChiller")
          |> range(start: ${start}, stop: ${end})
          |> filter(fn: (r) => r._measurement == "equipment_metrics")
          |> filter(fn: (r) => r._field == "${data_type == "RT" ? "RT" : "Chiller_1_KW_tot"}")
          `
        }
      ],
      range: {
        from: start,
        to: end
      }
    };

    return this.http.post(this.apiUrl, body, { headers });

    //|> range(start: 2024-08-20T00:00:00Z, stop: 2024-08-21T00:00:00Z)
    //|> range(start: time(v: "${start}"), stop: time(v: "${end}"))
    //
    //|> filter(fn: (r) => r._measurement == "equipment_metrics")
    //|> filter(fn: (r) => r._field == "${data_type=="RT"? "RT" : "Chiller_1_KW_tot"}")
  }
}
