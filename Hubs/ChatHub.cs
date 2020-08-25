using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR; 
 
namespace SignalRExample.Hubs 
{ 
    public class ChatHub : Hub<IChatHubClient> 
    { 
        public async Task MessageSender(string user, string message) 
        { 
            await Clients.All.MessageReceiver(user, message); 
        } 
    } 
}