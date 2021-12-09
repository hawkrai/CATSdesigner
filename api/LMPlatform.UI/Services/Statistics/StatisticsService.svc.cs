using Application.Core;
using Application.Core.Data;
using Application.Core.Helpers;
using Application.Infrastructure.KnowledgeTestsManagement;
using Application.Infrastructure.SubjectManagement;
using LMPlatform.Models;
using LMPlatform.UI.Attributes;
using LMPlatform.UI.Services.Modules.CoreModels;
using LMPlatform.UI.Services.Modules.Statistics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace LMPlatform.UI.Services.Statistics
{
    [JwtAuth]
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "StatisticsService" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select StatisticsService.svc or StatisticsService.svc.cs at the Solution Explorer and start debugging.
    public class StatisticsService : IStatisticsService
    {
        private readonly LazyDependency<ISubjectManagementService> subjectManagementService = new LazyDependency<ISubjectManagementService>();

        public ISubjectManagementService SubjectManagementService => subjectManagementService.Value;

        private readonly LazyDependency<ITestsManagementService> testsManagementService = new LazyDependency<ITestsManagementService>();

        public ITestsManagementService TestsManagementService => testsManagementService.Value;

        private readonly LazyDependency<ITestPassingService> testPassingService = new LazyDependency<ITestPassingService>();

        public ITestPassingService TestPassingService => testPassingService.Value;



        public TeacherStatisticsViewData GetTeacherStatistics()
        {
            if (UserContext.Role != "lector")
            {
                return new TeacherStatisticsViewData
                {
                    Code = "403",
                    Message = ""
                };
            }
            var subjects = SubjectManagementService.GetSubjects(new Query<Subject>(x => !x.IsArchive && x.SubjectLecturers.Any(sl => sl.LecturerId == UserContext.CurrentUserId))
                .Include(x => x.Labs)
                .Include(x => x.Practicals)
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.StudentPracticalMarks)))
                .Include(x => x.SubjectGroups.Select(g => g.SubGroups.Select(sg => sg.ScheduleProtectionLabs)))
                .Include(x => x.SubjectGroups.Select(g => g.SubGroups.Select(sg => sg.SubjectStudents)))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.CoursePercentagesResults.Select(r => r.CoursePercentagesGraph))))
                .Include(x => x.SubjectGroups.Select(g => g.SubjectStudents.Select(s => s.Student.StudentLabMarks))));

            var subjectStatistics = new List<SubjectStatisticsViewResult>();

            foreach(var subject in subjects)
            {
                var marks = new List<StudentMark>();
                var controlTests = TestsManagementService.GetTestsForSubject(subject.Id).Where(x => !x.ForSelfStudy && !x.BeforeEUMK && !x.ForEUMK && !x.ForNN);
                foreach(var group in subject.SubjectGroups)
                {
                    foreach (var student in group.SubjectStudents.Select(x => x.Student).OrderBy(x => x.LastName))
                    {
                        var studentViewData = new StudentsViewData(TestPassingService.GetStidentResults(subject.Id, student.Id).Where(x => controlTests.Any(y => y.Id == x.TestId)).ToList(), 
                            student, labs: subject.Labs, practicals: subject.Practicals);

                        marks.Add(new StudentMark
                        {
                            FullName = student.FullName,
                            StudentId = student.Id,
                            LabsMarkTotal = studentViewData.LabsMarkTotal,
                            TestMark = studentViewData.TestMark,
                            LabVisitingMark = studentViewData.LabVisitingMark,
                            LabsMarks = studentViewData.StudentLabMarks,
                            AllTestsPassed = studentViewData.AllTestsPassed,
                            PracticalsMarkTotal = studentViewData.PracticalMarkTotal,
                            PracticalVisitingMark = studentViewData.PracticalVisitingMark,
                            PracticalsMarks = studentViewData.StudentPracticalMarks,
                            CourseProjectMark = student.CoursePercentagesResults.FirstOrDefault(cpr => cpr.CoursePercentagesGraph.SubjectId == subject.Id)?.Mark?.ToString()
                        });
                    }
                }
                subjectStatistics.Add(new SubjectStatisticsViewResult
                {
                    AverageCourceProjectMark = marks.Count == 0 ? 0 : Math.Round(marks.Select(x => double.TryParse(x.CourseProjectMark, out var courseProjectMark) ? courseProjectMark : 0).Sum() / marks.Count, 2),
                    AverageLabsMark = marks.Count == 0 ? 0 : Math.Round(marks.Select(x => double.TryParse(x.LabsMarkTotal, out var labsMarkTotal) ? labsMarkTotal : 0).Sum() / marks.Count, 2),
                    AveragePracticalsMark = marks.Count == 0 ? 0 : Math.Round(marks.Select(x => double.TryParse(x.PracticalsMarkTotal, out var practicalsMarkTotal) ? practicalsMarkTotal : 0).Sum() / marks.Count, 2),
                    AverageTestsMark = marks.Count == 0 ? 0 : Math.Round(marks.Select(x => double.TryParse(x.TestMark, out var testMark) ? testMark : 0).Sum() / marks.Count, 2),
                    SubjectName = subject.Name
                });
            }

            return new TeacherStatisticsViewData
            {
                Code = "200",
                SubjectStatistics = subjectStatistics
            };
        }
    }
}
