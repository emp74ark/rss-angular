import { Component, inject, input, output } from '@angular/core'
import { MatToolbarRow } from '@angular/material/toolbar'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { PageService } from '../../services/page-service'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator, MatToolbarRow, AsyncPipe],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  pageService = inject(PageService, { skipSelf: true })
  totalResults = this.pageService.$totalResults
  pageSize = this.pageService.$pageSize

  pageChange = output<PageEvent>()
  hidden = input<boolean>(false)

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event)
    this.pageService.setCurrentPage(event.pageIndex + 1)
    this.pageService.setPageSize(event.pageSize)
  }
}
