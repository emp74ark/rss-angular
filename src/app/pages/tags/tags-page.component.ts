import { Component } from '@angular/core'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatList, MatListItem } from '@angular/material/list'

@Component({
  selector: 'app-tags',
  imports: [MatCard, MatCardContent, MatList, MatListItem],
  templateUrl: './tags-page.component.html',
  styleUrl: './tags-page.component.css',
})
export class TagsPage {}
