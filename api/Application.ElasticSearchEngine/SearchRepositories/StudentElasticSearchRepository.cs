using LMPlatform.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SearchRepositories
{
    public class StudentElasticSearchRepository : BaseElasticSearchRepository
    {
       // private static string STUDENTS_INDEX_NAME => ConfigurationManager.AppSettings["StudentsIndexName"];
        private static string STUDENTS_INDEX_NAME = "students";

        public StudentElasticSearchRepository(ElasticClient client)
             : base(client, STUDENTS_INDEX_NAME)
        { }
        public StudentElasticSearchRepository(string elastickAddress, string userName, string password, int prefixLength = 3, int fuzziness = 6)
            : base(elastickAddress, STUDENTS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
       
        public IEnumerable<ElasticStudent> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<ElasticStudent>(s => s
            .Index(STUDENTS_INDEX_NAME)
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

            return searchResponse.Documents.ToList<ElasticStudent>(); 
        }
        public IEnumerable<ElasticStudent> SearchAll()
        {
            var searchResponse = Client.Search<ElasticStudent>(s => s
            .Index(STUDENTS_INDEX_NAME)
            .Size(200)
            .From(0)
            .Query(q => q
                .MatchAll()
                )
            );
            Console.WriteLine("found {0} documents", searchResponse.Documents.Count);
            return searchResponse.Documents.ToList<ElasticStudent>();
        }
        public void AddToIndex(ElasticStudent student)
        {
            Client.Index<ElasticStudent>(student,st => st.Index(STUDENTS_INDEX_NAME));
        }
        public void AddToIndex(IEnumerable<ElasticStudent> students)
        {
            Client.IndexMany(students,STUDENTS_INDEX_NAME);
        }
        public void AddToIndexAsync(ElasticStudent student)
        {
            Client.IndexAsync<ElasticStudent>(student, st => st.Index(STUDENTS_INDEX_NAME));
        }
        public void AddToIndexAsync(IEnumerable<ElasticStudent> students)
        {
            Client.IndexManyAsync(students, STUDENTS_INDEX_NAME);
        }
        public void UpdateDocument(ElasticStudent student)
        {
            DeleteFromIndex(student.Id);
            AddToIndex(student);
        }

        private static CreateIndexDescriptor GetStudentMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
             .Map<ElasticStudent>(m => m
               .Properties(prop => prop
                 .Text(s => s
                    .Name(n => n.FullName)
                    )
                 .Object<ElasticGroup>(o => o
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
