using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using Application.Core;
using Application.Infrastructure.KnowledgeTestsManagement;
using LMPlatform.Models;

namespace LMPlatform.UI.Services.Modules.Parental
{
    [DataContract]
    public class ParentalUser
    {

        [DataMember]
        public string FIO { get; set; }

        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public Dictionary<int, int> UserLecturePass { get; set; }

        [DataMember]
        public Dictionary<int, int> UserLabPass { get; set; }
        [DataMember]
        public Dictionary<int, int> UserPracticalPass { get; set; }

        [DataMember]
        public Dictionary<int, double> UserAvgLabMarks { get; set; }
        [DataMember]
        public Dictionary<int, double> UserAvgPracticalMarks { get; set; }

        [DataMember]
        public Dictionary<int, double> UserAvgTestMarks { get; set; }

        [DataMember]
        public Dictionary<int, int> UserLabCount { get; set; }
        [DataMember]
        public Dictionary<int, int> UserPracticalCount { get; set; }

        [DataMember]
        public Dictionary<int, int> UserTestCount { get; set; }

        [DataMember]
        public Dictionary<int, int> UserCourseCount { get; set; }

        [DataMember]
        public Dictionary<int, int> UserCoursePass { get; set; }

        [DataMember]
        public Dictionary<int, int> UserAvgCourseMark { get; set; }


        [DataMember]
        public double Rating { get; set; }

        private List<Subject> Subjects;

        private readonly LazyDependency<ITestPassingService> _testPassingService = new LazyDependency<ITestPassingService>();

        private ITestPassingService TestPassingService
        {
            get
            {
                return _testPassingService.Value;
            }
        }


        public ParentalUser(Student student, List<Subject> subjects)
        {
            #region Init
            FIO = student.FullName;
            Id = student.Id;
            this.UserLecturePass = new Dictionary<int, int>();
            this.UserLabPass = new Dictionary<int, int>();
            this.UserAvgLabMarks = new Dictionary<int, double>();
            this.UserAvgTestMarks = new Dictionary<int, double>();
            this.UserLabCount = new Dictionary<int, int>();
            this.UserTestCount = new Dictionary<int, int>();
            this.UserPracticalPass = new Dictionary<int, int>();
            this.UserPracticalCount = new Dictionary<int, int>();
            this.UserAvgPracticalMarks = new Dictionary<int, double>();
            this.UserAvgCourseMark = new Dictionary<int, int>();
            this.UserCourseCount = new Dictionary<int, int>();
            this.UserCoursePass = new Dictionary<int, int>();
            this.Subjects = subjects;

            foreach (var subject in subjects)
            {
                this.UserLecturePass.Add(subject.Id, 0);
                this.UserLabPass.Add(subject.Id, 0);
                this.UserAvgLabMarks.Add(subject.Id, 0);
                this.UserLabCount.Add(subject.Id, 0);
                this.UserAvgTestMarks.Add(subject.Id, 0);
                this.UserTestCount.Add(subject.Id, 0);
                this.UserPracticalPass.Add(subject.Id, 0);
                this.UserAvgPracticalMarks.Add(subject.Id, 0);
                this.UserPracticalCount.Add(subject.Id, 0);
                this.UserCourseCount.Add(subject.Id, 0);
                this.UserCoursePass.Add(subject.Id, 0);
                this.UserAvgCourseMark.Add(subject.Id, 0);
            }
            InitLecturePass(student);
            InitLabPass(student);
            InitAvgLabMarks(student);
            InitPracticalPass(student);
            InitAvgPracticalMarks(student);
            InitAvgTestMarks(student);
            InitCoursePass(student);
            InitAvgCourseMarks(student);

            foreach (var subject in subjects)
            {
                if (this.UserLabCount[subject.Id] != 0)
                    this.UserAvgLabMarks[subject.Id] /= this.UserLabCount[subject.Id];
                if (this.UserTestCount[subject.Id] != 0)
                    this.UserAvgTestMarks[subject.Id] /= this.UserTestCount[subject.Id];
                if (this.UserPracticalCount[subject.Id] != 0)
                    this.UserAvgPracticalMarks[subject.Id] /= this.UserPracticalCount[subject.Id];
                if (this.UserCourseCount[subject.Id] != 0)
                    this.UserAvgCourseMark[subject.Id] /= this.UserCourseCount[subject.Id];
            }
            #endregion
        }

        private void InitLecturePass(Student student)
        {
            if (student.LecturesVisitMarks != null)
            {
                foreach (var lecture in student.LecturesVisitMarks)
                {
                    if (lecture != null)
                    {
                        if (lecture.LecturesScheduleVisiting != null && lecture.Mark != null)
                        {
                            int mark;
                            int.TryParse(lecture.Mark, out mark);
                            if (UserLecturePass.ContainsKey(lecture.LecturesScheduleVisiting.SubjectId))
                            {
                                this.UserLecturePass[lecture.LecturesScheduleVisiting.SubjectId] += mark;
                            }
                        }
                    }
                }
            }
        }

