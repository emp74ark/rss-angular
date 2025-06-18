import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { FeedService } from '../../services/feed-service'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-subscriptions',
  imports: [MatCardModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions implements OnInit {
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)

  feeds = signal<any[]>([])

  ngOnInit() {
    this.feedService
      .getAllSubscriptions()
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
          this.feeds.set(result as any[])
        }
      })
  }
}
