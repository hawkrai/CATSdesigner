import {Component, Input, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {GroupStatsStatistic} from '../../../model/group.stats';

@Component({
  selector: 'app-table-for-stats-subject',
  templateUrl: './table-for-stats-subject.component.html',
  styleUrls: ['./table-for-stats-subject.component.css']
})
export class TableForStatsSubjectComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['position', 'FIO', 'UserLabPass', 'UserLecturePass', 'UserPracticalPass', 'AllPass',
   'UserAvgLabMarks', 'UserAvgTestMarks', 'UserAvgPracticalMarks', 'Rating'];
  headerRow: string[] = ['family-header', 'option-header', 'omissions-header', 'average-mark-header'];

  public categoriesConst: string[]  = ['Средний балл за практические занятия',
    'Средний балл за лабораторные работы',
    'Средняя оценка за тесты',
    'Рейтинговая оценка'];

  public surnames: string [] = [];
  public marksChart: any[] = [];
  public passes: any[] = [];
  public marks: any;

  colors: string [] = [ 'orange', 'red', 'blue', 'green'];
  dataSource;
  public chartOptions: any;
  public chartOptions1: any;
  @Input() data: any;

  constructor() {}

  ngOnInit() {
    this.dataSource = this.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = changes.data.currentValue;
    this.marks = JSON.parse(JSON.stringify(this.dataSource.marks));
    this.addChart(this.marks, this.dataSource[0].Subject, this.categoriesConst);
    delete this.dataSource.marks;
    this.dataSource.forEach(student => {
      this.surnames.push(student.FIO.split(' ')[0]);
      this.passes.push(student.AllPass);
      this.marksChart.push(+student.Rating);
    });
    this.addPassAndMarksChart(this.marksChart, this.passes, this.surnames);
  }

  addChart(marks: any, name: string, cat: any) {
      this.chartOptions = {
        categories: cat,
        series: [
          {
            name: 'Средняя оценка',
            data: marks
          }
        ],
        chart: {
          height: 200,
          type: 'radar',
          width: 200
        },
        title: {
          text: name
        },
        xaxis: {
          categories: ['', '', '', '', '']

        },
        yaxis: {
        },
        fill: {
          type: 'solid',
          opacity: 0,
        },
        markers: {
          discrete: [{
            seriesIndex: 0,
            dataPointIndex: 0,
            fillColor: this.colors[0],
            strokeColor: '#fff',
            size: 5
          }, {
            seriesIndex: 0,
            dataPointIndex: 1,
            fillColor: this.colors[1],
            strokeColor: '#eee',
            size: 5
          }, {
            seriesIndex: 0,
            dataPointIndex: 2,
            fillColor: this.colors[2],
            strokeColor: '#eee',
            size: 5
          }, {
            seriesIndex: 0,
            dataPointIndex: 3,
            fillColor: this.colors[3],
            strokeColor: '#eee',
            size: 5
          }, {
            seriesIndex: 0,
            dataPointIndex: 4,
            fillColor: this.colors[4],
            strokeColor: '#eee',
            size: 5
          }]
        },
        stroke: {
          show: true,
          width: 0.3,
          colors: ['black'],
          dashArray: 0
        },
        legend: {
          show: 'true',
          position: 'bottom',
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 400,
        }
      };
  }

  addPassAndMarksChart(marks: any, passes: any, surnames: any ) {
    this.chartOptions1 = {
      series: [
        {
          name: 'Пропуски',
          data: passes
        },
        {
          name: 'Оценки',
          data: marks
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: surnames
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter(val) {
            return val;
          }
        },
        x: {
          formatter(val) {
            return val;
          }
        }
      }
    };
  }
}
