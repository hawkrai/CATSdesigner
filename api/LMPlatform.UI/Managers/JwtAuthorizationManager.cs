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
using System.ServiceModel.Web;
using System.Threading;
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
            var annonymousAttribute = method?.GetCustomAttribute<AllowAnonymousAttribute>();
            if (annonymousAttribute != null)
            {
                return true;
            }
            if (!bool.Parse(ConfigurationManager.AppSettings["jwt:enabled"]))
            {
                return false;
            }
            var cookieHeader = WebOperationContext.Current.IncomingRequest.Headers[HttpRequestHeader.Cookie];
            string authCookie = null;
            if (!string.IsNullOrEmpty(cookieHeader))
            {
                foreach (var part in cookieHeader.Split(';'))
                {
                    var pair = part.Trim().Split(new[] { '=' }, 2);
                    if (pair.Length == 2 && pair[0].Trim() == "Authorization")
                    {
                        authCookie = pair[1].Trim();
                        break;
                    }
                }
            }

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

                    var claims = new List<Claim>
                    {
                        new Claim(ClaimsIdentity.DefaultNameClaimType, json[ClaimsIdentity.DefaultNameClaimType]),
                        new Claim(ClaimsIdentity.DefaultRoleClaimType, json[ClaimsIdentity.DefaultRoleClaimType]),
                        new Claim("id", json["id"])
                    };

                    var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "JWT"));

                    Thread.CurrentPrincipal = principal;
                    if (HttpContext.Current != null)
                    {
                        HttpContext.Current.User = principal;
                    }
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