using Contracts;
using Entities.ErrorModel;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Server.Extensions
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, ILoggerManager logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature.Error is CustomError)
                    {
                        context.Response.Clear();
                        context.Response.StatusCode = (contextFeature.Error as CustomError).errorDetails.StatusCode;    
                        await context.Response.WriteAsync((contextFeature.Error as CustomError).errorDetails.Message);
                        return;
                    }
                    if (contextFeature != null)
                    {
                        logger.LogError($"Something went wrong: {contextFeature.Error}");
                        await context.Response.WriteAsync(new ErrorDetails(context.Response.StatusCode, "Internal Server Error.").ToString());
                    }
                });
            });
        }
    }
}
