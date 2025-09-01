import { Component, DestroyRef, inject, model } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCardActions, MatCardContent } from '@angular/material/card'
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input'
import { AuthService } from '../../services/auth-service'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-signup-form',
  imports: [
    AsyncPipe,
    FormsModule,
    MatButton,
    MatCardActions,
    MatCardContent,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatError,
  ],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  authService = inject(AuthService)
  router = inject(Router)
  destroyRef = inject(DestroyRef)

  formData = model({
    password: '',
  })

  authStatus = this.authService.$authStatus

  inputHandler(field: 'password', event: Event) {
    const { value } = event.target as HTMLInputElement
    if (value) {
      this.formData.update((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  onSubmit() {
    this.authService
      .signup(this.formData())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/user'])
        }
      })
  }
}
