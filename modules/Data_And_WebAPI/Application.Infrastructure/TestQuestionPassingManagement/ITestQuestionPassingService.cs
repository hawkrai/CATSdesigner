using LMP.Models.KnowledgeTesting;

namespace Application.Infrastructure.TestQuestionPassingManagement
{
    public interface ITestQuestionPassingService
    {
        void SaveTestQuestionPassResults(TestQuestionPassResults item);
    }
}
