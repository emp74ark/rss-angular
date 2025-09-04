import { Component, inject } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogContent, MatDialogActions, MatButton, MatDialogTitle, MatDialogClose],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef)
  data: { title?: string; message?: string; confirmButtonText?: string } = inject(MAT_DIALOG_DATA)

  onAgree() {
    this.dialogRef.close(true)
  }
}
