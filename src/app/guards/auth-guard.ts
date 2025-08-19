import { CanMatchFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from '../services/auth-service'
import { map } from 'rxjs/operators'
import { UserService } from '../services/user-service'

export const authGuard: CanMatchFn = (route, segments) => {
  const savedUserId = localStorage.getItem('user')

  const router = inject(Router)
  const authService = inject(AuthService)
  const userService = inject(UserService)

  if (savedUserId) {
    return userService.getUser().pipe(
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
