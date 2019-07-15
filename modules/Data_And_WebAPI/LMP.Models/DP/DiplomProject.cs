using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LMP.Models.DP
{
    public class DiplomProject
    {
        public DiplomProject()
        {
            AssignedDiplomProjects = new HashSet<AssignedDiplomProject>();
            DiplomProjectGroups = new HashSet<DiplomProjectGroup>();
        }

        public int DiplomProjectId { get; set; }

        public string Theme { get; set; }

        public int? LecturerId { get; set; }

        public string InputData { get; set; }

        public string RpzContent { get; set; }

        public string DrawMaterials { get; set; }

        public string Consultants { get; set; }

        public string Workflow { get; set; }

        public string Univer { get; set; }

        public string Faculty { get; set; }

        public string HeadCathedra { get; set; }

        public DateTime? DateEnd { get; set; }

        public DateTime? DateStart { get; set; }

        public ICollection<AssignedDiplomProject> AssignedDiplomProjects { get; set; }

        public ICollection<DiplomProjectGroup> DiplomProjectGroups { get; set; }

        public Lecturer Lecturer { get; set; }
    }
}