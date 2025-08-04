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
import { RowSpacer } from '../../components/row-spacer/row-spacer'
import { MatDialog } from '@angular/material/dialog'
import { TagAddForm } from '../../components/tag-add-form/tag-add-form'
import { MatChipRemove, MatChipRow, MatChipSet } from '@angular/material/chips'

@Component({
  selector: 'app-tags',
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatIconButton,
    MatIconModule,
    RowSpacer,
    MatPaginator,
    MatChipRow,
    MatChipRemove,
    MatChipSet,
  ],
  templateUrl: './tags-page.component.html',
  styleUrl: './tags-page.component.css',
})
export class TagsPage implements OnInit {
  tagsService = inject(TagService)
  destroyRef = inject(DestroyRef)
  readonly dialog = inject(MatDialog)

  tags = signal<Tag[]>([])
  currentPage = signal<number>(1)
  pageSize = signal<number>(10)
  totalResults = signal<number>(0)

  getDate() {
    this.tagsService
      .getAllTags({
        pagination: {
          perPage: this.pageSize(),
          pageNumber: this.currentPage(),
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
          this.currentPage.set(1)
          this.tags.set(result.result)
          this.totalResults.set(result.total)
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
    this.currentPage.set(event.pageIndex + 1)
    this.pageSize.set(event.pageSize)
    this.getDate()
  }
}
