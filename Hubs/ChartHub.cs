using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRExample.Hubs
{
    public class ChartHub : Hub<IChartHubClient>
    {
        public async Task ValueSender(double chartValue) 
        { 
            await Clients.All.ValueReceiver(chartValue); 
        }
    }
}
