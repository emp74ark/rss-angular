import { Component, inject, OnInit } from '@angular/core'
import { AuthService } from '../../services/auth-service'
import { AsyncPipe } from '@angular/common'
import { TitleService } from '../../services/title-service'

@Component({
  selector: 'app-user-page',
  imports: [AsyncPipe],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage implements OnInit {
  authService = inject(AuthService)
  titleService = inject(TitleService)
  $currentUser = this.authService.$authStatus

  ngOnInit() {
    this.titleService.setTitle('User')
    this.titleService.setSubtitle(null)
  }
}
