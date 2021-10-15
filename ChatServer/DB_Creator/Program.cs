using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DB_Creator
{
    class Program : IDesignTimeDbContextFactory<RepositoryContext>
    {
        public RepositoryContext CreateDbContext(string[] args)
        {
            var configurationBuilder = new ConfigurationBuilder()
              .SetBasePath(Directory.GetCurrentDirectory())
              .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            IConfigurationRoot configuration = configurationBuilder.Build();
            string connectionString = configuration.GetConnectionString("DefaultConnection");

            DbContextOptionsBuilder<RepositoryContext> optionsBuilder = new DbContextOptionsBuilder<RepositoryContext>().UseSqlServer(connectionString);

            return new RepositoryContext(optionsBuilder.Options);
        }

        static void Main(string[] args)
        {
            Program p = new Program();

            using (RepositoryContext sc = p.CreateDbContext(null))
            {
                sc.Database.Migrate();
                sc.SaveChanges();
            }
        }
    }
}