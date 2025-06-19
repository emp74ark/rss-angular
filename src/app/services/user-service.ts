import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { User } from '../entities/user/user.types'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  httpClient = inject(HttpClient)

  getUser() {
    return this.httpClient.get<User>(`${environment.api}/user/self`)
  }
}
