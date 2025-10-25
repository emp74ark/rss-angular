import { CanActivateFn, Router } from '@angular/router'
import { DestroyRef, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, of } from 'rxjs'
import { UserService } from '../services/user-service'
import { map } from 'rxjs/operators'

export const publicGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  const destroyRef = inject(DestroyRef)
  const path = route.routeConfig?.path
  const router = inject(Router)

  return userService.getUser().pipe(
    takeUntilDestroyed(destroyRef),
    catchError(() => {
      return of(null)
    }),
    map((user) => {
      if (user && (path === '' || path === 'auth')) {
        return router.createUrlTree(['/articles'])
      } else {
        return true
      }
    }),
  )
}
