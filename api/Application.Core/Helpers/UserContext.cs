using WebMatrix.WebData;

namespace Application.Core.Helpers
{
    public static class UserContext
    { 
        public static string Name { get; set; }

        public static string Id { get; set; }

        public static string Role { get; set; }

        public static int CurrentUserId =>
            WebSecurity.CurrentUserId <= 0 ? int.Parse(Id) : WebSecurity.CurrentUserId;
        public static string CurrentUserName =>
            string.IsNullOrEmpty(WebSecurity.CurrentUserName) ? Name : WebSecurity.CurrentUserName;
    }
}