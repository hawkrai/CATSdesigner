
using LMPlatform.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SearchRepositories
{
    public class GroupElasticSearchRepository : BaseElasticSearchRepository
    {
        private const string GROUPS_INDEX_NAME = "groups";
        public GroupElasticSearchRepository(string elastickAddress,string userName, string password)
            : base(elastickAddress, GROUPS_INDEX_NAME, userName, password)
        { }
        public GroupElasticSearchRepository(string elastickAddress, int prefixLength, int fuzziness, string userName, string password)
            : base(elastickAddress, GROUPS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
        public IEnumerable<ElasticGroup> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<ElasticGroup>(s => s
            .Size(DEFAULT_NUM_OF_RESULTS)

            .Query(q => q
                      .Match(m => m
                          .Fuzziness(Fuzziness.EditDistance(SearchFuziness))
                          .PrefixLength(PrefixLength)
                          .Field(p => p.Name)
                          .FuzzyTranspositions(true)
                          .Query(searchStr)
                      )
                      || q
                      .Prefix(p => p.Name, searchStr)
             )   
            ); 
            return searchResponse.Documents.ToList<ElasticGroup>();
        }

        public IEnumerable<ElasticGroup> SearchAll()
        {
            var searchResponse = Client.Search<ElasticGroup>(s => s
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
            return searchResponse.Documents.ToList<ElasticGroup>();
        }

        public void AddToIndex(ElasticGroup group)
        {
                Client.Index<ElasticGroup>(group, st => st.Index(GROUPS_INDEX_NAME));
        }

        public void AddToIndex(IEnumerable<ElasticGroup> groups)
        {
            Client.IndexMany(groups, GROUPS_INDEX_NAME);
        }

        public void AddToIndexAsync(ElasticGroup group)
        {

            Client.IndexAsync<ElasticGroup>(group, st => st.Index(GROUPS_INDEX_NAME));

        }

        public void AddToIndexAsync(IEnumerable<ElasticGroup> groups)
        {
            Client.IndexManyAsync(groups, GROUPS_INDEX_NAME);
        }
        public void UpdateDocument(ElasticGroup group)
        {
            DeleteFromIndex(group.Id);
            AddToIndex(group);
        }

        private static CreateIndexDescriptor GetaGroupMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<ElasticGroup>(m => m
                    .Properties(prop => prop
                        .Number(num => num
                            .Name(n => n.Id)
                            )
                        .Number(num => num
                            .Name(n => n.SecretaryId)
                            )
                        .Object<List<ElasticStudent>>(num => num
                            .Name(n => n.Students)
                            )
                        .Text(s => s
                            .Name(n => n.Name)
                            )
                    )
                )
             )
           ;
            return map;
        }
    }
}
    

