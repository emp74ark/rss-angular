import { Component } from '@angular/core';
import {PageTitle} from '../../components/page-title/page-title';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-tags',
  imports: [
    PageTitle,
    MatCard,
    MatCardContent,
    MatList,
    MatListItem,
  ],
  templateUrl: './tags.html',
  styleUrl: './tags.css'
})
export class Tags {

}
