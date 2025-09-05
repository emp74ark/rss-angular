import { Component, inject } from '@angular/core'
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatError } from '@angular/material/form-field'

@Component({
  selector: 'app-bottom-error-sheet',
  imports: [MatBottomSheetModule, MatError],
  templateUrl: './bottom-error-sheet.html',
  styleUrl: './bottom-error-sheet.css',
})
export class BottomErrorSheet {
  readonly data: { error?: string } = inject(MAT_BOTTOM_SHEET_DATA)
}
