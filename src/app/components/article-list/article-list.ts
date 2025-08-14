import { Component, DestroyRef, effect, inject, input, linkedSignal } from '@angular/core'
import { DatePipe } from '@angular/common'
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
  ],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  constructor() {
    effect(() => {
      if (!this.articles().length) {
        return
      }
      const page = document.querySelector('.page-content')
      page?.scroll({ top: 0, behavior: 'smooth' })
    })
  }
  router = inject(Router)
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)

  articles = input.required<Article[]>()
  displayedArticles = linkedSignal(this.articles)
  isRefreshing = input<boolean>(false)
  display = input.required<'title' | 'short'>()
  favTagId = input.required<string>()
  userTags = input.required<Tag[]>()

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
