import { Component, inject, OnInit, signal } from '@angular/core'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { AsyncPipe } from '@angular/common'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { Observable } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { ActivatedRouteSnapshot, EventType, Router, RouterLink } from '@angular/router'

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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  )

  pageTitle = signal<string>('Home')

  router = inject(Router)

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event.type === EventType.ActivationStart) {
        const title: string = event.snapshot.data?.['title']
        this.pageTitle.set(title)
      }
    })
  }
}
