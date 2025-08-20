import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { Article } from '../../entities/article/article.types'
import { FeedService } from '../../services/feed-service'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Tag } from '../../entities/tag/tag.types'
import { TagService } from '../../services/tag-service'
import { TitleService } from '../../services/title-service'
import { ArticleList } from '../../components/article-list/article-list'
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar'
import { MatIcon } from '@angular/material/icon'
import { MatButtonToggle } from '@angular/material/button-toggle'
import { PageEvent } from '@angular/material/paginator'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'

@Component({
  selector: 'app-bookmarks',
  imports: [ArticleList, MatButtonToggle, MatIcon, MatToolbar, MatToolbarRow, Paginator],
  templateUrl: './bookmarks.html',
  styleUrl: './bookmarks.css',
})
export class Bookmarks implements OnInit {
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)
  tagService = inject(TagService)
  pageService = inject(PageService)
  titleService = inject(TitleService)

  articles = signal<Article[]>([])
  display = signal<'title' | 'short'>('title')

  favTagId = signal<string>('')
  userTags = signal<Tag[]>([])

  ngOnInit() {
    this.tagService
      .getDefaultTags()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
      )
      .subscribe((tags) => {
        const favTag = tags?.find((t) => t.name === 'fav')?._id || ''
        this.favTagId.set(favTag)
        this.getData()
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
    const filters = { tags: this.favTagId() }

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
          this.titleService.setTitle(`Bookmarks: ${result.total}`)
        } else {
          this.titleService.setTitle('Bookmarks')
        }
      })
  }

  toggleDisplay(display: 'title' | 'short') {
    this.display.set(display)
  }

  paginationHandler(event: PageEvent) {
    this.getData()
  }
}
