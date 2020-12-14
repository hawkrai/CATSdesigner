import {Injectable} from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

import {IAppState} from '../state/app.state';
import {LabsRestService} from '../../services/labs/labs-rest.service';
import * as groupsSelectors  from '../selectors/groups.selectors';
import * as labsActions from '../actions/labs.actions';
import * as labsSelectors from '../selectors/labs.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import * as filesActions from '../actions/files.actions';

@Injectable()
export class LabsEffects {

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private rest: LabsRestService) {
  }

  schedule$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabsSchedule),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId),this.store.select(groupsSelectors.getCurrentGroupId)),
    switchMap(([_, subjectId, groupId]) => this.rest.getProtectionSchedule(subjectId, groupId)),
    mergeMap(({ labs, scheduleProtectionLabs }) => [labsActions.loadLabsSuccess({ labs }), labsActions.laodLabsScheduleSuccess({ scheduleProtectionLabs })])
    )
  );

  updateOrder$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.updateOrder),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(labsSelectors.getLabs)),
    switchMap(([{ prevIndex, currentIndex }, subjectId, labs]) => 
    this.rest.updateLabsOrder(subjectId, [{ Id: labs[prevIndex].LabId, Order: currentIndex + 1 }, { Id: labs[currentIndex].LabId, Order: prevIndex + 1 }]).pipe(
      map(() => labsActions.updateOrderSuccess({ prevIndex, currentIndex }))
    ))
  ));

  labs$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabs),
    switchMap(() => this.store.select(subjectSelectors.getSubjectId)),
    switchMap(subjectId => this.rest.getLabWork(subjectId).pipe(
      map(labs => labsActions.loadLabsSuccess({ labs }))
    ))
  ));

  deleteLab$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.deleteLab),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ id }, subjectId]) => this.rest.deleteLab({ id, subjectId }).pipe(
      map(() => labsActions.loadLabs())
    ))
  ));

  createLab$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.saveLab),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
    switchMap(([{ lab }, subjectId]) => (lab.subjectId = subjectId, this.rest.saveLab(lab)).pipe(
      map(() => labsActions.loadLabs())
    ))
  ));

  createDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.createDateVisit),
    switchMap(({ date, subGroupId }) => this.rest.createDateVisit(subGroupId, date).pipe(
      map(() => labsActions.loadLabsSchedule())
    ))
  ));

  deleteDateVisit$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.deleteDateVisit),
    switchMap(({ id }) => this.rest.deleteDateVisit(id).pipe(
      map(() => labsActions.loadLabsSchedule())
    ))
  ));

  loadLabStudent$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadLabStudents),
    withLatestFrom(
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(groupsSelectors.getCurrentGroupId)
    ),
    switchMap(([_, subjectId, groupId]) => this.rest.getMarksV2(subjectId, groupId).pipe(
      map(students => labsActions.setLabStudents({ students }))
    ))
  ));

  setLabMark$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.setLabMark),
    switchMap(({ labMark }) => this.rest.setLabsMark(labMark).pipe(
      map(() => labsActions.loadLabStudents())
    ))
  ));

  loadStudentsLabsFiles$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadStudentsLabsFiles),
    withLatestFrom(
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(groupsSelectors.getCurrentGroupId)
    ),
    switchMap(([_, subjectId, groupId]) => this.rest.getAllStudentFilesLab(subjectId, groupId).pipe(
      map(studentsLabsFiles => labsActions.loadStudentsLabsFilesSuccess({ studentsLabsFiles }))
    ))
  ));

  loadUserLabsFiles$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.loadUserLabsFiles),
    withLatestFrom(
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(subjectSelectors.getUserId)
    ),
    switchMap(([_, subjectId, userId]) => this.rest.getFilesLab(subjectId, +userId).pipe(
      map(userLabsFiles => labsActions.loadUserLabsFilesSuccess({ userLabsFiles }))
    ))
  ));

  labsVisitingExcel$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.getVisitingExcel),
    withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId), 
        this.store.select(groupsSelectors.getCurrentGroupId), 
        this.store.select(groupsSelectors.getCurrentGroupSubGroupIds)),
    switchMap(([_, subjectId, groupId, [subGroupOneId, subGroupTwoId]]) => this.rest.getVisitLabsExcel(subjectId, groupId, subGroupOneId, subGroupTwoId).pipe(
        map(response => filesActions.getExcelData({ response }))
    ))
  ));

  labsMarksExcel$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.getMarksExcel),
    withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(groupsSelectors.getCurrentGroupId)),
    switchMap(([_, subjectId, groupId]) => this.rest.getLabsMarksExcel(subjectId, groupId).pipe(
      map(response => filesActions.getExcelData({ response }))
    ))
  ));

  sendUserFile$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.sendUserFile),
    withLatestFrom(
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(subjectSelectors.isTeacher)
    ),
    switchMap(([{ sendFile }, subjectId, isTeacher]) => this.rest.sendUserFile({ ...sendFile, subjectId }).pipe(
      map(() => isTeacher ? labsActions.updateUserLabsFiles({ subjectId, userId: sendFile.userId }) : labsActions.loadUserLabsFiles())
    ))
  ));

  updateUserLabsFiles$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.updateUserLabsFiles),
    switchMap(({ subjectId, userId}) => this.rest.getFilesLab(subjectId, userId).pipe(
      map((userLabsFiles) => labsActions.updateUserLabsFilesSuccess({ userLabsFiles, userId }))
    ))
  ))

  receiveLabFile$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.receiveLabFile),
    switchMap(({ userFileId }) => this.rest.receiveLabFile(userFileId).pipe(
      map(() => labsActions.loadStudentsLabsFiles())
    ))
  ));

  cancelLabFile$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.cancelLabFile),
    switchMap(({ userFileId }) => this.rest.cancelLabFile(userFileId).pipe(
      map(() => labsActions.loadStudentsLabsFiles())
    ))
  ));

  deleteUserFile$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.deleteUserFile),
    switchMap(({ userFileId }) => this.rest.deleteUserFile(userFileId).pipe(
      map(() => labsActions.loadUserLabsFiles())
    ))
  ));

  refreshJobProtection$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.refreshJobProtection),
    withLatestFrom(this.store.select(subjectSelectors.isTeacher)),
    map(isTeacher => isTeacher ? labsActions.loadStudentsLabsFiles() : labsActions.loadUserLabsFiles())
  ));

  getLabsAsZip$ = createEffect(() => this.actions$.pipe(
    ofType(labsActions.getLabsAsZip),
    withLatestFrom(
      this.store.select(groupsSelectors.getCurrentGroupId),
      this.store.select(subjectSelectors.getSubjectId)
    ),
    switchMap(([_, groupId, subjectId]) => this.rest.getLabsZip(subjectId, groupId).pipe(
      map(response => filesActions.getZipData({ response }))
    ))
  ));
}
