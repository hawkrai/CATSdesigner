using System.Security.Claims;
using System.Web;
using WebMatrix.WebData;

namespace Application.Core.Helpers
{
    public static class UserContext
    {
        private static ClaimsPrincipal CurrentPrincipal =>
            HttpContext.Current?.User as ClaimsPrincipal;

        public static string Name =>
            CurrentPrincipal?.Identity?.Name;

        public static string Id =>
            CurrentPrincipal?.FindFirst("id")?.Value;

        public static string Role =>
            CurrentPrincipal?.FindFirst(ClaimsIdentity.DefaultRoleClaimType)?.Value;

        public static int CurrentUserId =>
            WebSecurity.CurrentUserId > 0
                ? WebSecurity.CurrentUserId
                : (int.TryParse(Id, out var id) ? id : 0);

        public static string CurrentUserName =>
            !string.IsNullOrEmpty(WebSecurity.CurrentUserName)
                ? WebSecurity.CurrentUserName
                : Name;
    }
}