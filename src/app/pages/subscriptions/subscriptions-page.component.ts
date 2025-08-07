import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core'
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator'

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
  ],
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.css',
})
export class SubscriptionsPage implements OnInit {
  feedService = inject(FeedService)
  readonly dialog = inject(MatDialog)
  destroyRef = inject(DestroyRef)

  feeds = signal<Feed[]>([])
  currentPage = signal<number>(1)
  pageSize = signal<number>(10)
  totalResults = signal<number>(0)

  isRefreshing = signal<Record<string, boolean>>({})

  ngOnInit() {
    this.getData()
  }

  getData() {
    this.feedService
      .getAllSubscriptions({
        pagination: {
          perPage: this.pageSize(),
          pageNumber: this.currentPage(),
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
          this.currentPage.set(1)
          this.feeds.set(result.result)
          this.totalResults.set(result.total)
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

  onRefresh(subscriptionId: string) {
    this.isRefreshing.update((prev) => ({
      [subscriptionId]: true,
    }))
    this.feedService
      .refreshOneSubscription({ subscriptionId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          this.isRefreshing.update((prev) => ({
            [subscriptionId]: false,
          }))
          console.error(e)
          return of(null)
        }),
      )
      .subscribe((result) => {
        this.isRefreshing.update((prev) => ({
          [subscriptionId]: false,
        }))
      })
  }

  paginator = viewChild(MatPaginator)

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
        this.getData()
        this.paginator()?.firstPage()
      })
  }

  paginationHandler(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1)
    this.pageSize.set(event.pageSize)
    this.getData()
  }
}
