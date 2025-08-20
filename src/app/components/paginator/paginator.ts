import { Component, inject, input, output } from '@angular/core'
import { MatToolbarRow } from '@angular/material/toolbar'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { PaginationService } from '../../services/pagination-service'

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator, MatToolbarRow],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  paginationService = inject(PaginationService, { skipSelf: true })
  totalResults = this.paginationService.totalResults
  pageChange = output<PageEvent>()
  hidden = input<boolean>(false)

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event)
    this.paginationService.setCurrentPage(event.pageIndex + 1)
    this.paginationService.setPageSize(event.pageSize)
  }
}
