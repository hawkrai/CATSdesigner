import { Component, OnInit, Inject } from '@angular/core';
import { StatisticService } from 'src/app/service/statistic.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  title = '';
  type = 'LineChart';
  data = [];
  columnNames = ['Data', 'Count'];
  options = {
     legend: {position: 'none'},
     hAxis: {
        title: ''
     },
     vAxis: {
        title: '',
        viewWindow: {
          max: 30
        }
     }
  };
  isLoad = false;

  constructor(private statisticService: StatisticService, public dialogRef: MatDialogRef<object>,
              @Inject(MAT_DIALOG_DATA) public value: any) { }

  ngOnInit() {
    this.loadStatistic(this.value);
  }

  async loadStatistic(userId) {
    await this.statisticService.getStatistics(userId).subscribe( result => {
      if (!result.attendance) {
        this.data.push(['', 0]);
      } else {
        this.data = this.convertData(result.attendance);
      }
      this.title = result.resultMessage;
      this.isLoad = true;
    });
  }

  convertData(array) {
    const arr = [];
    for (const item of array) {
      arr.push([ item.day, item.count]);
    }
    const arrLength = arr.length;
    return arrLength > 30 ? arr.slice( arrLength - 30, arrLength) : arr.slice(0, arrLength);
  }

}