        private void InitLabPass(Student student)
        {
            if (student.ScheduleProtectionLabMarks != null)
            {
                foreach (var lab in student.ScheduleProtectionLabMarks)
                {

                    if (lab != null && lab.ScheduleProtectionLab != null && lab.ScheduleProtectionLab.SubGroup != null && lab.ScheduleProtectionLab.SubGroup.SubjectGroup != null)
                    {
                        int pass;
                        Int32.TryParse(lab.Mark, out pass);
                        if (UserLabPass.ContainsKey(lab.ScheduleProtectionLab.SubGroup.SubjectGroup.SubjectId))
                        {
                            this.UserLabPass[lab.ScheduleProtectionLab.SubGroup.SubjectGroup.SubjectId] += pass;
                        }
                        
                    }
                }
            }
        }

        private void InitPracticalPass(Student student)
        {
            if (student.ScheduleProtectionPracticalMarks != null)
            {
                foreach (var practical in student.ScheduleProtectionPracticalMarks)
                {

                    if (practical != null && practical.ScheduleProtectionPractical != null)
                    {
                        int pass;
                        Int32.TryParse(practical.Mark, out pass);
                        if (UserPracticalPass.ContainsKey(practical.ScheduleProtectionPractical.SubjectId))
                        {
                            this.UserPracticalPass[practical.ScheduleProtectionPractical.SubjectId] += pass;
                        }

                    }
                }
            }
        }

        private void InitAvgLabMarks(Student student)
        {
            if (student.StudentLabMarks != null)
            {
                foreach (var lab in student.StudentLabMarks)
                {
                    double mark;
                    double.TryParse(lab.Mark, out mark);
                    if (this.UserAvgLabMarks.ContainsKey(lab.Lab.SubjectId))
                    {
                        this.UserAvgLabMarks[lab.Lab.SubjectId] += mark;
                    }

                    if (this.UserLabCount.ContainsKey(lab.Lab.SubjectId))
                    {
                        this.UserLabCount[lab.Lab.SubjectId]++;
                    }
                }
            }
        }

        private void InitAvgPracticalMarks(Student student)
        {
            if (student.StudentPracticalMarks != null)
            {
                foreach (var practical in student.StudentPracticalMarks)
                {
                    double mark;
                    double.TryParse(practical.Mark, out mark);
                    if (this.UserAvgPracticalMarks.ContainsKey(practical.Practical.SubjectId))
                    {
                        this.UserAvgPracticalMarks[practical.Practical.SubjectId] += mark;
                    }

                    if (this.UserPracticalCount.ContainsKey(practical.Practical.SubjectId))
                    {
                        this.UserPracticalCount[practical.Practical.SubjectId]++;
                    }
                }
            }
        }

        private void InitAvgTestMarks(Student student)
        {

            foreach (var sub in Subjects)
            {
                var tests = TestPassingService.GetStudentControlTestResults(sub.Id, student.Id);
                if (tests != null)
                {
                    foreach (var test in tests)
                    {
                        if (test.Points.HasValue)
                        {
                            this.UserAvgTestMarks[sub.Id] += (double)test.Points;
                            this.UserTestCount[sub.Id]++;
                        }
                    }
                }
            }
        }

        private void InitCoursePass(Student student)
        {
            if (student.AssignedCourseProjects != null)
            {
                foreach (var courseProject in student.AssignedCourseProjects)
                {
                    if (courseProject != null)
                    {
                        if (courseProject.CourseProject != null && courseProject.Mark != null && courseProject.CourseProject.SubjectId != null)
                        {
                            int mark = courseProject.Mark.Value;
                            if (UserCoursePass.ContainsKey(courseProject.CourseProject.SubjectId.Value))
                            {
                                this.UserCoursePass[courseProject.CourseProject.SubjectId.Value] += mark;
                            }
                        }
                    }
                }
            }
        }

        private void InitAvgCourseMarks(Student student)
        {
            if (student.CoursePercentagesResults != null)
            {
                foreach (var courseResult in student.CoursePercentagesResults)
                {
                    if (courseResult != null && courseResult.Mark.HasValue && 
                        courseResult.CoursePercentagesGraph != null
                        )
                    {
                        int mark = courseResult.Mark.Value;
                        if (this.UserAvgCourseMark.ContainsKey(courseResult.CoursePercentagesGraph.SubjectId))
                        {
                            this.UserAvgCourseMark[courseResult.CoursePercentagesGraph.SubjectId] += mark;
                        }

                        if (this.UserCourseCount.ContainsKey(courseResult.CoursePercentagesGraph.SubjectId))
                        {
                            this.UserCourseCount[courseResult.CoursePercentagesGraph.SubjectId]++;
                        }
                    }

                }
            }
        }
    }
}