import { CreateLessonEntity } from './../../models/form/create-lesson-entity.model';
import { createAction, props } from '@ngrx/store';

import { Practical } from '../../models/practical.model';
import { ScheduleProtectionPractical } from 'src/app/models/schedule-protection/schedule-protection-practical.model';
import { StudentMark } from 'src/app/models/student-mark.model';
import { GroupJobProtection } from 'src/app/models/job-protection/group-job-protection.model';
import { UserLabFile } from 'src/app/models/user-lab-file.model';
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model';
import { StudentJobProtection } from 'src/app/models/job-protection/student-job-protection.mode';
import { Protection } from 'src/app/models/protection.model';

export const loadPracticals = createAction(
    '[Practicals] Load Practicals'
);

export const loadPracticalsSuccess = createAction(
    '[Practicals] Load Practicals Success',
    props<{ practicals: Practical[] }>()
);

export const loadSchedule = createAction(
    '[Practicals] Load Practicals Schedule',
);

export const loadScheduleSuccess = createAction(
    '[Practicals] Load Practivals Schedule Success',
    props<{ schedule: ScheduleProtectionPractical[] }>()
);

export const loadMarks = createAction(
    '[Practicals] Load Marks'
);

export const loadMarksSuccess = createAction(
    '[Practicals] Load Marks Success',
    props<{ students: StudentMark[] }>()
);

export const deletePractical = createAction(
    '[Practicals] Delete Practical',
    props<{ id: number }>()
);

export const savePractical = createAction(
    '[Practicals] Save Practical',
    props<{ practical: CreateLessonEntity }>()
);

export const resetPracticals = createAction(
    '[Practicals] Reset Practicals'
);

export const updateOrder = createAction(
    '[Practicals] Update Order',
    props<{ prevIndex: number, currentIndex: number }>()
);

export const createDateVisit = createAction(
    '[Practicals] Create Date Visit',
    props<{ obj: { date: string, startTime: string, endTime: string, building: string, audience: string, lecturerId: number } }>()
  );
  
export const deleteDateVisit = createAction(
    '[Practicals] Delete Date Visit',
    props<{ id: number }>()
);

export const setPracticalsVisitingDate = createAction(
    '[Practicals] Set Practicals Visiting Date',
    props<{ visiting: { Id: number[], comments: string[], showForStudents: boolean[], dateId: number, marks: string[], students: StudentMark[] } }>()
);

export const setPracticalMark = createAction(
    '[Practicals] Set Practical Mark',
    props<{ body: { studentId: number, practicalId: number, mark: string, comment: string, date: string, id: number, showForStudent: boolean } }>()
);

export const getMarksExcel = createAction(
    '[Practicals] Get Marks Excel'
  );
  
  export const getVisitingExcel = createAction(
    '[Practicals] Get Visiting Excel'
  );

  export const loadGroupJobProtection = createAction(
    '[Practicals] Load Group Job Protection'
  );
  
  export const loadGroupJobProtectionSuccess = createAction(
    '[Practicals] Load Group Job Protection Success',
    props<{ groupJobProtection: GroupJobProtection }>()
  );

  export const sendUserFile = createAction(
    '[Practicals] Send User File',
    props<{ sendFile: { attachments: string, id: number, pathFile: string, comments: string, userId: number, practicalId: number, isRet: boolean }, fileId: number }>()
  );
  
  export const sendUserFileSuccess = createAction(
    '[Practicals] Send User File Success',
    props<{ userLabFile: UserLabFile, isReturned: boolean, fileId?: number, userId: number }>()
  );

  export const returnFile = createAction(
    '[Practicals] Return Files',
    props<{ userId: number, userFileId: number }>()
  );

  export const returnFileSuccess = createAction(
    '[Practicals] Return Files Success',
    props<{ userId: number, userFileId: number }>()
  );

  export const deleteUserFile = createAction(
    '[Practicals] Delete User File',
    props<{ userLabFileId: number, userId: number }>()
  );
  
  export const deleteUserFileSuccess = createAction(
    '[Practicals] Delete User File Success',
    props<{ userId: number, userLabFileId: number }>()
  );

  export const receiveFile = createAction(
    '[Practicals] Receive Files',
    props<{ userId: number, userFileId: number }>()
  );

  export const receiveFileSuccess = createAction(
    '[Practicals] Receive Files Success',
    props<{ userId: number, userFileId: number }>()
  );

  export const cancelFile = createAction(
    '[Practicals] Cancel File',
    props<{ userId: number, userFileId: number }>()
  );

  export const cancelFileSuccess = createAction(
    '[Practicals] Cancel File Success',
    props<{ userId: number, userFileId: number }>()
  );

  export const loadStudentFiles = createAction(
    '[Practicals] Get Student Files',
    props<{ userId?: number }>()
  );
  
  export const loadStudentFilesSuccess = createAction(
    '[Practicals] Get Student Files Success',
    props<{ practicalFiles: UserLabFile[], studentId: number }>()
  );

  export const resetStudentJobProtection = createAction(
    '[Practicals] Reset Student Job Protection',
    props<{ studentId: number }>()
  );

  export const checkJobProtections = createAction(
    '[Practicals] Check Job Protection'
  );

  export const setJobProtections = createAction(
    '[Practicals] Set Job Protections',
    props<{ hasJobProtections: HasJobProtection[] }>()
  );

  export const getAsZip = createAction(
    '[Practicals] Get As Zip'
  );

  export const loadStudentJobProtection = createAction(
    '[Practicals] Load Student Job Protection',
    props<{ studentId: number }>()
  
  );
  
  export const loadStudentJobProtectionSuccess = createAction(
    '[Practicals] Load Student Job Protection Success',
    props<{ studentJobProtection: StudentJobProtection }>()
  );

  export const protectionChanged = createAction(
    '[Practicals] Protection Changed',
    props<Protection>()
  );

  export const protectionChangedUpdate = createAction(
    '[Practicals] Protection Changed Update',
    props<{ userId: number }>()
  );