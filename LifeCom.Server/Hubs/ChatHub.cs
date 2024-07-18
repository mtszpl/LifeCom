using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;

namespace LifeCom.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message) =>
            await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
