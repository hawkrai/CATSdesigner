using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core.Exceptions
{
    public class DuplicateDPThemeInGroupException : ApplicationServiceException
    {
        public DuplicateDPThemeInGroupException()
        {
        }

        public DuplicateDPThemeInGroupException(string message)
            : base(message)
        {
        }

        public DuplicateDPThemeInGroupException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
