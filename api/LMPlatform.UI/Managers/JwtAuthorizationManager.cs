using Application.Core.Helpers;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.ServiceModel;
using System.ServiceModel.Dispatcher;
using System.ServiceModel.Web;
using System.Web;
using System.Web.Http;


namespace LMPlatform.UI.Managers
{
    public class JwtAuthorizationManager : ServiceAuthorizationManager
    {
        protected override bool CheckAccessCore(OperationContext operationContext)
        {
            // Extract the action URI from the OperationContext. Match this against the claims
            // in the AuthorizationContext.
            string action = GetActionName(operationContext);
            Type hostType = operationContext.Host.Description.ServiceType;
            MethodInfo method = hostType.GetMethod(action);
            var annonymousAttribute =  method?.GetCustomAttribute<AllowAnonymousAttribute>();
            if (annonymousAttribute != null)
            {
                return true;
            }
            if (!bool.Parse(ConfigurationManager.AppSettings["jwt:enabled"]))
            {
                return false;
            }
            var parsed = HttpCookie.TryParse(WebOperationContext.Current.IncomingRequest.Headers[HttpRequestHeader.Cookie], out var cookie);
            var authCookie = parsed ? cookie.Name == "Authorization" ? cookie.Value : cookie.Values.Get("Authorization") : null;

            var autHeader = WebOperationContext.Current.IncomingRequest.Headers["Authorization"];

            if (authCookie != null || autHeader != null)
            {
                var token = authCookie != null ? authCookie : autHeader.Replace("Bearer", "");
                try
                {
                    var tokenSecret = ConfigurationManager.AppSettings["jwt:secret"];
                    var json = new JwtBuilder()
                        .WithSecret(tokenSecret)
                        .WithAlgorithm(new HMACSHA256Algorithm())
                        .MustVerifySignature()
                        .Decode<IDictionary<string, string>>(token);

                    UserContext.Id = json["id"];
                    UserContext.Name = json[ClaimsIdentity.DefaultNameClaimType];
                    UserContext.Role = json[ClaimsIdentity.DefaultRoleClaimType];
                }
                catch (TokenExpiredException)
                {
                    Console.WriteLine("Token has expired");
                    return false;
                }
                catch (Exception)
                {
                    Console.WriteLine("Token has invalid signature");
                    return false;
                }
                return true;
            }
            return false;
        }

        private static string GetActionName(OperationContext operationContext)
        {
            string action;

            if (operationContext.RequestContext != null)
            {
                action = operationContext.RequestContext.RequestMessage.Headers.Action;
            }
            else
            {
                action = operationContext.IncomingMessageHeaders.Action;
            }

            if (action == null)// REST Service - webHttpBinding
            {
                action = WebOperationContext.Current.IncomingRequest.UriTemplateMatch == null || WebOperationContext.Current.IncomingRequest.UriTemplateMatch.Data == null
                         ? String.Empty : WebOperationContext.Current.IncomingRequest.UriTemplateMatch.Data.ToString();
            }
            else
            {
                action = action.Split('/').Last();
            }
            return action;
        }
    }
}