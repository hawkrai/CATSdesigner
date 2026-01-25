import { NestedTreeControl } from '@angular/cdk/tree'
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core'
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { ComplexService } from '../../../service/complex.service'
import { ConverterService } from '../../../service/converter.service'
import { Router } from '@angular/router'
import { ComplexMonitoring } from 'src/app/models/ComplexMonitoring'
import { ComplexStudentMonitoring } from 'src/app/models/ComplexStudentMonitoring'
import { TranslatePipe } from 'educats-translate'
import { StorageKeys } from '../../../../../../../container/src/app/core/models/storage-keys.enum'
import { TestService } from '../../../service/test.service'
import { TestResultsLoaderService } from '../../../service/test-results-loader.service'
import { WatchingTimeService } from '../../../service/watching-time.service'
import { HiddenTestsService } from '../../../service/hidden-tests.service'

@Component({
  selector: 'app-monitoring-tree',
  templateUrl: './monitoring-tree.component.html',
  styleUrls: ['./monitoring-tree.component.less'],
})
export class MonitoringTreeComponent implements OnInit {
  @Input() complexId: string
  @Input() studentId: string
  @Input() isLecturerOpened: boolean
  studentName: string
  studentGroup: string
  complexName: string
  showLoader: boolean
  treeControl = new NestedTreeControl<ComplexMonitoring>(
    (node) => node.Children
  )
  dataSource = new MatTreeNestedDataSource<ComplexMonitoring>()

  constructor(
    private complexService: ComplexService,
    public converterService: ConverterService,
    private router: Router,
    private translatePipe: TranslatePipe,
    private testService: TestService,
    private testResultsLoaderService: TestResultsLoaderService,
    private watchingTimeService: WatchingTimeService,
    private hiddenTestsService: HiddenTestsService,
    private cdr: ChangeDetectorRef
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false
    }
    this.router.onSameUrlNavigation = 'reload'
  }

  ngOnInit() {
    this.showLoader = true
    this.hiddenTestsService.loadHiddenTests(this.complexId).subscribe(
      () => {
        this.loadComplexMonitoringInfo(true)
      },
      () => {
        this.loadComplexMonitoringInfo(false)
      }
    )
  }

  private loadComplexMonitoringInfo(applyFilter: boolean) {
    this.complexService
      .getStudentComplexMonitoringInfo(this.complexId, this.studentId)
      .subscribe(
        (res: ComplexStudentMonitoring) => {
          this.studentName = res.StudentName
          this.studentGroup = res.StudentGroup
          this.complexName = res.ComplexName

          const data = applyFilter
            ? this.hiddenTestsService.filterHiddenTestsForMonitoring(this.complexId, res.ConceptMonitorings)
            : res.ConceptMonitorings

          this.dataSource.data = data
          this.treeControl.dataNodes = data
          this.showLoader = false
          this.treeControl.expandAll()
          this.loadTestResults(data)
        },
        () => {
          sessionStorage.removeItem(StorageKeys.MonitoringComplexId)
          window.location.reload()
        }
      )
  }

  onClick() {
    sessionStorage.removeItem(StorageKeys.MonitoringComplexId)

    window.location.reload()
  }

  isFolder = (_: number, node) =>
    node.IsGroup || (node.Children && node.Children.length > 0)

  loadTestResults(nodes: ComplexMonitoring[]): void {
    if (!this.studentId) {
      return
    }

    const studentIdNum = parseInt(this.studentId, 10)
    this.testResultsLoaderService.loadTestResults(
      nodes,
      studentIdNum,
      (nodes, testNodes) => this.collectTestNodes(nodes, testNodes),
      this.cdr
    )
  }

  collectTestNodes(nodes: any[], testNodes: any[]): void {
    nodes.forEach((node) => {
      if (node.TestId) {
        testNodes.push(node)
      }
      if (node.children || node.Children) {
        this.collectTestNodes(node.children || node.Children, testNodes)
      }
    })
  }

  getTestScoreColor(points: number): string {
    return this.testResultsLoaderService.getTestScoreColor(points)
  }

  getTestTooltip(node: ComplexMonitoring): string {
    return this.testResultsLoaderService.getTestTooltip(node)
  }

  getTestScoreText(points: number): string {
    return this.testResultsLoaderService.getTestScoreText(points)
  }

  getWatchingTimeText(node: ComplexMonitoring): string {
    return this.watchingTimeService.getWatchingTimeText(node)
  }

  getExpectedActualTooltip(node: ComplexMonitoring): string {
    return this.watchingTimeService.getExpectedActualTooltip(node)
  }
}
