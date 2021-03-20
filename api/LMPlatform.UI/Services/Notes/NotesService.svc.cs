using Application.Core;
using Application.Core.Helpers;
using Application.Infrastructure.NoteManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules;
using LMPlatform.UI.Services.Modules.Notes;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace LMPlatform.UI.Services.Notes
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "NotesService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select NotesService.svc or NotesService.svc.cs at the Solution Explorer and start debugging.
    [JwtAuth]
    public class NotesService : INotesService
    {
        private readonly LazyDependency<INoteManagementService> noteManagementService = new LazyDependency<INoteManagementService>();
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public INoteManagementService NoteManagementService => noteManagementService.Value;
        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;


        public ResultViewData SaveNote(int id, string text, int subjectId, int? lecturesScheduleId, int? labsScheduleId, int? practicalScheduleId)
        {
            try
            {
                var isUserAssigned = SubjectManagementService.IsUserAssignedToSubject(UserContext.CurrentUserId, subjectId);
                if (!isUserAssigned)
                {
                    return new ResultViewData
                    {
                        Code = "500",
                        Message = "Пользователь не присоединён к предмету"
                    };
                }
                NoteManagementService.SaveNote(new Note
                {
                    Id = id,
                    Text = text,
                    LecturesScheduleId = lecturesScheduleId,
                    LabsScheduleId = labsScheduleId,
                    PracticalScheduleId = practicalScheduleId,
                    UserId = UserContext.CurrentUserId
            });
                return new ResultViewData
                {
                    Code = "200",
                    Message = "Заметка успешно сохранена"
                };
            }
            catch (Exception ex)
            {
                return new ResultViewData
                {
                    Message = "Не удалось сохранить заметку",
                    Code = "500"
                };
            }
        }

        public ResultViewData DeleteNote(int id)
        {
            try
            {
                NoteManagementService.DeleteNote(id);
                return new ResultViewData
                {
                    Code = "200",
                    Message = "Заметка успешно удалена"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Не удалось удалить заметку",
                    Code = "500"
                };
            }
        }

        public NoteViewResult GetUserNotes()
        {
            return new NoteViewResult
            {
                Notes = NoteManagementService.GetUserNotes(UserContext.CurrentUserId).Select(x => new NoteViewData(x))
            };
        }

        public ResultViewData DeletePersonalNote(int id)
        {
            try
            {
                NoteManagementService.DeletePersonalNote(id);
                return new ResultViewData
                {
                    Code = "200",
                    Message = "Заметка успешно удалена"
                };
            }
            catch
            {
                return new ResultViewData
                {
                    Message = "Не удалось удалить заметку",
                    Code = "500"
                };
            }
        }


        public UserNoteViewResult GetPersonalNotes()
        {
            return new UserNoteViewResult
            {
                Notes = NoteManagementService.GetPersonalNotes(UserContext.CurrentUserId).Select(x => new UserNoteViewData(x))
            };
        }


        public ResultViewData SavePersonalNote(int id, string text, string date, string startTime, string endTime)
        {
            try
            {
                var dateTime = DateTime.ParseExact(date, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                var start = DateTime.ParseExact(startTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                var end = DateTime.ParseExact(endTime, "HH:mm", CultureInfo.InvariantCulture).TimeOfDay;
                NoteManagementService.SavePersonalNote(new UserNote
                {
                    Id = id,
                    Text = text,
                    UserId = UserContext.CurrentUserId,
                    Date = dateTime,
                    EndTime = end,
                    StartTime = start
                });
                return new ResultViewData
                {
                    Code = "200",
                    Message = "Заметка успешно сохранена"
                };
            }
            catch (Exception ex)
            {
                return new ResultViewData
                {
                    Message = "Не удалось сохранить заметку",
                    Code = "500"
                };
            }
        }
    }
}
