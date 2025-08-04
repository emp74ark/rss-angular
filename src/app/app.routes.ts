import { Routes } from '@angular/router'
import { NotFoundPage } from './pages/not-found/not-found-page.component'
import { authGuard } from './guards/auth-guard'
import { AuthPage } from './pages/auth-page/auth-page.component'

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthPage, data: { title: 'Authentication' } },
  {
    path: 'home',
    loadComponent: async () => {
      const c = await import('./pages/home/home-page.component')
      return c.HomePage
    },
    data: { title: 'Home' },
    canMatch: [authGuard],
  },
  {
    path: 'subscriptions',
    loadComponent: async () => {
      const c = await import('./pages/subscriptions/subscriptions-page.component')
      return c.SubscriptionsPage
    },
    title: 'Subscriptions',
    data: { title: 'Subscriptions' },
    canMatch: [authGuard],
  },
  {
    path: 'subscription/:subscriptionId/article/:articleId',
    loadComponent: async () => {
      const c = await import('./pages/article-page/article-page.component')
      return c.ArticlePage
    },
    title: 'Article',
    data: { title: 'Article' },
    canMatch: [authGuard],
  },
  {
    path: 'tags',
    loadComponent: async () => {
      const c = await import('./pages/tags/tags-page.component')
      return c.TagsPage
    },
    title: 'Tags',
    data: { title: 'Tags' },
    canMatch: [authGuard],
  },
  {
    path: '**',
    component: NotFoundPage,
    title: 'Not Found',
    data: { title: 'Not Found' },
  },
]
