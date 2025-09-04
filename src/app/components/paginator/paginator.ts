import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { MatToolbarRow } from '@angular/material/toolbar'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { PageService } from '../../services/page-service'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator, MatToolbarRow, AsyncPipe],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Paginator {
  private readonly pageService = inject(PageService, { skipSelf: true })
  public readonly totalResults = this.pageService.$totalResults
  public readonly pageSize = this.pageService.$pageSize

  readonly pageChange = output<PageEvent>()
  readonly hidden = input<boolean>(false)

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event)
    this.pageService.setCurrentPage(event.pageIndex + 1)
    this.pageService.setPageSize(event.pageSize)
  }
}
