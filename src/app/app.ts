import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly authService = inject(AuthService)
  private readonly authStatus = toSignal(this.authService.$authStatus)

  getOutlet(): typeof PrivateOutlet | typeof PublicOutlet {
    return this.authStatus()?.authenticated ? PrivateOutlet : PublicOutlet
  }
}
