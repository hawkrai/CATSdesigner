using Application.Core.Helpers;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;


namespace LMPlatform.UI.Attributes
{
    public class JwtAuthAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (!bool.Parse(ConfigurationManager.AppSettings["jwt:enabled"]))
            {
                return base.AuthorizeCore(httpContext);
            }

            var authCookie = httpContext.Request.Cookies["Authorization"];

            var autHeader = httpContext.Request.Headers["Authorization"];

            if (authCookie != null || autHeader != null)
            {
                var token = authCookie != null ? authCookie.Value : autHeader.Replace("Bearer","");
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

                    UserContext.Id = json["id"];
                    UserContext.Name = json[ClaimsIdentity.DefaultNameClaimType];
                    UserContext.Role = json[ClaimsIdentity.DefaultRoleClaimType];

                    httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(claims));

                    if (!string.IsNullOrWhiteSpace(this.Roles) && !this.Roles.Contains(json[ClaimsIdentity.DefaultRoleClaimType])) return false;
                }
                catch (TokenExpiredException)
                {
                    Console.WriteLine("Token has expired");
                    return false;
                }
                catch (SignatureVerificationException)
                {
                    Console.WriteLine("Token has invalid signature");
                    return false;
                }
                return true;
            }
            return false;
        }
    }
}