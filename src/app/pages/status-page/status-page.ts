import { Component } from '@angular/core'
import { HealthStatus } from '../../components/health-status/health-status'

@Component({
  selector: 'app-status-page',
  imports: [HealthStatus],
  templateUrl: './status-page.html',
  styleUrl: './status-page.css',
})
export class StatusPage {}
