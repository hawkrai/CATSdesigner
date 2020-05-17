using System.Collections.Generic;
using LMP.Models;

namespace Application.Infrastructure.UserManagement
{
    public interface IUsersManagementService
	{
        User GetUser(string userName);

        User GetUser(int id);

        User GetUserByName(string firstName, string lastName, string middleName);

        bool IsExistsUser(string userName);

        User CurrentUser { get; }

        bool DeleteUser(int id);

        User GetAdmin();

        IEnumerable<User> GetUsers(bool includeRole = false);

        void UpdateLastLoginDate(string userName);
	}
}