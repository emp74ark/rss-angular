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
import { Feed } from '../../entities/feed/feed.types'
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { LinkTrimPipe } from '../../pipes/link-trim-pipe'
import { Paginator } from '../../components/paginator/paginator'
import { PaginationService } from '../../services/pagination-service'

@Component({
  selector: 'app-subscriptions',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatIconButton,
    RowSpacer,
    MatDialogModule,
    MatProgressBar,
    MatPaginatorModule,
    LinkTrimPipe,
    Paginator,
  ],
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.css',
})
export class SubscriptionsPage implements OnInit {
  feedService = inject(FeedService)
  paginationService = inject(PaginationService)
  readonly dialog = inject(MatDialog)
  destroyRef = inject(DestroyRef)

  feeds = signal<Feed[]>([])

  isRefreshing = signal<Record<string, boolean>>({})
  isRefreshingAll = signal<boolean>(false)

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.feedService
      .getAllSubscriptions({
        pagination: {
          perPage: this.paginationService.pageSize(),
          pageNumber: this.paginationService.currentPage(),
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          this.paginationService.setCurrentPage(1)
          this.paginationService.setTotalResults(result.total)
          this.feeds.set(result.result)
        }
      })
  }

  onAdd() {
    const dialogRef = this.dialog.open(SubscriptionAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getData()
      }
    })
  }

  onRefreshOne(subscriptionId: string) {
    this.isRefreshing.update((prev) => ({
      ...prev,
      [subscriptionId]: true,
    }))
    this.feedService
      .refreshOneSubscription({ subscriptionId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          this.isRefreshing.update((prev) => ({
            ...prev,
            [subscriptionId]: false,
          }))
          console.error(e)
          return of(null)
        }),
      )
      .subscribe(() => {
        this.isRefreshing.update((prev) => ({
          ...prev,
          [subscriptionId]: false,
        }))
      })
  }

  onRefreshAll() {
    this.isRefreshingAll.set(true)
    this.feedService
      .refreshAllSubscriptions()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          this.isRefreshingAll.set(false)
          console.error(e)
          return of(null)
        }),
      )
      .subscribe(() => {
        this.isRefreshingAll.set(false)
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
      .subscribe(() => {
        this.getData()
        this.paginationService.setCurrentPage(1)
      })
  }

  paginationHandler() {
    this.getData()
  }
}
