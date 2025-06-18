import { HttpInterceptorFn } from '@angular/common/http'

export const authCookiesInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedReq = req.clone({ withCredentials: true })
  return next(clonedReq)
}
