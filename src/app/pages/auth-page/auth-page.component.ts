import { Component } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { LoginForm } from '../../components/login-form/login-form'
import { SignupForm } from '../../components/signup-form/signup-form'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { MatCard } from '@angular/material/card'

@Component({
  selector: 'app-auth',
  imports: [MatFormFieldModule, FormsModule, LoginForm, SignupForm, MatTabGroup, MatTab, MatCard],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPage {}
