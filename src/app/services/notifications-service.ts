import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

type AppNotification = {
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private $$notification = new BehaviorSubject<AppNotification | null>(null)
  $notification = this.$$notification.asObservable()

  setNotification(notification: AppNotification) {
    this.$$notification.next(notification)
    setTimeout(() => {
      this.$$notification.next(null)
    }, 3000)
  }
}
