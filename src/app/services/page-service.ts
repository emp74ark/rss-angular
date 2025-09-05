import { Injectable } from '@angular/core'
import { PageDisplay } from '../entities/page/page.enums'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'any',
})
export class PageService {
  private $$pageSize = new BehaviorSubject<number>(5)
  $pageSize = this.$$pageSize.asObservable()

  private $$currentPage = new BehaviorSubject<number>(1)
  $currentPage = this.$$currentPage.asObservable()

  private $$totalResults = new BehaviorSubject<number>(0)
  $totalResults = this.$$totalResults.asObservable()

  private $$display = new BehaviorSubject<PageDisplay>(PageDisplay.Title)
  $display = this.$$display.asObservable()

  setCurrentPage(currentPage: number) {
    this.$$currentPage.next(currentPage)
  }

  setPageSize(pageSize: number) {
    this.$$pageSize.next(pageSize)
  }

  setTotalResults(totalResults: number) {
    this.$$totalResults.next(totalResults)
  }

  setDisplay(display: PageDisplay) {
    this.$$display.next(display)
  }
}
