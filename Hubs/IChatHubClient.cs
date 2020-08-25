using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRExample.Hubs
{
    public interface IChatHubClient
    {
        Task MessageReceiver(string user, string message); 
    }
}