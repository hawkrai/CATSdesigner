namespace LMPlatform.ElasticDataModels
{
    using Application.Core.Data;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public class ElasticStudent : ModelBase
    {
        [NotMapped]
        public string FullName => $"{LastName} {FirstName} {MiddleName}";
        public ElasticUser User { get; set; }
        public ElasticGroup Group { get; set; }
        public int GroupId { get; set; }

        [JsonIgnore]
        public string Email { get; set; }

        public string FirstName { get; set; }
       
        public string LastName { get; set; }
        
        public string MiddleName { get; set; }

        [JsonIgnore]
        public bool? Confirmed { get; set; }



 
    }
}
