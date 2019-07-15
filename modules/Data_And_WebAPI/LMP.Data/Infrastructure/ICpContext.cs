using System.Linq;
using LMP.Models.From_LMP_Models;
using LMP.Models.From_LMP_Models.CP;
using Microsoft.EntityFrameworkCore;

namespace LMP.Data.Infrastructure
{
    public interface ICpContext
    {
        DbSet<CourseProjectNews> CourseProjectNews { get; set; }

        DbSet<CourseProject> CourseProjects { get; set; }

        DbSet<Lecturer> Lecturers { get; set; }

        DbSet<AssignedCourseProject> AssignedCourseProjects { get; set; }

        DbSet<CourseProjectGroup> CourseProjectGroups { get; set; }

        DbSet<User> Users { get; set; }

        DbSet<Student> Students { get; set; }

        DbSet<CoursePercentagesGraph> CoursePercentagesGraphs { get; set; }

        DbSet<CoursePercentagesGraphToGroup> CoursePercentagesGraphToGroups { get; set; }

        DbSet<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        DbSet<CourseProjectConsultationDate> CourseProjectConsultationDates { get; set; }

        DbSet<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }

        DbSet<CourseProjectTaskSheetTemplate> CourseProjectTaskSheetTemplates { get; set; }

        DbSet<Group> Groups { get; set; }

        IQueryable<Student> GetGraduateStudents();

        IQueryable<Group> GetGraduateGroups();

        int SaveChanges();
    }
}
