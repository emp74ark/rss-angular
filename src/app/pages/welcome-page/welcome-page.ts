import { Component } from '@angular/core'
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
export class WelcomePage {}
