import {
  Component,
  computed,
  HostBinding,
  HostListener,
  input,
} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-page-title',
  imports: [
    MatToolbar,
  ],
  templateUrl: './page-title.html',
  styleUrl: './page-title.css',
})
export class PageTitle {
  title = input<string>();
  randomColor = computed<string>(() => {
    return `#${Math.floor(Math.random() * 16777215).
      toString(16).
      padStart(6, '0')}`;
  });

  @HostBinding('style.--background')
  value: string = this.randomColor();

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.setProperty('--border', '50cqh');
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const element = event.target as HTMLElement;
    if (element) {
      element.style.setProperty('--border', '0');
    }
  }
}
