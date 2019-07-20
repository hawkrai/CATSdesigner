using LMP.Data.Repositories;
using LMP.Models.KnowledgeTesting;

namespace Application.Infrastructure.TestQuestionPassingManagement
{
    public class TestQuestionPassingService : ITestQuestionPassingService
    {
        public void SaveTestQuestionPassResults(TestQuestionPassResults item)
        {
            using (var repositoriesContainer = new LmPlatformRepositoriesContainer())
            {
                if (item != null)
                {
                    repositoriesContainer.TestQuestionPassResultsRepository.Save(item);
                }
                repositoriesContainer.ApplyChanges();
            }
        }
    }
}
