
using LMPlatform.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SearchRepositories
{
    public class GroupElasticSearchRepository : BaseElasticSearchRepository
    {
        private static string GROUPS_INDEX_NAME => ConfigurationManager.AppSettings["GroupsIndexName"];

        public GroupElasticSearchRepository(ElasticClient client)
            : base(client, GROUPS_INDEX_NAME)
        { }
        public GroupElasticSearchRepository(string elastickAddress, string userName, string password, int prefixLength = 3, int fuzziness = 6)
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
            .Index(GROUPS_INDEX_NAME)
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
            .Index(GROUPS_INDEX_NAME)
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
        
        internal static CreateIndexDescriptor GetaGroupMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Map<ElasticGroup>(m => m
                    .Dynamic(false)
                    .Properties(prop => prop
                        .Number(s => s
                            .Name(n => n.Id)
                            .Type(NumberType.Integer)
                        )
                        .Number(num => num
                            .Name(n => n.SecretaryId)
                        )
                        .Text(s => s
                            .Name(n => n.Name)
                        )
                    )
                )
           ;
            return map;
        }
    }
}
    

