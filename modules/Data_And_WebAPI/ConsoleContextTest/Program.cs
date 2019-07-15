using LMP.Data.Infrastructure;
using System.Collections.Generic;
using System.Linq;

namespace ConsoleContextTest
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var ctx = new LmPlatformModelsContext())
            {
                var props = ctx.GetType().GetProperties().Where(p => p.PropertyType.ToString().Contains("DbSet"));

                foreach (var propertyInfo in props)
                {
                    ((IEnumerable<dynamic>)propertyInfo.GetValue(ctx)).ToArray();
                }
            }
        }
    }
}
