import { Routes } from '@angular/router'
import { Home } from './pages/home/home'
import { NotFound } from './pages/not-found/not-found'
import { Subscriptions } from './pages/subscriptions/subscriptions'
import { Tags } from './pages/tags/tags'
import { Auth } from './pages/auth/auth'
import { Article } from './pages/article/article'
import { authGuard } from './guards/auth-guard'
import { Root } from './pages/root/root'

export const routes: Routes = [
  { path: '', component: Root, data: { title: 'Start' } },
  { path: 'home', component: Home, data: { title: 'Home' }, canMatch: [authGuard] },
  { path: 'auth', component: Auth, data: { title: 'Authentication' } },
  {
    path: 'subscriptions',
    component: Subscriptions,
    title: 'Subscriptions',
    data: { title: 'Subscriptions' },
    canMatch: [authGuard],
  },
  {
    path: 'subscriptions/:subscriptionId/article/:articleId',
    component: Article,
    title: 'Article',
    data: { title: 'Article' },
    canMatch: [authGuard],
  },
  {
    path: 'tags',
    component: Tags,
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
