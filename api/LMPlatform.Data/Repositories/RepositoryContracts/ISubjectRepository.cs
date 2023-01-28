using System.Collections.Generic;
using Application.Core.Data;
using LMPlatform.Models;

namespace LMPlatform.Data.Repositories.RepositoryContracts
{
    public interface ISubjectRepository : IRepositoryBase<Subject>
    {
        List<Subject> GetAllSubjectsForGroup(int groupId, bool isArchive = false);
        List<Subject> GetSubjects(int groupId = 0, int lecturerId = 0);
        List<Subject> GetSubjectsInfoByLecturerId(int lecturerId);
        List<Subject> GetSubjectsInfoByGroupId(int groupId);

        List<Subject> GetSubjectsV2(int groupId = 0, int lecturerId = 0);
        int GetSubjectsCountByGroupId(int groupId, bool isActive);
        Subject GetSubject(int subjectId, int groupId = 0, int lecturerId = 0);
        List<Subject> GetSubjectsLite(int? groupId = null);

        void DeleteLection(Lectures lectures);

		bool IsSubjectName(string name, string id, int userId);

		bool IsSubjectShortName(string name, string id, int userId);

	    void DisableNews(int subjectId, bool disable);
    }
}