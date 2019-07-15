using System;
using LMP.Models.From_App_Core_Data;

namespace LMP.Models.From_LMP_Models
{
    public class AccessCode : ModelBase
    {
        public string Number { get; set; }

        public DateTime Date { get; set; }
    }
}