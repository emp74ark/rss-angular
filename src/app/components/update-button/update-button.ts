import { Component, inject } from '@angular/core'
import { AppUpdate } from '../../services/app-update'
import { AsyncPipe } from '@angular/common'
import { MatIconButton } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-update-button',
  imports: [AsyncPipe, MatIconModule, MatIconButton],
  templateUrl: './update-button.html',
  styleUrl: './update-button.css',
})
export class UpdateButton {
  private readonly appUpdates = inject(AppUpdate)

  updateFound$ = this.appUpdates.updateFound

  updateHandler() {
    this.appUpdates.reloadApp()
  }
}
