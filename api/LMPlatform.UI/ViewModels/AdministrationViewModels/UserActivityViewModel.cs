using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using Application.Core;
using Application.Core.Constants;
using Application.Infrastructure.UserManagement;
using LMPlatform.Models;

namespace LMPlatform.UI.ViewModels.AdministrationViewModels
{
    public class UserActivityViewModel
    {
        private readonly LazyDependency<IUsersManagementService> _userManagementService =
            new LazyDependency<IUsersManagementService>();

        private IEnumerable<User> users;

        public UserActivityViewModel()
        {
            this.InitializeActivity();
        }

        public IUsersManagementService UserManagementService => this._userManagementService.Value;

        public string UserActivityJson { get; set; }

        public int TotalUsersCount { get; set; }

        public int TotalStudentsCount { get; set; }

        public int TotalLecturersCount { get; set; }

        public int ServiceAccountsCount { get; set; }

        private IEnumerable<User> Users => this.users ??= this.UserManagementService.GetUsers(true);

        private void InitializeActivity()
        {
            this.TotalUsersCount = this.Users.Count();

            this.TotalStudentsCount = this.Users.Count(u =>
                u.Membership != null && u.Membership.Roles.Select(r => r.RoleName).Contains(Constants.Roles.Student));

            this.TotalLecturersCount = this.Users.Count(u =>
                u.Membership != null && u.Membership.Roles.Select(r => r.RoleName).Contains(Constants.Roles.Lector));

            this.ServiceAccountsCount = this.Users.Count(u =>
                u.Membership != null && u.Membership.Roles.Select(r => r.RoleName).Contains(Constants.Roles.Admin));

            var today = DateTime.Now;

            var dayActivity = this.Users.Count(u =>
                u.LastLogin != null && DateTime.Compare(u.LastLogin.Value, today.AddDays(-1)) >= 0);
            var weekActivity =
                this.Users.Count(
                    u => u.LastLogin != null && DateTime.Compare(u.LastLogin.Value, today.AddDays(-7)) >= 0) -
                dayActivity;
            var monthActivity =
                this.Users.Count(u =>
                    u.LastLogin != null && DateTime.Compare(u.LastLogin.Value, today.AddMonths(-1)) >= 0) -
                weekActivity - dayActivity;
            var inactive = this.TotalUsersCount - dayActivity - weekActivity - monthActivity;

            var dictionary = new Dictionary<string, int>
            {
                {"Сутки", dayActivity},
                {"Неделя", weekActivity},
                {"Месяц", monthActivity},
                {"Ранее", inactive}
            };

            var jsonSerialiser = new JavaScriptSerializer();

            this.UserActivityJson = jsonSerialiser.Serialize(dictionary);
        }
    }
}