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
}
