using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.ErrorModel
{
    [Serializable]
    public class ErrorDetails
    {
        public ErrorDetails(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
        }

        public int StatusCode { get; set; }
        public string Message { get;}
    }
}
