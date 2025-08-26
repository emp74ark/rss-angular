import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { HealthService } from '../../services/health-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, of } from 'rxjs'

@Component({
  selector: 'app-health-status',
  imports: [],
  templateUrl: './health-status.html',
  styleUrl: './health-status.css',
})
export class HealthStatus implements OnInit {
  healthService = inject(HealthService)
  destroyRef = inject(DestroyRef)

  status = signal<string>('')
  version = signal<string>('')
  uptime = signal<string>('')

  ngOnInit() {
    this.healthService
      .getBackendStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          return of({
            status: 'error',
            uptime: 'unknown',
            version: 'unknown',
          })
        }),
      )
      .subscribe(({ status, uptime, version }) => {
        this.status.set(status)
        this.uptime.set(uptime)
        this.version.set(version)
      })
  }
}
