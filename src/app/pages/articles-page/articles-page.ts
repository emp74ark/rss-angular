import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, combineLatest, forkJoin, of, switchMap } from 'rxjs'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { ActivatedRoute, Router } from '@angular/router'
import { Article } from '../../entities/article/article.types'
import { MatPaginatorModule } from '@angular/material/paginator'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { TitleService } from '../../services/title-service'
import { ArticleList } from '../../components/article-list/article-list'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { PageDisplayToggle } from '../../components/page-display-toggle/page-display-toggle'
import { AsyncPipe } from '@angular/common'
import { SortOrder } from '../../entities/base/base.enums'

@Component({
  selector: 'app-articles-page',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    RowSpacer,
    MatIconButton,
    MatPaginatorModule,
    MatButton,
    ArticleList,
    Paginator,
    PageDisplayToggle,
    AsyncPipe,
  ],
  templateUrl: './articles-page.html',
  styleUrl: './articles-page.css',
})
export class ArticlesPage implements OnInit {
  private readonly feedService = inject(FeedService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly destroyRef = inject(DestroyRef)
  private readonly tagService = inject(TagService)
  private readonly titleService = inject(TitleService)
  private readonly pageService = inject(PageService)

  readonly articles = signal<Article[]>([])
  readonly articleIds = computed(() => this.articles().map(({ _id }) => _id))
  readonly favTagId = signal<string>('')
  readonly userTags = signal<Tag[]>([])
  readonly isRefreshingAll = signal<boolean>(false)

  $readFilter = new BehaviorSubject(true)
  $favFilter = new BehaviorSubject(false)
  $subscriptionFilter = new BehaviorSubject<string | null>(null)
  $tagFilter = new BehaviorSubject<string | null>(null)
  $dateOrder = new BehaviorSubject(SortOrder.Desc)

  ngOnInit() {
    this.tagService
      .getAllTags({})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
      )
      .subscribe((tags) => {
        if (tags?.result) {
          this.userTags.set(tags.result.filter((t) => t.userId !== 'all'))
        }
      })

    this.tagService
      .getDefaultTags()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((tags) => {
          const favTag = tags?.find((t) => t.name === 'fav')?._id
          if (!favTag) {
            return of(null)
          }
          this.favTagId.set(favTag)

          return combineLatest([
            this.pageService.$pageSize,
            this.pageService.$currentPage,
            this.$favFilter,
            this.$readFilter,
            this.$subscriptionFilter,
            this.$tagFilter,
            this.$dateOrder,
          ]).pipe(
            switchMap(([perPage, pageNumber, fav, read, subscription, tag, dateSort]) => {
              const filters: Record<string, string | boolean> = {}

              if (read) {
                filters['read'] = false
              }

              if (fav) {
                filters['tags'] = favTag
              }

              if (subscription) {
                filters['subscription'] = subscription
              }

              if (tag) {
                filters['tags'] = tag
              }

              return this.feedService.getAllArticles({
                pagination: {
                  perPage,
                  pageNumber,
                },
                filters,
                sort: {
                  date: dateSort,
                },
              })
            }),
          )
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.articles.set(result.result)
          this.pageService.setTotalResults(result.total)
          this.titleService.setTitle(`Articles: ${result.total} articles`)
        } else {
          this.titleService.setTitle('Articles')
        }
      })

    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          const subscriptionId: string = params['subscription']
          const tagName: string = params['tag']
          const tag = this.userTags().find((t) => t.name === tagName)
          if (!subscriptionId) {
            return forkJoin([of(null), this.tagService.getOne({ name: tagName })])
          } else {
            return forkJoin([this.feedService.getOneSubscription({ subscriptionId }), of(null)])
          }
        }),
        catchError((e) => {
          console.error(e)
          return of(null)
        }),
      )
      .subscribe((results) => {
        if (!results) {
          return
        }

        const [feed, tag] = results

        if (feed) {
          this.titleService.setSubtitle(feed.title)
          this.$subscriptionFilter.next(feed._id)
          this.$tagFilter.next(null)
        } else if (tag) {
          this.titleService.setSubtitle(tag.name)
          this.$subscriptionFilter.next(null)
          this.$tagFilter.next(tag._id)
        } else {
          this.titleService.setSubtitle(null)
          this.$subscriptionFilter.next(null)
          this.$tagFilter.next(null)
        }
      })
  }

  markManyAsRead({
    articleIds,
    read,
    all,
  }: {
    articleIds?: string[]
    read: boolean
    all?: boolean
  }) {
    this.feedService
      .changeManyArticles({
        ids: articleIds,
        article: { read },
        all,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
      )
      .subscribe((result) => {
        if (!result?.modifiedCount) {
          return
        }
        this.pageService.setCurrentPage(1)
      })
  }

  filterHandler(filter: 'read' | 'fav') {
    if (filter === 'read') {
      this.$readFilter.next(!this.$readFilter.value)
    } else {
      this.$favFilter.next(!this.$favFilter.value)
    }
    this.pageService.setCurrentPage(1)
  }

  orderHandler(param: 'date') {
    if (param === 'date') {
      this.$dateOrder.next(this.$dateOrder.value === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc)
      this.pageService.setCurrentPage(1)
    }
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
        this.pageService.setCurrentPage(1)
      })
  }

  protected readonly SortOrder = SortOrder
}
