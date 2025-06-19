import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { FeedService } from '../../services/feed-service'
import { ActivatedRoute } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, of, switchMap } from 'rxjs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Article } from '../../entities/article/article.types'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { MatChip, MatChipSet } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatDivider } from '@angular/material/divider'
import { DatePipe } from '@angular/common'
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-article',
  imports: [
    MatToolbarModule,
    MatProgressBarModule,
    RowSpacer,
    MatChipSet,
    MatChip,
    MatIconModule,
    MatIconButton,
    MatDivider,
    DatePipe,
  ],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.css',
})
export class ArticlePage implements OnInit {
  feedService = inject(FeedService)
  route = inject(ActivatedRoute)
  destroyRef = inject(DestroyRef)

  article = signal<Article | null>(null)

  bookmarked = computed<boolean>(() => {
    return !!this.article()?.read
  })

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params) => {
          console.log(params)
          if (!params['articleId']) {
            return of(null)
          }
          return this.feedService.getOneArticle({ articleId: params['articleId'] })
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
      )
      .subscribe((result) => {
        this.article.set(result)
        console.log(result)
      })
  }

  onAddToBookmarks() {
    if (this.article() !== null) {
      this.feedService
        .changeOneArticle({
          articleId: this.article()?._id,
          article: {
            read: !this.article()?.read,
          },
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.log(error)
            return of(null)
          }),
        )
        .subscribe(() => {
          this.article.update((prev) => {
            if (prev !== null) {
              return { ...prev, read: !prev.read }
            }
            return prev
          })
        })
    }
  }
}
