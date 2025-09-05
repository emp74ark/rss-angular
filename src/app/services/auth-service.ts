import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs'
import { User, UserDTO } from '../entities/user/user.types'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient)

  private $$authStatus = new BehaviorSubject<{
    authenticated: boolean
    user: User | null
    error: string | null
  }>({
    authenticated: false,
    user: null,
    error: null,
  })

  $authStatus = this.$$authStatus.asObservable()

  login({ login, password }: UserDTO) {
    return this.httpClient
      .post<User>(`${environment.api}/auth/login`, {
        login: login.trim(),
        password: password.trim(),
      })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('user', response._id)
          this.$$authStatus.next({ authenticated: true, user: response, error: null })
          return of(response)
        }),
        catchError((error: HttpErrorResponse) => {
          this.$$authStatus.next({ authenticated: false, user: null, error: error.error.message })
          return of(null)
        }),
      )
  }

  signup({ password }: { password: string }) {
    return this.httpClient
      .post<User>(`${environment.api}/auth/signup`, {
        password: password.trim(),
      })
      .pipe(
        switchMap((response) => {
          localStorage.setItem('user', response._id)
          this.$$authStatus.next({ authenticated: true, user: response, error: null })
          return of(response)
        }),
        catchError((error: HttpErrorResponse) => {
          this.$$authStatus.next({ authenticated: false, user: null, error: error.error.message })
          return of(null)
        }),
      )
  }

  logout() {
    return this.httpClient.get<{ message: string }>(`${environment.api}/auth/logout`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error)
        return of(false)
      }),
      switchMap(() => {
        localStorage.removeItem('user')
        this.$$authStatus.next({ authenticated: false, user: null, error: null })
        return of(true)
      }),
    )
  }

  updateAuth(user: User) {
    this.$$authStatus.next({ authenticated: true, user, error: null })
    localStorage.setItem('user', user._id)
  }
}
