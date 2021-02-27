using System;
using Application.Core;
using Application.Infrastructure.KnowledgeTestsManagement;
using LMPlatform.Models.KnowledgeTesting;
using LMPlatform.UI.Services.Modules.Practicals;

namespace LMPlatform.UI.Services.Modules.CoreModels
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Runtime.Serialization;

    using LMPlatform.Models;
    using LMPlatform.UI.Services.Modules.Labs;

    [DataContract]
    public class StudentsViewData
    {
        public StudentsViewData()
        {
        }

        public StudentsViewData(List<TestPassResult> test, Student student, IEnumerable<ScheduleProtectionLabs> scheduleProtectionLabs = null, IEnumerable<ScheduleProtectionPractical> scheduleProtectionPracticals = null, IEnumerable<Labs> labs = null, IEnumerable<Practical> practicals = null, List<UserlabFilesViewData> userLabsFile = null)
        {
            StudentId = student.Id;
            FullName = student.FullName;
            GroupId = student.GroupId;
            Login = student.User != null ? student.User.UserName : string.Empty;
            LabVisitingMark = new List<LabVisitingMarkViewData>();
            PracticalVisitingMark = new List<PracticalVisitingMarkViewData>();
            StudentLabMarks = new List<StudentLabMarkViewData>();
            StudentPracticalMarks = new List<StudentPracticalMarkViewData>();

			if (test != null && test.Any() && test.Any(e => e.Points.HasValue))
	        {
                var sum = (double)test.Where(e => e.Points != null).Sum(e => e.Points);
				TestMark = Math.Round(sum / test.Count(e => e.Points != null), 1).ToString(CultureInfo.InvariantCulture);
	        }

            AllTestsPassed = test.Count > 0  && test.All(e => e.Points.HasValue);

            FileLabs = userLabsFile;

            if (labs != null)
            {
                foreach (var lab in labs)
                {
                    var model = student.StudentLabMarks.FirstOrDefault(e => e.LabId == lab.Id && e.StudentId == student.Id);

                    if (model == null)
                    {
                        StudentLabMarks.Add(new StudentLabMarkViewData
                        {
                            LabId = lab.Id,
                            Mark = string.Empty,
                            StudentId = StudentId,
                            Comment = string.Empty,
                            Date = string.Empty,
                            StudentLabMarkId = 0,
                            LecturerId = new int?(),
                            ShowForStudent = false
                        });
                    }
                    else
                    {
                        StudentLabMarks.Add(new StudentLabMarkViewData
                        {
                            LabId = lab.Id,
                            Mark = model.Mark,
                            StudentId = StudentId,
                            Comment = model.Comment,
                            Date = model.Date,
                            StudentLabMarkId = model.Id,
                            LecturerId = model.LecturerId.HasValue ? model.LecturerId.Value : new int?(),
                            ShowForStudent = model.ShowForStudent
                        });
                    }
                }   
            }

            if (practicals != null)
            {
                foreach (var practical in practicals)
                {
                    var model = student.StudentPracticalMarks.FirstOrDefault(e => e.PracticalId == practical.Id);
                    if (model != null)
                    {
                        StudentPracticalMarks.Add(new StudentPracticalMarkViewData
                        {
                            PracticalId = practical.Id,
                            Mark = model.Mark,
                            StudentId = StudentId,
                            StudentPracticalMarkId = model.Id,
                            Comment = model.Comment,
                            Date = model.Date,
                            ShowForStudent = model.ShowForStudent,
                            LecturerId = model.LecturerId
                        });
                    }
                    else
                    {
                        StudentPracticalMarks.Add(new StudentPracticalMarkViewData
                        {
                            PracticalId = practical.Id,
                            Mark = string.Empty,
                            StudentId = StudentId,
                            StudentPracticalMarkId = 0,
                            Comment = string.Empty,
                            Date = string.Empty,
                            LecturerId = new int?(),
                            ShowForStudent = false
                        });
                    }
                }
            }

            if (scheduleProtectionLabs != null)
            {
                foreach (var scheduleProtectionLab in scheduleProtectionLabs)
                {
                    var model = student.ScheduleProtectionLabMarks.FirstOrDefault(e => e.ScheduleProtectionLabId == scheduleProtectionLab.Id && e.StudentId == student.Id);
                    if (model != null)
                    {
                        LabVisitingMark.Add(new LabVisitingMarkViewData
                        {
                            Comment = model.Comment,
                            Mark = model.Mark,
                            ScheduleProtectionLabId = scheduleProtectionLab.Id,
                            StudentId = student.Id,
                            LabVisitingMarkId = model.Id,
                            ShowForStudent = model.ShowForStudent
                        });    
                    }
                    else
                    {
                        LabVisitingMark.Add(new LabVisitingMarkViewData
                        {
                            Comment = string.Empty,
                            Mark = string.Empty,
                            ScheduleProtectionLabId = scheduleProtectionLab.Id,
                            StudentId = this.StudentId,
                            LabVisitingMarkId = 0,
                            ShowForStudent = false
                        });       
                    }
                }
            }

            if (scheduleProtectionPracticals != null)
            {
                foreach (var scheduleProtectionPractical in scheduleProtectionPracticals)
                {
                    var model = student.ScheduleProtectionPracticalMarks
                        .FirstOrDefault(e => e.ScheduleProtectionPracticalId == scheduleProtectionPractical.Id && e.StudentId == student.Id);
                    if (model != null)
                    {
                        PracticalVisitingMark.Add(new PracticalVisitingMarkViewData
                        {
                            Comment = model.Comment,
                            Mark = model.Mark,
                            ScheduleProtectionPracticalId = scheduleProtectionPractical.Id,
                            StudentId = student.Id,
                            PracticalVisitingMarkId = student.Id,
                            ShowForStudent = model.ShowForStudent
                        });
                    }
                    else
                    {
                        PracticalVisitingMark.Add(new PracticalVisitingMarkViewData
                        {
                            Comment = string.Empty,
                            Mark = string.Empty,
                            ScheduleProtectionPracticalId = scheduleProtectionPractical.Id,
                            StudentId = this.StudentId,
                            PracticalVisitingMarkId = 0,
                            ShowForStudent = false

                        });
                    }
                }
            }

			double number;
			var summ = StudentLabMarks.Where(studentLabMarkViewData => !string.IsNullOrEmpty(studentLabMarkViewData.Mark) && double.TryParse(studentLabMarkViewData.Mark, out number)).Sum(studentLabMarkViewData => double.Parse(studentLabMarkViewData.Mark));
            var countMark = StudentLabMarks.Count(e => !string.IsNullOrEmpty(e.Mark) && double.TryParse(e.Mark, out number));
            if (countMark != 0)
            {
				LabsMarkTotal = Math.Round(summ / countMark, 1).ToString(CultureInfo.InvariantCulture);    
            }

			summ = StudentPracticalMarks.Where(studentPracticalMarkViewData => !string.IsNullOrEmpty(studentPracticalMarkViewData.Mark) && double.TryParse(studentPracticalMarkViewData.Mark, out number)).Sum(studentPracticalMarkViewData => double.Parse(studentPracticalMarkViewData.Mark));

            countMark = StudentPracticalMarks.Count(studentPracticalMarkViewData => !string.IsNullOrEmpty(studentPracticalMarkViewData.Mark) && double.TryParse(studentPracticalMarkViewData.Mark, out number));
            if (countMark != 0)
            {
                PracticalMarkTotal = Math.Round(summ / countMark).ToString(CultureInfo.InvariantCulture);

            }
        }

        [DataMember]
        public int StudentId { get; set; }

        [DataMember]
        public int SubgroupId { get; set; }

        [DataMember]
        public string FullName { get; set; }

		[DataMember]
		public string Login { get; set; }

        [DataMember]
        public int GroupId { get; set; }

        [DataMember]
        public List<LabVisitingMarkViewData> LabVisitingMark { get; set; }

        [DataMember]
        public List<PracticalVisitingMarkViewData> PracticalVisitingMark { get; set; }

        [DataMember]
        public List<StudentLabMarkViewData> StudentLabMarks { get; set; }

        [DataMember]
        public string LabsMarkTotal { get; set; }

		[DataMember]
		public string TestMark { get; set; }

        [DataMember]
        public bool AllTestsPassed { get; set; }

        [DataMember]
        public string PracticalMarkTotal { get; set; }

        [DataMember]
        public List<StudentPracticalMarkViewData> StudentPracticalMarks { get; set; }

        [DataMember]
        public List<UserlabFilesViewData> FileLabs { get; set; }

		public ITestPassingService TestPassingService
		{
			get
			{
				return ApplicationService<ITestPassingService>();
			}
		}

		public TService ApplicationService<TService>()
		{
			return UnityWrapper.Resolve<TService>();
		}

		[DataMember]
		public bool? Confirmed
		{
			get;
			set;
		}
    }
}