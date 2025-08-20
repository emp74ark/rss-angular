import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, of } from 'rxjs'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { Router } from '@angular/router'
import { Article } from '../../entities/article/article.types'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { TitleService } from '../../services/title-service'
import { ArticleList } from '../../components/article-list/article-list'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'

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
  display = signal<'title' | 'short'>('title')

  readFilter = signal<boolean>(true)
  favFilter = signal<boolean>(false)

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

    this.getData()
  }

  getData() {
    const filters: Record<string, string | boolean> = {}

    if (this.readFilter()) {
      filters['read'] = false
    }

    if (this.favFilter()) {
      filters['tags'] = this.favTagId()
    }

    this.feedService
      .getAllArticles({
        pagination: {
          perPage: this.pageService.pageSize(),
          pageNumber: this.pageService.currentPage(),
        },
        filters,
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
          this.articles.set(result.result)
          this.pageService.setTotalResults(result.total)
          this.titleService.setTitle(`News: ${result.total} articles`)
        } else {
          this.titleService.setTitle('News')
        }
      })
  }

  toggleDisplay(display: 'title' | 'short') {
    this.display.set(display)
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
      .subscribe(() => {
        this.getData()
      })
  }

  paginationHandler(event: PageEvent) {
    this.getData()
  }

  filterHandler(filter: 'read' | 'fav') {
    if (filter === 'read') {
      this.readFilter.update((prev) => !prev)
    } else {
      this.pageService.setCurrentPage(1)
      this.favFilter.update((prev) => !prev)
    }
    this.getData()
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
        this.getData()
        this.isRefreshingAll.set(false)
      })
  }
}
