import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpClient = inject(HttpClient)

  getUser() {
    return this.httpClient.get(`${environment.api}/user/self`)
  }
}
