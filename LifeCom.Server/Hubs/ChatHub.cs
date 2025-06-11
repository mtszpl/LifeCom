using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Data;
using LifeCom.Server.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Principal;

namespace LifeCom.Server.Hubs
{

    public static class UserConnectionHandler
    {
        public static Dictionary<int, string> UserConnectionMapping = new Dictionary<int, string>();

        public static void AddConnection(int userId, string connectionId)
        {
            UserConnectionMapping.Add(userId, connectionId);
        }

        public static string GetUserConnectionId(int userId)
        {
            return UserConnectionMapping[userId];
        }

        public static void RemoveConnection(int userId)
        {
            UserConnectionMapping.Remove(userId);
        }
    }


    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private readonly LifeComContext _context;

        public ChatHub(LifeComContext context)
        {
            _context = context;
        }

        public async Task JoinChannel(int channelId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, channelId.ToString());
        }

        public async Task LeaveChannel(int channelId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, channelId.ToString());
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            ClaimsIdentity? identity = Context.User.Identity as ClaimsIdentity;
            if (identity == null) return;
            int? id = int.Parse(identity.FindFirst("id").Value);

            User user = _context.Users.Include(u => u.channels).SingleOrDefault(u => u.Id == id);
            if (user == null)
            {
                await Clients.All.ReceiveMessage("Error, no user found");
                return;
            }
            foreach(Channel channel in user.channels)
                await JoinChannel(channel.Id);
            //await Groups.AddToGroupAsync(Context.ConnectionId.ToString(), user.Id.ToString());
            try
            {
                UserConnectionHandler.AddConnection(user.Id, Context.ConnectionId);
            }
            catch (Exception ex)
            {

            }

        }

        public override async Task OnDisconnectedAsync(Exception? e)
        {
            await base.OnDisconnectedAsync(e);
            ClaimsIdentity? identity = Context.User.Identity as ClaimsIdentity;
            if (identity == null) return;
            int? id = int.Parse(identity.FindFirst("id").Value);

            User user = _context.Users.Include(u => u.channels).SingleOrDefault(u => u.Id == id);
            UserConnectionHandler.RemoveConnection(user.Id);
        }

        public async Task SendMessage(User author, string message)
        {
            await Clients.All.ReceiveMessage(new UserResponse(author), message);
        }

        public async Task AddUserToChannel(string userId, Channel channel)
        {
            await Clients.User(userId).ChangedChannelMembership(channel);
        }

        public async Task AddUserToChat(string userId, Chat chat)
        {
            await Clients.User(userId).AddedToChat(chat);
        }
    }
}
