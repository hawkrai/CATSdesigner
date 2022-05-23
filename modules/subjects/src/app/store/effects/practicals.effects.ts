import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, withLatestFrom, map, filter } from 'rxjs/operators';

import * as practicalsActions from '../actions/practicals.actions';
import * as groupSelectors from '../selectors/groups.selectors';
import * as subjectSelectors from '../selectors/subject.selector';
import * as groupsSelectors from '../selectors/groups.selectors';
import * as catsActions from '../actions/cats.actions';
import { PracticalRestService } from 'src/app/services/practical/practical-rest.service';
import * as filesActions from '../actions/files.actions';
import * as testsActions from '../actions/tests.actions';
import { IAppState } from '../state/app.state';
import { ScheduleService } from "src/app/services/schedule.service";
import { generateCreateDateException } from "src/app/utils/exceptions";
import { UserFilesService } from "src/app/services/user-files.service";
import { iif, of } from "rxjs";
import { ProtectionType } from "src/app/models/protection-type.enum";
import * as protectionActions from '../actions/protection.actions';

@Injectable()
export class PracticalsEffects {

    constructor(
        private store: Store<IAppState>,
        private actions$: Actions,
        private rest: PracticalRestService,
        private scheduleService: ScheduleService,
        private userFilesService: UserFilesService
    ) { }

