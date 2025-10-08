import { CanMatchFn, Router } from '@angular/router'
import { DestroyRef, inject } from '@angular/core'
import { AuthService } from '../services/auth-service'
import { map } from 'rxjs/operators'
import { UserService } from '../services/user-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

export const authGuard: CanMatchFn = (route, segments) => {
  const savedUserId = localStorage.getItem('user')

  const router = inject(Router)
  const authService = inject(AuthService)
  const userService = inject(UserService)
  const destroyRef = inject(DestroyRef)

  if (savedUserId) {
    return userService.getUser().pipe(
      takeUntilDestroyed(destroyRef),
      catchError((error: HttpErrorResponse) => {
        return of(null)
      }),
      map((user) => {
        if (user) {
          authService.updateAuth(user)
          return true
        } else {
          return router.createUrlTree(['auth'])
        }
      }),
    )
  }

  return authService.$authStatus.pipe(
    map((status) => {
      return status.authenticated ? true : router.createUrlTree(['auth'])
    }),
  )
}
