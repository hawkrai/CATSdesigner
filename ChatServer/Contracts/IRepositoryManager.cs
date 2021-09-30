using Contracts.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryManager
    {
        IUserRepository Users { get; }
        IStudentRepository Students { get; }
        ILecturerRepository Lecturers { get; }
        IUserChatRepository UserChats { get; }
        IUserChatMessageRepository UserChatMessages { get; }
        IGroupChatRepository GroupChats { get; }
        ISubjectLecturerRepository SubjectLecturer { get; }
        ISubjectGroupRepository SubjectGroup { get; }
        IGroupMessageRepository GroupMessages { get; }
        IUserChatHistoryRepository UserChatHistoryRepository { get; }
        IGroupChatHistoryRepository GroupChatHistoryRepository { get; }
       
        Task SaveAsync();
    }
}
