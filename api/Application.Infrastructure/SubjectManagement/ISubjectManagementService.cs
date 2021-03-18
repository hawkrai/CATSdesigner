using System.Collections.Generic;
using Application.Core.Data;
using LMPlatform.Models;

namespace Application.Infrastructure.SubjectManagement
{
    using System;
    using Models;

    public interface ISubjectManagementService
    {
        List<Subject> GetUserSubjects(int userId);

        bool IsUserAssignedToSubject(int useId, int subjectId);

        List<Subject> GetUserSubjectsV2(int userId);

        List<Subject> GetGroupSubjects(int groupId);

        List<Subject> GetGroupSubjectsLite(int groupId);

        Subject GetSubject(int id);

        IPageableList<Subject> GetSubjectsLecturer(int lecturerId, string searchString = null, IPageInfo pageInfo = null, IEnumerable<ISortCriteria> sortCriterias = null);

        Subject SaveSubject(Subject subject);

        SubjectNews SaveNews(SubjectNews news, IList<Attachment> attachments);

        void DeleteNews(int id, int subjectId);

        void DeleteLection(Lectures lectures);

        void DeleteLectionVisitingDate(int id);

        void DeleteLabsVisitingDate(int id);

        void DeleteLabs(int id);

        void DeleteNonReceivedUserFiles(int groupId, int subjId);

        bool IsWorkingSubject(int userId, int subjectId);

        SubjectNews GetNews(int id, int subjectId);

	    IList<SubGroup> GetSubGroups(int subjectId, int groupId);

		void SaveSubGroup(int subjectId, int groupId, IList<int> firstInts, IList<int> secoInts, IList<int> thirdInts);

        Lectures GetLectures(int id);

        Lectures SaveLectures(Lectures lectures, IList<Attachment> attachments, int userId);

        Lectures UpdateLectureOrder(Lectures lectures, int order);

        Labs UpdateLabOrder(Labs labs, int order);

        IList<Labs> GetSubjectLabs(int subjectId);
        IList<Lectures> GetSubjectLectures(int subjectId);

        Labs SaveLabs(Labs labs, IList<Attachment> attachments, int userId);

		UserLabFiles SaveUserLabFiles(UserLabFiles userLabFiles, IList<Attachment> attachments);

        Labs GetLabs(int id);

        void SaveDateLectures(int subjectId, DateTime date);

        List<LecturesScheduleVisiting> GetScheduleVisitings(Query<LecturesScheduleVisiting> query);

        void SaveMarksCalendarData(List<LecturesVisitMark> lecturesVisitMarks);

        void SaveScheduleProtectionLabsDate(int subGroupId, DateTime date);


        SubGroup GetSubGroup(int subGroupId);

        Group GetGroup(int groupId);

        void SaveLabsVisitingData(ScheduleProtectionLabMark protectionLabMarks);

        void SaveStudentLabsMark(StudentLabMark studentLabMark);

        List<string> GetLecturesAttachments(int subjectId);

        List<string> GetLabsAttachments(int subjectId);

        List<string> GetNewsAttachments(int subjectId);

        IEnumerable<string> GetSubjectAttachments(int subjectId);

        void DeleteSubject(int id);

        List<Subject> GetSubjects();

	    List<UserLabFiles> GetUserLabFiles(int userId, int subjectId);

		UserLabFiles GetUserLabFile(int id);

		void DeleteUserLabFile(int id);

	    bool IsSubjectName(string name, string id, int userId);

		bool IsSubjectShortName(string name, string id, int userId);

	    void DisableNews(int subjectId, bool disable);

        List<ProfileCalendarModel> GetLabEvents(int userId);

        List<ProfileCalendarModel> GetLecturesEvents(int userId);

        List<Subject> GetSubjectsByLector(int userId);

        List<Subject> GetSubjectsByStudent(int userId);

		decimal GetSubjectCompleting(int subjectId, string user, Student student);

        int StudentAttendance(int userId);

	    List<Subject> GetSubjectsByLectorOwner(int userId, bool lite = false);

        Lecturer GetSubjectOwner(int subjectId);

	    IList<SubGroup> GetSubGroupsV2(int subjectId, int groupId);

        IList<SubGroup> GetSubGroupsV3(int subjectId, int groupId);

        IList<SubGroup> GetSubGroupsV4(int subjectId, int groupId);
        List<Labs> GetLabsV2(int subjectId);

	    IList<SubGroup> GetSubGroupsV2WithScheduleProtectionLabs(int subjectId, int groupId);

		Subject GetSubject(IQuery<Subject> query);

		List<SubjectNews> GetNewsByGroup(int id);

		List<SubjectNews> GetNewsByLector(int id);

		List<ProfileCalendarModel> GetGroupsLabEvents(int groupId, int userId);

		void UpdateUserLabFile(int userFileId, bool isReceived);

		UserLabFiles GetUserLabFile(string path);

		List<ProfileCalendarModel> GetLecturesEvents(int groupId, int userId);

        void SavePracticalVisitingData(ScheduleProtectionPracticalMark protectionPracticalMarks);

    }
}