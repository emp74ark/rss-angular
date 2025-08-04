import { inject, Injectable } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  pageTitleService = inject(Title)

  private $$currentTitle = new BehaviorSubject<string>('')
  $currentTitle = this.$$currentTitle.asObservable()

  setTitle(title: string) {
    this.$$currentTitle.next(title)
    this.pageTitleService.setTitle(title)
  }
}
