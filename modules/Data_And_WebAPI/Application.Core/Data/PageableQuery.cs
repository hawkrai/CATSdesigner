using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Application.Core.Data
{
    public class PageableQuery<TModel> : Query<TModel>, IPageableQuery<TModel>
    {
        private IPageInfo _pageInfo;

        public PageableQuery(IPageInfo pageInfo, params Expression<Func<TModel, bool>>[] filterClauses)
            : base(filterClauses)
        {
            _pageInfo = pageInfo;
        }

        public PageableQuery(params Expression<Func<TModel, bool>>[] filterClauses)
            : base(filterClauses)
        {
            _pageInfo = new PageInfo();
        }

        public IPageInfo PageInfo => _pageInfo ?? (_pageInfo = new PageInfo());

        public IList<ISortCriteria> SortCriterias { get; } = new List<ISortCriteria>();

        public IPageableQuery<TModel> OrderBy(IEnumerable<ISortCriteria> sortCriterias)
        {
            if (sortCriterias != null)
                foreach (var sortCriteria in sortCriterias)
                    SortCriterias.Add(sortCriteria);

            return this;
        }

        public new IPageableQuery<TModel> AddFilterClause(Expression<Func<TModel, bool>> filterClause)
        {
            base.AddFilterClause(filterClause);

            return this;
        }

        public new IPageableQuery<TModel> Include<TResult>(Expression<Func<TModel, TResult>> includeExpression)
        {
            base.Include(includeExpression);

            return this;
        }

        public IPageableQuery<TModel> OrderBy(ISortCriteria sortCriteria)
        {
            SortCriterias.Add(sortCriteria);

            return this;
        }
    }
}