export enum KnownMessage {
    FileUploadSuccess = 'Файл(ы) успешно отправлен(ы)',
    PlagiarismCheckSuccess = 'Проверка прошла успешна',
    NoAcceptedWorks = 'Отсутствуют принятые работы для проверки на плагиат',
    GeneralError = 'Произошла ошибка',
    WorkDeletionSuccess = 'Работа удалена',
    WorkDeletionError = 'Произошла ошибка при удалении работы',
    FileArchiveSuccess = 'Файл(ы) перемещен(ы) в архив',
    FileArchiveError = 'Произошла ошибка переноса файла в архив',
    FileRevisionSuccess = 'Файл отправлен на доработку',
    FileRevisionError = 'Не удалось отправить файл на доработку',
    FileUnarchiveSuccess = 'Файл(ы) перемещен(ы) из архива'
  }
  
  export const translationKeyMapping: { [key in KnownMessage]: string } = {
    [KnownMessage.FileUploadSuccess]: 'fileUpload.success',
    [KnownMessage.PlagiarismCheckSuccess]: 'plagiarismCheck.success',
    [KnownMessage.NoAcceptedWorks]: 'plagiarismCheck.noAcceptedWorks',
    [KnownMessage.GeneralError]: 'general.error',
    [KnownMessage.WorkDeletionSuccess]: 'workDeletion.success',
    [KnownMessage.WorkDeletionError]: 'workDeletion.error',
    [KnownMessage.FileArchiveSuccess]: 'fileArchive.success',
    [KnownMessage.FileArchiveError]: 'fileArchive.error',
    [KnownMessage.FileRevisionSuccess]: 'fileRevision.success',
    [KnownMessage.FileRevisionError]: 'fileRevision.error',
    [KnownMessage.FileUnarchiveSuccess]: 'fileUnarchive.success',
  };
  