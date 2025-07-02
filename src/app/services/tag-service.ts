import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Tag } from '../entities/tag/tag.types'
import { environment } from '../../environments/environment'
import { Paginated, Pagination } from '../entities/base/base.types'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TagService {
  constructor() {}

  httpClient = inject(HttpClient)

  private $$defaultTags = new BehaviorSubject<Tag[]>([])

  $defaultTags = this.$$defaultTags.asObservable()

  getDefaultTags() {
    return this.httpClient.get<Tag[]>(`${environment.api}/tag?default=true`).subscribe((tags) => {
      this.$$defaultTags.next(tags)
    })
  }

  getAllTags({ pagination }: { pagination?: Partial<Pagination> }) {
    return this.httpClient.get<Paginated<Tag>>(`${environment.api}/tag`, {
      params: pagination,
    })
  }

  addOneTag({ name }: { name: string }) {
    return this.httpClient.post<Tag>(`${environment.api}/tag`, { name })
  }

  changeOneTag({ currentName, newName }: { currentName: string; newName: string }) {
    return this.httpClient.patch<Tag>(`${environment.api}/tag/${currentName}`, { name: newName })
  }

  deleteOneTag({ name }: { name: string }) {
    return this.httpClient.delete<Tag>(`${environment.api}/tag/${name}`)
  }
}
