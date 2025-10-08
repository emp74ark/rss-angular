import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'

export const publicGuard: CanActivateFn = (route, state) => {
  const savedUserId = localStorage.getItem('user')
  const path = route.routeConfig?.path
  const router = inject(Router)

  if (savedUserId && (path === '' || path === 'auth')) {
    return router.createUrlTree(['/articles'])
  }

  return true
}
