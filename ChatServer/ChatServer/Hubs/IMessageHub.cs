using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatServer.Hubs
{
    public interface IMessageHub
    {
        void SendMessage(string userId, string messageJson);
    }
}
