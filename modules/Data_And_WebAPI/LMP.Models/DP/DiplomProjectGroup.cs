namespace LMP.Models.DP
{
    public class DiplomProjectGroup
    {
        public int DiplomProjectGroupId { get; set; }

        public int DiplomProjectId { get; set; }

        public int GroupId { get; set; }

        public DiplomProject DiplomProject { get; set; }

        public Group Group { get; set; }
    }
}