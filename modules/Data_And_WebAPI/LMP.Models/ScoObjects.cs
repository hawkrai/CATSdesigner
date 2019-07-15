using LMP.Models.Interface;

namespace LMP.Models
{
    public class ScoObjects : ModelBase
    {
        public string Name { get; set; }

        public string Path { get; set; }

        public bool IsDeleted { get; set; }

        public bool Enabled { get; set; }
    }
}