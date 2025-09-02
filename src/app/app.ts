import { Component, inject } from '@angular/core'
import { AuthService } from './services/auth-service'
import { toSignal } from '@angular/core/rxjs-interop'
import { PrivateOutlet } from './outlet/private-outlet/private-outlet'
import { PublicOutlet } from './outlet/public-outlet/public-outlet'
import { NgComponentOutlet } from '@angular/common'

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly authService = inject(AuthService)
  private readonly authStatus = toSignal(this.authService.$authStatus)

  getOutlet() {
    return this.authStatus()?.authenticated ? PrivateOutlet : PublicOutlet
  }
}
