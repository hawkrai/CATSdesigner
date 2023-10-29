import { AttachedFile } from './../../models/file/attached-file.model'
import { createAction, props } from '@ngrx/store'
import { HttpResponse } from '@angular/common/http'

export const downloadFile = createAction(
  '[Files] Download Files',
  props<{ pathName: string; fileName: string }>()
)

export const loadAttachments = createAction(
  '[Files] Load Attachments',
  props<{ values: string }>()
)

export const loadAttachmentsSuccess = createAction(
  '[Files] Load Attachments Success',
  props<{ files: AttachedFile[] }>()
)

export const reset = createAction('[Files] Reset Files')

export const uploadFile = createAction(
  '[Files] Upload File',
  props<{ file: File }>()
)

export const addFile = createAction(
  '[Files] Add File',
  props<{ file: File; index: number }>()
)

export const addFileSuccess = createAction(
  '[Files] Add File Success',
  props<{ file: AttachedFile; index: number }>()
)

export const deleteFile = createAction(
  '[Files] Delete File',
  props<{ file: AttachedFile }>()
)

export const deleteFileSuccess = createAction(
  '[Files] Delete File Success',
  props<{ guidFileName: string }>()
)

export const loadSubjectFiles = createAction('[Files] Load Subject Files')

export const exportFile = createAction(
  '[Files] Export File',
  props<{ response: HttpResponse<Blob> | HttpResponse<ArrayBuffer> }>()
)

export const getAttachmentsAsZip = createAction(
  '[Files] Get Attachments As Zip',
  props<{ attachmentsIds: number[] }>()
)

export const downloadAsZipLoadedFiles = createAction(
  '[Files] Download As Zip Loaded Files'
)

export const setIsDownloading = createAction(
  '[Files] Set Is Downloading',
  props<{ isDownloading: boolean }>()
)
