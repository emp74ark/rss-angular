import { Routes } from '@angular/router'
import { NotFound } from './pages/not-found/not-found'
import { Auth } from './pages/auth/auth'
import { authGuard } from './guards/auth-guard'
import { Root } from './pages/root/root'

export const routes: Routes = [
  { path: '', component: Root, data: { title: 'Start' } },
  { path: 'auth', component: Auth, data: { title: 'Authentication' } },
  {
    path: 'home',
    loadComponent: async () => {
      const c = await import('./pages/home/home')
      return c.Home
    },
    data: { title: 'Home' },
    canMatch: [authGuard],
  },
  {
    path: 'subscriptions',
    loadComponent: async () => {
      const c = await import('./pages/subscriptions/subscriptions')
      return c.Subscriptions
    },
    title: 'Subscriptions',
    data: { title: 'Subscriptions' },
    canMatch: [authGuard],
  },
  {
    path: 'subscriptions/:subscriptionId/article/:articleId',
    loadComponent: async () => {
      const c = await import('./pages/article/article')
      return c.Article
    },
    title: 'Article',
    data: { title: 'Article' },
    canMatch: [authGuard],
  },
  {
    path: 'tags',
    loadComponent: async () => {
      const c = await import('./pages/tags/tags')
      return c.Tags
    },
    title: 'Tags',
    data: { title: 'Tags' },
    canMatch: [authGuard],
  },
  {
    path: '**',
    component: NotFound,
    title: 'Not Found',
    data: { title: 'Not Found' },
  },
]
