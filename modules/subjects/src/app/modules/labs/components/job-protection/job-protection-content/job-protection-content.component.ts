import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core'
import { Store } from '@ngrx/store'
import * as filesActions from '../../../../../store/actions/files.actions'
import { UserLabFile } from 'src/app/models/user-lab-file.model'
import { Attachment } from 'src/app/models/file/attachment.model'
import { IAppState } from 'src/app/store/state/app.state'
import { LabPositionsService } from 'src/app/services/lab-positions.service'

@Component({
  selector: 'app-job-protection-content',
  templateUrl: './job-protection-content.component.html',
  styleUrls: ['./job-protection-content.component.less'],
})
export class JobProtectionContentComponent implements OnChanges {
  @Input() labFiles: UserLabFile[] = []
  @Input() actionsTemplate: TemplateRef<any>

  public displayedColumns = [
    'lab',
    'file',
    'filesize',
    'comments',
    'date',
    'action',
  ]
  public receivedLabs: UserLabFile[] = []

  constructor(
    private store: Store<IAppState>,
    private labPositionsService: LabPositionsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labFiles'] && this.labFiles && this.labFiles.length) {
      this.labPositionsService.clear()
      this.filterReceivedLabs()
      this.storeLabPositions()
    }
  }

  filterReceivedLabs(): void {
    this.receivedLabs = this.labFiles.filter((lab) => lab.IsReceived)
  }

  storeLabPositions(): void {
    this.labPositionsService.labPositions = this.receivedLabs
      .map((lab) => lab.Order)
      .filter((labNumber) => labNumber !== null)
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
