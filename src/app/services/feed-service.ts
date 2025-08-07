import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Feed, FeedDTO } from '../entities/feed/feed.types'
import { Article, ArticleDTO } from '../entities/article/article.types'
import { Paginated, Pagination } from '../entities/base/base.types'
import { TagService } from './tag-service'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  httpClient = inject(HttpClient)
  tagService = inject(TagService)

  getAllSubscriptions({ pagination }: { pagination?: Partial<Pagination> }) {
    return this.httpClient.get<Paginated<Feed>>(`${environment.api}/subscription`, {
      params: pagination,
    })
  }

  getAllArticles({
    pagination,
    filters,
  }: {
    pagination?: Partial<Pagination>
    filters?: { tags?: string; read?: boolean }
  }) {
    this.tagService.getDefaultTags()
    return this.httpClient.get<Paginated<Article>>(`${environment.api}/article`, {
      params: { ...pagination, ...filters },
    })
  }

  getOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.get<Feed>(`${environment.api}/subscription/${subscriptionId}`)
  }

  getOneArticle({ articleId }: { articleId: string }) {
    return this.httpClient.get<Article>(`${environment.api}/article/${articleId}`)
  }

  changeOneArticle({ article, articleId }: { article: Partial<ArticleDTO>; articleId?: string }) {
    return this.httpClient.patch<Article>(`${environment.api}/article/${articleId}`, article)
  }

  changeManyArticles({
    ids = [],
    article,
    all = false,
  }: {
    ids?: string[]
    article: Partial<ArticleDTO>
    all?: boolean
  }) {
    return this.httpClient.patch<{
      acknowledged: boolean
      modifiedCount: number
      matchedCount: number
    }>(`${environment.api}/article?all=${all}`, {
      ids,
      ...article,
    })
  }

  addOneSubscription({ subscription }: { subscription: FeedDTO }) {
    return this.httpClient.post<FeedDTO>(`${environment.api}/subscription`, subscription)
  }

  deleteOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.delete<Feed>(`${environment.api}/subscription/${subscriptionId}`)
  }

  refreshAllSubscriptions() {
    return this.httpClient.get<Feed[]>(`${environment.api}/subscription/refresh`)
  }

  refreshOneSubscription({ subscriptionId }: { subscriptionId: string }) {
    return this.httpClient.get<Feed[]>(`${environment.api}/subscription/${subscriptionId}/refresh`)
  }
}
