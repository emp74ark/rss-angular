import { Component, inject, OnInit, signal, viewChild } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AsyncPipe } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { Observable, tap } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { EventType, Router, RouterLink } from '@angular/router'
import { TitleService } from '../../services/title-service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
  ],
})
export class NavComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver)
  private titleService = inject(TitleService)
  private sideNav = viewChild<MatSidenav>('drawer')

  currentTitle = toSignal(this.titleService.$currentTitle)

  isHandset = signal<boolean>(false)

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    tap((result) => this.isHandset.set(result.matches)),
    map((result) => result.matches),
    shareReplay(),
  )

  private router = inject(Router)

  menuItems: { title: string; icon?: string; url: string }[] = [
    { title: 'Articles', url: '/home', icon: 'library_books' },
    { title: 'Bookmarks', url: '/bookmarks', icon: 'bookmark' },
    { title: 'Subscriptions', url: '/subscriptions', icon: 'rss_feed' },
    { title: 'Tags', url: '/tags', icon: 'tag' },
    { title: 'Status', url: '/status', icon: 'memory' },
  ]

  onMenuItemClick() {
    if (this.isHandset()) {
      this.sideNav()?.close()
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event.type === EventType.ActivationStart) {
        const title: string = event.snapshot.data?.['title']
        this.titleService.setTitle(title)
      }
    })
  }
}
