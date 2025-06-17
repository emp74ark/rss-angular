import {Routes} from '@angular/router';
import {Home} from './pages/home/home';
import {NotFound} from './pages/not-found/not-found';
import {Subscriptions} from './pages/subscriptions/subscriptions';
import {Tags} from './pages/tags/tags';

export const routes: Routes = [
  {path: '', component: Home, data: {title: 'Home'}},
  {
    path: 'subscriptions',
    component: Subscriptions,
    title: 'Subscriptions',
    data: {title: 'Subscriptions'},
  },
  {path: 'tags', component: Tags, title: 'Tags', data: {title: 'Tags'}},
  {
    path: '**',
    component: NotFound,
    title: 'Not Found',
    data: {title: 'Not Found'},
  },
];
