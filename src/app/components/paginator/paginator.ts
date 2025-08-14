import { Component, input, output } from '@angular/core'
import {MatToolbarRow} from '@angular/material/toolbar';
import { MatPaginator, PageEvent } from '@angular/material/paginator'

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator, MatToolbarRow],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  totalResults = input.required<number>()
  pageChange = output<PageEvent>()

  onPageChange(e: PageEvent) {
    console.log(e)
    this.pageChange.emit(e)
  }
}
