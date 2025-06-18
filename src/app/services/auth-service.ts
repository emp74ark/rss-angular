import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient)

  private $$authStatus = new BehaviorSubject<{
    authenticated: boolean
    user: { _id: string; login: string; role: string } | null
    error: string | null
  }>({
    authenticated: false,
    user: null,
    error: null,
  })

  $authStatus = this.$$authStatus.asObservable()

  login({ login, password }: { login: string; password: string }) {
    return this.httpClient
      .post<{
        _id: string
        login: string
        role: string
      }>(`${environment.api}/auth/login`, { login, password }, { withCredentials: true })
      .pipe(
        switchMap((response) => {
          this.$$authStatus.next({ authenticated: true, user: response, error: null })
          return of(response)
        }),
        catchError((error: HttpErrorResponse) => {
          this.$$authStatus.next({ authenticated: false, user: null, error: error.error.message })
          return of(null)
        }),
      )
  }
}
