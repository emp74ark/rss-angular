import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { FeedService } from '../../services/feed-service'
import { ActivatedRoute } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { catchError, exhaustMap, of } from 'rxjs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { Article } from '../../entities/article/article.types'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { MatChip, MatChipSet } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatDivider } from '@angular/material/divider'
import { HttpErrorResponse } from '@angular/common/http'
import { TagService } from '../../services/tag-service'
import { TitleService } from '../../services/title-service'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'app-article-page',
  imports: [
    MatToolbarModule,
    MatProgressBarModule,
    RowSpacer,
    MatChipSet,
    MatChip,
    MatIconModule,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './article-page.html',
  styleUrl: './article-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlePage implements OnInit {
  private readonly feedService = inject(FeedService)
  private readonly tagService = inject(TagService)
  private readonly route = inject(ActivatedRoute)
  private readonly titleService = inject(TitleService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly domSanitizer = inject(DomSanitizer)

  readonly article = signal<Article | null>(null)

  readonly fullText = signal<SafeHtml | undefined>(undefined)

  readonly favTagId = signal<string>('')

  readonly readStatus = computed<boolean>(() => {
    return !!this.article()?.read
  })

  readonly isLoading = signal<boolean>(false)

  safeHtml(html?: string): SafeHtml | undefined {
    if (!html) {
      return
    }
    return this.domSanitizer.bypassSecurityTrustHtml(html)
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        exhaustMap((params) => {
          if (!params['articleId']) {
            return of(null)
          }
          return this.feedService.getOneArticle({ articleId: params['articleId'] })
        }),
        exhaustMap((params) => {
          if (!params) {
            return of(null)
          }
          return this.feedService.changeOneArticle({
            articleId: params._id,
            article: {
              read: true,
            },
          })
        }),
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          return of(null)
        }),
      )
      .subscribe((result) => {
        this.article.set(result)
        if (result?.fullText) {
          const parsed = this.safeHtml(result.fullText || '')
          this.fullText.set(parsed)
        }
        this.titleService.setTitle(result?.title || '')
      this.titleService.setSubtitle(null)
      })

    this.tagService.$defaultTags
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tags) => {
        this.favTagId.set(tags.find((t) => t.name === 'fav')?._id || '')
      })
  }

  onMarkAsRead(): void {
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
            console.error(error)
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

  onAddToBookmarks(): void {
    const existingTag = this.article()?.tags.find((t) => t === this.favTagId())
    const tags = existingTag
      ? [...(this.article()?.tags || [])].filter((t) => t !== this.favTagId())
      : [...(this.article()?.tags || []), this.favTagId()]

    if (this.article()) {
      this.feedService
        .changeOneArticle({
          articleId: this.article()?._id,
          article: { tags },
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error: HttpErrorResponse) => {
            console.error(error)
            return of(null)
          }),
        )
        .subscribe(() => {
          this.article.update((prev) => {
            if (prev !== null) {
              return { ...prev, tags: tags }
            }
            return prev
          })
        })
    }
  }

  getFullText(): void {
    const articleId = this.article()?._id
    if (!articleId) {
      return
    }
    this.isLoading.set(true)
    this.feedService
      .getFullText({ articleId })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((e) => {
          console.error(e)
          this.isLoading.set(false)
          return of(null)
        }),
      )
      .subscribe((result) => {
        const parsed = this.safeHtml(result?.fullText || '')
        this.fullText.set(parsed)
        this.isLoading.set(false)
      })
  }
}
