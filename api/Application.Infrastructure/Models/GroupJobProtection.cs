using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructure.Models
{
    public class GroupJobProtection
    {
        public int GroupId { get; set; }
        public bool HasJobProtection { get; set; }
    }
}
