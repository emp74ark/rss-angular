import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  httpClient = inject(HttpClient);

  getAllSubscriptions() {
    return this.httpClient.get(`${environment.api}/subscription`,
      {withCredentials: true});
  }

  getAllArticles() {
    return this.httpClient.get(`${environment.api}/article`,
      {withCredentials: true});
  }

  getOneSubscription({subscriptionId}: { subscriptionId: string }) {
    return this.httpClient.get(
      `${environment.api}/subscription/${subscriptionId}`,
      {withCredentials: true});
  }
}
