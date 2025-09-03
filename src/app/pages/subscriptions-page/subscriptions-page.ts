import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { catchError, combineLatest, of, switchMap } from 'rxjs'
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
import { MatPaginatorModule } from '@angular/material/paginator'
import { LinkTrimPipe } from '../../pipes/link-trim-pipe'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { TitleService } from '../../services/title-service'
import { scrollUp } from '../../../utils'
import { RouterLink } from '@angular/router'
import { SubscriptionEditForm } from '../../components/subscription-edit-form/subscription-edit-form'
import { MatBadgeModule } from '@angular/material/badge'

@Component({
  selector: 'app-subscriptions-page',
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
    RouterLink,
    MatBadgeModule,
  ],
  templateUrl: './subscriptions-page.html',
  styleUrl: './subscriptions-page.css',
})
export class SubscriptionsPage implements OnInit {
  constructor() {
    effect(() => {
      scrollUp({ trigger: !!this.feeds().length })
    })
  }

  readonly feedService = inject(FeedService)
  readonly pageService = inject(PageService)
  readonly dialog = inject(MatDialog)
  readonly destroyRef = inject(DestroyRef)
  readonly titleService = inject(TitleService)

  feeds = signal<Feed[]>([])

  isRefreshing = signal<Record<string, boolean>>({})
  isRefreshingAll = signal<boolean>(false)

  ngOnInit(): void {
    combineLatest([this.pageService.$pageSize, this.pageService.$currentPage])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([perPage, pageNumber]) => {
          return this.feedService.getAllSubscriptions({
            pagination: {
              perPage,
              pageNumber,
            },
          })
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.pageService.setTotalResults(result.total)
          this.feeds.set(result.result)
        }
        this.titleService.setTitle('Subscriptions')
      })
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(SubscriptionAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result)
      this.pageService.setCurrentPage(1)
    })
  }

  onRefreshOne(e: MouseEvent, subscriptionId: string): void {
    e.stopPropagation()
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

  onRefreshAll(): void {
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

  onRemove(e: MouseEvent, id: string): void {
    e.stopPropagation()
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
        this.pageService.setCurrentPage(1)
      })
  }

  onEdit(e: MouseEvent, feed: Feed): void {
    e.stopPropagation()
    const dialogRef = this.dialog.open(SubscriptionEditForm, {
      data: { feed },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result)
      this.pageService.setCurrentPage(1)
    })
  }
}
