import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {
  }

  httpClient = inject(HttpClient);

  login({login, password}: { login: string, password: string }) {
    return this.httpClient.post(`${environment.api}/auth/login`, {login, password});
  }
}
