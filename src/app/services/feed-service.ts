import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Feed, FeedDTO } from '../entities/feed/feed.types'
import { Article, ArticleDTO } from '../entities/article/article.types'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  httpClient = inject(HttpClient)

  getAllSubscriptions() {
    return this.httpClient.get<Feed[]>(`${environment.api}/subscription`)
  }

  getAllArticles() {
    return this.httpClient.get<Article[]>(`${environment.api}/article`)
  }

  getOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.get<Feed>(`${environment.api}/subscription/${subscriptionId}`)
  }

  getOneArticle({ articleId }: { articleId: string }) {
    return this.httpClient.get<Article>(`${environment.api}/article/${articleId}`)
  }

  changeOneArticle({ article, articleId }: { article: ArticleDTO; articleId?: string }) {
    return this.httpClient.patch<Article>(`${environment.api}/article/${articleId}`, article)
  }

  addOneSubscription({ subscription }: { subscription: FeedDTO }) {
    return this.httpClient.post<FeedDTO>(`${environment.api}/subscription`, subscription)
  }

  deleteOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.delete<Feed>(`${environment.api}/subscription/${subscriptionId}`)
  }
}
