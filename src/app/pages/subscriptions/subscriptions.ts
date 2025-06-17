import {Component} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-subscriptions',
  imports: [
    MatCard,
    MatCardContent,
  ],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions {
}
