import { Component, inject } from '@angular/core'
import { PageService } from '../../services/page-service'
import { MatButtonToggle } from '@angular/material/button-toggle'
import { MatIcon } from '@angular/material/icon'
import { PageDisplay } from '../../entities/page/page.enums'
import { AsyncPipe } from '@angular/common'
import { MatIconButton } from '@angular/material/button'

@Component({
  selector: 'app-page-display-toggle',
  imports: [MatButtonToggle, MatIcon, MatButtonToggle, MatIcon, AsyncPipe, MatIconButton],
  templateUrl: './page-display-toggle.html',
  styleUrl: './page-display-toggle.css',
})
export class PageDisplayToggle {
  private readonly pageService = inject(PageService, { skipSelf: true })
  readonly display = this.pageService.$display
  protected readonly PageDisplay = PageDisplay

  toggleDisplay(display: PageDisplay) {
    this.pageService.setDisplay(display)
  }
}
