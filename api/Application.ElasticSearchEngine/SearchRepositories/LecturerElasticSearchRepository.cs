
using LMPlatform.ElasticDataModels;
using LMPlatform.Models;
using Nest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;


namespace Application.ElasticSearchEngine.SearchRepositories
{
    public class LecturerElasticSearchRepository : BaseElasticSearchRepository
    {
        private static string LECTURERS_INDEX_NAME => ConfigurationManager.AppSettings["ElasticLecturersIndexName"];

        public LecturerElasticSearchRepository(ElasticClient client)
            : base(client, LECTURERS_INDEX_NAME)
        { }
        public LecturerElasticSearchRepository(string elastickAddress, string userName, string password, int prefixLength = 3, int fuzziness = 6)
            : base(elastickAddress, LECTURERS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
    
        public IEnumerable<ElasticLecturer> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<ElasticLecturer>(s => s
            .Index(LECTURERS_INDEX_NAME)
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

            return searchResponse.Documents.ToList<ElasticLecturer>();
        }
        public IEnumerable<ElasticLecturer> SearchAll()
        {
            var searchResponse = Client.Search<ElasticLecturer>(s => s
            .Index(LECTURERS_INDEX_NAME)
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
            return searchResponse.Documents.ToList<ElasticLecturer>();
        }
        public void AddToIndex(ElasticLecturer lecturer)
        {
                Client.Index<ElasticLecturer>(lecturer, st => st.Index(LECTURERS_INDEX_NAME));
        }
        public void AddToIndex(IEnumerable<ElasticLecturer> lecturers)
        {
            Client.IndexMany(lecturers, LECTURERS_INDEX_NAME);
        }
        public void AddToIndexAsync(ElasticLecturer lecturer)
        {
            Client.IndexAsync<ElasticLecturer>(lecturer, st => st.Index(LECTURERS_INDEX_NAME));
        }
        public void AddToIndexAsync(IEnumerable<ElasticLecturer> lecturers)
        {
            Client.IndexManyAsync(lecturers, LECTURERS_INDEX_NAME);
        }
        public void UpdateDocument(ElasticLecturer lecturer)
        {
            DeleteFromIndex(lecturer.Id);
            AddToIndex(lecturer);
        }
    
        internal static CreateIndexDescriptor GetLecturerMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Map<ElasticLecturer>(m => m
                    .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                         )
                        .Text(s => s
                            .Name(n => n.FullName)
                         )
                        .Text(o => o
                            .Name(s => s.Skill)
                         )
                        .Object<User>(u => u
                            .Dynamic(false)
                            .Name(n => n.User)
                            .Properties(pr => pr
                                .Text(t => t
                                    .Name(n => n.SkypeContact)
                                 )
                                .Text(t => t
                                    .Name(n => n.Phone)
                                 )
                                .Text(t => t
                                    .Name(n => n.About)
                                )
                            )
                        )
                    )
                )
           ;
            return map;
        }
    }
}
    

