import { RssItem } from '../rss/rss.types.js'

export interface ArticleDTO extends RssItem {
  tags: string[]
  read: boolean
}

export interface Article extends RssItem {
  _id: string
  tags: string[]
  read: boolean
  readonly fullText?: string
  readonly userId: string
  readonly subscriptionId: string
  readonly createdAt: Date
  readonly modifiedAt: Date
}
