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

  private $$currentSubtitle = new BehaviorSubject<string | null>(null)
  $currentSubtitle = this.$$currentSubtitle.asObservable()

  setTitle(title: string) {
    this.$$currentTitle.next(title)
    this.pageTitleService.setTitle(title)
  }

  setSubtitle(subtitle: string | null) {
    this.$$currentSubtitle.next(subtitle)
  }
}
