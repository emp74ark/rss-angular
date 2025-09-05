import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { Feed, FeedDTO } from '../entities/feed/feed.types'
import { Article, ArticleDTO } from '../entities/article/article.types'
import { Paginated, Pagination } from '../entities/base/base.types'
import { SortOrder } from '../entities/base/base.enums'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  readonly httpClient = inject(HttpClient)

  getAllFeeds({ pagination }: { pagination?: Partial<Pagination> }) {
    return this.httpClient.get<Paginated<Feed>>(`${environment.api}/feed`, {
      params: pagination,
    })
  }

  getAllArticles({
    pagination,
    filters,
    sort,
  }: {
    pagination?: Partial<Pagination>
    filters?: { tags?: string; read?: boolean }
    sort?: { date: SortOrder }
  }) {
    return this.httpClient.get<Paginated<Article>>(`${environment.api}/article`, {
      params: {
        ...pagination,
        ...filters,
        dateSort: sort?.date || SortOrder.Desc,
      },
    })
  }

  getOneFeed({ feedId }: { feedId: string }) {
    return this.httpClient.get<Feed>(`${environment.api}/feed/${feedId}`)
  }

  changeOneFeed({ id, dto }: { id: string; dto: Partial<FeedDTO> }) {
    return this.httpClient.patch<Feed>(`${environment.api}/feed/${id}`, dto)
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

  addOneFeed({ feed }: { feed: FeedDTO }) {
    return this.httpClient.post<FeedDTO>(`${environment.api}/feed`, feed)
  }

  deleteOneFeed({ feedId }: { feedId: string }) {
    return this.httpClient.delete<Feed>(`${environment.api}/feed/${feedId}`)
  }

  refreshAllFeeds() {
    return this.httpClient.get<Feed[]>(`${environment.api}/feed/refresh`)
  }

  refreshOneFeed({ feedId }: { feedId: string }) {
    return this.httpClient.get<Feed[]>(`${environment.api}/feed/${feedId}/refresh`)
  }

  getFullText({ articleId }: { articleId: string }) {
    return this.httpClient.get<{ fullText: string }>(`${environment.api}/article/${articleId}/full`)
  }
}
