using System;
using System.Linq;
using System.Linq.Expressions;
using LMP.Models;
using LMP.Models.DP;
using Microsoft.EntityFrameworkCore;

namespace LMP.Data.Infrastructure
{
    public interface IDpContext
    {
        #region DbSets

        DbSet<Role> Roles { get; set; }

        DbSet<ScoObjects> ScoObjects { get; set; }

        DbSet<TinCanObjects> TinCanObjects { get; set; }

        DbSet<User> Users { get; set; }

        DbSet<Student> Students { get; set; }

        DbSet<Group> Groups { get; set; }

        DbSet<Lecturer> Lecturers { get; set; }

        DbSet<AssignedDiplomProject> AssignedDiplomProjects { get; set; }

        DbSet<DiplomPercentagesGraph> DiplomPercentagesGraphs { get; set; }

        DbSet<DiplomPercentagesGraphToGroup> DiplomPercentagesGraphToGroups { get; set; }

        DbSet<DiplomPercentagesResult> DiplomPercentagesResults { get; set; }

        DbSet<DiplomProjectConsultationDate> DiplomProjectConsultationDates { get; set; }

        DbSet<DiplomProjectConsultationMark> DiplomProjectConsultationMarks { get; set; }

        DbSet<DiplomProjectGroup> DiplomProjectGroups { get; set; }

        DbSet<DiplomProject> DiplomProjects { get; set; }

        DbSet<DiplomProjectTaskSheetTemplate> DiplomProjectTaskSheetTemplates { get; set; }

        Expression<Func<Student, bool>> StudentIsGraduate { get; }

        DbSet<DiplomProjectNews> DiplomProjectNews { get; set; }

            #endregion

        IQueryable<Student> GetGraduateStudents();

        IQueryable<Group> GetGraduateGroups();

        int SaveChanges();
    }
}