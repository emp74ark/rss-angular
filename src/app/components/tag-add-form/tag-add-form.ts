import { Component, DestroyRef, inject, signal } from '@angular/core'
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { TagService } from '../../services/tag-service'
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { catchError, of } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-tag-add-form',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './tag-add-form.html',
  styleUrl: './tag-add-form.css',
})
export class TagAddForm {
  fb = inject(NonNullableFormBuilder)
  tagService = inject(TagService)
  destroyRef = inject(DestroyRef)
  dialogRef = inject(MatDialogRef<TagAddForm>)

  isLoading = signal<boolean>(false)
  errorMessage = signal<string | null>(null)

  form = this.fb.group({
    name: ['', Validators['required']],
  })

  onSubmit() {
    this.form.disable()
    this.isLoading.set(true)
    this.tagService
      .addOneTag({ name: this.form.getRawValue().name })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.errorMessage.set(error.error.message)
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
