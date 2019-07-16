using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Application.Core.Data
{
    public interface IQuery<TModel>
    {
        IList<Expression<Func<TModel, bool>>> Filters { get; }

        IList<string> IncludedProperties { get; }

        IQuery<TModel> AddFilterClause(Expression<Func<TModel, bool>> filterClause);

        IQuery<TModel> Include<TResult>(Expression<Func<TModel, TResult>> includeExpression);
    }
}