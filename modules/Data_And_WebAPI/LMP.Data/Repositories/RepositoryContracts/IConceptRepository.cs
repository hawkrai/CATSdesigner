using System;
using System.Collections.Generic;
using Application.Core.Data;
using LMP.Models;

namespace LMP.Data.Repositories.RepositoryContracts
{
    public interface IConceptRepository : IRepositoryBase<Concept>
    {
        Concept GetById(Int32 id);

        Concept GetTreeConceptByElementId(Int32 elementId);

        IEnumerable<Concept> GetRootElementsByAuthorId(Int32 authorId);

        IEnumerable<Concept> GetRootElementsBySubjectId(Int32 subjectId);

        IEnumerable<Concept> GetByParentId(Int32 id);

        IEnumerable<Concept> GetBySubjectId(Int32 subjectId);

        IEnumerable<Concept> GetByAuthorId(Int32 authorId);

        void Remove(Int32 id, Boolean removeChildren);
    }
}
