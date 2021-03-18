using System;
using System.Collections.Generic;
using Application.Core.Data;

namespace LMPlatform.Models
{
    public class ScheduleProtectionPractical : ScheduleBase
    {
        public int GroupId { get; set; }

        public Group Group { get; set; }

        public int SubjectId { get; set; }

        public Subject Subject { get; set; }


        public ICollection<ScheduleProtectionPracticalMark> ScheduleProtectionPracticalMarks { get; set; }   
        
        public ICollection<Note> Notes { get; set; } = new List<Note>();
    }
}