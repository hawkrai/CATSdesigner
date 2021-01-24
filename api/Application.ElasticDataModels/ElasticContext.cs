namespace Application.ElasticDataModels
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class ElasticContext : DbContext
    {
        public ElasticContext()
            : base("name=ElasticContext")
        {
        }

        public ElasticContext(string connectionStringName)
            : base(connectionStringName)
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<Lecturer> Lecturers { get; set; }
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {

            modelBuilder.Entity<User>().Map(m => m.ToTable("Users"))
                .Property(m => m.Id)
                .HasColumnName("UserId");
            modelBuilder.Entity<Student>().Map(m => m.ToTable("Students"))
                .Property(m => m.Id)
                .HasColumnName("UserId")
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
            modelBuilder.Entity<Group>().Map(m => m.ToTable("Groups"));
            modelBuilder.Entity<Project>().Map(m => m.ToTable("Projects"));

            modelBuilder.Entity<Group>()
                .HasMany(e => e.Students)
                .WithRequired(e => e.Group)
                .HasForeignKey(e => e.GroupId)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Lecturer>()
                .HasMany(e => e.Groups)
                .WithOptional(e => e.Secretary)
                .HasForeignKey(e => e.SecretaryId);

            modelBuilder.Entity<User>()
                .Property(e => e.Answer)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .HasOptional(e => e.Lecturer)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete();

            modelBuilder.Entity<User>()
                .HasMany(e => e.Projects)
                .WithRequired(e => e.User)
                .HasForeignKey(e => e.CreatorId)
                .WillCascadeOnDelete(false);

     

            modelBuilder.Entity<User>()
                .HasOptional(e => e.Student)
                .WithRequired(e => e.User)
                .WillCascadeOnDelete();

            Database.SetInitializer<ElasticContext>(null);
            base.OnModelCreating(modelBuilder);
        }
    }
}
