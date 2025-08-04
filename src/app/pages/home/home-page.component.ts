import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, of } from 'rxjs'
import { DatePipe } from '@angular/common'
import { MatIconButton } from '@angular/material/button'
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatIconModule } from '@angular/material/icon'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { Router, RouterLink } from '@angular/router'
import { Article } from '../../entities/article/article.types'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { MatChipOption, MatChipSet } from '@angular/material/chips'
import { TitleService } from '../../services/title-service'

@Component({
  selector: 'app-home',
  imports: [
    MatCardModule,
    DatePipe,
    MatProgressBar,
    MatToolbarModule,
    MatButtonToggleModule,
    MatIconModule,
    RowSpacer,
    MatIconButton,
    RouterLink,
    MatPaginatorModule,
    MatChipOption,
    MatChipSet,
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

  articles = signal<Article[]>([])
  display = signal<'title' | 'short'>('title')

  currentPage = signal<number>(1)
  pageSize = signal<number>(10)
  totalResults = signal<number>(0)

  readFilter = signal<boolean>(true)
  favFilter = signal<boolean>(false)

  favTagId = signal<string>('')
  userTags = signal<Tag[]>([])

  ngOnInit() {
    this.getData()
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
          perPage: this.pageSize(),
          pageNumber: this.currentPage(),
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
          this.totalResults.set(result.total)
          this.titleService.setTitle(`News: ${result.total} articles`)
        } else {
          this.titleService.setTitle('News')
        }
      })
  }

  toggleDisplay(display: 'title' | 'short') {
    this.display.set(display)
  }

  async onArticleClick(article: Article) {
    await this.router.navigate(['subscription', article.subscriptionId, 'article', article._id])
  }

  markAsRead(article: Article, event: MouseEvent) {
    event.stopPropagation()
    if (article) {
      this.feedService
        .changeOneArticle({
          articleId: article._id,
          article: {
            read: !article.read,
          },
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            return of(null)
          }),
        )
        .subscribe((result) => {
          if (result === null) {
            return
          }
          this.articles.update((prev) => {
            if (prev !== null) {
              return prev.map((a) => (a._id === result._id ? { ...a, read: !a.read } : a))
            }
            return prev
          })
        })
    }
  }

  onAddToBookmarks(article: Article, event: MouseEvent) {
    const existingTag = article.tags.find((t) => t === this.favTagId())
    const tags = existingTag
      ? [...article.tags].filter((t) => t !== this.favTagId())
      : [...article.tags, this.favTagId()]

    event.stopPropagation()
    if (article) {
      this.feedService
        .changeOneArticle({
          articleId: article._id,
          article: { tags },
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            return of(null)
          }),
        )
        .subscribe((result) => {
          if (result === null) {
            return
          }
          this.articles.update((prev) => {
            if (prev !== null) {
              return prev.map((a) => (a._id === result._id ? { ...a, tags } : a))
            }
            return prev
          })
        })
    }
  }

  paginationHandler(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1)
    this.pageSize.set(event.pageSize)
    this.getData()
  }

  filterHandler(filter: 'read' | 'fav') {
    if (filter === 'read') {
      this.readFilter.update((prev) => !prev)
    } else {
      this.favFilter.update((prev) => !prev)
    }
    this.getData()
  }

  tagHandler(article: Article, tag: Tag, event: MouseEvent) {
    const existingTag = article.tags.find((t) => t === tag._id)
    const tags = existingTag
      ? [...article.tags].filter((t) => t !== tag._id)
      : [...article.tags, tag._id]

    event.stopPropagation()
    if (article) {
      this.feedService
        .changeOneArticle({
          articleId: article._id,
          article: { tags },
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            return of(null)
          }),
        )
        .subscribe((result) => {
          if (result === null) {
            return
          }
          this.articles.update((prev) => {
            if (prev !== null) {
              return prev.map((a) => (a._id === result._id ? { ...a, tags } : a))
            }
            return prev
          })
        })
    }
  }
}
