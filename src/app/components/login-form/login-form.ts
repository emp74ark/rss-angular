import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatCardActions, MatCardContent } from '@angular/material/card'
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input'
import { AuthService } from '../../services/auth-service'
import { Router } from '@angular/router'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatProgressBar } from '@angular/material/progress-bar'

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
    MatProgressBar,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  readonly isLoading = signal<boolean>(false)

  readonly formData = model({
    login: '',
    password: '',
  })

  readonly authStatus = this.authService.$authStatus

  inputHandler(field: 'login' | 'password', event: Event): void {
    const { value } = event.target as HTMLInputElement
    if (value) {
      this.formData.update((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  onSubmit(): void {
    this.isLoading.set(true)
    this.authService
      .login(this.formData())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.isLoading.set(false)
          this.router.navigate(['/articles'])
        }
      })
  }
}
