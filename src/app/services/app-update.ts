import { ApplicationRef, inject, Injectable } from '@angular/core'
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker'
import { BehaviorSubject, concat, filter, first, interval } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AppUpdate {
  private appRef = inject(ApplicationRef)
  private swu = inject(SwUpdate)

  updateFound = new BehaviorSubject<boolean>(false)

  currentVersion = new BehaviorSubject<string>('')
  nextVersion = new BehaviorSubject<string>('')

  constructor() {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable))
    const schedule$ = interval(20000)
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

    this.swu.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe((evt) => {
        this.currentVersion.next(evt.currentVersion.hash)
        this.nextVersion.next(evt.latestVersion.hash)
        this.updateFound.next(true)
      })
  }

  reloadApp() {
    document.location.reload()
  }
}
