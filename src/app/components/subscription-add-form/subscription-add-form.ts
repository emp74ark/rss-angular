import { Component, DestroyRef, inject, signal } from '@angular/core'
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
  selector: 'app-subscription-add-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatSlideToggle,
    MatDialogModule,
    MatButton,
  ],
  templateUrl: './subscription-add-form.html',
  styleUrl: './subscription-add-form.css',
})
export class SubscriptionAddForm {
  fb = inject(NonNullableFormBuilder)
  feedService = inject(FeedService)
  destroyRef = inject(DestroyRef)
  dialogRef = inject(MatDialogRef<SubscriptionAddForm>)

  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  form = this.fb.group({
    title: ['', Validators['required']],
    description: [''],
    link: ['', Validators['required']],
    settings: this.fb.group({
      enabled: [true],
      loadFullText: [false],
    }),
  })

  onSubmit() {
    this.isLoading.set(true)
    console.log(this.form.getRawValue())
    // this.dialogRef.close('Success')
    this.form.disable()
    this.feedService
      .addOneSubscription({ subscription: this.form.getRawValue() })
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
        console.log('NEW_SUBSCRIPTION', result)
        this.dialogRef.close(true)
      })
  }
}
