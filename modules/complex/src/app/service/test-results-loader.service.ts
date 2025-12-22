import { Injectable } from '@angular/core'
import { TestService } from './test.service'
import { ConverterService } from './converter.service'
import { ChangeDetectorRef } from '@angular/core'
import { forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { StorageKeys } from '../../../../../container/src/app/core/models/storage-keys.enum'
import { TranslatePipe } from 'educats-translate'

export interface TestNode {
  Name?: string
  TestId?: number
  TestResult?: {
    Points?: number
    StartTime?: string
    EndTime?: string
  }
  Children?: TestNode[]
}

@Injectable({
  providedIn: 'root',
})
export class TestResultsLoaderService {
  constructor(
    private testService: TestService,
    private converterService: ConverterService,
    private translatePipe: TranslatePipe
  ) {}

  loadTestResults(
    nodes: TestNode[],
    studentId: number,
    collectTestNodesFn: (nodes: TestNode[], testNodes: TestNode[]) => void,
    cdr?: ChangeDetectorRef
  ): void {
    if (!studentId) {
      return
    }

    const currentSubject = localStorage.getItem(StorageKeys.CurrentSubject)
    if (!currentSubject) {
      return
    }

    const subject = JSON.parse(currentSubject)
    if (!subject || !subject.id) {
      return
    }

    const testNodes: TestNode[] = []
    collectTestNodesFn(nodes, testNodes)

    if (testNodes.length === 0) {
      return
    }

    const testRequests = testNodes.filter(node => node.TestId).map(node => 
        this.testService.getTestResult(node.TestId, studentId).pipe(map(response => ({ node, response }))))

    if (testRequests.length === 0) {
      return
    }

    forkJoin(testRequests).subscribe(results => {
      let processedCount = 0

      results.forEach(({ node, response }) => {
        if (response) {
          const testInfo = this.extractTestInfo(response)
          
          if (testInfo && testInfo.Points != null) {
            const startTime =
              testInfo.StartTime ||
              testInfo.startTime ||
              testInfo.StartDate ||
              testInfo.startDate
            const endTime =
              testInfo.EndTime ||
              testInfo.endTime ||
              testInfo.EndDate ||
              testInfo.endDate

            node.TestResult = {
              Points: testInfo.Points,
              StartTime: startTime,
              EndTime: endTime,
            }
            processedCount++
          }
        }
      })

      if (cdr) {
        cdr.detectChanges()
      }
    })
  }

  private extractTestInfo(response: any): any {
    if (!response) {
      return null
    }

    if (response.TestInfo) {
      return response.TestInfo
    }

    if (Array.isArray(response)) {
      const testInfoData = response.find(
        (item: any) => item.Key === 'TestInfo' || item.Key === 'TEST_INFO'
      )
      if (testInfoData && testInfoData.Value) {
        return testInfoData.Value
      }
    }

    if (response.Points != null) {
      return response
    }

    return null
  }

  getTestScoreColor(points: number): string {
    return points >= 4 ? 'green' : 'red'
  }

  parseDate(dateString: string): number {
    if (!dateString) {
      return 0
    }
    try {
      const match = dateString.match(/\/Date\((\d+)\)\//)
      if (match && match[1]) {
        return parseInt(match[1], 10)
      }
      const date = new Date(dateString).getTime()
      if (!isNaN(date)) {
        return date
      }
      return 0
    } catch (e) {
      console.error('Error parsing date:', e, dateString)
      return 0
    }
  }

  getTestTimeInSeconds(startTime: string, endTime: string): number {
    if (!startTime || !endTime) {
      return 0
    }
    try {
      const start = this.parseDate(startTime)
      const end = this.parseDate(endTime)
      if (start === 0 || end === 0 || end < start) {
        return 0
      }
      return Math.floor((end - start) / 1000)
    } catch (e) {
      console.error('Error calculating time difference:', e, startTime, endTime)
      return 0
    }
  }

  getTestTooltip(node: TestNode): string {
    if (!node.TestResult || node.TestResult.Points == null) {
      return ''
    }

    const points = node.TestResult.Points
    const timeInSeconds = this.getTestTimeInSeconds(
      node.TestResult.StartTime,
      node.TestResult.EndTime
    )
    
    let timeStr = ''
    if (timeInSeconds > 0) {
      const timeConverted = this.converterService.convertTimeToMinuteAndSeconds(
        timeInSeconds
      )
      if (timeConverted.minutes > 0) {
        timeStr +=
          timeConverted.minutes +
          ' ' +
          this.translatePipe.transform('common.minutes', 'мин') +
          ' '
      }
      if (timeConverted.seconds > 0 || timeConverted.minutes === 0) {
        timeStr +=
          timeConverted.seconds +
          ' ' +
          this.translatePipe.transform('common.seconds', 'сек')
      }
    }

    const pointsText = this.getPointsText(points)
    
    if (timeStr) {
      const tooltipText = this.translatePipe.transform(
        'complex.test.tooltip',
        'Оценка за тест {points} {pointsText}, затраченное время - {time}',
        {
          points: points.toString(),
          pointsText: pointsText,
          time: timeStr.trim(),
        }
      )
      return tooltipText
    } else {
      return `${this.translatePipe.transform('complex.test.score', 'Оценка за тест')} ${points} ${pointsText}`
    }
  }

  getPointsText(points: number): string {
    const lastDigit = points % 10
    const lastTwoDigits = points % 100
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return this.translatePipe.transform('complex.test.points.many', 'баллов')
    } else if (lastDigit === 1) {
      return this.translatePipe.transform('complex.test.points.one', 'балл')
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return this.translatePipe.transform('complex.test.points.few', 'балла')
    } else {
      return this.translatePipe.transform('complex.test.points.many', 'баллов')
    }
  }

  getTestScoreText(points: number): string {
    const pointsText = this.getPointsText(points)
    return `${points} ${pointsText}`
  }
}

