import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AsyncPipe } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { Observable, tap } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { EventType, Router, RouterLink, RouterLinkActive } from '@angular/router'
import { TitleService } from '../../services/title-service'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { AuthService } from '../../services/auth-service'

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
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver)
  private readonly titleService = inject(TitleService)
  private readonly authService = inject(AuthService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly sideNav = viewChild<MatSidenav>('drawer')
  private readonly router = inject(Router)

  readonly currentTitle = toSignal(this.titleService.$currentTitle)
  readonly currentSubtitle = toSignal(this.titleService.$currentSubtitle)

  readonly isHandset = signal<boolean>(false)

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    tap((result) => this.isHandset.set(result.matches)),
    map((result) => result.matches),
    shareReplay(),
  )

  menuItems: { title: string; icon?: string; url: string }[] = [
    { title: 'Articles', url: '/articles', icon: 'library_books' },
    { title: 'Bookmarks', url: '/bookmarks', icon: 'bookmark' },
    { title: 'Feeds', url: '/feeds', icon: 'rss_feed' },
    { title: 'Tags', url: '/tags', icon: 'tag' },
    { title: 'User', url: '/user', icon: 'person' },
    { title: 'Status', url: '/status', icon: 'memory' },
  ]

  onMenuItemClick() {
    if (this.isHandset()) {
      this.sideNav()?.close()
    }
  }

  onLogOut() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.router.navigate(['/auth'])
        }
      })
  }

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event.type === EventType.ActivationStart) {
          const title: string = event.snapshot.data?.['title']
          this.titleService.setTitle(title)
        }
      })
  }
}
