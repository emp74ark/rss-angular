import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavComponent } from './components/nav/nav.component'
import { AuthService } from './services/auth-service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService)
  protected readonly authStatus = toSignal(this.authService.$authStatus)
}
