namespace LMP.Models.From_LMP_Models.KnowledgeTesting
{
    public class TestUnlockInfo
    {
        public int Number { get; set; }

        public int StudentId { get; set; }

        public int TestId { get; set; }

        public string StudentName { get; set; }

        public bool Unlocked { get; set; }

        public TestUnlock ToTestUnlock()
        {
            return new TestUnlock
            {
                StudentId = StudentId,
                TestId = TestId
            };
        }
    }
}