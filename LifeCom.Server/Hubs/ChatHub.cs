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
        public static Dictionary<string, int> UserConnectionMapping = new Dictionary<string, int>();

        public static void AddConnection(string connectionId, int userIdentifier)
        {
            UserConnectionMapping.Add(connectionId, userIdentifier);
        }

        public static List<KeyValuePair<string, int>> GetUserConnectionId(int userIdentifier)
        {
            return UserConnectionMapping.Where(tuple => tuple.Value == userIdentifier).ToList();
        }

        public static void RemoveConnection(string connectionId)
        {
            UserConnectionMapping.Remove(connectionId);
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
            UserConnectionHandler.AddConnection(Context.ConnectionId, Int32.Parse(Context.UserIdentifier));
            foreach (Channel channel in user.channels)
                await JoinChannel(channel.Id);
            //await Groups.AddToGroupAsync(Context.ConnectionId.ToString(), user.Id.ToString());

        }

        public override async Task OnDisconnectedAsync(Exception? e)
        {
            await base.OnDisconnectedAsync(e);
            ClaimsIdentity? identity = Context.User.Identity as ClaimsIdentity;
            if (identity == null) return;
            int? id = int.Parse(identity.FindFirst("id").Value);

            User user = _context.Users.Include(u => u.channels).SingleOrDefault(u => u.Id == id);
            UserConnectionHandler.RemoveConnection(user.Id.ToString());
        }

        public async Task SendMessage(User author, string message)
        {
            await Clients.All.ReceiveMessage(new UserResponse(author), message);
        }

        public async Task AddUserToChannel(string userId, Channel channel)
        {
            await Clients.User(userId).ChangedChannelMembership(channel.chatId);
        }

        public async Task AddUserToChat(string userId, Chat chat)
        {
            await Clients.User(userId).AddedToChat(chat);
        }
    }
}
