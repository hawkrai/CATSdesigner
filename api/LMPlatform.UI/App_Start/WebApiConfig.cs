using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.ModelBinding.Binders;
using Application.Core.Data;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;

namespace LMPlatform.UI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });

            var provider = new SimpleModelBinderProvider(
                typeof(GetPagedListParams), new GetPagedListParamsModelBinder());
            config.Services.Insert(typeof(ModelBinderProvider), 0, provider);

            config.MessageHandlers.Add(new JwtAuthHandler());
        }
    }

    public class JwtAuthHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (!bool.Parse(ConfigurationManager.AppSettings["jwt:enabled"]))
            {
                return await base.SendAsync(request, cancellationToken);
            }

            string token = null;

            if (request.Headers.TryGetValues("Authorization", out var headerValues))
            {
                token = headerValues.FirstOrDefault()?.Replace("Bearer", "").Trim();
            }
            else if (HttpContext.Current?.Request.Cookies["Authorization"] != null)
            {
                token = HttpContext.Current.Request.Cookies["Authorization"].Value;
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                return CreateUnauthorizedResponse(request);
            }

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
                return CreateUnauthorizedResponse(request);
            }
            catch (SignatureVerificationException)
            {
                return CreateUnauthorizedResponse(request);
            }
            catch (Exception)
            {
                return CreateUnauthorizedResponse(request);
            }

            return await base.SendAsync(request, cancellationToken);
        }

        private HttpResponseMessage CreateUnauthorizedResponse(HttpRequestMessage request)
        {
            return request.CreateResponse(HttpStatusCode.Unauthorized);
        }
    }
}