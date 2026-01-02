import { Component, inject, input } from '@angular/core'
import { AppUpdate } from '../../services/app-update'
import { AsyncPipe } from '@angular/common'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-update-button',
  imports: [AsyncPipe, MatIconModule, MatIconButton, MatButton],
  templateUrl: './update-button.html',
  styleUrl: './update-button.css',
})
export class UpdateButton {
  private readonly appUpdates = inject(AppUpdate)

  withLabel = input<boolean>(false)

  updateFound$ = this.appUpdates.updateFound
  currentVersion$ = this.appUpdates.currentVersion
  nextVersion$ = this.appUpdates.nextVersion

  updateHandler() {
    this.appUpdates.reloadApp()
  }
}
