import { Routes } from '@angular/router'
import { NotFoundPage } from './pages/not-found/not-found-page.component'
import { authGuard } from './guards/auth-guard'
import { AuthPage } from './pages/auth-page/auth-page.component'
import { StatusPage } from './pages/status-page/status-page'

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPage, data: { title: 'Authentication' } },
  {
    path: 'articles',
    loadComponent: async () => {
      const c = await import('./pages/articles-page/articles-page')
      return c.ArticlesPage
    },
    canMatch: [authGuard],
  },
  {
    path: 'bookmarks',
    loadComponent: async () => {
      const c = await import('./pages/bookmarks-page/bookmarks-page')
      return c.BookmarksPage
    },
    canMatch: [authGuard],
  },
  {
    path: 'subscriptions',
    loadComponent: async () => {
      const c = await import('./pages/subscriptions-page/subscriptions-page')
      return c.SubscriptionsPage
    },
    data: { title: 'Subscriptions' },
    canMatch: [authGuard],
  },
  {
    path: 'subscription/:subscriptionId/article/:articleId',
    loadComponent: async () => {
      const c = await import('./pages/article-page/article-page')
      return c.ArticlePage
    },
    data: { title: 'Article' },
    canMatch: [authGuard],
  },
  {
    path: 'tags',
    loadComponent: async () => {
      const c = await import('./pages/tags-page/tags-page')
      return c.TagsPage
    },
    data: { title: 'Tags' },
    canMatch: [authGuard],
  },
  {
    path: 'user',
    loadComponent: async () => {
      const c = await import('./pages/user-page/user-page')
      return c.UserPage
    },
    data: { title: 'User' },
    canMatch: [authGuard],
  },
  {
    path: 'status',
    component: StatusPage,
    data: { title: 'Status' },
    canMatch: [authGuard],
  },
  {
    path: '**',
    component: NotFoundPage,
    data: { title: 'Not Found' },
  },
]
