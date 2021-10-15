using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.ErrorModel
{
    public class CustomError : Exception
    {
        public ErrorDetails errorDetails;
        public CustomError(int statusCode, string message)
        {
            errorDetails = new ErrorDetails(statusCode, message);
        }
    }
}
