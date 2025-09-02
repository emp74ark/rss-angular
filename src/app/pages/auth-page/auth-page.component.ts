import { Component, inject } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { LoginForm } from '../../components/login-form/login-form'
import { SignupForm } from '../../components/signup-form/signup-form'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { MatCard } from '@angular/material/card'
import { MatIconButton } from '@angular/material/button'
import { HealthStatus } from '../../components/health-status/health-status'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-auth',
  imports: [
    MatFormFieldModule,
    FormsModule,
    LoginForm,
    SignupForm,
    MatTabGroup,
    MatTab,
    MatCard,
    MatIconModule,
    MatIconButton,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPage {
  private bottomSheet = inject(MatBottomSheet)

  showAppHealth() {
    this.bottomSheet.open(HealthStatus)
  }
}
