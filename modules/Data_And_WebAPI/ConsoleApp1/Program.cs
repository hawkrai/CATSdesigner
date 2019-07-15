using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using LMP.Data.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var ctx = new LmPlatformModelsContext())
            {
                var props = ctx.GetType().GetProperties().Where(p => p.PropertyType.ToString().Contains("DbSet"));

                int i = 0;
                int count = props.Count();

                foreach (var propertyInfo in props)
                {
                    i++;
                    ((IEnumerable<object>) propertyInfo.GetValue(ctx)).ToArray();
                }

                ctx.GetType();


                ctx.AccessCodes.ToArray();
                ctx.AssignedCourseProjects.ToArray();
                ctx.AssignedDiplomProjects.ToArray();
                ctx.Attachments.ToArray();


            }

            Console.WriteLine("Hello World!");
        }
    }
}
