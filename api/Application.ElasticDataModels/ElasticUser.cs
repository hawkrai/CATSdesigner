using Application.Core.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Spatial;

namespace LMPlatform.ElasticDataModels
{


    public partial class ElasticUser : ModelBase
    {
 
        public string UserName { get; set; }

        public string SkypeContact { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string About { get; set; }

        [JsonIgnore]
        public bool? IsServiced { get; set; }
        [JsonIgnore]
        public DateTime? LastLogin { get; set; }

        [JsonIgnore]
        public string Attendance { get; set; }

        [JsonIgnore]
        public string Avatar { get; set; }

        [JsonIgnore]
        public string Answer { get; set; }

        [JsonIgnore]
        public int? QuestionId { get; set; }

        [JsonIgnore]
        public ICollection<ElasticProject> Projects { get; set; }

        [JsonIgnore]
        public virtual ElasticLecturer Lecturer { get; set; }

        [JsonIgnore]
        public virtual ElasticStudent Student { get; set; }
    }
}
