using System;
using System.Collections.Generic;
using Application.Infrastructure.Models;
using LMPlatform.Models;
using LMPlatform.Models.KnowledgeTesting;

namespace Application.Infrastructure.KnowledgeTestsManagement
{
    public interface ITestPassingService
    {
        NextQuestionResult GetNextQuestion(int testId, int userId, int currentQuestionNumber);

        void MakeUserAnswer(IEnumerable<Answer> answers, int userId, int testId, int questionNumber);

        IEnumerable<Student> GetPassTestResults(int groupId, int subjectId);

        IEnumerable<Test> GetAvailableTestsForStudent(int studentId, int subjectId);

        IEnumerable<RealTimePassingResult> GetRealTimePassingResults(int subjectId);

        IEnumerable<Test> GetTestsForSubject(int subjectId);

        TestPassResult GetTestPassingTime(int testId, int studentId);

        List<TestPassResult> GetStidentResults(int subjectId, int currentUserId);

        List<AnswerOnTestQuestion> GetAnswersForTest(int testId, int userId);

        TestPassResult GetTestPassResult(int testId, int userId);

        List<AnswerOnTestQuestion> GetAnswersForEndedTest(int testId, int userId);

        bool CheckForSubjectAvailableForStudent(int studentId, int subjectId);

        int? GetPointsForQuestion(int userId, int questionId);

        (int, int) SimpleTestCloseById(int testId, int userId);
        /// <summary>
        /// Returns set of students and average marks for subject
        /// </summary>
        Dictionary<int, double?> GetAverageMarkForTests(int groupId, int subjectId);

        TestsResult GetSubjectControlTestsResult(int subjectId, IEnumerable<int> studentsIds);
    }
}
