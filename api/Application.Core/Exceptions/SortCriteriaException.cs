using System;
using System.Runtime.Serialization;

namespace Application.Core.Exceptions
{
    public class SortCriteriaException : ApplicationException
    {
        public SortCriteriaException()
        {
        }

        public SortCriteriaException(string message) : base(message)
        {
        }

        public SortCriteriaException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected SortCriteriaException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
