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
  selector: 'app-login-form',
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
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  authService = inject(AuthService)
  router = inject(Router)
  destroyRef = inject(DestroyRef)

  formData = model({
    login: '',
    password: '',
  })

  authStatus = this.authService.$authStatus

  inputHandler(field: 'login' | 'password', event: Event) {
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
      .login(this.formData())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/articles'])
        }
      })
  }
}
