import { Component, inject, OnDestroy, OnInit } from '@angular/core'
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
import { Subscription } from 'rxjs'
import { environment } from '../../../environments/environment'

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
  ],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage implements OnInit, OnDestroy {
  private readonly healthService = inject(HealthService)
  subscription: Subscription[] = []

  ngOnInit() {
    if (environment.production) {
      this.subscription.push(this.healthService.updateStat().subscribe())
    }
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe())
  }
}
