import { CanMatchFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth-service'
import { map } from 'rxjs/operators'

export const authGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router)
  const authService = inject(AuthService)
  return authService.$authStatus.pipe(
    map((status) => {
      return status.authenticated ? true : router.createUrlTree(['auth'])
    }),
  )
}
