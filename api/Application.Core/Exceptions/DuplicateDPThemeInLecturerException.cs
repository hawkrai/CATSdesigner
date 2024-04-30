using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core.Exceptions
{
    public class DuplicateDPThemeInLecturerException : ApplicationServiceException
    {
        public DuplicateDPThemeInLecturerException()
        {
        }

        public DuplicateDPThemeInLecturerException(string message)
            : base(message)
        {
        }

        public DuplicateDPThemeInLecturerException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
