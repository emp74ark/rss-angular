import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core'
import { NavComponent } from '../../components/nav/nav.component'
import { RouterOutlet } from '@angular/router'
import { NotificationsService } from '../../services/notifications-service'
import { catchError, of, tap } from 'rxjs'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { BottomErrorSheet } from '../../components/bottom-error-sheet/bottom-error-sheet'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-private-outlet',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './private-outlet.html',
  styleUrl: './private-outlet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateOutlet implements OnInit {
  private readonly notificationsService = inject(NotificationsService)
  private readonly notification = this.notificationsService.$notification
  private readonly errorSheet = inject(MatBottomSheet)
  private readonly destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.notification
      .pipe(
        tap((n) => {
          if (n === null) {
            this.errorSheet.dismiss()
          } else {
            this.errorSheet.open(BottomErrorSheet, { data: { error: n?.message } })
          }
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          console.error(error)
          return of(null)
        }),
      )
      .subscribe()
  }
}
