import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, of } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconButton } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { TagAddForm } from '../../components/tag-add-form/tag-add-form'
import { MatChipRemove, MatChipRow, MatChipSet } from '@angular/material/chips'
import { Paginator } from '../../components/paginator/paginator'
import { PaginationService } from '../../services/pagination-service'
import { TitleService } from '../../services/title-service'

@Component({
  selector: 'app-tags',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatIconButton,
    MatIconModule,
    MatChipRow,
    MatChipRemove,
    MatChipSet,
    Paginator,
  ],
  templateUrl: './tags-page.component.html',
  styleUrl: './tags-page.component.css',
})
export class TagsPage implements OnInit {
  tagsService = inject(TagService)
  paginationService = inject(PaginationService)
  destroyRef = inject(DestroyRef)
  readonly dialog = inject(MatDialog)
  titleService = inject(TitleService)

  tags = signal<Tag[]>([])

  getDate() {
    this.tagsService
      .getAllTags({
        pagination: {
          perPage: this.paginationService.pageSize(),
          pageNumber: this.paginationService.currentPage(),
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        if (result) {
          this.paginationService.setCurrentPage(1)
          this.paginationService.setTotalResults(result.total)
          this.tags.set(result.result)
          this.titleService.setTitle('Tags')
        }
      })
  }

  ngOnInit() {
    this.getDate()
  }

  paginator = viewChild(MatPaginator)

  onAdd() {
    const dialogRef = this.dialog.open(TagAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDate()
      }
    })
  }

  onRemove(tag: Tag) {
    this.tagsService
      .deleteOneTag({ name: tag.name })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.getDate()
        this.paginator()?.firstPage()
      })
  }

  paginatorHandler(event: PageEvent) {
    this.getDate()
  }
}
