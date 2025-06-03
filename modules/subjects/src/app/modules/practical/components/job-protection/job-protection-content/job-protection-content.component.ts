import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core'
import { Store } from '@ngrx/store'
import { IAppState } from 'src/app/store/state/app.state'
import * as filesActions from '../../../../../store/actions/files.actions'
import { Attachment } from 'src/app/models/file/attachment.model'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { PracticalPositionsService } from 'src/app/services/PracticalPositionsService'

@Component({
  selector: 'app-job-protection-content',
  templateUrl: './job-protection-content.component.html',
  styleUrls: ['./job-protection-content.component.less'],
})
export class JobProtectionContentComponent implements OnChanges {
  @Input() practicalFiles: UserLabFile[] = []
  @Input() actionsTemplate: TemplateRef<any>

  public displayedColumns = [
    'practical',
    'file',
    'filesize',
    'comments',
    'date',
    'action',
  ]
  public receivedPracticals: UserLabFile[] = []

  constructor(
    private store: Store<IAppState>,
    private practicalPositionsService: PracticalPositionsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['practicalFiles']) {
      this.practicalPositionsService.clear()
      if (this.practicalFiles && this.practicalFiles.length) {
        this.filterReceivedPracticals()
        this.storePracticalPositions()
      }
    }
  }

  filterReceivedPracticals(): void {
    this.receivedPracticals = this.practicalFiles.filter((p) => p.IsReceived)
  }

  storePracticalPositions(): void {
    this.practicalPositionsService.practicalPositions = this.receivedPracticals
      .map((p) => p.Order)
      .filter((n) => n !== null)
  }

  downloadFile(attachment: Attachment): void {
    this.store.dispatch(
      filesActions.downloadFile({
        pathName: attachment.PathName,
        fileName: attachment.FileName,
      })
    )
  }
}
