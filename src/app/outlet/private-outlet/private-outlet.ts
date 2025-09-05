import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NavComponent } from '../../components/nav/nav.component'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-private-outlet',
  imports: [NavComponent, RouterOutlet],
  templateUrl: './private-outlet.html',
  styleUrl: './private-outlet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateOutlet {}
