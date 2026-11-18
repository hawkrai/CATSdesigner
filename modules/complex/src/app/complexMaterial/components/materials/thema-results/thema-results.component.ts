import { Component, Input } from '@angular/core'
import { ThemaStudyResult } from '../../../../models/ThemaStudyResult'
import { StudyPercent } from '../../../../models/study-percent.enum'

@Component({
  selector: 'app-thema-results',
  templateUrl: './thema-results.component.html',
  styleUrls: ['./thema-results.component.less'],
})
export class ThemaResultsComponent {
  @Input()
  public themas: ThemaStudyResult[] = []

  @Input()
  public showPercent = true

  public isLearned(thema: ThemaStudyResult): boolean {
    return thema.percent > StudyPercent.LearnedThreshold
  }
}
