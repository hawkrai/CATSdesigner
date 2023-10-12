import { Component, OnInit, ViewChild } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'
import { FileService } from '../../../service/file.service'
import { MatDialog } from '@angular/material/dialog'
import { Attachment } from 'src/app/model/lecture'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  isLoad: boolean
  file: any
  displayedColumns = [
    'Id',
    'Name',
    'Date',
    'Author',
    'Size',
    'NameOnDisk',
    'PackageOnDisk',
  ]
  dataSource = new MatTableDataSource<Attachment>()
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort

  filter: string = null

  orderBy: string = null
  sortDirection: number = 0

  pageIndexDelta: number = 0
  prevPageData: Attachment[] = null
  nextPageData: Attachment[] = null

  orderByMap = {
    Name: 'Name',
    Date: 'CreationDate',
    Author: 'Author.UserName',
  }

  constructor(
    private dialog: MatDialog,
    private fileService: FileService,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.dataSource.sort = this.sort
    this.paginator.pageSize = 20

    this.loadFilesPaged(false)
  }

  t(value, defaultValue = value) {
    return this.translatePipe.transform(value, defaultValue)
  }

  applyFilter() {
    this.filter = this.filter.trim().toLowerCase()

    this.paginator.pageIndex = 0

    this.loadFilesPaged(false)
  }

  applySort(sort: Sort) {
    this.orderBy = null

    if (sort.direction != '') {
      this.orderBy = this.orderByMap.hasOwnProperty(sort.active)
        ? this.orderByMap[sort.active]
        : null
    }

    this.sortDirection = sort.direction == 'desc' ? 1 : 0

    this.loadFilesPaged(false)
  }

  pageChanged(event: PageEvent) {
    this.pageIndexDelta = event.pageIndex - event.previousPageIndex
    this.loadFilesPaged()
  }

  loadFilesPaged(usePreloaded: boolean = true) {
    let isDataLoaded = false

    if (usePreloaded) {
      if (this.pageIndexDelta == -1 && this.prevPageData != null) {
        this.loadPrevPagePreloaded()
        isDataLoaded = true
      } else if (this.pageIndexDelta == 1 && this.nextPageData != null) {
        this.loadNextPagePreloaded()
        isDataLoaded = true
      }
    }

    if (isDataLoaded) {
      return
    }

    this.dataSource.data = []
    this.isLoad = false

    this.nextPageData = null
    this.prevPageData = null

    this.fileService
      .getFilesPaged(
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.filter,
        this.orderBy,
        this.sortDirection
      )
      .subscribe((items) => {
        this.dataSource.data = items.Items
        this.paginator.length = items.TotalCount
        this.isLoad = true

        this.preloadFiles()
      })
  }

  preloadFiles(loadPrevPage: boolean = true, loadNextPage: boolean = true) {
    if (loadPrevPage && this.paginator.hasPreviousPage()) {
      this.fileService
        .getFilesPaged(
          this.paginator.pageIndex - 1,
          this.paginator.pageSize,
          this.filter,
          this.orderBy,
          this.sortDirection
        )
        .subscribe((items) => {
          this.prevPageData = items.Items
        })
    }

    if (loadNextPage && this.paginator.hasNextPage()) {
      this.fileService
        .getFilesPaged(
          this.paginator.pageIndex + 1,
          this.paginator.pageSize,
          this.filter,
          this.orderBy,
          this.sortDirection
        )
        .subscribe((items) => {
          this.nextPageData = items.Items
        })
    }
  }

  loadPrevPagePreloaded() {
    this.nextPageData = this.dataSource.data
    this.dataSource.data = this.prevPageData
    this.prevPageData = null

    this.preloadFiles(true, false)
  }

  loadNextPagePreloaded() {
    this.prevPageData = this.dataSource.data
    this.dataSource.data = this.nextPageData
    this.nextPageData = null

    this.preloadFiles(false, true)
  }

  loadFile() {
    this.fileService.getFiles().subscribe((items) => {
      this.dataSource.data = items.Files
      this.isLoad = true
    })
  }

  downloadFile(path, filename) {
    this.fileService.downloadFile(path, filename)
  }

  getDateString(date: Date) {
    return date.toDateString()
  }

  getAuthor(AuthorName) {
    if (AuthorName != null) {
      return AuthorName
    } else {
      return this.t('noData')
    }
  }

  getDate(dateString) {
    if (dateString != null) {
      return this.formatDate(dateString)
    } else {
      return this.t('noData')
    }
  }

  formatDate(dateString) {
    let date = new Date(dateString)

    let year = date.getFullYear()
    let month =
      date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 //months are 0 based
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return `${day}.${month}.${year}`
  }

  getSize(size) {
    if (size != null) {
      return this.toReadableFileSize(size)
    } else {
      return this.t('noData')
    }
  }

  toReadableFileSize(size) {
    const units = ['B', 'kB', 'MB', 'GB', 'TB']

    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024))
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
  }
}
