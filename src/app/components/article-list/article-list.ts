import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, linkedSignal } from '@angular/core'
import { AsyncPipe, DatePipe } from '@angular/common'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card'
import { MatChipOption, MatChipSet } from '@angular/material/chips'
import { MatIconButton } from '@angular/material/button'
import { MatProgressBar } from '@angular/material/progress-bar'
import { Router, RouterLink } from '@angular/router'
import { RowSpacer } from '../row-spacer/row-spacer'
import { MatIcon } from '@angular/material/icon'
import { Article } from '../../entities/article/article.types'
import { SafeHtmlPipe } from '../../pipes/safe-html-pipe'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { FeedService } from '../../services/feed-service'
import { Tag } from '../../entities/tag/tag.types'
import { PageService } from '../../services/page-service'
import { scrollUp } from '../../../utils'

@Component({
  selector: 'app-article-list',
  imports: [
    DatePipe,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatChipOption,
    MatChipSet,
    MatIcon,
    MatIconButton,
    MatProgressBar,
    RouterLink,
    RowSpacer,
    SafeHtmlPipe,
    AsyncPipe,
  ],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleList {
  constructor() {
    effect(() => {
      scrollUp({ trigger: !!this.articles().length })
    })
  }
  private readonly router = inject(Router)
  private readonly feedService = inject(FeedService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly pageService = inject(PageService, { skipSelf: true })

  readonly articles = input.required<Article[]>()
  readonly displayedArticles = linkedSignal(this.articles)
  readonly isRefreshing = input<boolean>(false)
  readonly favTagId = input.required<string>()
  readonly userTags = input.required<Tag[]>()

  $display = this.pageService.$display

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
          this.displayedArticles.update((prev) => {
            if (prev !== null) {
              return prev.map((a) => (a._id === result._id ? { ...a, read: !a.read } : a))
            }
            return prev
          })
        })
    }
  }

  tagHandler(article: Article, tagId: Tag['_id'], event: MouseEvent) {
    const existingTag = article.tags.find((t) => t === tagId)
    const tags = existingTag
      ? [...article.tags].filter((t) => t !== tagId)
      : [...article.tags, tagId]

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
          this.displayedArticles.update((prev) =>
            prev.map((a) => (a._id === result._id ? { ...a, tags } : a)),
          )
        })
    }
  }
}
