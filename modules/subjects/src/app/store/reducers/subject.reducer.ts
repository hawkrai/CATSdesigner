import { createReducer, on } from '@ngrx/store'
import { initialSubjectState, ISubjectState } from '../state/subject.state'
import * as subjectActions from '../actions/subject.actions'
import { Subject } from 'src/app/models/subject.model'

export const subjectReducer = createReducer(
  initialSubjectState,
  on(
    subjectActions.setSubject,
    (state, action): ISubjectState => ({
      ...state,
      selectedSubject: action.subject,
    })
  ),
  on(
    subjectActions.setUser,
    (state, { user }): ISubjectState => ({
      ...state,
      user,
    })
  ),
  on(
    subjectActions.loadSubjectsSuccess,
    (state, { subjects }): ISubjectState => ({
      ...state,
      subjects,
    })
  ),
  on(
    subjectActions.resetSubjects,
    (state): ISubjectState => ({
      ...state,
      subjects: [],
    })
  ),
  on(
    subjectActions.loadSubjectSuccess,
    (state, { subject }): ISubjectState => ({
      ...state,
      subjects: onSubjectLodded(state.subjects, subject),
    })
  )
)

const onSubjectLodded = (subjects: Subject[], subject: Subject) => {
  if (!subject) {
    return subjects
  }
  const subjectIndex = subjects.findIndex(
    (x) => x.SubjectId == subject.SubjectId
  )
  if (subjectIndex >= 0) {
    return subjects
      .slice(0, subjectIndex)
      .concat(subject, subjects.slice(subjectIndex + 1))
  }

  return [...subjects, subject]
}
