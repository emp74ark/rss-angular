import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, combineLatest, of, switchMap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconButton } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatDialog } from '@angular/material/dialog'
import { TagAddForm } from '../../components/tag-add-form/tag-add-form'
import { MatChipRemove, MatChipRow, MatChipSet } from '@angular/material/chips'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { TitleService } from '../../services/title-service'

@Component({
  selector: 'app-tags-page',
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
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.css',
})
export class TagsPage implements OnInit {
  tagsService = inject(TagService)
  pageService = inject(PageService)
  destroyRef = inject(DestroyRef)
  readonly dialog = inject(MatDialog)
  titleService = inject(TitleService)

  tags = signal<Tag[]>([])

  ngOnInit() {
    combineLatest([this.pageService.$pageSize, this.pageService.$currentPage])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(([perPage, pageNumber]) => {
          return this.tagsService.getAllTags({
            pagination: {
              perPage,
              pageNumber,
            },
          })
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.pageService.setTotalResults(result.total)
          this.tags.set(result.result)
          this.titleService.setTitle('Tags')
        }
      })
  }

  onAdd() {
    const dialogRef = this.dialog.open(TagAddForm)

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result)
      this.pageService.setCurrentPage(1)
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
      .subscribe((res) => {
        if (res) {
          this.pageService.setCurrentPage(1)
        }
      })
  }
}
