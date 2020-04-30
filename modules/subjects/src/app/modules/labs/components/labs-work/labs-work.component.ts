import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LabService} from "../../../../services/lab.service";
import {Lab} from "../../../../models/lab.model";
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../../../store/state/app.state';
import {getSubjectId} from '../../../../store/selectors/subject.selector';

@Component({
  selector: 'app-labs-work',
  templateUrl: './labs-work.component.html',
  styleUrls: ['./labs-work.component.less']
})
export class LabsWorkComponent implements OnInit {

  @Input() teacher: boolean;

  public labsWork: Lab[];
  public displayedColumns: string[] = ['position', 'theme', 'shortName', 'clock'];

  private subjectId: string;

  constructor(private labService: LabService,
              private store: Store<IAppState>,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const column = this.teacher ? 'actions' : 'download';
    this.displayedColumns.push(column);

    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.labService.getLabWork(this.subjectId).subscribe(res => {
        this.labsWork = res;
        console.log(res);
      })
    })
  }

}
