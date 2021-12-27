import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubjectService } from 'src/app/service/subject.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'src/app/model/subject.response';
import * as xlsx from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {GroupStatsStudent} from '../../model/group.stats';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {
  @ViewChild('table', { static: false }) table: ElementRef;

  subjects: Subject[];
  isLoad = false;
  groupId: any;
  selectedItem: any;
  tableStats: any;
  groupName: string;
  studentStatistic: GroupStatsStudent[];
  surname: string;

  constructor(private subjectService: SubjectService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.groupName = this.route.snapshot.params.groupName;
    this.surname = this.route.snapshot.params.surname;
    this.initData(this.groupName);
  }

  getStatistic(groupId) {
    this.isLoad = false;
    this.subjectService.loadGroup(groupId).subscribe(
      res => {
        this.studentStatistic = res.Students;
        this.isLoad = true;
        this.selectedItem = -1;
        this.statisticSubject();
      }
    );
  }

  statisticSubject() {
    const id = this.selectedItem;
    const groupName = this.groupName;
    let labMarks = 0;
    let practMarks = 0;
    let testMarks = 0;
    let rating = 0;
    if (id && id !== -1) {
      const subject = this.subjects.find(({Id}) => Id === id);
      this.tableStats = this.studentStatistic.map((item) => {
        const userLabPass = item.UserLabPass.find(({Key}) => Key === id).Value;
        const userLecturePass = item.UserLecturePass.find(({Key}) => Key === id).Value;
        const userAvgLabMarks = item.UserAvgLabMarks.find(({Key}) => Key === id).Value;
        const userAvgTestMarks = item.UserAvgTestMarks.find(({Key}) => Key === id).Value;
        const userPracticalPass = item.UserPracticalPass.find(({Key}) => Key === id).Value;
        const userPracticalMarks = item.UserAvgPracticalMarks.find(({Key}) => Key === id).Value;
        labMarks += userAvgLabMarks;
        practMarks += userPracticalMarks;
        testMarks += userAvgTestMarks;

        if (this.surname != undefined && !item.FIO.includes(this.surname)) {
          return ;
        }
        return {
          GroupName: groupName,
          FIO: item.FIO,
          Subject: subject.Name,
          Rating: ((userAvgLabMarks + userAvgTestMarks + userPracticalMarks) / 3).toFixed(2),
          AllPass: userLabPass + userLecturePass + userPracticalPass,
          UserAvgLabMarks: userAvgLabMarks.toFixed(2),
          UserAvgTestMarks: userAvgTestMarks.toFixed(2),
          UserAvgPracticalMarks: userPracticalMarks.toFixed(2),
          UserTestCount: item.UserTestCount.find(({Key}) => Key === id).Value,
          UserLabCount: item.UserLabCount.find(({Key}) => Key === id).Value,
          UserLabPass: userLabPass,
          UserLecturePass: userLecturePass,
          UserPracticalPass: userPracticalPass};
      });
    } else if (id === -1) {
      this.tableStats = this.studentStatistic.map( item => {
        let labPassTotal = 0;
        let lecturePassTotal = 0;
        let practicalPassTotal = 0;
        let avgLabMarksTotal = 0;
        let avgTestMarksTotal = 0;
        let avgPracticalMarksTotal = 0;
        item.UserLabPass.map( ( statsItem, index) => {
          labPassTotal += statsItem.Value;
          lecturePassTotal += item.UserLecturePass[index].Value;
          practicalPassTotal = item.UserPracticalPass[index].Value;
          avgLabMarksTotal += item.UserAvgLabMarks[index].Value;
          avgTestMarksTotal += item.UserAvgTestMarks[index].Value;
          avgPracticalMarksTotal += item.UserAvgPracticalMarks[index].Value;
        });
        avgLabMarksTotal = avgLabMarksTotal / item.UserLabPass.length;
        avgTestMarksTotal = avgTestMarksTotal / item.UserLabPass.length;
        avgPracticalMarksTotal = avgPracticalMarksTotal / item.UserLabPass.length;
        labMarks += avgLabMarksTotal;
        practMarks += avgPracticalMarksTotal;
        testMarks += avgTestMarksTotal;
        if (this.surname != undefined && !item.FIO.includes(this.surname)) {
          return ;
        }
        return {
          GroupName: groupName,
          FIO: item.FIO,
          Subject: 'Все предметы',
          Rating: ((avgTestMarksTotal + avgLabMarksTotal + avgPracticalMarksTotal) / 3).toFixed(2),
          AllPass: labPassTotal + lecturePassTotal + practicalPassTotal,
          UserAvgLabMarks: avgLabMarksTotal.toFixed(2),
          UserAvgTestMarks: avgTestMarksTotal.toFixed(2),
          UserLabPass: labPassTotal,
          UserAvgPracticalMarks: avgPracticalMarksTotal.toFixed(2),
          UserLecturePass: lecturePassTotal,
          UserPracticalPass: practicalPassTotal
        };
      });
    }
    labMarks = Math.round(labMarks / this.studentStatistic.length * 100) / 100;
    practMarks = Math.round(practMarks / this.studentStatistic.length * 100) / 100;
    testMarks = Math.round(testMarks / this.studentStatistic.length * 100) / 100;
    rating = Math.round((labMarks + practMarks + testMarks) / 3 * 100) / 100;
    this.tableStats.marks = [labMarks, practMarks, testMarks, rating];
    while (true) {
      if (this.tableStats.indexOf(undefined) == -1) {
        break;
      }
      this.remove(undefined);
    }
  }

  remove(value: any) {
    this.tableStats.forEach((element, index) => {
      if (element == value) { this.tableStats.splice(index, 1); }
    });
  }
  initData(groupName) {
    this.subjectService.getSubjects(groupName).subscribe(subjectResponse => {
      this.subjects = subjectResponse.Subjects;
      this.groupId = subjectResponse.GroupId;
      this.getStatistic(this.groupId);
      console.log(this.studentStatistic);
    });
  }

  exportExcel(): void {
    const element = document.getElementById('excel-table');
    if (document.getElementById('position')) {
      document.getElementById('position').remove();
    }
    if (document.getElementById('surname')) {
      document.getElementById('surname').remove();
    }
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(element);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'ExcelSheet.xlsx');
  }

  public captureScreen() {
    const data = document.getElementById('excel-table');
    if (document.getElementById('position')) {
      document.getElementById('position').remove();
    }
    if (document.getElementById('surname')) {
      document.getElementById('surname').remove();
    }
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('StatsPdf.pdf');
    });

    const objFra = document.createElement('iframe');
    document.body.appendChild(objFra);
    objFra.contentWindow.focus();
    objFra.contentWindow.print();
    objFra.remove();
  }
}
