import { Injectable, signal } from '@angular/core'

@Injectable({
  providedIn: 'any',
})
export class PageService {
  constructor() {}

  #currentPage = signal<number>(1)
  currentPage = this.#currentPage.asReadonly()
  #pageSize = signal<number>(10)
  pageSize = this.#pageSize.asReadonly()
  #totalResults = signal<number>(0)
  totalResults = this.#totalResults.asReadonly()

  setCurrentPage(currentPage: number) {
    this.#currentPage.set(currentPage)
  }

  setPageSize(pageSize: number) {
    this.#pageSize.set(pageSize)
  }

  setTotalResults(totalResults: number) {
    this.#totalResults.set(totalResults)
  }
}
