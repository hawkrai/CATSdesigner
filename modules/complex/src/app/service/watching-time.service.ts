import { Injectable } from '@angular/core'
import { TranslatePipe } from 'educats-translate'

export interface WatchingTimeNode {
  WatchingTime?: number
  WatchingTimeMinutes?: number
  WatchingTimeSeconds?: number
  Estimated?: number
  EstimatedMinutes?: number
  EstimatedSeconds?: number
}

@Injectable({
  providedIn: 'root',
})
export class WatchingTimeService {
  constructor(private translatePipe: TranslatePipe) {}

  getWatchingTimeText(node: WatchingTimeNode): string {
    if (!node || !node.WatchingTime || node.WatchingTime <= 0) {
      return ''
    }

    const parts: string[] = []

    if (node.WatchingTimeMinutes && node.WatchingTimeMinutes > 0) {
      parts.push(`${node.WatchingTimeMinutes} ${this.translatePipe.transform('common.minutes','мин')}`)
    }

    if ((node.WatchingTimeSeconds && node.WatchingTimeSeconds > 0) || parts.length === 0) {
      parts.push(`${node.WatchingTimeSeconds} ${this.translatePipe.transform('common.seconds','сек')}`)
    }

    return parts.join(' ')
  }

  getExpectedActualTooltip(node: WatchingTimeNode): string {
    if (!node || !node.Estimated || node.Estimated <= 0) {
      return ''
    }

    const expectedParts: string[] = []
    if (node.EstimatedMinutes && node.EstimatedMinutes > 0) {
      expectedParts.push(
        `${node.EstimatedMinutes} ${this.translatePipe.transform('common.minutes','мин')}`
      )
    }
    expectedParts.push(
      `${node.EstimatedSeconds} ${this.translatePipe.transform('common.seconds','сек')}`
    )
    const expectedText = expectedParts.join(' ')

    const actualParts: string[] = []
    if (node.WatchingTimeMinutes && node.WatchingTimeMinutes > 0) {
      actualParts.push(`${node.WatchingTimeMinutes} ${this.translatePipe.transform('common.minutes','мин' )}`)
    }
    actualParts.push(`${node.WatchingTimeSeconds} ${this.translatePipe.transform('common.seconds','сек')}`)
    const actualText = actualParts.join(' ')

    const expectedLabel = this.translatePipe.transform('complex.time.expected','Ожидаемое время')
    const actualLabel = this.translatePipe.transform('complex.time.actual','Фактическое время')

    return `${expectedLabel} - ${expectedText}, ${actualLabel} - ${actualText}`
  }
}
