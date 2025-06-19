import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { FeedService } from '../../services/feed-service'
import { ActivatedRoute } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { of, switchMap } from 'rxjs'

@Component({
  selector: 'app-article',
  imports: [],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.css',
})
export class ArticlePage implements OnInit {
  feedService = inject(FeedService)
  route = inject(ActivatedRoute)
  destroyRef = inject(DestroyRef)

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
      )
      .subscribe((result) => console.log(result))
  }
}
