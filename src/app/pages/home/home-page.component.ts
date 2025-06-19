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
import { RouterLink } from '@angular/router'
import { ArticlePage } from '../article-page/article-page.component'
import { Article } from '../../entities/article/article.types'

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
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePage implements OnInit {
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)

  articles = signal<Article[]>([])
  display = signal<'title' | 'short'>('title')

  ngOnInit() {
    this.feedService
      .getAllArticles()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          console.log(result)
          this.articles.set(result)
        }
      })
  }

  toggleDisplay(display: 'title' | 'short') {
    this.display.set(display)
  }
}
