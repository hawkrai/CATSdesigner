import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { PercentageResultsService } from '../../services/percentage-results.service'
import { Subscription } from 'rxjs'
import { StudentPercentageResults } from '../../models/student-percentage-results.model'
import { PercentageGraph } from '../../models/percentage-graph.model'
import { PercentageResult } from '../../models/percentage-result.model'
import { DiplomUser } from '../../models/diplom-user.model'
import {
  MatDialog,
  MatOptionSelectionChange,
  MatSnackBar,
} from '@angular/material'
import { EditPercentageDialogComponent } from './edit-percentage-dialog/edit-percentage-dialog.component'
import { TranslatePipe } from 'educats-translate'
import { CoreGroup } from 'src/app/models/core-group.model'
import { ToastrService } from 'ngx-toastr'
import { GroupService } from 'src/app/services/group.service'

@Component({
  selector: 'app-percentage-results',
  templateUrl: './percentage-results.component.html',
  styleUrls: ['./percentage-results.component.less'],
})
export class PercentageResultsComponent implements OnInit, OnChanges {
  @Input() diplomUser: DiplomUser

  private COUNT = 1000
  private PAGE = 1

  private percentageResults: StudentPercentageResults[]
  public filteredPercentageResults: StudentPercentageResults[]
  public percentageGraphs: PercentageGraph[]
  public groups: String[]
  public themes = [
    {
      name: this.translatePipe.transform(
        'text.diplomProject.head',
        'Руководитель проекта'
      ),
      value: true,
    },
    {
      name: this.translatePipe.transform(
        'text.diplomProject.secretary',
        'Секретарь ГЭК'
      ),
      value: false,
    },
  ]
  public theme = undefined

  private percentageResultsSubscription: Subscription
  private studentItems: any[] = []
  public searchString = ''
  private sorting = 'Id'
  private direction = 'asc'
  public selectedGroup: String
  public isLecturer = false

  constructor(
    private percentageResultsService: PercentageResultsService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private groupService: GroupService,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    const toggleValue: string = localStorage.getItem('toggle')
    if (toggleValue && this.diplomUser.IsLecturer) {
      this.isLecturer =
        localStorage.getItem('toggle') === 'false' ? false : true
    } else {
      this.isLecturer = this.diplomUser.IsLecturer
    }
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]
    this.retrievePercentageResults()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedGroup && !changes.selectedGroup.firstChange) {
      this.retrievePercentageResults()
    }
  }

  lecturerStatusChange(event) {
    this.isLecturer = event.value.value
    this.selectedGroup = undefined
    localStorage.setItem('toggle', event.value.value)
    this.retrievePercentageResults()
  }

  sort(field: string, direction: string) {
  if (!direction) {
    this.sorting = 'Id'
    this.direction = 'asc'
  } else {
    if (field === 'Student') {
      this.sorting = 'Id'
    } else if (field === 'Lecturer') {
      this.sorting = 'Lecturer'
    } else {
      this.sorting = field
    }
    this.direction = direction
  }
  if (this.filteredPercentageResults) {
    this.filteredPercentageResults = this.applySort([...this.filteredPercentageResults])
  }
}

  retrievePercentageResults() {
  this.percentageResults = null

  let isSecretaryFilter: boolean
  if (this.diplomUser.IsStudent) {
    isSecretaryFilter = false
  } else {
    isSecretaryFilter = !this.isLecturer
  }

  this.percentageResultsSubscription = this.percentageResultsService
    .getPercentageResults(
      'count=' +
        this.COUNT +
        '&page=' +
        this.PAGE +
        '&filter={"isSecretary":"' +
        isSecretaryFilter +
        '","searchString":"' +
        this.searchString +
        '","studentId":"' +
        (this.diplomUser.IsStudent ? this.diplomUser.UserId : 0) +
        '"}' +
        '&sorting[' +
        this.sorting +
        ']=' +
        this.direction
    )
    .subscribe((res) => {
      this.studentItems = res.Students.Items

      if (this.diplomUser.IsStudent) {
        const currentStudent = res.Students.Items.find(
          (x) => x.Id == this.diplomUser.UserId
        )
        if (currentStudent) {
          const students = res.Students.Items.filter(
            (x) => x.Group == currentStudent.Group
          )
          this.percentageResults = this.assignResults(students, res.PercentageGraphs)
        } else {
          this.percentageResults = []
        }
      } else {
        this.percentageResults = this.assignResults(
          res.Students.Items,
          res.PercentageGraphs
        )
      }

      if (this.isLecturer) {
        const currentSelectedGroup = (this.selectedGroup && this.groups && this.groups.includes(this.selectedGroup))
          ? this.selectedGroup
          : (this.groups && this.groups.length > 0 ? this.groups[0] : null)

        const groupStudent = res.Students.Items.find(
          (s) => s.Group === currentSelectedGroup
        )
        const groupId = groupStudent ? groupStudent.GroupId : null

        if (groupId) {
          this.percentageGraphs = res.PercentageGraphs.filter((graph) =>
            graph.SelectedGroupsIds && graph.SelectedGroupsIds.includes(groupId)
          )
          this.percentageResults = this.assignResults(
            res.Students.Items,
            this.percentageGraphs
          )
        } else {
          this.percentageGraphs = res.PercentageGraphs
        }
      } else {
        this.percentageGraphs = res.PercentageGraphs.filter((graph) =>
          graph.SelectedGroupsIds && graph.SelectedGroupsIds.length > 0
        )
      }

      if (
        (this.isLecturer || (this.diplomUser.IsSecretary && !this.isLecturer)) &&
        this.groups &&
        this.groups.length > 0
      ) {
        if (!this.selectedGroup || !this.groups.includes(this.selectedGroup)) {
          this.selectedGroup = this.groups[0]
        }
        this.filteredPercentageResults = this.applySort(
          this.percentageResults.filter((x) => x.Group === this.selectedGroup)
        )
      } else {
        this.filteredPercentageResults = this.applySort(
          this.percentageResults ? [...this.percentageResults] : []
        )
      }
    })
}

