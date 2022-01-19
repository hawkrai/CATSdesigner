import {Component, Input, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import { StatisticService } from 'src/app/service/statistic.service';


@Component({
  selector: 'app-table-for-stats-subject',
  templateUrl: './table-for-stats-subject.component.html',
  styleUrls: ['./table-for-stats-subject.component.css']
})
export class TableForStatsSubjectComponent implements OnInit, OnChanges {

  displayedColumns: string[] = ['position', 'FIO', 'UserLecturePass', 'UserPracticalPass',  'UserLabPass',  'AllPass',
    'UserAvgPracticalMarks', 'UserAvgLabMarks', 'UserAvgTestMarks',  'Rating'];
  headerRow: string[] = ['family-header', 'option-header', 'omissions-header', 'average-mark-header'];

  public categoriesConst: string[]  = ['Средний балл за практические занятия',
    'Средний балл за лабораторные работы',
    'Средняя оценка за тесты',
    'Рейтинговая оценка'];

  public surnames: string [] = [];
  public marksChart: any[] = [];
  public passes: any[] = [];
  public chartColors: string [] = ['#7F00FF' , '#006400'];

  colors: string [] = [ 'orange', 'red', 'blue', 'green'];
  dataSource;
  public chartOptions1: any;
  @Input() data: any;

  constructor(private statisticsService: StatisticService) {}

  ngOnInit() {
    this.dataSource = this.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.passes = [];
    this.surnames = [];
    this.marksChart = [];
    this.dataSource = changes.data.currentValue;
    console.log(this.dataSource);
    this.dataSource.forEach(student => {
      this.surnames.push(this.statisticsService.cutName(student.FIO));
      this.passes.push(student.AllPass);
      this.marksChart.push(+student.Rating);
    });
    this.addPassAndMarksChart(this.marksChart, this.passes, this.surnames);
  }

  addPassAndMarksChart(marks: any, passes: any, surnames: any ) {
    this.chartOptions1 = {
      series: [
        {
          name: 'Пропуски, ч.',
          data: passes
        },
        {
          name: 'Рейтинг',
          data: marks
        }
      ],
      colors: this.chartColors,
      chart: {
        type: 'bar',
        height: 450
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
