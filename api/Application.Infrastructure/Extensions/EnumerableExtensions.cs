using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.Extensions
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> MoveItem<T>(this IEnumerable<T> enumerable, int prevIndex, int curIndex)
        {
            if (prevIndex < curIndex)
            {
                return enumerable.Take(prevIndex)
                        .Concat(enumerable.Skip(prevIndex + 1).Take(curIndex - prevIndex))
                        .Append(enumerable.ElementAt(prevIndex))
                        .Concat(enumerable.Skip(curIndex + 1).Take(enumerable.Count() - curIndex - 1));
            }
            return enumerable.Take(curIndex)
                        .Append(enumerable.ElementAt(prevIndex))
                        .Concat(enumerable.Skip(curIndex).Take(prevIndex - curIndex))
                        .Concat(enumerable.Skip(prevIndex + 1).Take(enumerable.Count() - prevIndex - 1));
        }
    }
}
