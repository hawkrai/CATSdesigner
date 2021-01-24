using Application.ElasticDataModels;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Application.ElasticSearchEngine.SerachMethods
{
    public class ProjectElasticSearchMethod : SearchMethods.BaseElasticSearchMethod
    {
        private const string PROJECTS_INDEX_NAME = "projects";
        public ProjectElasticSearchMethod(string elastickAddress, string userName, string password)
            : base(elastickAddress, PROJECTS_INDEX_NAME, userName, password)
        { }
        public ProjectElasticSearchMethod(string elastickAddress, int prefixLength, int fuzziness, string userName, string password)
            : base(elastickAddress, PROJECTS_INDEX_NAME, prefixLength, fuzziness, userName, password)
        { }
        public IEnumerable<Project> Search(string requestStr)
        {
            string searchStr = "";
            if (requestStr != null)
            {
                searchStr = requestStr.ToLower();
            }
            var searchResponse = Client.Search<Project>(s => s
            .Size(DEFAULT_NUM_OF_RESULTS)

            .Query(q => q
                      .Match(m => m
                          .Fuzziness(Fuzziness.EditDistance(SearchFuziness))
                          .PrefixLength(PrefixLength)
                          .Field(p => p.Title)
                          .Field(p => p.Details)
                          .FuzzyTranspositions(true)
                          .Query(searchStr)
                      )
                      || q
                      .Prefix(p => p.Title , searchStr)
                      || q
                      .Prefix(p => p.Details , searchStr)
             )   
            ); ;
            return searchResponse.Documents.ToList<Project>();
        }

        public IEnumerable<Project> SearchAll()
        {
            var searchResponse = Client.Search<Project>(s => s
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
            return searchResponse.Documents.ToList<Project>();
        }

        public void AddToIndex(Project project)
        {

                Client.Index<Project>(project, st => st.Index(PROJECTS_INDEX_NAME));

        }

        public void AddToIndex(IEnumerable<Project> projects)
        {
            Client.IndexMany(projects, PROJECTS_INDEX_NAME);
        }

        public void AddToIndexAsync(Project project)
        {

            Client.IndexAsync<Project>(project, st => st.Index(PROJECTS_INDEX_NAME));

        }

        public void AddToIndexAsync(IEnumerable<Project> projects)
        {
            Client.IndexManyAsync(projects, PROJECTS_INDEX_NAME);
        }
        public void UpdateDocument(Project project)
        {
            DeleteFromIndex(project.Id);
            AddToIndex(project);
        }

        private static CreateIndexDescriptor GetProjectMap(string indexName)
        {
            CreateIndexDescriptor map = new CreateIndexDescriptor(indexName);
            map.Mappings(M => M
                .Map<Project>(m => m
                    .Properties(prop => prop
                        .Date(s => s
                            .Name(n => n.DateOfChange)
                            )
                        .Number(num => num
                            .Name(n => n.Id)
                            )
                        .Text(s => s
                            .Name(n => n.Title)
                            )
                    )
                )
             )
           ;
            return map;
        }
    }
}
    

