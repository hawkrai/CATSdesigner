using System;
using LMP.Models.Interface;

namespace LMP.Models
{
    public class AccessCode : ModelBase
    {
        public string Number { get; set; }

        public DateTime Date { get; set; }
    }
}