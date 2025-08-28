import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, combineLatest, of, switchMap } from 'rxjs'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { Router } from '@angular/router'
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

@Component({
  selector: 'app-home',
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
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePage implements OnInit {
  feedService = inject(FeedService)
  router = inject(Router)
  destroyRef = inject(DestroyRef)
  tagService = inject(TagService)
  titleService = inject(TitleService)
  pageService = inject(PageService)

  articles = signal<Article[]>([])
  articleIds = computed(() => this.articles().map(({ _id }) => _id))

  $readFilter = new BehaviorSubject(true)
  $favFilter = new BehaviorSubject(false)

  favTagId = signal<string>('')
  userTags = signal<Tag[]>([])

  isRefreshingAll = signal<boolean>(false)

  ngOnInit() {
    this.tagService.$defaultTags
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
      )
      .subscribe((tags) => {
        this.favTagId.set(tags?.find((t) => t.name === 'fav')?._id || '')
      })

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

    combineLatest([
      this.pageService.$pageSize,
      this.pageService.$currentPage,
      this.$favFilter,
      this.$readFilter,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([perPage, pageNumber, fav, read]) => {
          const filters: Record<string, string | boolean> = {}

          if (read) {
            filters['read'] = false
          }

          if (fav) {
            filters['tags'] = this.favTagId()
          }

          return this.feedService.getAllArticles({
            pagination: {
              perPage,
              pageNumber,
            },
            filters,
          })
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.articles.set(result.result)
          this.pageService.setTotalResults(result.total)
          this.titleService.setTitle(`News: ${result.total} articles`)
        } else {
          this.titleService.setTitle('News')
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
      .subscribe()
  }

  filterHandler(filter: 'read' | 'fav') {
    if (filter === 'read') {
      this.$readFilter.next(!this.$readFilter.value)
    } else {
      this.pageService.setCurrentPage(1)
      this.$favFilter.next(!this.$favFilter.value)
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
      })
  }
}
