﻿using System.Collections.Generic;

namespace Application.Infrastructure.UserManagement
{
    using System;
    using System.Threading.Tasks;
    using LMPlatform.Models;

    public interface IUsersManagementService
	{
        User GetUser(string userName);
        Task<User> GetUserAsync(string userName);

        User GetUser(int id);
        User GetUserById(int id);
        User GetUserByName(string firstName, string lastName, string middleName);

        bool IsExistsUser(string userName);

        User CurrentUser { get; }

        bool DeleteUser(int id);

        User GetAdmin();

        IEnumerable<User> GetUsers(bool includeRole = false);

        void UpdateLastLoginDate(string userName);

        void UpdateUser(User user);

        (User, Role) Login(string userName, string password);
    }
}