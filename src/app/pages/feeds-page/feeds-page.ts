import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core'
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
import { Feed } from '../../entities/feed/feed.types'
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatPaginatorModule } from '@angular/material/paginator'
import { LinkTrimPipe } from '../../pipes/link-trim-pipe'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { TitleService } from '../../services/title-service'
import { scrollUp } from '../../../utils'
import { RouterLink } from '@angular/router'
import { MatBadgeModule } from '@angular/material/badge'
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog'
import { FeedAddForm } from '../../components/feed-add-form/feed-add-form'
import { FeedEditForm } from '../../components/feed-edit-form/feed-edit-form'

@Component({
  selector: 'app-feed-page',
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
  templateUrl: './feeds-page.html',
  styleUrl: './feeds-page.css',
})
export class FeedsPage implements OnInit {
  constructor() {
    effect(() => {
      scrollUp({ trigger: !!this.feeds().length })
    })
  }

  private readonly feedService = inject(FeedService)
  private readonly pageService = inject(PageService)
  private readonly dialog = inject(MatDialog)
  private readonly destroyRef = inject(DestroyRef)
  private readonly titleService = inject(TitleService)

  readonly feeds = signal<Feed[]>([])
  readonly isRefreshing = signal<Record<string, boolean>>({})
  readonly isRefreshingAll = signal<boolean>(false)

  ngOnInit(): void {
    combineLatest([this.pageService.$pageSize, this.pageService.$currentPage])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([perPage, pageNumber]) => {
          return this.feedService.getAllFeeds({
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
        this.titleService.setTitle('Feeds')
        this.titleService.setSubtitle(null)
      })
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(FeedAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result)
      this.pageService.setCurrentPage(1)
    })
  }

  onRefreshOne(e: MouseEvent, feedId: string): void {
    e.stopPropagation()
    this.isRefreshing.update((prev) => ({
      ...prev,
      [feedId]: true,
    }))
    this.feedService
      .refreshOneFeed({ feedId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          this.isRefreshing.update((prev) => ({
            ...prev,
            [feedId]: false,
          }))
          console.error(e)
          return of(null)
        }),
      )
      .subscribe(() => {
        this.isRefreshing.update((prev) => ({
          ...prev,
          [feedId]: false,
        }))
      })
  }

  onRefreshAll(): void {
    this.isRefreshingAll.set(true)
    this.feedService
      .refreshAllFeeds()
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

    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Delete feed?',
        message: 'Are you sure you want to delete this feed?',
        confirmButtonText: 'Delete',
      },
    })

    dialogRef.afterClosed().subscribe((agree) => {
      if (agree) {
        this.feedService
          .deleteOneFeed({ feedId: id })
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
    })
  }

  onEdit(e: MouseEvent, feed: Feed): void {
    e.stopPropagation()
    const dialogRef = this.dialog.open(FeedEditForm, {
      data: { feed },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result)
      this.pageService.setCurrentPage(1)
    })
  }
}
