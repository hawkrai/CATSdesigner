using Application.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace Application.ElasticSearchEngine.SearchRepositories
{
    public class LecturerElasticSearchRepository : BaseElasticSearchRepository
    {
        private const string LECTURERS_INDEX_NAME = "lecturers";
        public LecturerElasticSearchRepository(string elastickAddress, string userName, string password)
            : base(elastickAddress, LECTURERS_INDEX_NAME, userName, password)
        { }
        public LecturerElasticSearchRepository(string elastickAddress, int prefixLength, int fuzziness, string userName, string password)
            : base(elastickAddress, LECTURERS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
        public IEnumerable<Lecturer> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<Lecturer>(s => s
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
            ); ;
            return searchResponse.Documents.ToList<Lecturer>();
        }

        public IEnumerable<Lecturer> SearchAll()
        {
            var searchResponse = Client.Search<Lecturer>(s => s
            .Size(200)
            .From(0)
            .Query(q => q
                .Nested(n=>n
                    .Query(u=>u
                        .MatchAll()
                        )
                    )

                )
            );
            Console.WriteLine("found {0} documents", searchResponse.Documents.Count);
            return searchResponse.Documents.ToList<Lecturer>();
        }

        public void AddToIndex(Lecturer lecturer)
        {

                Client.Index<Lecturer>(lecturer, st => st.Index(LECTURERS_INDEX_NAME));

        }

        public void AddToIndex(IEnumerable<Lecturer> lecturers)
        {
            Client.IndexMany(lecturers, LECTURERS_INDEX_NAME);
        }

        public void AddToIndexAsync(Lecturer lecturer)
        {

            Client.IndexAsync<Lecturer>(lecturer, st => st.Index(LECTURERS_INDEX_NAME));

        }

        public void AddToIndexAsync(IEnumerable<Lecturer> lecturers)
        {
            Client.IndexManyAsync(lecturers, LECTURERS_INDEX_NAME);
        }
        public void UpdateDocument(Lecturer lecturer)
        {
            DeleteFromIndex(lecturer.Id);
            AddToIndex(lecturer);
        }

        private static CreateIndexDescriptor GetLecturerMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
             .Map<Lecturer>(m => m
               .Properties(prop => prop
                 .Text(s => s
                    .Name(n => n.FullName)
                    )
                 .Boolean(o => o
                    .Name(s => s.IsActive)
                    )
                 .Number(s => s
                    .Name(n => n.User.Id)
                    .Type(NumberType.Integer)
                    )
                 .Text(s => s
                    .Name(n => n.User.Phone)
                    )
                 .Date(d => d
                    .Name(n => n.User.LastLogin)
                 )
                 )
                .AutoMap()
               )
             )
           ;
            return map;

        }
    }
}
    

