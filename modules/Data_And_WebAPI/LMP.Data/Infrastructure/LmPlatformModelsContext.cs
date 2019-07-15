using System;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using LMP.Models;
using LMP.Models.BTS;
using LMP.Models.CP;
using LMP.Models.DP;
using LMP.Models.KnowledgeTesting;
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
            modelBuilder.Entity<CoursePercentagesGraph>(ent =>
            {
                ent.ToTable("CoursePercentagesGraph");

                ent.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<CoursePercentagesResult>()
                .Property(e => e.Comments)
                .HasMaxLength(50);

            modelBuilder.Entity<CourseProject>()
                .Property(e => e.Theme)
                .IsRequired()
                .HasMaxLength(2048);

            modelBuilder.Entity<DiplomProject>()
                .Property(d => d.Theme)
                .HasMaxLength(2048)
                .IsRequired();

            modelBuilder.Entity<DiplomPercentagesResult>()
                .Property(d => d.Comments)
                .HasMaxLength(50);

            modelBuilder.Entity<DiplomPercentagesGraph>()
                .ToTable("DiplomPercentagesGraph")
                .Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<WatchingTime>()
                .ToTable("WatchingTime");

            modelBuilder.Entity<TestQuestionPassResults>()
                .ToTable("TestQuestionPassResults");

            modelBuilder.Entity<Membership>(ent =>
            {
                ent.ToTable("webpages_Membership")
                    .Property(m => m.Id)
                    .HasColumnName("UserId")
                    .ValueGeneratedNever();

                ent.Property(e => e.ConfirmationToken)
                    .HasMaxLength(128);

                ent.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(128);

                ent.Property(e => e.PasswordSalt)
                    .IsRequired()
                    .HasMaxLength(128);

                ent.Property(e => e.PasswordVerificationToken)
                    .HasMaxLength(128);
            });
            
            modelBuilder.Entity<OAuthMembership>(ent =>
            {
                ent.ToTable("webpages_OAuthMembership")
                    .HasKey(k => new {k.Provider, k.ProviderUserId});

                ent.Property(e => e.Provider)
                    .HasMaxLength(30);

                ent.Property(e => e.ProviderUserId)
                    .HasMaxLength(100);

                ent.HasOne(o => o.User)
                    .WithMany(u => u.OAuthMemberships)
                    .HasForeignKey(o => o.UserId);
            });
            
            modelBuilder.Entity<Role>(ent =>
            {
                ent.ToTable("webpages_Roles")
                    .Property(m => m.Id)
                    .HasColumnName("RoleId");

                ent.Property(e => e.RoleName)
                    .HasMaxLength(256);

                ent.Property(e => e.RoleDisplayName)
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<User>(ent =>
            {
                ent.HasMany(e => e.Concept)
                    .WithOne(e => e.Author)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasOne(e => e.Membership)
                    .WithOne(e => e.User)
                    .HasForeignKey<User>(u => u.Id);

                ent.HasOne(e => e.Student)
                    .WithOne(e => e.User)
                    .HasForeignKey<User>(u => u.Id)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasOne(e => e.Lecturer)
                    .WithOne(e => e.User)
                    .HasForeignKey<User>(u => u.Id)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.Property(m => m.Id)
                    .HasColumnName("UserId");

                ent.HasMany(e => e.ProjectComments)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.ProjectUsers)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<DiplomProjectConsultationMark>(ent =>
            {
                ent.Property(e => e.Mark)
                    .HasMaxLength(2)
                    .IsFixedLength()
                    .IsUnicode(false);

                ent.Property(e => e.Comments)
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Attachment>()
                .ToTable("Attachments")
                .HasOne(a => a.Message)
                .WithMany(m => m.Attachments)
                .HasForeignKey(a => a.Message_Id);

            modelBuilder.Entity<Group>(ent =>
            {
                ent.HasMany(e => e.Students)
                    .WithOne(e => e.Group)
                    .OnDelete(DeleteBehavior.SetNull);

                modelBuilder.Entity<Group>()
                    .HasMany(e => e.SubjectGroups)
                    .WithOne(e => e.Group)
                    .HasForeignKey(e => e.GroupId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.ToTable("Groups");

                ent.HasMany(e => e.ScheduleProtectionPracticals)
                    .WithOne(e => e.Group)
                    .HasForeignKey(e => e.GroupId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.Property(g => g.SecretaryId)
                    .HasColumnName("Secretary_Id");
            });

            modelBuilder.Entity<UsersInRoles>(ent =>
            {
                ent.ToTable("webpages_UsersInRoles")
                    .HasKey(k => new {k.UserId, k.RoleId});

                ent.HasOne(e => e.User)
                    .WithMany(r => r.Roles)
                    .HasForeignKey(e => e.UserId);

                ent.HasOne(e => e.Role)
                    .WithMany(r => r.Members)
                    .HasForeignKey(e => e.RoleId);
            });

            modelBuilder.Entity<ScoObjects>().ToTable("ScoObjects");

            modelBuilder.Entity<TinCanObjects>().ToTable("TinCanObjects");

            modelBuilder.Entity<Materials>(ent =>
            {
                ent.HasOne(f => f.Folders)
                    .WithMany(f => f.Materials)
                    .HasForeignKey(m => m.Folders_Id);

                ent.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(128);
            });

            modelBuilder.Entity<Student>(ent =>
            {
                ent.HasMany(e => e.AssignedDiplomProjects)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.PercentagesResults)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.SetNull); //TODO: get rid of multiple cascade paths

                ent.HasMany(e => e.DiplomProjectConsultationMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.SetNull); //TODO: get rid of multiple cascade paths

                ent.ToTable("Students")
                    .Property(m => m.Id)
                    .HasColumnName("UserId")
                    .ValueGeneratedNever();

                ent.HasMany(e => e.SubjectStudents)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.LecturesVisitMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.ScheduleProtectionLabMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.StudentLabMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.ScheduleProtectionPracticalMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.StudentPracticalMarks)
                    .WithOne(e => e.Student)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Module>()
                .ToTable("Modules")
                .HasMany(e => e.SubjectModules)
                .WithOne(e => e.Module)
                .HasForeignKey(e => e.ModuleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SubjectModule>()
                .ToTable("SubjectModules")
                .HasMany(e => e.Folders)
                .WithOne(e => e.SubjectModule)
                .HasForeignKey(e => e.SubjectModuleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SubjectNews>().ToTable("SubjectNewses");

            modelBuilder.Entity<Message>().ToTable("Messages");

            modelBuilder.Entity<SubjectStudent>().ToTable("SubjectStudents");

            modelBuilder.Entity<UserMessages>()
                .HasOne(u => u.Author)
                .WithMany(u => u.Messages)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Lecturer>()
                .HasMany(e => e.SubjectLecturers)
                .WithOne(e => e.Lecturer)
                .HasForeignKey(e => e.LecturerId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Concept>(ent =>
            {
                ent.ToTable("Concept");

                ent.HasMany(d => d.Children);

                ent.HasMany(d => d.ConceptQuestions);
            });

            modelBuilder.Entity<SubjectGroup>(ent =>
            {
                ent.ToTable("SubjectGroups");

                ent.HasMany(e => e.SubGroups)
                    .WithOne(e => e.SubjectGroup)
                    .HasForeignKey(e => e.SubjectGroupId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.SubjectStudents)
                    .WithOne(e => e.SubjectGroup)
                    .HasForeignKey(e => e.SubjectGroupId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ConceptQuestions>().ToTable("ConceptQuestions");

            modelBuilder.Entity<Test>(ent =>
            {
                ent.Property(test => test.Title).IsRequired();

                ent.HasOne(test => test.Subject)
                    .WithMany(subject => subject.SubjectTests)
                    .HasForeignKey(test => test.SubjectId);

                ent.Ignore(test => test.Unlocked);
            });

            modelBuilder.Entity<Question>(ent =>
            {
                ent.Property(question => question.Title).IsRequired();

                ent.HasOne(question => question.Test)
                    .WithMany(test => test.Questions)
                    .HasForeignKey(question => question.TestId);

                ent.HasMany(e => e.ConceptQuestions)
                    .WithOne(e => e.Question)
                    .HasForeignKey(e => e.QuestionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Answer>(ent =>
            {
                ent.Property(answer => answer.Content).IsRequired();

                ent.HasOne(answer => answer.Question)
                    .WithMany(question => question.Answers)
                    .HasForeignKey(answer => answer.QuestionId);
            });
            
            modelBuilder.Entity<TestUnlock>(ent =>
            {
                ent.HasOne(e => e.Test)
                    .WithMany(test => test.TestUnlocks)
                    .HasForeignKey(e => e.TestId);

                ent.HasOne(e => e.Student)
                    .WithMany(student => student.TestUnlocks)
                    .HasForeignKey(e => e.StudentId);
            });

            modelBuilder.Entity<Subject>(ent =>
            {
                ent.ToTable("Subjects");

                ent.HasMany(e => e.SubjectModules)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.SubjectGroups)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.SubjectLecturers)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.Concept)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.Lectures)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.Labs)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.Practicals)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.LecturesScheduleVisitings)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.ScheduleProtectionPracticals)
                    .WithOne(e => e.Subject)
                    .HasForeignKey(e => e.SubjectId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Bug>(ent =>
            {
                ent.HasOne(e => e.Reporter)
                    .WithMany(e => e.Bugs)
                    .HasForeignKey(e => e.ReporterId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasOne(e => e.AssignedDeveloper)
                    .WithMany(e => e.DeveloperBugs)
                    .HasForeignKey(e => e.AssignedDeveloperId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.ToTable("Bugs");
            });

            modelBuilder.Entity<BugStatus>()
                .ToTable("BugStatuses")
                .HasMany(e => e.Bug)
                .WithOne(e => e.Status)
                .HasForeignKey(e => e.StatusId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ScheduleProtectionPractical>()
                .HasMany(e => e.ScheduleProtectionPracticalMarks)
                .WithOne(e => e.ScheduleProtectionPractical)
                .HasForeignKey(e => e.ScheduleProtectionPracticalId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Project>(ent =>
            {
                ent.ToTable("Projects");

                ent.HasOne(e => e.Creator)
                    .WithMany(e => e.Projects)
                    .HasForeignKey(e => e.CreatorId)
                    .OnDelete(DeleteBehavior.SetNull);

                ent.HasMany(e => e.ProjectComments)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.ProjectUsers)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.Bugs)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.Property(e => e.Title)
                    .IsRequired();
            });

            modelBuilder.Entity<SubGroup>(ent =>
            {
                ent.HasMany(e => e.SubjectStudents)
                    .WithOne(e => e.SubGroup)
                    .HasForeignKey(e => e.SubGroupId)
                    .OnDelete(DeleteBehavior.Cascade);

                ent.HasMany(e => e.ScheduleProtectionLabs)
                    .WithOne(e => e.SubGroup)
                    .HasForeignKey(e => e.SuGroupId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BugSymptom>()
                .ToTable("BugSymptoms")
                .HasMany(e => e.Bug)
                .WithOne(e => e.Symptom)
                .HasForeignKey(e => e.SymptomId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Practical>()
                .HasMany(e => e.StudentPracticalMarks)
                .WithOne(e => e.Practical)
                .HasForeignKey(e => e.PracticalId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProjectRole>()
                .ToTable("ProjectRoles")
                .HasMany(e => e.ProjectUser)
                .WithOne(e => e.ProjectRole)
                .HasForeignKey(e => e.ProjectRoleId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BugSeverity>()
                .ToTable("BugSeverities")
                .HasMany(e => e.Bug)
                .WithOne(e => e.Severity)
                .HasForeignKey(e => e.SeverityId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LecturesScheduleVisiting>()
                .HasMany(e => e.LecturesVisitMarks)
                .WithOne(e => e.LecturesScheduleVisiting)
                .HasForeignKey(e => e.LecturesScheduleVisitingId)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<ScheduleProtectionLabs>()
                .HasMany(e => e.ScheduleProtectionLabMarks)
                .WithOne(e => e.ScheduleProtectionLab)
                .HasForeignKey(e => e.ScheduleProtectionLabId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Labs>().HasMany(e => e.StudentLabMarks)
                .WithOne(e => e.Lab)
                .HasForeignKey(e => e.LabId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ProjectUser>().ToTable("ProjectUsers");

            modelBuilder.Entity<DiplomProjectConsultationDate>()
                .HasMany(e => e.DiplomProjectConsultationMarks)
                .WithOne(e => e.DiplomProjectConsultationDate)
                .HasForeignKey(e => e.ConsultationDateId);

            modelBuilder.Entity<CourseProjectConsultationDate>()
                .HasMany(e => e.CourseProjectConsultationMarks)
                .WithOne(e => e.CourseProjectConsultationDate)
                .HasForeignKey(e => e.ConsultationDateId);

            modelBuilder.Entity<TestPassResult>()
                .HasOne(passResult => passResult.User)
                .WithMany(user => user.TestPassResults)
                .HasForeignKey(passResult => passResult.StudentId);

            modelBuilder.Entity<AnswerOnTestQuestion>()
                .HasOne(answer => answer.User)
                .WithMany(user => user.UserAnswersOnTestQuestions)
                .HasForeignKey(answer => answer.UserId);

            modelBuilder.Entity<CourseProjectConsultationMark>(ent =>
            {
                ent.Property(e => e.Mark)
                    .HasMaxLength(2);

                ent.Property(e => e.Comments)
                    .HasMaxLength(50);
            });


            //modelBuilder.Entity<Concept>()
            //    .WithMany<WatchingTime>(e => e.WatchingTime)
            //    .WithOne(e => e.Concept);

            // modelBuilder.Entity<ProjectMatrixRequirement>().ToTable("ProjectMatrixRequirements");

            //modelBuilder.Entity<ProjectMatrixRequirement>()
            //    .HasOne(e => e.Project)
            //    .WithMany(e => e.MatrixRequirements)
            //    .HasForeignKey(e => e.ProjectId)
            //    .OnDelete(DeleteBehavior.Cascade);
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