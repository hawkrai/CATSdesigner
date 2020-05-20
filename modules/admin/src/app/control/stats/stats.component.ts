import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubjectService } from 'src/app/service/subject.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'src/app/model/subject.response';
import * as xlsx from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
  window: any;

  constructor(private subjectService: SubjectService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.groupId = this.route.snapshot.params.groupId;
    this.getSubjectName(this.groupId);
  }

  getSubjectName(groupId) {
    this.subjectService.getSubjects(groupId).subscribe(subjectResponse => {
      this.subjects = subjectResponse.Subjects;
      this.isLoad = true;
    });
  }

  exportexcel(): void {
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
  }
}
