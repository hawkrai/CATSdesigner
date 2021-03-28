namespace Application.ElasticDataModels
{
    using Application.Core.Data;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class ElasticGroup : ModelBase
    {
        public string Name { get; set; }

        public string StartYear { get; set; }

        public string GraduationYear { get; set; }

        [JsonIgnore]
        public Lecturer Secretary { get; set; }

        [JsonIgnore]
        [Column("Secretary_Id")]
        public int? SecretaryId { get; set; }

        [JsonIgnore]
        public virtual ICollection<ElasticStudent> Students { get; set; }



    }
}
