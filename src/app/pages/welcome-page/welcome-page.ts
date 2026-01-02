import { Component, inject, OnInit } from '@angular/core'
import { MatButton, MatFabButton } from '@angular/material/button'
import { RouterLink } from '@angular/router'
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { HealthService } from '../../services/health-service'
import { UpdateButton } from '../../components/update-button/update-button'

@Component({
  selector: 'app-welcome-page',
  imports: [
    MatButton,
    RouterLink,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatCardModule,
    MatIconModule,
    MatFabButton,
    MatAccordion,
    UpdateButton,
  ],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage implements OnInit {
  private readonly healthService = inject(HealthService)

  ngOnInit() {
    this.healthService.updateStat()
  }
}
