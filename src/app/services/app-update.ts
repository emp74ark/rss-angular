import { ApplicationRef, inject, Injectable } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { BehaviorSubject, concat, first, interval } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AppUpdate {
  private appRef = inject(ApplicationRef)
  private swu = inject(SwUpdate)

  updateFound = new BehaviorSubject<boolean>(false)

  constructor() {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable))
    const schedule$ = interval(6 * 60 * 60 * 1000) // 6h
    const scheduledEvent$ = concat(appIsStable$, schedule$)

    scheduledEvent$.subscribe(async () => {
      try {
        console.info(`[${new Date().toLocaleString()}] Checking for updates...`)
        const updateFound = await this.swu.checkForUpdate()
        this.updateFound.next(updateFound)
      } catch (err) {
        console.error('Failed to check for updates:', err)
      }
    })
  }

  reloadApp() {
    document.location.reload()
  }
}
