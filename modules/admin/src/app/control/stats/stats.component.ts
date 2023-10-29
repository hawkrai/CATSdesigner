import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { SubjectService } from 'src/app/service/subject.service'
import { ActivatedRoute } from '@angular/router'
import { Subject } from 'src/app/model/subject.response'
import * as xlsx from 'xlsx'
import * as jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import { GroupStatsStudent } from '../../model/group.stats'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef

  subjects: Subject[]
  subjectsArchive: Subject[]
  subjectsTemp: Subject[]
  isLoad = false
  groupId: any
  selectedItem: any
  tableStats: any
  groupName: string
  studentStatistic: GroupStatsStudent[]
  studentStatisticArchive: GroupStatsStudent[]
  studentStatisticTemp: GroupStatsStudent[]
  surname: string
  start: string
  end: string
  isArchive = false
  isArchiveEnable = false

  constructor(
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.groupName = this.route.snapshot.params.groupName
    this.surname = this.route.snapshot.params.surname
    this.start = this.route.snapshot.params.start
    this.end = this.route.snapshot.params.end
    this.initData(this.groupName)
  }

  getStatistic(groupId) {
    this.isLoad = false
    this.subjectService
      .loadGroupByDates(groupId, this.start, this.end)
      .subscribe((res) => {
        this.subjectService
          .loadGroupArchiveByDates(groupId, this.start, this.end)
          .subscribe((resArchive) => {
            this.subjectService
              .getUserInfo(resArchive.Students[0].Id + '')
              .subscribe((userInfo) => {
                this.subjectService
                  .getAllArchiveSubjects(userInfo.Login)
                  .subscribe((subjectResponseArchive) => {
                    this.subjectsArchive = subjectResponseArchive
                    if (this.subjectsArchive.length != 0) {
                      this.isArchiveEnable = true
                    }
                  })
              })
            this.studentStatistic = res.Students
            this.studentStatisticArchive = resArchive.Students
            this.isLoad = true
            this.selectedItem = -1
            this.statisticSubject()
          })
      })
  }

  subjectsStatusChange(event) {
    this.isArchive = false
    if (event.checked) {
      this.isArchive = true
    }
    this.selectedItem = -1
    this.statisticSubject()
  }

  statisticSubject() {
    const id = this.selectedItem
    const groupName = this.groupName
    let labMarks = 0
    let practMarks = 0
    let testMarks = 0
    let lectPass = 0
    let practPass = 0
    let labPass = 0
    let rating = 0
    let ratingChart = 0
    let typeCount = 0
    let userLabCount = 0
    let userPracticalCount = 0
    let userTestCount = 0
    let userLabCountTotal = 0
    let userPracticalCountTotal = 0
    let userTestCountTotal = 0
    if (this.isArchive) {
      this.studentStatisticTemp = this.studentStatisticArchive
      this.subjectsTemp = this.subjectsArchive
    } else {
      this.studentStatisticTemp = this.studentStatistic
      this.subjectsTemp = this.subjects
    }
    if (id && id !== -1) {
      const subject = this.subjectsTemp.find(({ Id }) => Id === id)
      this.tableStats = this.studentStatisticTemp.map((item) => {
        rating = 0
        typeCount = 0
        if (this.surname != undefined && !item.FIO.includes(this.surname)) {
          return
        }
        const userLabPass = item.UserLabPass.find(({ Key }) => Key === id).Value
        const userLecturePass = item.UserLecturePass.find(
          ({ Key }) => Key === id
        ).Value
        let userAvgLabMarks = item.UserAvgLabMarks.find(
          ({ Key }) => Key === id
        ).Value
        let userAvgTestMarks = item.UserAvgTestMarks.find(
          ({ Key }) => Key === id
        ).Value
        const userPracticalPass = item.UserPracticalPass.find(
          ({ Key }) => Key === id
        ).Value
        let userPracticalMarks = item.UserAvgPracticalMarks.find(
          ({ Key }) => Key === id
        ).Value
        labMarks += userAvgLabMarks
        practMarks += userPracticalMarks
        testMarks += userAvgTestMarks
        lectPass += userLecturePass
        practPass += userPracticalPass
        labPass += userLabPass
        userLabCount = item.UserLabCount.find(({ Key }) => Key === id).Value
        userPracticalCount = item.UserPracticalCount.find(
          ({ Key }) => Key === id
        ).Value
        userTestCount = item.UserTestCount.find(({ Key }) => Key === id).Value
        if (userLabCount != 0) {
          rating += userAvgLabMarks
          typeCount += 1
          userLabCountTotal += 1
        } else {
          userAvgLabMarks = -1
        }
        if (userPracticalCount != 0) {
          rating += userPracticalMarks
          typeCount += 1
          userPracticalCountTotal += 1
        } else {
          userPracticalMarks = -1
        }
        if (userTestCount != 0) {
          rating += userAvgTestMarks
          typeCount += 1
          userTestCountTotal += 1
        } else {
          userAvgTestMarks = -1
        }
        if (typeCount != 0) {
          rating = rating / typeCount
          ratingChart = rating
        } else {
          rating = -1
          ratingChart = 0
        }
        return {
          GroupName: groupName,
          display: 'revert',
          FIOColspan: 1,
          isBold: false,
          FIO: item.FIO,
          Subject: subject.Name,
          Rating: rating.toFixed(1),
          RatingChart: ratingChart.toFixed(1),
          AllPass: userLabPass + userLecturePass + userPracticalPass,
          UserAvgLabMarks: userAvgLabMarks.toFixed(1),
          UserAvgTestMarks: userAvgTestMarks.toFixed(1),
          UserAvgPracticalMarks: userPracticalMarks.toFixed(1),
          UserTestCount: item.UserTestCount.find(({ Key }) => Key === id).Value,
          UserLabCount: item.UserLabCount.find(({ Key }) => Key === id).Value,
          UserLabPass: userLabPass,
          UserLecturePass: userLecturePass,
          UserPracticalPass: userPracticalPass,
        }
      })
    } else if (id === -1) {
      this.tableStats = this.studentStatisticTemp.map((item) => {
        if (this.surname != undefined && !item.FIO.includes(this.surname)) {
          return
        }
        let labPassTotal = 0
        let lecturePassTotal = 0
        let practicalPassTotal = 0
        let avgLabMarksTotal = 0
        let avgTestMarksTotal = 0
        let avgPracticalMarksTotal = 0
        rating = 0
        ratingChart = 0
        typeCount = 0
        userLabCount = 0
        userPracticalCount = 0
        userTestCount = 0
        item.UserLabPass.map((statsItem, index) => {
          labPassTotal += statsItem.Value
          lecturePassTotal += item.UserLecturePass[index].Value
          practicalPassTotal = item.UserPracticalPass[index].Value
          avgLabMarksTotal += item.UserAvgLabMarks[index].Value
          avgTestMarksTotal += item.UserAvgTestMarks[index].Value
          avgPracticalMarksTotal += item.UserAvgPracticalMarks[index].Value
          userLabCount += item.UserLabCount[index].Value
          userPracticalCount += item.UserPracticalCount[index].Value
          userTestCount += item.UserTestCount[index].Value
        })
        avgLabMarksTotal = avgLabMarksTotal / item.UserLabPass.length
        avgTestMarksTotal = avgTestMarksTotal / item.UserLabPass.length
        avgPracticalMarksTotal =
          avgPracticalMarksTotal / item.UserLabPass.length
        labMarks += avgLabMarksTotal
        practMarks += avgPracticalMarksTotal
        testMarks += avgTestMarksTotal
        lectPass += lecturePassTotal
        practPass += practicalPassTotal
        labPass += labPassTotal
        if (userLabCount != 0) {
          rating += avgLabMarksTotal
          typeCount += 1
          userLabCountTotal += 1
        } else {
          avgLabMarksTotal = -1
        }
        if (userPracticalCount != 0) {
          rating += avgPracticalMarksTotal
          typeCount += 1
          userPracticalCountTotal += 1
        } else {
          avgPracticalMarksTotal = -1
        }
        if (userTestCount != 0) {
          rating += avgTestMarksTotal
          typeCount += 1
          userTestCountTotal += 1
        } else {
          avgTestMarksTotal = -1
        }
        if (typeCount != 0) {
          rating = rating / typeCount
          ratingChart = rating
        } else {
          rating = -1
          ratingChart = 0
        }
        return {
          GroupName: groupName,
          display: 'revert',
          FIOColspan: 1,
          FIO: item.FIO,
          isBold: false,
          Subject: this.translatePipe.transform(
            'text.all.subjects',
            'Все предметы'
          ),
          Rating: rating.toFixed(1),
          RatingChart: ratingChart.toFixed(1),
          AllPass: labPassTotal + lecturePassTotal + practicalPassTotal,
          UserAvgLabMarks: avgLabMarksTotal.toFixed(1),
          UserAvgTestMarks: avgTestMarksTotal.toFixed(1),
          UserLabPass: labPassTotal,
          UserAvgPracticalMarks: avgPracticalMarksTotal.toFixed(1),
          UserLecturePass: lecturePassTotal,
          UserPracticalPass: practicalPassTotal,
        }
      })
    }
    typeCount = 0
    rating = 0
    if (this.surname == undefined) {
      if (userLabCountTotal != 0) {
        labMarks = Math.round(labMarks / userLabCountTotal)
      }
      if (userPracticalCountTotal != 0) {
        practMarks = Math.round(practMarks / userPracticalCountTotal)
      }
      if (testMarks != 0) {
        testMarks = Math.round(testMarks / userTestCountTotal)
      }

      lectPass = Math.round(lectPass / this.studentStatistic.length)
      practPass = Math.round(practPass / this.studentStatistic.length)
      labPass = Math.round(labPass / this.studentStatistic.length)
    }

    labMarks = Math.round(labMarks * 10) / 10
    practMarks = Math.round(practMarks * 10) / 10
    testMarks = Math.round(testMarks * 10) / 10
    if (userLabCountTotal != 0) {
      rating += labMarks
      typeCount += 1
    } else {
      labMarks = -1
    }
    if (userPracticalCountTotal != 0) {
      rating += practMarks
      typeCount += 1
    } else {
      practMarks = -1
    }
    if (userTestCountTotal != 0) {
      rating += testMarks
      typeCount += 1
    } else {
      testMarks = -1
    }

    if (typeCount != 0) {
      rating = Math.round((rating / typeCount) * 10) / 10
      ratingChart = rating
    } else {
      rating = -1
      ratingChart = 0
    }

    lectPass = Math.round(lectPass * 10) / 10
    practPass = Math.round(practPass * 10) / 10
    labPass = Math.round(labPass * 10) / 10

    this.tableStats.push({
      GroupName: groupName,
      isBold: true,
      display: 'none',
      FIOColspan: 2,
      FIO: this.translatePipe.transform(
        'text.average.values',
        'Средние значения'
      ),
      Subject: this.translatePipe.transform(
        'text.all.subjects',
        'Все предметы'
      ),
      Rating: rating,
      RatingChart: ratingChart.toFixed(1),
      AllPass: lectPass + practPass + labPass,
      UserAvgLabMarks: labMarks,
      UserAvgTestMarks: testMarks,
      UserLabPass: labPass,
      UserAvgPracticalMarks: practMarks,
      UserLecturePass: lectPass,
      UserPracticalPass: practPass,
    })
    while (true) {
      if (this.tableStats.indexOf(undefined) == -1) {
        break
      }
      this.remove(undefined)
    }
  }

  remove(value: any) {
    this.tableStats.forEach((element, index) => {
      if (element == value) {
        this.tableStats.splice(index, 1)
      }
    })
  }
  initData(groupName) {
    this.subjectService.getSubjects(groupName).subscribe((subjectResponse) => {
      this.subjects = subjectResponse.Subjects
      this.subjects = this.subjects.sort((a, b) => a.Name.localeCompare(b.Name))
      this.groupId = subjectResponse.GroupId
      this.getStatistic(this.groupId)
    })
  }

  exportExcel(): void {
    const element = document.getElementById('excel-table')
    if (document.getElementById('position')) {
      document.getElementById('position').remove()
    }
    if (document.getElementById('surname')) {
      document.getElementById('surname').remove()
    }
    if (document.getElementById('true')) {
      document.getElementById('true').remove()
    }
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element)
    const wb: xlsx.WorkBook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1')
    xlsx.writeFile(wb, 'ExcelSheet.xlsx')
  }

  public captureScreen() {
    let data = document.getElementById('excel-table')
    if (document.getElementById('position')) {
      document.getElementById('position').remove()
    }
    if (document.getElementById('surname')) {
      document.getElementById('surname').remove()
    }
    html2canvas(data).then((canvas) => {
      const imgWidth = 208
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const heightLeft = imgHeight
      const contentDataURL = canvas.toDataURL('image/png')
      const pdf = new jspdf('p', 'mm', 'a4')
      const position = 0
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('StatsPdf.pdf')
    })

    /*const objFra = document.createElement('iframe');
    document.body.appendChild(objFra);
    objFra.contentWindow.focus();
    objFra.contentWindow.print();
    objFra.remove();*/
    window.print()
    data = document.getElementById('excel-table')
  }
}
