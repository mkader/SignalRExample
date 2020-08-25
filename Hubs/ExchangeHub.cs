using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRExample.Hubs
{
    public class ExchangeHub : Hub<IExchangeHubClient>
    {
        public async Task ValueSender(double chartValue) 
        { 
            await Clients.All.ValueReceiver(chartValue); 
        }
    }
}
