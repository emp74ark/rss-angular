import { Component, inject, OnInit, viewChild } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AsyncPipe } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { Observable } from 'rxjs'
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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  )

  private router = inject(Router)

  menuItems: { title: string; icon?: string; url: string }[] = [
    { title: 'Articles', url: '/home' },
    { title: 'Bookmarks', url: '/bookmarks' },
    { title: 'Subscriptions', url: '/subscriptions' },
    { title: 'Tags', url: '/tags' },
  ]

  onMenuItemClick() {
    this.sideNav()?.close()
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
