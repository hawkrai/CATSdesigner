import { Injectable } from '@angular/core'
import { Actions, ofType, createEffect } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import {
  map,
  mergeMap,
  withLatestFrom,
  switchMap,
  filter,
} from 'rxjs/operators'

import { IAppState } from '../state/app.state'
import { LabsRestService } from '../../services/labs/labs-rest.service'
import * as groupsSelectors from '../selectors/groups.selectors'
import * as labsActions from '../actions/labs.actions'
import * as subjectSelectors from '../selectors/subject.selector'
import * as filesActions from '../actions/files.actions'
import * as catsActions from '../actions/cats.actions'
import * as testsActions from '../actions/tests.actions'

import * as protectionActions from '../actions/protection.actions'
import { iif, of } from 'rxjs'
import { ScheduleService } from 'src/app/services/schedule.service'
import { generateCreateDateException } from 'src/app/utils/exceptions'
import { UserFilesService } from 'src/app/services/user-files.service'
import { ProtectionType } from 'src/app/models/protection-type.enum'

@Injectable()
export class LabsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private scheduleService: ScheduleService,
    private rest: LabsRestService,
    private userFilesService: UserFilesService
  ) {}

  schedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadLabsSchedule),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest.getProtectionSchedule(subjectId, groupId)
      ),
      mergeMap(({ labs, scheduleProtectionLabs, subGroups }) => [
        labsActions.loadLabsSuccess({ labs }),
        labsActions.loadLabsScheduleSuccess({ scheduleProtectionLabs }),
        labsActions.setLabsSubGroups({ subGroups }),
      ])
    )
  )

  subGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadLabsSubGroups),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest
          .getSubGroups(subjectId, groupId)
          .pipe(map((subGroups) => labsActions.setLabsSubGroups({ subGroups })))
      )
    )
  )

  updateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.updateOrder),
      withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
      switchMap(([{ prevIndex, currentIndex }, subjectId]) =>
        this.rest
          .updateLabsOrder(subjectId, prevIndex, currentIndex)
          .pipe(map(() => labsActions.loadLabs()))
      )
    )
  )

  labs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadLabs),
      switchMap(() => this.store.select(subjectSelectors.getSubjectId)),
      switchMap((subjectId) =>
        this.rest
          .getLabWork(subjectId)
          .pipe(map((labs) => labsActions.loadLabsSuccess({ labs })))
      )
    )
  )

  deleteLab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.deleteLab),
      withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
      switchMap(([{ id }, subjectId]) =>
        this.rest
          .deleteLab({ id, subjectId })
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.loadLabs(),
            ])
          )
      )
    )
  )

  createLab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.saveLab),
      withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
      switchMap(([{ lab }, subjectId]) =>
        this.rest
          .saveLab({ ...lab, subjectId })
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.loadLabs(),
            ])
          )
      )
    )
  )

  createDateVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.createDateVisit),
      withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
      switchMap(([{ obj }, subjectId]) =>
        this.scheduleService
          .createLabDateVisit({ ...obj, subjectId })
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({
                body: {
                  ...body,
                  Message:
                    body.Code === '200'
                      ? body.Message
                      : generateCreateDateException(body),
                },
              }),
              labsActions.loadLabsSchedule(),
            ])
          )
      )
    )
  )

  deleteDateVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.deleteDateVisit),
      switchMap(({ id }) =>
        this.scheduleService
          .deleteLabDateVisit(id)
          .pipe(map(() => labsActions.loadLabsSchedule()))
      )
    )
  )

  setLabsVisitingDate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.setLabsVisitingDate),
      switchMap(({ visiting }) =>
        this.rest
          .setLabsVisitingDate(visiting)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.loadLabStudents(),
            ])
          )
      )
    )
  )

  loadLabStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadLabStudents),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest
          .getMarksV2(subjectId, groupId)
          .pipe(
            switchMap(({ students, testsCount }) => [
              labsActions.setLabStudents({ students }),
              testsActions.loadedTestsCount({ testsCount }),
            ])
          )
      )
    )
  )

  setLabMark$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.setLabMark),
      switchMap(({ labMark }) =>
        this.rest
          .setLabsMark(labMark)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.loadLabStudents(),
            ])
          )
      )
    )
  )

  removeLabMark$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.removeLabMark),
      switchMap(({ id }) =>
        this.rest
          .removeLabsMark(id)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.loadLabStudents(),
            ])
          )
      )
    )
  )

  labsVisitingExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.getVisitingExcel),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest
          .getVisitLabsExcel(subjectId, groupId)
          .pipe(map((response) => filesActions.exportFile({ response })))
      )
    )
  )

  labsMarksExcel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.getMarksExcel),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest
          .getLabsMarksExcel(subjectId, groupId)
          .pipe(map((response) => filesActions.exportFile({ response })))
      )
    )
  )

  sendUserFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.sendUserFile),
      withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
      switchMap(([{ sendFile, fileId }, subjectId]) =>
        this.userFilesService
          .sendUserFile({ ...sendFile, subjectId })
          .pipe(
            switchMap((body) => [
              ...(!body.IsReturned ? [catsActions.showMessage({ body })] : []),
              labsActions.sendUserFileSuccess({
                userLabFile: body,
                isReturned: sendFile.isRet,
                fileId,
                userId: sendFile.userId,
              }),
            ])
          )
      )
    )
  )

  sendUserLabFileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.sendUserFileSuccess),
      filter(({ isReturned }) => isReturned),
      map(({ fileId, userLabFile }) =>
        labsActions.returnLabFile({
          userFileId: fileId,
          userId: userLabFile.UserId,
        })
      )
    )
  )

  deleteUserLabFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.deleteUserLabFile),
      switchMap(({ userLabFileId, userId }) =>
        this.userFilesService
          .deleteUserFile(userLabFileId)
          .pipe(
            map(() =>
              labsActions.deleteUserLabFileSuccess({ userId, userLabFileId })
            )
          )
      )
    )
  )

  getLabsAsZip$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.getLabsAsZip),
      withLatestFrom(
        this.store.select(groupsSelectors.getCurrentGroupId),
        this.store.select(subjectSelectors.getSubjectId)
      ),
      switchMap(([_, groupId, subjectId]) =>
        this.rest
          .getLabsZip(subjectId, groupId)
          .pipe(map((response) => filesActions.exportFile({ response })))
      )
    )
  )

  checkJobProtections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.checkJobProtections),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(subjectSelectors.isTeacher),
        this.store.select(groupsSelectors.isActiveGroup)
      ),
      switchMap(([_, subjectId, isTeacher, isActive]) =>
        iif(
          () => isTeacher,
          this.rest.hasJobProtections(subjectId, isActive),
          of([])
        ).pipe(
          map((hasJobProtections) =>
            labsActions.setJobProtections({ hasJobProtections })
          )
        )
      )
    )
  )

  loadStudentLabFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadStudentLabFiles),
      withLatestFrom(
        this.store.select(subjectSelectors.getUserId),
        this.store.select(subjectSelectors.getSubjectId)
      ),
      switchMap(([{ userId }, currentUserId, subjectId]) =>
        this.rest
          .getUserLabFiles(!!userId ? userId : currentUserId, subjectId)
          .pipe(
            map((labFiles) =>
              labsActions.loadStudentLabFilesSuccess({
                labFiles,
                studentId: !!userId ? userId : currentUserId,
              })
            )
          )
      )
    )
  )

  loadGroupJobProtection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadGroupJobProtection),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([_, subjectId, groupId]) =>
        this.rest
          .getGroupJobProtection(subjectId, groupId)
          .pipe(
            map((groupJobProtection) =>
              labsActions.loadGroupJobProtectionSuccess({ groupJobProtection })
            )
          )
      )
    )
  )

  receiveLabFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.receiveLabFile),
      switchMap(({ userId, userFileId }) =>
        this.userFilesService
          .receiveFile(userFileId)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.receiveLabFileSuccess({ userId, userFileId }),
            ])
          )
      )
    )
  )

  returnLabFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.returnLabFile),
      switchMap(({ userId, userFileId }) =>
        this.userFilesService
          .returnFile(userFileId)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.returnLabFileSuccess({ userId, userFileId }),
            ])
          )
      )
    )
  )

  cancelLabFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.cancelLabFile),
      switchMap(({ userId, userFileId }) =>
        this.userFilesService
          .cancelFile(userFileId)
          .pipe(
            switchMap((body) => [
              catsActions.showMessage({ body }),
              labsActions.cancelLabFileSuccess({ userId, userFileId }),
            ])
          )
      )
    )
  )

  checkJobProptection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        labsActions.receiveLabFileSuccess,
        labsActions.returnLabFileSuccess,
        labsActions.cancelLabFileSuccess,
        labsActions.protectionChangedUpdate,
        labsActions.sendUserFileSuccess
      ),
      withLatestFrom(
        this.store.select(subjectSelectors.getUserId),
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId),
        this.store.select(subjectSelectors.isTeacher)
      ),
      switchMap(
        ([{ userId, type }, currentUserId, subjectId, groupId, isTeacher]) => {
          if (type === labsActions.sendUserFileSuccess.type) {
            return [
              protectionActions.protectionChanged({
                userId,
                from: currentUserId,
                subjectId,
                groupId,
                protectionType: ProtectionType.Lab,
              }),
            ]
          }
          const actions: any[] = [labsActions.checkJobProtections()]
          if (isTeacher) {
            actions.push(
              labsActions.loadStudentJobProtection({ studentId: userId })
            )
          } else {
            actions.push(labsActions.loadStudentLabFiles({ userId: userId }))
          }
          if (type !== labsActions.protectionChangedUpdate.type) {
            actions.push(
              protectionActions.protectionChanged({
                userId,
                from: currentUserId,
                subjectId,
                groupId,
                protectionType: ProtectionType.Lab,
              })
            )
          }
          return actions
        }
      )
    )
  )

  loadStudentJobProtection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.loadStudentJobProtection),
      withLatestFrom(
        this.store.select(subjectSelectors.getSubjectId),
        this.store.select(groupsSelectors.getCurrentGroupId)
      ),
      switchMap(([{ studentId }, subjectId, groupId]) =>
        this.rest
          .getStudentJobProtection(subjectId, groupId, studentId)
          .pipe(
            map((studentJobProtection) =>
              labsActions.loadStudentJobProtectionSuccess({
                studentJobProtection,
              })
            )
          )
      )
    )
  )

  protectionChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(labsActions.protectionChanged),
      filter((body) => body.protectionType === ProtectionType.Lab),
      map((body) =>
        labsActions.protectionChangedUpdate({ userId: body.userId })
      )
    )
  )
}
