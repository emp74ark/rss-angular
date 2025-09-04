import { Component, DestroyRef, inject, linkedSignal, OnInit, signal } from '@angular/core'
import { TagService } from '../../services/tag-service'
import { Tag } from '../../entities/tag/tag.types'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, combineLatest, of, switchMap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatIconModule } from '@angular/material/icon'
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { Paginator } from '../../components/paginator/paginator'
import { PageService } from '../../services/page-service'
import { TitleService } from '../../services/title-service'
import { Router } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { BottomErrorSheet } from '../../components/bottom-error-sheet/bottom-error-sheet'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog'

@Component({
  selector: 'app-tags-page',
  imports: [MatIconModule, Paginator, MatFormFieldModule, MatChipsModule],
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.css',
})
export class TagsPage implements OnInit {
  private readonly tagsService = inject(TagService)
  private readonly pageService = inject(PageService)
  private readonly destroyRef = inject(DestroyRef)
  private readonly titleService = inject(TitleService)
  private readonly router = inject(Router)
  private readonly errorSheet = inject(MatBottomSheet)
  private readonly dialog = inject(MatDialog)

  readonly separatorKeysCodes = [ENTER, COMMA] as const

  private readonly tags = signal<Tag[]>([])

  readonly userTags = linkedSignal(() => {
    return this.tags().filter((t) => t.userId !== 'all')
  })

  readonly appTags = linkedSignal(() => {
    return this.tags().filter((t) => t.userId === 'all')
  })

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

  onAdd(e: MatChipInputEvent) {
    const name = (e.value || '').trim()

    if (!name) {
      return
    }

    this.tagsService
      .addOneTag({ name })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.errorSheet.open(BottomErrorSheet, { data: { error: error.error.message } })
          return of(null)
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res) => {
        if (res) {
          this.pageService.setCurrentPage(1)
          e.chipInput.clear()
        }
      })
  }

  onEdit(tag: Tag, e: MatChipEditedEvent) {
    const newName = (e.value || '').trim()
    const currentName = tag.name

    if (!newName) {
      return
    }

    this.tagsService
      .changeOneTag({ newName, currentName })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.errorSheet.open(BottomErrorSheet, { data: { error: error.error.message } })
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

  onRemove(tag: Tag) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Delete tag',
        message: `Are you sure you want to delete the tag "${tag.name}"?`,
        confirmButtonText: 'Delete',
      },
    })

    dialogRef.afterClosed().subscribe((agree) => {
      if (agree) {
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
    })
  }

  onClick(name: string) {
    if (!name) {
      return
    }
    this.router.navigate(['/articles'], { queryParams: { tag: name } })
  }
}
