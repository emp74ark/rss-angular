import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'
import { FeedService } from '../../services/feed-service'
import { Feed } from '../../entities/feed/feed.types'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, of } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-subscription-edit-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatSlideToggle,
    MatDialogModule,
    MatButton,
  ],
  templateUrl: './subscription-edit-form.html',
  styleUrl: './subscription-edit-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionEditForm implements OnInit {
  readonly fb = inject(NonNullableFormBuilder)
  readonly feedService = inject(FeedService)
  readonly destroyRef = inject(DestroyRef)
  readonly dialogRef = inject(MatDialogRef<SubscriptionEditForm>)

  data: { feed: Feed; feedId: string } | null = inject(MAT_DIALOG_DATA)
  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    link: ['', Validators.required],
    settings: this.fb.group({
      enabled: [false],
      loadFullText: [false],
    }),
  })

  onSubmit(): void {
    if (!this.data?.feed._id) {
      return
    }
    this.isLoading.set(true)
    this.form.disable()
    this.feedService
      .changeOneSubscription({ id: this.data?.feed._id, dto: this.form.getRawValue() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage.set(error.error.message)
          this.form.enable()
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.isLoading.set(false)
        if (result) {
          this.dialogRef.close({ result })
        }
      })
  }

  ngOnInit(): void {
    if (this.data?.feed) {
      const { feed } = this.data
      this.form.patchValue({
        title: feed.title,
        description: feed.description,
        link: feed.link,
        settings: {
          enabled: feed.settings?.enabled || false,
          loadFullText: feed.settings?.loadFullText || false,
        },
      })
    }
  }
}
