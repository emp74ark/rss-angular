import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  httpClient = inject(HttpClient)

  getAllSubscriptions() {
    return this.httpClient.get(`${environment.api}/subscription`)
  }

  getAllArticles() {
    return this.httpClient.get(`${environment.api}/article`)
  }

  getOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.get(`${environment.api}/subscription/${subscriptionId}`)
  }
}
