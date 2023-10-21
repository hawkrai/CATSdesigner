import { createReducer, on } from '@ngrx/store'
import * as userFilesUtils from '../../utils/user-files.utils'
import {
  initialPracticalsState,
  IPracticalsState,
} from '../state/practicals.state'
import * as practicalsActions from '../actions/practicals.actions'
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode'
import { UserLabFile } from 'src/app/models/user-lab-file.model'

export const practicalsReducer = createReducer(
  initialPracticalsState,
  on(
    practicalsActions.loadPracticalsSuccess,
    (state, { practicals }): IPracticalsState => ({
      ...state,
      practicals,
    })
  ),
  on(
    practicalsActions.resetPracticals,
    (state): IPracticalsState => ({
      ...state,
      practicals: [],
      schedule: [],
      students: [],
    })
  ),
  on(
    practicalsActions.loadScheduleSuccess,
    (state, { schedule }): IPracticalsState => ({
      ...state,
      schedule,
    })
  ),
  on(
    practicalsActions.loadMarksSuccess,
    (state, { students }): IPracticalsState => ({
      ...state,
      students,
    })
  ),
  on(
    practicalsActions.loadGroupJobProtectionSuccess,
    (state, { groupJobProtection }): IPracticalsState => ({
      ...state,
      groupJobProtection,
    })
  ),
  on(
    practicalsActions.loadStudentJobProtectionSuccess,
    (state, { studentJobProtection }): IPracticalsState => ({
      ...state,
      groupJobProtection: {
        ...state.groupJobProtection,
        StudentsJobProtections:
          state.groupJobProtection.StudentsJobProtections.map((x) =>
            x.StudentId === studentJobProtection.StudentId
              ? studentJobProtection
              : x
          ),
      },
    })
  ),
  on(
    practicalsActions.setJobProtections,
    (state, { hasJobProtections }): IPracticalsState => ({
      ...state,
      hasJobProtections,
    })
  ),
  on(
    practicalsActions.loadStudentFilesSuccess,
    (state, { practicalFiles, studentId }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [studentId]: practicalFiles,
      },
    })
  ),
  on(
    practicalsActions.receiveFileSuccess,
    (state, { userId, userFileId }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [userId]: (state.studentsPracticalsFiles[userId] || []).map(
          (ulf): UserLabFile =>
            ulf.Id === userFileId ? { ...ulf, IsReceived: true } : ulf
        ),
      },
    })
  ),
  on(
    practicalsActions.cancelFileSuccess,
    (state, { userId, userFileId }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [userId]: (state.studentsPracticalsFiles[userId] || []).map(
          (ulf): UserLabFile =>
            ulf.Id === userFileId
              ? { ...ulf, IsReceived: false, IsReturned: false }
              : ulf
        ),
      },
    })
  ),
  on(
    practicalsActions.returnFileSuccess,
    (state, { userId, userFileId }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [userId]: (state.studentsPracticalsFiles[userId] || []).map(
          (ulf): UserLabFile =>
            ulf.Id === userFileId ? { ...ulf, IsReturned: true } : ulf
        ),
      },
    })
  ),
  on(
    practicalsActions.sendUserFileSuccess,
    (state, { userLabFile }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [userLabFile.UserId]: userFilesUtils.sendUserFileSuccess(
          state.studentsPracticalsFiles[userLabFile.UserId] || [],
          userLabFile
        ),
      },
    })
  ),
  on(
    practicalsActions.deleteUserFileSuccess,
    (state, { userId, userLabFileId }): IPracticalsState => ({
      ...state,
      studentsPracticalsFiles: {
        ...state.studentsPracticalsFiles,
        [userId]: (state.studentsPracticalsFiles[userId] || []).filter(
          (x) => x.Id !== userLabFileId
        ),
      },
    })
  )
)
