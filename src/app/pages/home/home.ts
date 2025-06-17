import { Component } from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardContent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
