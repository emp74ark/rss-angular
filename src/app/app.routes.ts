import { Routes } from '@angular/router'
import { Home } from './pages/home/home'
import { NotFound } from './pages/not-found/not-found'
import { Subscriptions } from './pages/subscriptions/subscriptions'
import { Tags } from './pages/tags/tags'
import { Auth } from './pages/auth/auth'
import { Article } from './pages/article/article'

export const routes: Routes = [
  { path: '', component: Home, data: { title: 'Home' } },
  { path: 'auth', component: Auth, data: { title: 'Authentication' } },
  {
    path: 'subscriptions',
    component: Subscriptions,
    title: 'Subscriptions',
    data: { title: 'Subscriptions' },
  },
  {
    path: 'subscriptions/:subscriptionId/article/:articleId',
    component: Article,
    title: 'Article',
    data: { title: 'Article' },
  },
  { path: 'tags', component: Tags, title: 'Tags', data: { title: 'Tags' } },
  {
    path: '**',
    component: NotFound,
    title: 'Not Found',
    data: { title: 'Not Found' },
  },
]
