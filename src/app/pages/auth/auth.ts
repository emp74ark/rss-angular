import { Component, DestroyRef, inject, model } from '@angular/core'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card'
import { MatInput } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButton } from '@angular/material/button'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../services/auth-service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-auth',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    MatInput,
    MatCardActions,
    MatButton,
    MatCardHeader,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
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
          this.router.navigate(['/home'])
        }
      })
  }
}
