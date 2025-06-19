export interface FeedSettings {
  enable?: boolean
  loadFullText?: boolean
}

export interface FeedDTO {
  title: string
  description?: string
  link: string
  settings: FeedSettings
}

export interface Feed extends FeedDTO {
  _id: string
  articles: string[]
  userId: string
  createdAt: Date
  modifiedAt: Date
}
