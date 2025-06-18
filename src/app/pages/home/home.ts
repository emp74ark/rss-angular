import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, of } from 'rxjs'
import { DatePipe } from '@angular/common'
import { MatButton } from '@angular/material/button'
import { MatProgressBar } from '@angular/material/progress-bar'

@Component({
  selector: 'app-home',
  imports: [MatCardModule, DatePipe, MatButton, MatProgressBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)

  articles = signal<any[]>([])

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
          this.articles.set(result as any[])
        }
      })
  }
}
