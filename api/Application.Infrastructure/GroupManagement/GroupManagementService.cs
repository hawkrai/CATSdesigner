using System.Collections.Generic;
using System.Linq;
using Application.Core.Data;
using Application.SearchEngine.SearchMethods;
using LMPlatform.Data.Repositories;
using LMPlatform.Models;
using Application.Core;
using LMPlatform.Data.Infrastructure;
using System.Threading.Tasks;

namespace Application.Infrastructure.GroupManagement
{
    public class GroupManagementService : IGroupManagementService
    {
        public Group GetGroup(int groupId)
        {
	        using var repositoriesContainer = new LmPlatformRepositoriesContainer();
	        return repositoriesContainer.GroupsRepository.GetBy(
		        new Query<Group>(e => e.Id == groupId)
					.Include(e => e.Students.Select(x => x.LecturesVisitMarks))
					.Include(e => e.Students.Select(x => x.User)));
        }

        public Group GetGroup(IQuery<Group> query = null)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();
            return repositoriesContainer.GroupsRepository.GetBy(query);
        }

        public Group GetGroupWithLiteStudents(int groupId)
        {
	        using var repositoriesContainer = new LmPlatformRepositoriesContainer();
	        return repositoriesContainer.GroupsRepository.GetBy(
		        new Query<Group>(e => e.Id == groupId)
			        .Include(e => e.Students));
        }

        public List<Group> GetGroups(IQuery<Group> query = null)
        {
	        using var repositoriesContainer = new LmPlatformRepositoriesContainer();
	        return repositoriesContainer.GroupsRepository.GetAll(query).OrderBy(x => x.Name).ToList();
        }

