using Contracts;
using Contracts.Repositories;
using Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RepositoryManager : IRepositoryManager
    {
        private RepositoryContext _repositoryContext;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
        }

        private IUserRepository _users;
        private IStudentRepository _students;
        private ILecturerRepository _lecturers;
        private IUserChatRepository _userChats;
        private IUserChatMessageRepository _userChatMessages;
        private IGroupChatRepository _groupChats;
        private ISubjectLecturerRepository _subjectLecturer;
        private ISubjectGroupRepository _subjectGroup;
        private IGroupMessageRepository _groupMessages;
        private IUserChatHistoryRepository _userChatHistoryRepository;
        private IGroupChatHistoryRepository _groupChatHistoryRepository;

        public IGroupChatHistoryRepository GroupChatHistoryRepository
        {
            get
            {
                if (_groupChatHistoryRepository == null)
                {
                    _groupChatHistoryRepository = new GroupChatHistoryRepository(_repositoryContext);
                }
                return _groupChatHistoryRepository;
            }
        }


        public IUserChatHistoryRepository UserChatHistoryRepository
        {
            get
            {
                if (_userChatHistoryRepository == null)
                {
                    _userChatHistoryRepository = new UserChatHistoryRepository(_repositoryContext);
                }
                return _userChatHistoryRepository;
            }
        }


        public IGroupMessageRepository GroupMessages
        {
            get
            {
                if (_groupMessages == null)
                {
                    _groupMessages = new GroupMessageRepository(_repositoryContext);
                }
                return _groupMessages;
            }
        }

        public ISubjectGroupRepository SubjectGroup
        {
            get
            {
                if (_subjectGroup == null)
                {
                    _subjectGroup = new SubjectGroupRepository(_repositoryContext);
                }
                return _subjectGroup;
            }
        }

        public IGroupChatRepository GroupChats
        {
            get
            {
                if (_groupChats == null)
                {
                    _groupChats = new GroupChatRepository(_repositoryContext);
                }
                return _groupChats;
            }
        }

        public ISubjectLecturerRepository SubjectLecturer
        {
            get
            {
                if (_subjectLecturer == null)
                {
                    _subjectLecturer = new SubjectLecturerRepository(_repositoryContext);
                }
                return _subjectLecturer;
            }
        }

        public IUserRepository Users
        {
            get
            {
                if (_users == null)
                {
                    _users = new UserRepository(_repositoryContext);
                }
                return _users;
            }
        }

        public IStudentRepository Students
        {
            get
            {
                if (_students == null)
                {
                    _students = new StudentRepository(_repositoryContext);
                }
                return _students;
            }
        }

        public ILecturerRepository Lecturers
        {
            get
            {
                if (_lecturers == null)
                {
                    _lecturers = new LecturerRepository(_repositoryContext);
                }
                return _lecturers;
            }
        }

        public IUserChatRepository UserChats
        {
            get
            {
                if (_userChats == null)
                {
                    _userChats = new UserChatRepository(_repositoryContext);
                }
                return _userChats;
            }
        }

        public IUserChatMessageRepository UserChatMessages
        {
            get
            {
                if (_userChatMessages == null)
                {
                    _userChatMessages = new UserChatMessageRepository(_repositoryContext);
                }
                return _userChatMessages;
            }
        }

        public Task SaveAsync() => _repositoryContext.SaveChangesAsync();
    }
}
