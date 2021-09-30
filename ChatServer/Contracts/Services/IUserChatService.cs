using AutoMapper;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts.Services
{
    public interface IUserChatService
    {
        Task Create(Chat chat);
        Task Update(Chat chat);
    }
}