applySort(students: StudentPercentageResults[]): StudentPercentageResults[] {
  if (!students) return []
  return students.sort((a, b) => {
    if (this.sorting === 'Lecturer') {
      const lecA = a.Lecturer || null
      const lecB = b.Lecturer || null
      if (!lecA && !lecB) return 0
      if (!lecA) return 1
      if (!lecB) return -1
      return this.direction === 'asc'
        ? lecA.localeCompare(lecB, 'ru', { sensitivity: 'base' })
        : lecB.localeCompare(lecA, 'ru', { sensitivity: 'base' })
    }
    const nameA = a.Name || ''
    const nameB = b.Name || ''

    const getOrder = (name: string): number => {
      if (/^[0-9]/.test(name)) return 0
      if (/^[a-zA-Z]/.test(name)) return 1
      if (/^[а-яёА-ЯЁ]/.test(name)) return 2
      return 3
    }

    const orderA = getOrder(nameA)
    const orderB = getOrder(nameB)

    if (orderA !== orderB) {
      return this.direction === 'asc' ? orderA - orderB : orderB - orderA
    }

    return this.direction === 'asc'
      ? nameA.localeCompare(nameB, 'ru', { sensitivity: 'base' })
      : nameB.localeCompare(nameA, 'ru', { sensitivity: 'base' })
  })
}

  onSearchChange(searchText: string) {
    this.searchString = searchText
    this.updateStats()
  }

  _selectedGroup(event: MatOptionSelectionChange) {
  if (event.isUserInput) {
    this.selectedGroup = event.source.value
    this.sorting = 'Id'
    this.direction = 'asc'

    if (this.isLecturer) {
      this.retrievePercentageResults()
      return
    }

    if (this.percentageResults) {
      this.filteredPercentageResults = this.applySort(
        [...this.percentageResults.filter((x) => x.Group === this.selectedGroup)]
      )
    }
  }
}

  updateStats() {
    if (this.percentageResultsSubscription) {
      this.percentageResultsSubscription.unsubscribe()
    }
    this.retrievePercentageResults()
  }

  public getDiplomUser() {
    return this.diplomUser
  }

  assignResults(
    studentPercentageResults: StudentPercentageResults[],
    percentageGraphs: PercentageGraph[]
  ): StudentPercentageResults[] {
    this.groups = studentPercentageResults
      .map((a) => a.Group)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => (a < b ? -1 : 1))
    for (const student of studentPercentageResults) {
      const results: PercentageResult[] = []
      for (const percentageGraph of percentageGraphs) {
        const result = student.PercentageResults.find(
          (pr) => pr.PercentageGraphId === percentageGraph.Id
        )
        if (result != null) {
          if (result.Mark == null) {
            result.Mark = ''
          }
          results.push(result)
        } else {
          // @ts-ignore
          const pr: PercentageResult = {
            StudentId: student.Id,
            PercentageGraphId: percentageGraph.Id,
            Mark: '',
          }
          results.push(pr)
        }
      }
      student.PercentageResults = results
      if (student.Mark == null) {
        student.Mark = ''
      }
    }
    return studentPercentageResults
  }

  setResult(pr: PercentageResult, student: StudentPercentageResults) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      autoFocus: false,
      height: '100%',
      width: '600px',
      data: {
        mark: pr.Mark !== '-' ? pr.Mark : null,
        min: 0,
        max: 100,
        regex: '^[0-9]*$',
        errorMsg: this.translatePipe.transform(
          'text.diplomProject.percentageControl',
          'Введите число от 0 до 100'
        ),
        label: this.translatePipe.transform(
          'text.diplomProject.percentageResult',
          'Результат процентовки'
        ),
        symbol: '%',
        lecturer: student.Lecturer,
        comment: pr.Comment,
        showForStudent: pr.ShowForStudent,
        expected: this.percentageGraphs.find(
          (pg) => pg.Id === pr.PercentageGraphId
        ).Percentage,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (
        result != null &&
        result.mark != null &&
        !(result.mark === '' && pr.Id == null)
      ) {
        if (pr.Id == null) {
          this.percentageResultsService
            .setPercentage(
              pr.StudentId,
              pr.PercentageGraphId,
              result.mark,
              result.comment,
              result.showForStudent
            )
            .subscribe(() => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.diplomProject.percentagesAlert',
                  'Процент успешно сохранен'
                )
              )
            })
        } else {
          this.percentageResultsService
            .editPercentage(
              pr.Id,
              pr.StudentId,
              pr.PercentageGraphId,
              result.mark,
              result.comment,
              result.showForStudent
            )
            .subscribe(() => {
              this.ngOnInit()
              this.addFlashMessage(
                this.translatePipe.transform(
                  'text.diplomProject.percentagesEditAlert',
                  'Процент успешно изменен'
                )
              )
            })
        }
      }
    })
  }

  setMark(student: StudentPercentageResults) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      autoFocus: false,
      height: '100%',
      width: '600px',
      data: {
        mark: student.Mark !== '' ? student.Mark : null,
        min: 1,
        max: 10,
        regex: '^[0-9]*$',
        errorMsg: this.translatePipe.transform(
          'text.diplomProject.estimationControl',
          'Введите число от 0 до 10'
        ),
        label: this.translatePipe.transform('mark', 'Выставление оценки'),
        notEmpty: true,
        total: true,
        lecturer: student.Lecturer,
        date: student.MarkDate,
        comment: student.Comment,
        showForStudent: student.ShowForStudent,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result.mark != null && result.mark !== '') {
        const date = new Date(result.date)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        const dateString =
          (date.getDay() < 10 ? '0' : '') +
          date.getDay() +
          '.' +
          (date.getMonth() < 10 ? '0' : '') +
          date.getMonth() +
          '.' +
          date.getFullYear()
        this.percentageResultsService
          .setMark(
            student.AssignedDiplomProjectId,
            result.mark,
            student.Lecturer,
            result.comment,
            dateString,
            result.showForStudent
          )
          .subscribe(() => {
            this.ngOnInit()
            this.addFlashMessage(
              this.translatePipe.transform(
                'text.diplomProject.estimationAlert',
                'Оценка успешно сохранена'
              )
            )
          })
      }
    })
  }

  getExcelFile() {
    location.href =
      location.origin +
      '/api/DpStatistic?count=1000' +
      '&page=1&filter=' +
      '{"group":"' +
      this.selectedGroup +
      '"}'
  }

  downloadArchive() {
    location.href = location.origin + '/api/DpTaskSheetDownload'
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }
}
