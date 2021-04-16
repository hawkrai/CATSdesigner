using Application.Core.Data;
using LMPlatform.Data.Infrastructure;
using LMPlatform.Data.Repositories.RepositoryContracts;
using LMPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LMPlatform.Data.Repositories
{
    public class ProtectionRepository : RepositoryBase<LmPlatformModelsContext, JobProtection>, IProtectionRepository
    {
        public ProtectionRepository(LmPlatformModelsContext dataContext) : base(dataContext) { }


        public JobProtection GetLabJobProtection(int labId, int studentId)
        {
            var jobProtection = GetBy(new Query<JobProtection>(x => x.LabId == labId && x.StudentId == studentId));
            if (jobProtection == null)
            {
                jobProtection = new JobProtection() { LabId = labId, StudentId = studentId };
                Add(jobProtection);
                DataContext.SaveChanges();
            }

            return jobProtection;
        }

    }
}
