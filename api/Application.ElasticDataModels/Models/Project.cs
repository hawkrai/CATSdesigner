namespace Application.ElasticDataModels
{
    using Application.Core.Data;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Project : ModelBase
    {

        [Required]
        public string Title { get; set; }

        public string Details { get; set; }

        public DateTime DateOfChange { get; set; }

        public int CreatorId { get; set; }

        public string Attachments { get; set; }

        public Guid? Guid { get; set; }

        public virtual User User { get; set; }

    }
}
