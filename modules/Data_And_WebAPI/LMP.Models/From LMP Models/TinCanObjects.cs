using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class TinCanObjects : ModelBase
    {
        public string Name { get; set; }

        public string Path { get; set; }

        public bool IsDeleted { get; set; }

        public bool Enabled { get; set; }
    }
}