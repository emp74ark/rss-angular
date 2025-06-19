import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { SubscriptionAddForm } from '../../components/subscription-add-form/subscription-add-form'

@Component({
  selector: 'app-subscriptions',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatIconButton,
    RowSpacer,
    MatDialogModule,
  ],
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.css',
})
export class SubscriptionsPage implements OnInit {
  feedService = inject(FeedService)
  readonly dialog = inject(MatDialog)
  destroyRef = inject(DestroyRef)

  feeds = signal<any[]>([])

  ngOnInit() {
    this.getAll()
  }

  getAll() {
    this.feedService
      .getAllSubscriptions()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          console.log(result)
          this.feeds.set(result as any[])
        }
      })
  }

  onAdd() {
    const dialogRef = this.dialog.open(SubscriptionAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAll()
      }
    })
  }

  onRemove(id: string) {
    this.feedService
      .deleteOneSubscription({ subscriptionId: id })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        console.log('DELETE_SUBSCRIPTION', result)
        this.getAll()
      })
  }
}
