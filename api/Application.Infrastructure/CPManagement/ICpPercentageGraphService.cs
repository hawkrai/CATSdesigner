using System;
using System.Collections.Generic;
using Application.Core.Data;
using Application.Infrastructure.CTO;
using LMPlatform.Models.CP;

namespace Application.Infrastructure.CPManagement
{
    public interface ICpPercentageGraphService
    {
        PagedList<PercentageGraphData> GetPercentageGraphs(int userId, GetPagedListParams parms);

        PagedList<PercentageGraphData> GetPercentageGraphsForLecturer(int lecturerId, GetPagedListParams parms, int secretaryId);

        List<PercentageGraphData> GetPercentageGraphsForLecturerAll(int userId, GetPagedListParams parms);

        List<CourseProjectConsultationDateData> GetConsultationDatesForUser(int userId, int groupId);

        void SavePercentage(int userId, PercentageGraphData percentageData);

        PercentageGraphData GetPercentageGraph(int id);

        void DeletePercentage(int userId, int id);

        void SavePercentageResult(int userId, PercentageResultData percentageResultData);

        void SaveConsultationMark(int userId, CourseProjectConsultationMarkData consultationMarkData);

        CourseProjectConsultationDate SaveConsultationDate(int userId, DateTime date, int subjectId, TimeSpan? startTime, TimeSpan? endTime, string audience, string buildingNumber, int groupId);

        void DeleteConsultationDate(int userId, int id);
    }
}
