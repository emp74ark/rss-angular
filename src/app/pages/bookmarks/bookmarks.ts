import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { Article } from '../../entities/article/article.types'
import { FeedService } from '../../services/feed-service'
import { catchError, combineLatest, of, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Tag } from '../../entities/tag/tag.types'
import { TagService } from '../../services/tag-service'
import { TitleService } from '../../services/title-service'
import { ArticleList } from '../../components/article-list/article-list'
import { MatToolbarRow } from '@angular/material/toolbar'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { PageDisplayToggle } from '../../components/page-display-toggle/page-display-toggle'

@Component({
  selector: 'app-bookmarks',
  imports: [ArticleList, MatToolbarRow, Paginator, PageDisplayToggle],
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

  favTagId = signal<string>('')
  userTags = signal<Tag[]>([])

  ngOnInit() {
    this.tagService
      .getDefaultTags()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((tags) => {
          const favTag = tags?.find((t) => t.name === 'fav')?._id
          if (!favTag) {
            return of(null)
          }
          return combineLatest([this.pageService.$pageSize, this.pageService.$currentPage]).pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap(([perPage, pageNumber]) => {
              this.favTagId.set(favTag)
              const filters = { tags: favTag }
              return this.feedService.getAllArticles({
                pagination: {
                  perPage,
                  pageNumber,
                },
                filters,
              })
            }),
          )
        }),
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
}
