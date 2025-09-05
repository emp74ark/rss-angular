import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatSlideToggle } from '@angular/material/slide-toggle'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'
import { FeedService } from '../../services/feed-service'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-feed-add-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatSlideToggle,
    MatDialogModule,
    MatButton,
  ],
  templateUrl: './feed-add-form.html',
  styleUrl: './feed-add-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedAddForm {
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly feedService = inject(FeedService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly dialogRef = inject(MatDialogRef<FeedAddForm>)

  readonly isLoading = signal<boolean>(false)
  readonly errorMessage = signal<string | null>(null)

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    link: ['', Validators.required],
    settings: this.fb.group({
      enabled: [true],
      loadFullText: [false],
    }),
  })

  onSubmit(): void {
    this.isLoading.set(true)
    this.form.disable()
    this.feedService
      .addOneFeed({ feed: this.form.getRawValue() })
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
}
