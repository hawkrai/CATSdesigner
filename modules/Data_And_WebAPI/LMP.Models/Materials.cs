using System.ComponentModel.DataAnnotations;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class Materials : ModelBase
    {
        //PROBLEM
        [Required] [StringLength(128)] public string Name { get; set; }

        public string Text { get; set; }

        public int? Folders_Id { get; set; }

        public virtual Folders Folders { get; set; }
    }
}