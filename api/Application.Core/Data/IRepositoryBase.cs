using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core.Data
{
    public interface IRepositoryBase<TModel> where TModel : IHasIdentifyKey
    {
        #region IRepositoryBase Members

        void Delete(TModel model);
        Task DeleteAsync(TModel model);

        IPageableList<TModel> GetPageableBy(IPageableQuery<TModel> query = null);

        Task<IPageableList<TModel>> GetPageableByAsync(IPageableQuery<TModel> query = null);

        IQueryable<TModel> GetAll(IQuery<TModel> query = null);

        TModel GetBy(IQuery<TModel> query);

        Task<TModel> GetByAsync(IQuery<TModel> query);

        void Save(TModel model, Func<TModel, bool> performUpdate = null);

        Task AddOrUpdateAsync(TModel model, Func<TModel, bool> performUpdate = null);

        void Delete(IEnumerable<TModel> models);

        void Save(IEnumerable<TModel> models, Func<TModel, bool> performUpdate = null);

        #endregion IRepositoryBase Members
    }
}