        public IPageableList<Group> GetGroupsPageable(string searchString = null, IPageInfo pageInfo = null, IEnumerable<ISortCriteria> sortCriterias = null)
        {
            var query = new PageableQuery<Group>(pageInfo);

            if (!string.IsNullOrEmpty(searchString))
            {
                query.AddFilterClause(
                    e => e.Name.ToLower().StartsWith(searchString) || e.Name.ToLower().Contains(searchString));
            }

            query.OrderBy(sortCriterias).Include(g => g.Students);
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var groups = repositoriesContainer.GroupsRepository.GetPageableBy(query);
                return groups;
            }
        }

        public async Task<IPageableList<Group>> GetGroupsPageableAsync(string searchString = null, IPageInfo pageInfo = null, ISortCriteria sortCriteria = null)
        {
            var query = new PageableQuery<Group>(pageInfo);
            query
                .Include(g => g.Students)
                .Include(e => e.SubjectGroups)
                .Include(e => e.SubjectGroups.Select(e => e.Subject));

            if (!string.IsNullOrEmpty(searchString))
            {
                query.AddFilterClause(e => 
                    e.Name.ToLower().Contains(searchString)
                );
            }

            if (sortCriteria != null)
            {
                query.OrderBy(sortCriteria);
            }

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var groups = await repositoriesContainer.GroupsRepository.GetPageableByAsync(query);
                return groups;
            }
        }

        public Group AddGroup(Group group)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.GroupsRepository.Save(group);
                repositoriesContainer.ApplyChanges();
            }
            new GroupSearchMethod().AddToIndex(group);
            return group;
        }

        public Group UpdateGroup(Group group)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                repositoriesContainer.GroupsRepository.Save(group);
                repositoriesContainer.ApplyChanges();
            }
            new GroupSearchMethod().UpdateIndex(group);
            return group;
        }

        public void DeleteGroup(int id)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(e => e.Id == id));
                repositoriesContainer.GroupsRepository.Delete(group);
                repositoriesContainer.ApplyChanges();
            }
        }

		public List<string> GetLabsScheduleVisitings(int subjectId, int groupId, int subGorupId)
	    {
            var data = new List<string>();

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                data.Add("Студент");

                var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId)
                    .Include(x => x.SubjectGroups.Select(t => t.SubGroups.Select(f => f.ScheduleProtectionLabs))));

                foreach (var scheduleProtectionLabs in subject.SubjectGroups.FirstOrDefault(e => e.GroupId == groupId).SubGroups.FirstOrDefault(e => e.Id == subGorupId).ScheduleProtectionLabs)
                {
                    data.Add(scheduleProtectionLabs.Date.ToString("dd/MM/yyyy"));
                    data.Add("Комментарий");
                }
            }

            return data;
	    }

	    public List<List<string>> GetLabsScheduleMarks(int subjectId, int groupId)
	    {
		    var data = new List<List<string>>();

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
                  .Include(x => x.SubjectGroups.Select(t => t.Group))
                  .Include(x => x.SubjectGroups.Select(t => t.SubGroups.Select(sg => sg.ScheduleProtectionLabs)))
                  .Include(x => x.SubjectGroups.Select(t => t.SubGroups.Select(sg => sg.SubjectStudents.Select(s => s.Student.ScheduleProtectionLabMarks)))));
                var group = subject.SubjectGroups.FirstOrDefault(e => e.GroupId == groupId).Group;


                var subGroups = group.SubjectGroups.FirstOrDefault(e => e.SubjectId == subjectId).SubGroups;
                foreach (var subGroup in subGroups.Select((x, index) => new { SubGroup = x, Index = index }))
                {
                    if (subGroup.SubGroup.ScheduleProtectionLabs.Count() == 0 || subGroup.SubGroup.SubjectStudents.Count == 0)
                    {
                        continue;
                    }
                    var row = new List<string>();
                    row.Add(" ");
                    row.Add($"Подгруппа {subGroup.Index + 1}");
                    data.Add(row);
                    data.Add(GetLabsScheduleVisitings(subjectId, groupId, subGroup.SubGroup.Id));
                    foreach (var student in subGroup.SubGroup.SubjectStudents.OrderBy(e => e.Student.FullName))
                    {
                        var studentRow = new List<string>();
                        studentRow.Add(student.Student.FullName);

                        var labMark = new List<string>();
                        string mark = "", comment = "";

                        foreach (var scheduleProtectionLabs in subGroup.SubGroup.ScheduleProtectionLabs)
                        {
                            foreach (var marks in student.Student.ScheduleProtectionLabMarks)
                            {
                                if (student.StudentId == marks.StudentId)
                                {
                                    if (marks.ScheduleProtectionLabId == scheduleProtectionLabs.Id)
                                    {
                                        mark = marks.Mark;
                                        comment = marks.Comment;
                                        break;
                                    } else
                                    {
                                        mark = "";
                                        comment = "";
                                    }
                                }
                            }
                            labMark.Add(mark);
                            labMark.Add(comment);

                        }
                        studentRow.AddRange(labMark);
                        data.Add(studentRow);
                    }
                }
            }
            return data;
	    }

        public List<string> GetCpScheduleVisitings(int subjectId, int groupId, int lecturerId)
        {
            var data = new List<string>();

            var subject = Context.CourseProjectConsultationDates.Where(x => x.SubjectId == subjectId && x.LecturerId == lecturerId);

                foreach (var cp in subject)
                {
                    data.Add(cp.Day.ToString("dd/MM/yyyy"));
                }

            return data;
        }

        public List<List<string>> GetCpScheduleMarks(int subjectId, int groupId, int lecturerId)
        {
            var data = new List<List<string>>();
            var groups = Context.Groups.Include("Students").Single(x=>x.Id == groupId);

            foreach (var student in groups.Students.OrderBy(e => e.FullName))
            {
                if (student.AssignedCourseProjects.Any(x=> x.CourseProject.SubjectId == subjectId && x.CourseProject.LecturerId == lecturerId))
                {
                    var rows = new List<string>();
                    rows.Add(student.FullName);
                    foreach (var cpd in Context.CourseProjectConsultationDates.Include("CourseProjectConsultationMarks").Where(x => x.SubjectId == subjectId && x.LecturerId == lecturerId))
                    {
                        var cpM = cpd.CourseProjectConsultationMarks.Where(x => x.StudentId == student.Id);
                        if (cpM.Count() > 0)
                        {
                            rows.Add("+");
                        }
                        else
                        {
                            rows.Add("-");
                        }
                    }
                    data.Add(rows);
                }
            }
            return data;
        }

        public List<List<string>> GetPracticalsScheduleMarks(int subjectId, int groupId)
        {
            using var repositoriesContainer = new LmPlatformRepositoriesContainer();

            var data = new List<List<string>>();

            data.Add(GetPracticalsScheduleVisitings(subjectId, groupId));
            var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
                .Include(x => x.SubjectGroups.Select(t => t.Group.ScheduleProtectionPracticals))
                .Include(x => x.SubjectGroups.Select(t => t.Group.Students.Select(x => x.ScheduleProtectionPracticalMarks))));
            var group = subject.SubjectGroups.FirstOrDefault(e => e.GroupId == groupId).Group;
            foreach (var student in group.Students.OrderBy(e => e.FullName))
            {
                var rowOne = new List<string>();
                rowOne.Add(student.FullName);
                string mark = "", comment = "";

                var practicalVisitingMarks = new List<string>();

                foreach (var scheduleProtectionPracticals in group.ScheduleProtectionPracticals)
                {
                    foreach (var marks in student.ScheduleProtectionPracticalMarks)
                    {
                        if (student.Id == marks.StudentId)
                        {
                            if (marks.ScheduleProtectionPracticalId == scheduleProtectionPracticals.Id)
                            {
                                mark = marks.Mark;
                                comment = marks.Comment;
                                break;
                            } else
                            {
                                mark = "";
                                comment = "";

                            }
                        }
                    }
                    practicalVisitingMarks.Add(mark);
                    practicalVisitingMarks.Add(comment);
                }
                rowOne.AddRange(practicalVisitingMarks);
                data.Add(rowOne);

            }
            return data;
        }

        public List<string> GetCpPercentage(int subjectId, int groupId, int lecturerId)
        {
            var data = new List<string>();

            var subject = Context.CoursePercentagesGraphs.Where(x => x.SubjectId == subjectId && x.LecturerId == lecturerId);

            foreach (var cp in subject)
            {
                data.Add(cp.Date.ToString("dd/MM/yyyy"));
            }

            return data;
        }

        public List<List<string>> GetCpMarks(int subjectId, int groupId, int lecturerId)
        {
            var data = new List<List<string>>();
            var groups = Context.Groups.Include("Students").Single(x => x.Id == groupId);

            foreach (var student in groups.Students.OrderBy(e => e.FullName))
            {
                if (student.AssignedCourseProjects.Any(x => x.CourseProject.SubjectId == subjectId && x.CourseProject.LecturerId == lecturerId))
                {
                    var rows = new List<string>();
                    rows.Add(student.FullName);
                    foreach (var cpd in Context.CoursePercentagesGraphs.Include("CoursePercentagesResults").Where(x => x.SubjectId == subjectId && x.LecturerId == lecturerId))
                    {
                        var cpM = cpd.CoursePercentagesResults.FirstOrDefault(x => x.StudentId == student.Id);
                        if (cpM != null)
                        {
                            rows.Add(cpM.Mark.ToString());
                        }
                        else
                        {
                            rows.Add("-");
                        }
                    }
                    var st = student.AssignedCourseProjects.First();
                    rows.Add(st.Mark.ToString());
                    data.Add(rows);
                }
            }
            return data;
        }

        public Group GetGroupByName(string groupName)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(g => g.Name == groupName));

                return group;
            }
        }


        private readonly LazyDependency<ICpContext> context = new LazyDependency<ICpContext>();

        private ICpContext Context
        {
            get { return context.Value; }
        }

        public List<string> GetLabsNames(int subjectId, int groupId)
        {
            var data = new List<string>();

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId).Include(x => x.Labs));

                foreach (var labs in subject.Labs)
                {
                    data.Add(labs.Theme);
                    data.Add("Комментарий");
                    data.Add("Дата выставления");
                    data.Add("Выставил");
                }
            }

            return data;
        }

        public List<string> GetPracticalsNames(int subjectId, int groupId)
        {
            var data = new List<string>();

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId).Include(x => x.Practicals));

                foreach (var practical in subject.Practicals)
                {
                    data.Add(practical.Theme);
                    data.Add("Комментарий");
                    data.Add("Дата выставления");
                    data.Add("Выставил");

                }
            }

            return data;
        }

        public List<List<string>> GetLabsMarks(int subjectId, int groupId)
        {
            var data = new List<List<string>>();


            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var group = repositoriesContainer.GroupsRepository.GetBy(new Query<Group>(e => e.Id == groupId).Include(x => x.Students
                    .Select(t => t.StudentLabMarks.Select(x => x.Lecturer))));

                foreach (var student in group.Students.OrderBy(e => e.FullName))
                {

                    var rows = new List<string>();

                    rows.Add(student.FullName);

                    var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId).Include(x => x.Labs));
                    var labMark = new List<string>();
                    string mark = "", comment = "", date = "", setBy = "";


                    foreach (var lab in subject.Labs)
                    {
                        foreach (var labToLabMark in student.StudentLabMarks)
                        {
                            if (student.Id == labToLabMark.StudentId)
                            {
                                if (lab.Id == labToLabMark.LabId)
                                {
                                    mark = labToLabMark.Mark;
                                    comment = labToLabMark.Comment;
                                    date = labToLabMark.Date;
                                    setBy = labToLabMark.Lecturer != null ? labToLabMark.Lecturer.FullName : string.Empty;
                                    break;
                                }
                                else
                                {
                                    mark = "";
                                    comment = "";
                                    date = "";
                                    setBy = "";
                                }
                            }
                        }

                        labMark.Add(mark);
                        labMark.Add(comment);
                        labMark.Add(date);
                        labMark.Add(setBy);
                    }

                    rows.AddRange(labMark);

                    data.Add(rows);

                }
            }
            return data;
        }

	    public List<Group> GetLecturesGroups(int id, bool activeOnly = false)
	    {
		    using var repositoriesContainer = new LmPlatformRepositoriesContainer();
		    var subjects = repositoriesContainer.RepositoryFor<SubjectLecturer>()
			    .GetAll(new Query<SubjectLecturer>(e => e.LecturerId == id)
				    .Include(e => e.Subject.SubjectGroups
					    .Select(x => x.Group)))
                .Where(x => activeOnly ? !x.Subject.IsArchive : true)
                .ToList();

		    var groups = new List<Group>();

		    foreach (var subject in subjects)
		    {
			    groups.AddRange(subject.Subject.SubjectGroups.Where(e => activeOnly ? e.IsActiveOnCurrentGroup : true).Select(e => e.Group));
		    }

		    return groups;
	    }

        public List<string> GetPracticalsScheduleVisitings(int subjectId, int groupId)
        {
            var data = new List<string>();

            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                data.Add("Студент");

                var subject = repositoriesContainer.SubjectRepository.GetBy(new PageableQuery<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(x => x.GroupId == groupId))
                    .Include(x => x.SubjectGroups.Select(t => t.Group.ScheduleProtectionPracticals)));

                foreach (var scheduleProtectionPrcaticals in subject.SubjectGroups.FirstOrDefault(e => e.GroupId == groupId).Group.ScheduleProtectionPracticals)
                {
                    data.Add(scheduleProtectionPrcaticals.Date.ToString("dd/MM/yyyy"));
                    data.Add("Комментарий");
                }
            }

            return data;
        }

        public List<List<string>> GetPracticalsMarks(int subjectId, int groupId)
        {
            var data = new List<List<string>>();


            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                var subject = repositoriesContainer.SubjectRepository.GetBy(new Query<Subject>(e => e.Id == subjectId && e.SubjectGroups.Any(sg => sg.GroupId == groupId))
                    .Include(x => x.Practicals)
                    .Include(x => x.SubjectGroups.Select(sg => sg.Group.Students.Select(x => x.StudentPracticalMarks.Select(x => x.Lecturer)))));

                var practicals = subject.Practicals.OrderBy(x => x.Order);

                foreach (var student in subject.SubjectGroups.FirstOrDefault(x => x.GroupId == groupId).Group.Students.OrderBy(e => e.FullName))
                {

                    var rows = new List<string>();

                    rows.Add(student.FullName);

                    var prcaticalMark = new List<string>();
                    string mark = "", comment = "", date = "", setBy = ""; ;

                    foreach (var practical in practicals)
                    {
                        foreach (var practicalToPracticalMark in student.StudentPracticalMarks)
                        {
                            if (student.Id == practicalToPracticalMark.StudentId)
                            {
                                if (practical.Id == practicalToPracticalMark.PracticalId)
                                {
                                    mark = practicalToPracticalMark.Mark;
                                    comment = practicalToPracticalMark.Comment;
                                    date = practicalToPracticalMark.Date;
                                    setBy = practicalToPracticalMark.Lecturer != null ? practicalToPracticalMark.Lecturer.FullName : string.Empty;
                                    break;
                                }
                                else
                                {
                                    mark = "";
                                    comment = "";
                                    date = "";
                                    setBy = "";
                                }
                            }
                        }

                        prcaticalMark.Add(mark);
                        prcaticalMark.Add(comment);
                        prcaticalMark.Add(date);
                        prcaticalMark.Add(setBy);
                    }

                    rows.AddRange(prcaticalMark);

                    data.Add(rows);

                }
            }
            return data;
        }
    }
}