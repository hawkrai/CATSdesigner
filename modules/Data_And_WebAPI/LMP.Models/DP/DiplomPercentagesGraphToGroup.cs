namespace LMP.Models.DP
{
    public class DiplomPercentagesGraphToGroup
    {
        public int DiplomPercentagesGraphToGroupId { get; set; }

        public int DiplomPercentagesGraphId { get; set; }

        public int GroupId { get; set; }

        public Group Group { get; set; }

        public DiplomPercentagesGraph DiplomPercentagesGraph { get; set; }
    }
}