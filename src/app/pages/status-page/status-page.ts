import { Component, inject, OnInit } from '@angular/core'
import { HealthStatus } from '../../components/health-status/health-status'
import { TitleService } from '../../services/title-service'
import { UpdateButton } from '../../components/update-button/update-button'
import { AppUpdate } from '../../services/app-update'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-status-page',
  imports: [HealthStatus, UpdateButton, AsyncPipe],
  templateUrl: './status-page.html',
  styleUrl: './status-page.css',
})
export class StatusPage implements OnInit {
  private readonly titleService = inject(TitleService)
  private readonly appUpdates = inject(AppUpdate)

  updateFound$ = this.appUpdates.updateFound

  ngOnInit() {
    this.titleService.setTitle('User')
    this.titleService.setSubtitle(null)
  }
}
