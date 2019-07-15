using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using LMP.Models.From_LMP_Models;
using LMP.Models.From_LMP_Models.BTS;
using LMP.Models.From_LMP_Models.CP;
using LMP.Models.From_LMP_Models.DP;
using LMP.Models.From_LMP_Models.KnowledgeTesting;
using Microsoft.EntityFrameworkCore;

namespace LMP.Data.Infrastructure
{
    public class LmPlatformModelsContext : DbContext, IDpContext, ICpContext
    {
        #region Constructors

        public LmPlatformModelsContext()
        {
        }

        public LmPlatformModelsContext(DbContextOptions<LmPlatformModelsContext> options)
            : base(options)
        {
        }

        #endregion Constructors

        #region Overrides of DbContext

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=localhost;Database=LMPlatform;User ID=lmsuser;Password=lmsuser");
            }
        }

        #endregion

        #region DbSets

        public DbSet<WatchingTime> WatchingTime { get; set; }

        public DbSet<TestQuestionPassResults> TestQuestionPassResults { get; set; }

        public DbSet<Membership> Membership { get; set; }

        public DbSet<OAuthMembership> OAuthMembership { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Student> Students { get; set; }

        public DbSet<ScoObjects> ScoObjects { get; set; }

        public DbSet<TinCanObjects> TinCanObjects { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Subject> Subjects { get; set; }

        public DbSet<Module> Modules { get; set; }

        public DbSet<Materials> Materials { get; set; }

        public DbSet<Concept> Concept { get; set; }

        public DbSet<Folders> Folders { get; set; }

        public DbSet<SubjectGroup> SubjectGroups { get; set; }

        public DbSet<Lecturer> Lecturers { get; set; }

        public DbSet<SubjectModule> SubjectModules { get; set; }

        public DbSet<SubjectNews> SubjectNewses { get; set; }

        public DbSet<Attachment> Attachments { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<UserMessages> UserMessages { get; set; }

        public DbSet<SubGroup> SubGroups { get; set; }

        public DbSet<SubjectStudent> SubjectStudents { get; set; }

        public DbSet<Lectures> Lectures { get; set; }

        public DbSet<TestPassResult> TestPassResults { get; set; }

        public DbSet<Labs> Labs { get; set; }

        public DbSet<Practical> Practicals { get; set; }

        public DbSet<ScheduleProtectionLabs> ScheduleProtectionLabs { get; set; }

        public DbSet<LecturesVisitMark> LecturesVisitMarks { get; set; }

        public DbSet<ScheduleProtectionLabMark> ScheduleProtectionLabMarks { get; set; }

        public DbSet<StudentLabMark> StudentLabMarks { get; set; }

        public DbSet<ScheduleProtectionPractical> ScheduleProtectionPracticals { get; set; }

        public DbSet<ScheduleProtectionPracticalMark> ScheduleProtectionPracticalMarks { get; set; }

        public DbSet<StudentPracticalMark> StudentPracticalMarks { get; set; }

        public DbSet<UserLabFiles> UserLabFiles { get; set; }

        public DbSet<AccessCode> AccessCodes { get; set; }

        public DbSet<Project> Projects { get; set; }

        public DbSet<ProjectUser> ProjectUsers { get; set; }

        public DbSet<ProjectRole> ProjectRoles { get; set; }

        public DbSet<Bug> Bugs { get; set; }

        public DbSet<BugStatus> BugStatuses { get; set; }

        public DbSet<BugSeverity> BugSeverities { get; set; }

        public DbSet<BugSymptom> BugSymptoms { get; set; }

        //public DbSet<ProjectMatrixRequirement> ProjectMatrixRequirements { get; set; }

        public virtual DbSet<DiplomProjectNews> DiplomProjectNews { get; set; }

        public virtual DbSet<AssignedDiplomProject> AssignedDiplomProjects { get; set; }

        public virtual DbSet<DiplomPercentagesGraph> DiplomPercentagesGraphs { get; set; }

        public virtual DbSet<DiplomPercentagesGraphToGroup> DiplomPercentagesGraphToGroups { get; set; }

        public virtual DbSet<DiplomPercentagesResult> DiplomPercentagesResults { get; set; }

        public virtual DbSet<DiplomProjectConsultationDate> DiplomProjectConsultationDates { get; set; }

        public virtual DbSet<DiplomProjectConsultationMark> DiplomProjectConsultationMarks { get; set; }

        public virtual DbSet<DiplomProjectGroup> DiplomProjectGroups { get; set; }

        public virtual DbSet<DiplomProject> DiplomProjects { get; set; }

        public virtual DbSet<DiplomProjectTaskSheetTemplate> DiplomProjectTaskSheetTemplates { get; set; }

        public virtual DbSet<CourseProjectNews> CourseProjectNews { get; set; }

        public virtual DbSet<CourseProject> CourseProjects { get; set; }

        public virtual DbSet<AssignedCourseProject> AssignedCourseProjects { get; set; }

        public virtual DbSet<ConceptQuestions> ConceptQuestions { get; set; }

        public virtual DbSet<CourseProjectGroup> CourseProjectGroups { get; set; }

        public virtual DbSet<CoursePercentagesGraph> CoursePercentagesGraphs { get; set; }

        public virtual DbSet<CoursePercentagesGraphToGroup> CoursePercentagesGraphToGroups { get; set; }

        public virtual DbSet<CoursePercentagesResult> CoursePercentagesResults { get; set; }

        public virtual DbSet<CourseProjectConsultationDate> CourseProjectConsultationDates { get; set; }

        public virtual DbSet<CourseProjectConsultationMark> CourseProjectConsultationMarks { get; set; }

        public virtual DbSet<CourseProjectTaskSheetTemplate> CourseProjectTaskSheetTemplates { get; set; }

        #endregion

        #region Models configing

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WatchingTime>()
                .ToTable("WatchingTime");
            modelBuilder.Entity<TestQuestionPassResults>()
                .ToTable("TestQuestionPassResults");

            modelBuilder.Entity<Membership>().ToTable("webpages_Membership")
                .Property(m => m.Id)
                .HasColumnName("UserId")
                .ValueGeneratedNever();
            modelBuilder.Entity<OAuthMembership>()
                .ToTable("webpages_OAuthMembership")
                .HasKey(k => new { k.Provider, k.ProviderUserId});
            modelBuilder.Entity<Role>().ToTable("webpages_Roles")
                .Property(m => m.Id)
                .HasColumnName("RoleId");
            modelBuilder.Entity<User>().ToTable("Users")
                .Property(m => m.Id)
                .HasColumnName("UserId");
            modelBuilder.Entity<Student>().ToTable("Students")
                .Property(m => m.Id)
                .HasColumnName("UserId")
                .ValueGeneratedNever();
            modelBuilder.Entity<Group>().ToTable("Groups");
            modelBuilder.Entity<ScoObjects>().ToTable("ScoObjects");
            modelBuilder.Entity<TinCanObjects>().ToTable("TinCanObjects");
            modelBuilder.Entity<Subject>().ToTable("Subjects");
            modelBuilder.Entity<Module>().ToTable("Modules");
            modelBuilder.Entity<SubjectGroup>().ToTable("SubjectGroups");
            modelBuilder.Entity<SubjectModule>().ToTable("SubjectModules");
            modelBuilder.Entity<SubjectNews>().ToTable("SubjectNewses");
            modelBuilder.Entity<Attachment>().ToTable("Attachments");
            modelBuilder.Entity<Attachment>()
                .HasOne(a => a.Message)
                .WithMany(m => m.Attachments)
                .HasForeignKey(a => a.Message_Id);

            modelBuilder.Entity<Materials>()
                .HasOne(f => f.Folders)
                .WithMany(f => f.Materials)
                .HasForeignKey(m => m.Folders_Id);

            modelBuilder.Entity<Message>().ToTable("Messages");
            modelBuilder.Entity<SubjectStudent>().ToTable("SubjectStudents");
            modelBuilder.Entity<UserMessages>()
                .HasOne(u => u.Author)
                .WithMany(u => u.Messages)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UsersInRoles>()
                .ToTable("webpages_UsersInRoles")
                .HasKey(k => new { k.UserId, k.RoleId });

            modelBuilder.Entity<UsersInRoles>()
                .HasOne(e => e.User)
                .WithMany(r => r.Roles)
                .HasForeignKey(e => e.UserId);

            modelBuilder.Entity<UsersInRoles>()
                .HasOne(e => e.Role)
                .WithMany(r => r.Members)
                .HasForeignKey(e => e.RoleId);

            modelBuilder.Entity<User>()
                .HasOne(e => e.Membership)
                .WithOne(e => e.User)
                .HasForeignKey<User>(u => u.Id);

            modelBuilder.Entity<Group>()
                .HasMany(e => e.Students)
                .WithOne(e => e.Group)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>()
                .HasOne(e => e.Student)
                .WithOne(e => e.User)
                .HasForeignKey<User>(u => u.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne(e => e.Lecturer)
                .WithOne(e => e.User)
                .HasForeignKey<User>(u => u.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.SubjectGroups)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Group>()
                .HasMany(e => e.SubjectGroups)
                .WithOne(e => e.Group)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.SubjectLecturers)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Lecturer>()
                .HasMany(e => e.SubjectLecturers)
                .WithOne(e => e.Lecturer)
                .HasForeignKey(e => e.LecturerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.SubjectModules)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Concept>().ToTable("Concept");
            modelBuilder.Entity<Concept>().HasMany(d => d.Children);
            modelBuilder.Entity<Concept>().HasMany(d => d.ConceptQuestions);

            //modelBuilder.Entity<Concept>()
            //    .WithMany<WatchingTime>(e => e.WatchingTime)
            //    .WithOne(e => e.Concept);

            modelBuilder.Entity<ConceptQuestions>().ToTable("ConceptQuestions");

            modelBuilder.Entity<Question>().HasMany(e => e.ConceptQuestions)
                .WithOne(e => e.Question)
                .HasForeignKey(e => e.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.Concept)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<User>().HasMany(e => e.Concept)
                .WithOne(e => e.Author)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SubjectModule>().HasMany(e => e.Folders)
                .WithOne(e => e.SubjectModule)
                .HasForeignKey(e => e.SubjectModuleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Module>().HasMany(e => e.SubjectModules)
                .WithOne(e => e.Module)
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SubGroup>().HasMany(e => e.SubjectStudents)
                .WithOne(e => e.SubGroup)
                .HasForeignKey(e => e.SubGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SubjectGroup>().HasMany(e => e.SubGroups)
                .WithOne(e => e.SubjectGroup)
                .HasForeignKey(e => e.SubjectGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>().HasMany(e => e.SubjectStudents)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SubjectGroup>() .HasMany(e => e.SubjectStudents)
                .WithOne(e => e.SubjectGroup)
                .HasForeignKey(e => e.SubjectGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Subject>() .HasMany(e => e.Lectures)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.Labs)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.Practicals)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SubGroup>()
                .HasMany(e => e.ScheduleProtectionLabs)
                .WithOne(e => e.SubGroup)
                .HasForeignKey(e => e.SuGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Subject>()
                .HasMany(e => e.LecturesScheduleVisitings)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LecturesScheduleVisiting>()
                .HasMany(e => e.LecturesVisitMarks)
                .WithOne(e => e.LecturesScheduleVisiting)
                .HasForeignKey(e => e.LecturesScheduleVisitingId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Student>()
                .HasMany(e => e.LecturesVisitMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>()
                .HasMany(e => e.ScheduleProtectionLabMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ScheduleProtectionLabs>()
                .HasMany(e => e.ScheduleProtectionLabMarks)
                .WithOne(e => e.ScheduleProtectionLab)
                .HasForeignKey(e => e.ScheduleProtectionLabId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Student>().HasMany(e => e.StudentLabMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Labs>().HasMany(e => e.StudentLabMarks)
                .WithOne(e => e.Lab)
                .HasForeignKey(e => e.LabId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Group>().HasMany(e => e.ScheduleProtectionPracticals)
                .WithOne(e => e.Group)
                .HasForeignKey(e => e.GroupId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Subject>().HasMany(e => e.ScheduleProtectionPracticals)
                .WithOne(e => e.Subject)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Student>().HasMany(e => e.ScheduleProtectionPracticalMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ScheduleProtectionPractical>().HasMany(e => e.ScheduleProtectionPracticalMarks)
                .WithOne(e => e.ScheduleProtectionPractical)
                .HasForeignKey(e => e.ScheduleProtectionPracticalId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Student>().HasMany(e => e.StudentPracticalMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Practical>().HasMany(e => e.StudentPracticalMarks)
                .WithOne(e => e.Practical)
                .HasForeignKey(e => e.PracticalId)
                .OnDelete(DeleteBehavior.SetNull);

            MapKnowledgeTestingEntities(modelBuilder);
            MapBTSEntities(modelBuilder);
            MapDpEntities(modelBuilder);
        }

        private void MapBTSEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>().ToTable("Projects");
            modelBuilder.Entity<ProjectUser>().ToTable("ProjectUsers");
            modelBuilder.Entity<ProjectRole>().ToTable("ProjectRoles");
            modelBuilder.Entity<Bug>().ToTable("Bugs");
            modelBuilder.Entity<BugStatus>().ToTable("BugStatuses");
            modelBuilder.Entity<BugSeverity>().ToTable("BugSeverities");
            modelBuilder.Entity<BugSymptom>().ToTable("BugSymptoms");
           // modelBuilder.Entity<ProjectMatrixRequirement>().ToTable("ProjectMatrixRequirements");

            modelBuilder.Entity<Project>()
                .HasOne(e => e.Creator)
                .WithMany(e => e.Projects)
                .HasForeignKey(e => e.CreatorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Project>()
                .HasMany(e => e.ProjectComments)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.ProjectComments)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(e => e.ProjectUsers)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(e => e.ProjectUsers)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProjectRole>()
                .HasMany(e => e.ProjectUser)
                .WithOne(e => e.ProjectRole)
                .HasForeignKey(e => e.ProjectRoleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Project>()
                .HasMany(e => e.Bugs)
                .WithOne(e => e.Project)
                .HasForeignKey(e => e.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BugStatus>()
                .HasMany(e => e.Bug)
                .WithOne(e => e.Status)
                .HasForeignKey(e => e.StatusId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BugSeverity>()
                .HasMany(e => e.Bug)
                .WithOne(e => e.Severity)
                .HasForeignKey(e => e.SeverityId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BugSymptom>()
                .HasMany(e => e.Bug)
                .WithOne(e => e.Symptom)
                .HasForeignKey(e => e.SymptomId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Bug>()
                .HasOne(e => e.Reporter)
                .WithMany(e => e.Bugs)
                .HasForeignKey(e => e.ReporterId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Bug>()
                .HasOne(e => e.AssignedDeveloper)
                .WithMany(e => e.DeveloperBugs)
                .HasForeignKey(e => e.AssignedDeveloperId)
                .OnDelete(DeleteBehavior.SetNull);

            //modelBuilder.Entity<ProjectMatrixRequirement>()
            //    .HasOne(e => e.Project)
            //    .WithMany(e => e.MatrixRequirements)
            //    .HasForeignKey(e => e.ProjectId)
            //    .OnDelete(DeleteBehavior.Cascade);
        }

        private void MapKnowledgeTestingEntities(ModelBuilder modelBuilder)
        {
            var testEntity = modelBuilder.Entity<Test>();
            testEntity.Property(test => test.Title).IsRequired();
            testEntity.HasOne(test => test.Subject)
                .WithMany(subject => subject.SubjectTests)
                .HasForeignKey(test => test.SubjectId);
            testEntity.Ignore(test => test.Unlocked);

            var questionEntity = modelBuilder.Entity<Question>();
            questionEntity.Property(question => question.Title).IsRequired();
            questionEntity.HasOne(question => question.Test)
                .WithMany(test => test.Questions)
                .HasForeignKey(question => question.TestId);

            var answerEntity = modelBuilder.Entity<Answer>();
            answerEntity.Property(answer => answer.Content).IsRequired();
            answerEntity.HasOne(answer => answer.Question)
                .WithMany(question => question.Answers)
                .HasForeignKey(answer => answer.QuestionId);


            var testUnlockEntity = modelBuilder.Entity<TestUnlock>();
            testUnlockEntity.HasOne(testunlock => testunlock.Test)
                .WithMany(test => test.TestUnlocks)
                .HasForeignKey(testunlock => testunlock.TestId);
            testUnlockEntity.HasOne(testunlock => testunlock.Student)
                .WithMany(student => student.TestUnlocks)
                .HasForeignKey(testunlock => testunlock.StudentId);

            var testPassResultEntity = modelBuilder.Entity<TestPassResult>();
            testPassResultEntity.HasOne(passResult => passResult.User)
                .WithMany(user => user.TestPassResults)
                .HasForeignKey(passResult => passResult.StudentId);

            var studentAnswerOnTestQuestionEntity = modelBuilder.Entity<AnswerOnTestQuestion>();
            studentAnswerOnTestQuestionEntity.HasOne(answer => answer.User)
                .WithMany(user => user.UserAnswersOnTestQuestions)
                .HasForeignKey(answer => answer.UserId);
        }

        protected void MapDpEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DiplomProjectConsultationDate>()
                .HasMany(e => e.DiplomProjectConsultationMarks)
                .WithOne(e => e.DiplomProjectConsultationDate)
                .HasForeignKey(e => e.ConsultationDateId);

            modelBuilder.Entity<CourseProjectConsultationDate>()
                .HasMany(e => e.CourseProjectConsultationMarks)
                .WithOne(e => e.CourseProjectConsultationDate)
                .HasForeignKey(e => e.ConsultationDateId);

            modelBuilder.Entity<Student>()
                .HasMany(e => e.AssignedDiplomProjects)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Student>()
                .HasMany(e => e.PercentagesResults)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.SetNull); //TODO: get rid of multiple cascade paths

            modelBuilder.Entity<Student>()
                .HasMany(e => e.DiplomProjectConsultationMarks)
                .WithOne(e => e.Student)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.SetNull); //TODO: get rid of multiple cascade paths

            modelBuilder.Entity<DiplomProjectConsultationMark>()
                .Property(e => e.Mark)
                .IsFixedLength()
                .IsUnicode(false);
        }

        #endregion Models configing
        
        #region DataContext Members

        public IQueryable<Student> GetGraduateStudents()
        {
            return Students.Where(StudentIsGraduate);
        }

        public Expression<Func<Student, bool>> StudentIsGraduate
        {
            get
            {
                var currentYearStr = DateTime.Now.Year.ToString(CultureInfo.InvariantCulture);
                var nextYearStr = DateTime.Now.AddYears(1).Year.ToString(CultureInfo.InvariantCulture);

                return x =>
                    x.Group.GraduationYear == currentYearStr && DateTime.Now.Month <= 9 ||
                    x.Group.GraduationYear == nextYearStr && DateTime.Now.Month >= 9;
            }
        }

        public IQueryable<Group> GetGraduateGroups()
        {
            var currentYearStr = DateTime.Now.Year.ToString(CultureInfo.InvariantCulture);
            var nextYearStr = DateTime.Now.AddYears(1).Year.ToString(CultureInfo.InvariantCulture);

            return Groups.Where(x =>
                x.GraduationYear == currentYearStr && DateTime.Now.Month <= 9 ||
                x.GraduationYear == nextYearStr && DateTime.Now.Month >= 9);
        }

        #endregion DataContext Members
    }
}