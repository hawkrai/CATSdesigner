using Application.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SerachMethods
{
    public class StudentElasticSearchMethod : SearchMethods.BaseElasticSearchMethod
    {
        private const string STUDENTS_INDEX_NAME = "students";
        public StudentElasticSearchMethod(string elastickAddress, string userName, string password)
            : base(elastickAddress, STUDENTS_INDEX_NAME, userName, password)
        { }
        public StudentElasticSearchMethod(string elastickAddress, int prefixLength, int fuzziness, string userName, string password)
            : base(elastickAddress, STUDENTS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
        public IEnumerable<Student> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<Student>(s => s
            .Size(DEFAULT_NUM_OF_RESULTS)
            .Query(q => q
                  .Match(m => m
                      .Fuzziness(Fuzziness.EditDistance(SearchFuziness))
                      .PrefixLength(PrefixLength)
                      .Field(p => p.FullName)
                      .FuzzyTranspositions(true)
                      .Query(searchStr)
                  )
                  || q
                  .Prefix(p => p.FullName, searchStr)
                  )
            );
            return searchResponse.Documents.ToList<Student>(); 
        }

        public IEnumerable<Student> SearchAll()
        {
            var searchResponse = Client.Search<Student>(s => s
            .Size(200)
            .From(0)
            .Query(q => q
                .MatchAll()

                )
            );
            Console.WriteLine("found {0} documents", searchResponse.Documents.Count);
            return searchResponse.Documents.ToList<Student>();
        }

        public void AddToIndex(Student student)
        {
            Client.Index<Student>(student,st => st.Index(STUDENTS_INDEX_NAME));
        }

        public void AddToIndex(IEnumerable<Student> students)
        {
            Client.IndexMany(students,STUDENTS_INDEX_NAME);
        }

        public void AddToIndexAsync(Student student)
        {
            Client.IndexAsync<Student>(student, st => st.Index(STUDENTS_INDEX_NAME));
        }

        public void AddToIndexAsync(IEnumerable<Student> students)
        {
            Client.IndexManyAsync(students, STUDENTS_INDEX_NAME);
        }

        public void UpdateDocument(Student student)
        {
            DeleteFromIndex(student.Id);
            AddToIndex(student);
        }

        private static CreateIndexDescriptor GetStudentMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
             .Map<Student>(m => m
               .Properties(prop => prop
                 .Text(s => s
                    .Name(n => n.FullName)
                    )
                 .Object<Group>(o => o
                    .Name(s => s.Group)
                    )
                 .Number(s => s
                    .Name(n => n.User.Id)
                    .Type(NumberType.Integer)
                    )
                 )
               )
             )
           ;
            return map;

        }
    }
}
