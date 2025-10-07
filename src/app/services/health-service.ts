import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor() {}
  httpClient = inject(HttpClient)

  getBackendStatus() {
    return this.httpClient.get<{ status: string; version: string; uptime: string }>(
      `${environment.api}/health`,
    )
  }

  updateStat() {
    const dataHamsterUrl = 'https://datahamster.online/api/stats/add'
    const welcome = '02c5fa7f-f747-4b68-b808-d073e2a84268'
    const dataHamsterParams = new URLSearchParams({
      id: welcome,
      timestamp: Date.now().toString(),
    })
    return this.httpClient.get(
      `${dataHamsterUrl}?${dataHamsterParams.toString()}`,
    )
  }
}
