import { Component, DestroyRef, inject, signal } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCardActions, MatCardContent } from '@angular/material/card'
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input'
import { AuthService } from '../../services/auth-service'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar'

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
    MatProgressSpinnerModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm {
  authService = inject(AuthService)
  router = inject(Router)
  destroyRef = inject(DestroyRef)

  isLoading = signal<boolean>(false)

  password = new FormControl('', {
    validators: [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
  })

  authStatus = this.authService.$authStatus

  onSubmit() {
    if (!this.password.value) {
      return
    }
    this.isLoading.set(true)
    this.authService
      .signup({ password: this.password.value as string })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.isLoading.set(false)
          this.router.navigate(['/user'])
        }
      })
  }
}
