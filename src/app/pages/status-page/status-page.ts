import { Component, inject, OnInit } from '@angular/core'
import { HealthStatus } from '../../components/health-status/health-status'
import { TitleService } from '../../services/title-service'

@Component({
  selector: 'app-status-page',
  imports: [HealthStatus],
  templateUrl: './status-page.html',
  styleUrl: './status-page.css',
})
export class StatusPage implements OnInit {
  private readonly titleService = inject(TitleService)

  ngOnInit() {
    this.titleService.setTitle('User')
    this.titleService.setSubtitle(null)
  }
}