    loadPracticals$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadPracticals),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([_, subjectId]) => this.rest.getPracticals(subjectId).pipe(
            map(practicals => practicalsActions.loadPracticalsSuccess({ practicals }))
        ))
    ));

    loadSchedule$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadSchedule),
        withLatestFrom(
            this.store.select(groupSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.getSubjectId)
        ),
        switchMap(([_, groupId, subjectId]) => this.rest.getProtectionSchedule(subjectId, groupId).pipe(
            switchMap(({ practicals, scheduleProtectionPracticals }) => [
                practicalsActions.loadScheduleSuccess({ schedule: scheduleProtectionPracticals }),
                practicalsActions.loadPracticalsSuccess({ practicals })
            ])
        ))
    ));

    updateOrder$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.updateOrder),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ prevIndex, currentIndex }, subjectId]) => this.rest.updatePracticalsOrder(subjectId, prevIndex, currentIndex).pipe(
            map(() => practicalsActions.loadPracticals())
        ))
    ));

    deletePractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deletePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ id }, subjectId]) => this.rest.deletePractical({ id, subjectId }).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.loadPracticals()])
        ))
    ));

    createPractical$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.savePractical),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ practical }, subjectId]) => this.rest.savePractical({ ...practical, subjectId }).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.loadPracticals()])
        ))
    ));

    createDateVisit$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.createDateVisit),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupSelectors.getCurrentGroupId)
        ),
        switchMap(([{ obj }, subjectId, groupId]) => this.scheduleService.createPracticalDateVisit({ ...obj, subjectId, groupId }).pipe(
            switchMap(body => [catsActions.showMessage({ body: { ...body, Message: body.Code === '200' ? body.Message : generateCreateDateException(body) } }), practicalsActions.loadSchedule()])
        ))
    ));

    deleteDateVisit$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deleteDateVisit),
        switchMap(({ id }) => this.scheduleService.deletePracticalDateVisit(id).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.loadSchedule()])
        ))
    ));

    loadPracticalsVisitingMarks$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadMarks),
        withLatestFrom(
            this.store.select(groupSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.getSubjectId)
        ),
        switchMap(([_, groupId, subjectId]) => this.rest.getMarks(subjectId, groupId).pipe(
            switchMap(({ students, testsCount }) => [practicalsActions.loadMarksSuccess({ students }), testsActions.loadedTestsCount({ testsCount })])
        ))
    ));

    setPracticalsVisitingDate$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.setPracticalsVisitingDate),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ visiting }, subjectId]) => this.rest.setPracticalsVisitingDate({ ...visiting, subjectId }).pipe(
            switchMap((body) => [catsActions.showMessage({ body }), practicalsActions.loadMarks()])
        ))
    ));

    setPracticalMark$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.setPracticalMark),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId)),
        switchMap(([{ body }, subjectId]) => this.rest.setPracticalMark({ ...body, subjectId }).pipe(
            switchMap((body) => [catsActions.showMessage({ body }), practicalsActions.loadMarks()])
        ))
    ));

    practicalsVisitingExcel$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.getVisitingExcel),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupSelectors.getCurrentGroupId)
        ),
        switchMap(([_, subjectId, groupId]) => this.rest.getVisitPrcaticalsExcel(subjectId, groupId).pipe(
            map(response => filesActions.exportFile({ response }))
        ))
    ));

    practicalsMarksExcel$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.getMarksExcel),
        withLatestFrom(this.store.select(subjectSelectors.getSubjectId), this.store.select(groupSelectors.getCurrentGroupId)),
        switchMap(([_, subjectId, groupId]) => this.rest.getPracticalsMarksExcel(subjectId, groupId).pipe(
            map(response => filesActions.exportFile({ response }))
        ))
    ));

    loadGroupJobProtection$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadGroupJobProtection),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupsSelectors.getCurrentGroupId)
        ),
        switchMap(([_, subjectId, groupId]) => this.rest.getGroupJobProtection(subjectId, groupId).pipe(
            map(groupJobProtection => practicalsActions.loadGroupJobProtectionSuccess({ groupJobProtection }))
        ))
    ));

    sendUserFile$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.sendUserFile),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
        ),
        switchMap(([{ sendFile, fileId }, subjectId]) => this.userFilesService.sendUserFile({ ...sendFile, subjectId }).pipe(

            switchMap(body => [...(!body.IsReturned ? [catsActions.showMessage({ body })] : []), practicalsActions.sendUserFileSuccess({ userLabFile: body, isReturned: sendFile.isRet, fileId, userId: sendFile.userId })])
        ))
    ));

    deleteUserFile$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.deleteUserFile),
        switchMap(({ userLabFileId, userId }) => this.userFilesService.deleteUserFile(userLabFileId).pipe(
            map(() => practicalsActions.deleteUserFileSuccess({ userId, userLabFileId }))
        ))
    ));

    receiveFile$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.receiveFile),
        switchMap(({ userId, userFileId }) => this.userFilesService.receiveFile(userFileId).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.receiveFileSuccess({ userId, userFileId })])
        ))
    ));

    checkJobProptection$ = createEffect(() => this.actions$.pipe(

        ofType(practicalsActions.receiveFileSuccess, practicalsActions.returnFileSuccess, practicalsActions.cancelFileSuccess, practicalsActions.protectionChangedUpdate, practicalsActions.sendUserFileSuccess),
        withLatestFrom(
            this.store.select(subjectSelectors.getUserId),
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupsSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.isTeacher)
        ),
          switchMap(([{ userId, type }, currentUserId, subjectId, groupId, isTeacher]) => {
            if (type === practicalsActions.sendUserFileSuccess.type) {
                return [protectionActions.protectionChanged({ userId, from: currentUserId, subjectId, groupId, protectionType: ProtectionType.Practical })];
              }
              const actions: any[] = [practicalsActions.checkJobProtections()];
              if (isTeacher) {
                actions.push(practicalsActions.loadStudentJobProtection({ studentId: userId }));
              } else {
                actions.push(practicalsActions.loadStudentFiles({ userId: userId }));
              }
              if (type !== practicalsActions.protectionChangedUpdate.type) {
                actions.push(protectionActions.protectionChanged({ userId, from: currentUserId, subjectId, groupId, protectionType: ProtectionType.Practical }));
              } 
              return actions;
          })
    ));

    returnFile$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.returnFile),
        switchMap(({ userId, userFileId }) => this.userFilesService.returnFile(userFileId).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.returnFileSuccess({ userId, userFileId })])
        ))
    ));


    loadStudentFiles$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadStudentFiles),
        withLatestFrom(
            this.store.select(subjectSelectors.getUserId),
            this.store.select(subjectSelectors.getSubjectId)
        ),
        switchMap(([{ userId }, currentUserId, subjectId]) => this.rest.getUserPracticalFiles(!!userId ? userId : currentUserId, subjectId).pipe(
            map(practicalFiles => practicalsActions.loadStudentFilesSuccess({ practicalFiles, studentId: !!userId ? userId : currentUserId }))
        ))
    ));

    checkJobProtections$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.checkJobProtections),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(subjectSelectors.isTeacher),
            this.store.select(groupsSelectors.isActiveGroup)
        ),
        switchMap(([_, subjectId, isTeacher, isActive]) => iif(() => isTeacher, this.rest.hasJobProtections(subjectId, isActive), of([])).pipe(
            map(hasJobProtections => practicalsActions.setJobProtections({ hasJobProtections }))
        ))));

    getAsZip$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.getAsZip),
        withLatestFrom(
            this.store.select(groupsSelectors.getCurrentGroupId),
            this.store.select(subjectSelectors.getSubjectId)
        ),
        switchMap(([_, groupId, subjectId]) => this.rest.getPracticalsZip(subjectId, groupId).pipe(
            map(response => filesActions.exportFile({ response }))

        ))
    ));

    cancelFile$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.cancelFile),
        switchMap(({ userId, userFileId }) => this.userFilesService.cancelFile(userFileId).pipe(
            switchMap(body => [catsActions.showMessage({ body }), practicalsActions.cancelFileSuccess({ userId, userFileId })])
        ))
    ));

    sendUserFileSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.sendUserFileSuccess),
        filter(({ isReturned }) => isReturned),
        map(({ fileId, userLabFile }) => practicalsActions.returnFile({ userFileId: fileId, userId: userLabFile.UserId }))
    ));

    loadStudentJobProtection$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.loadStudentJobProtection),
        withLatestFrom(
            this.store.select(subjectSelectors.getSubjectId),
            this.store.select(groupsSelectors.getCurrentGroupId)
        ),
        switchMap(([{ studentId }, subjectId, groupId]) => this.rest.getStudentJobProtection(subjectId, groupId, studentId).pipe(
            map(studentJobProtection => practicalsActions.loadStudentJobProtectionSuccess({ studentJobProtection }))
        ))
    ));

    protectionChanged$ = createEffect(() => this.actions$.pipe(
        ofType(practicalsActions.protectionChanged),
        filter(body => body.protectionType === ProtectionType.Practical),
        map(body => practicalsActions.protectionChangedUpdate({ userId: body.userId }))
    ));
}