using System.ComponentModel.DataAnnotations;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Materials : ModelBase
    {
        public string Name { get; set; }

        public string Text { get; set; }

        public int? Folders_Id { get; set; }

        public Folders Folders { get; set; }
    }
}