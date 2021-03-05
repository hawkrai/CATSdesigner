using Application.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SerachMethods
{
    public class GroupElasticSearchMethod : SearchMethods.BaseElasticSearchMethod
    {
        private const string GROUPS_INDEX_NAME = "groups";
        public GroupElasticSearchMethod(string elastickAddress,string userName, string password)
            : base(elastickAddress, GROUPS_INDEX_NAME, userName, password)
        { }
        public GroupElasticSearchMethod(string elastickAddress, int prefixLength, int fuzziness, string userName, string password)
            : base(elastickAddress, GROUPS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
        public IEnumerable<Group> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<Group>(s => s
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
            return searchResponse.Documents.ToList<Group>();
        }

        public IEnumerable<Group> SearchAll()
        {
            var searchResponse = Client.Search<Group>(s => s
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
            return searchResponse.Documents.ToList<Group>();
        }

        public void AddToIndex(Group group)
        {
                Client.Index<Group>(group, st => st.Index(GROUPS_INDEX_NAME));
        }

        public void AddToIndex(IEnumerable<Group> groups)
        {
            Client.IndexMany(groups, GROUPS_INDEX_NAME);
        }

        public void AddToIndexAsync(Group group)
        {

            Client.IndexAsync<Group>(group, st => st.Index(GROUPS_INDEX_NAME));

        }

        public void AddToIndexAsync(IEnumerable<Group> groups)
        {
            Client.IndexManyAsync(groups, GROUPS_INDEX_NAME);
        }
        public void UpdateDocument(Group group)
        {
            DeleteFromIndex(group.Id);
            AddToIndex(group);
        }

        private static CreateIndexDescriptor GetaGroupMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<Group>(m => m
                    .Properties(prop => prop
                        .Number(num => num
                            .Name(n => n.Id)
                            )
                        .Number(num => num
                            .Name(n => n.SecretaryId)
                            )
                        .Object<List<Student>>(num => num
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
    

