using LifeCom.Server.Data;
using LifeCom.Server.Exceptions;
using LifeCom.Server.Hubs;
using LifeCom.Server.Messages;
using LifeCom.Server.Models;
using LifeCom.Server.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LifeCom.Server.Chats.Channels
{
    public class ChannelService
    {
        private readonly LifeComContext _context;
        private readonly ChatService _chatService;
        private readonly UserService _userService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private ClaimsPrincipal? _User;


        public ChannelService(
            LifeComContext context,
            ChatService chatService, UserService userService,
            IAuthorizationService authorizationService, IHubContext<ChatHub, IChatClient> hubContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _chatService = chatService;
            _userService = userService;
            _authorizationService = authorizationService;
            _httpContextAccessor = httpContextAccessor;
            _hubContext = hubContext;
            if(_httpContextAccessor.HttpContext != null)
                _User = _httpContextAccessor.HttpContext.User;
        }

        public List<Channel> GetByChat(int chatId) => _context.Channel.Where(ch => ch.chatId == chatId).ToList();

        public Task<Channel?> GetByIdAsync(int? id)
        {
            return _context.Channel.FirstOrDefaultAsync(m => m.Id == id);
        }


        public Task<int> Remove(Channel channel)
        {
            _context.Channel.Remove(channel);
            return _context.SaveChangesAsync();
        }

        public async Task<int> RemoveById(int id) 
        {
            Channel? channel = await GetByIdAsync(id);
            if(channel != null)            
               return await Remove(channel);
            return 0;
        }

        public bool AddUserToChannel(Channel channel, User user)
        {
            if (!channel.members.Contains(user))
                channel.members.Add(user);
            else
                return false;
            _chatService.AddUser(channel.chat.Id, user.Id);
            return true;
        }

        public bool RemoveUserFromChannel(Channel channel, User user)
        {
            if(channel.members.Contains(user))
                channel.members.Remove(user);
            else
                return false;
            return true;
        }

        public bool ChannelOfNameExists(int chatId, string channelName)
        {
            return _context.Channel.Join(_context.Chat, cn => cn.chatId, ch => ch.Id, (cn, chatId) => cn).Any(e => e.name == channelName);
        }

        public bool ChannelExists(int id)
        {
            return _context.Channel.Any(e => e.Id == id);
        }

        //new shit

        public bool SetUserPrincipal()
        {
            if(_httpContextAccessor.HttpContext == null)
                return false;
            _User = _httpContextAccessor.HttpContext.User;
            return true;
        }

        public async Task<Channel> CreateChannel(int owningChatId, ChannelRequest request)
        {
            //if (!SetUserPrincipal() || _User == null || _httpContextAccessor.HttpContext == null)
            //    throw new HttpException(401, "Unauthenticated");
            Chat? owner = _chatService.GetById(owningChatId) ?? throw new HttpException(404, "Chat doesn't exist");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(_User, owningChatId, "ChatAdmin");
            if (!authorizationResult.Succeeded) throw new HttpException(403, "Not allowed");
            else if (!_User.Identity.IsAuthenticated) throw new HttpException(401, "Unknown user");

            int? userId = TokenDataReader.TryReadId(_httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity) ?? throw new HttpException(404, "User not found");
            User? creator = _userService.GetById(userId) ?? throw new HttpException(404, "Chat doesn't exist");

            Channel channel = new Channel
            {
                chatId = owningChatId,
                name = request.name,
                members = new List<User> { creator }
            };
            if (!ChannelOfNameExists(owningChatId, request.name))
            {
                _context.Add(channel);
                _context.SaveChanges();
                return channel;
            }
            else throw new HttpException(40, $"Channel of name {request.name} already exists in ${owner.name}");
        }

        public Channel? GetById(int? id)
        {
            int? userId = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity);
            if (userId != null)
                return _context.Channel.FirstOrDefault(m => m.Id == id);
            throw new HttpException(404, "Not found");
        }

        /**
         * Get channels of chat that user belongs to
         * @param chatId ID of chat
         */
        public List<Channel> GetByChatOfUser(int chatId)
        {
            int? userId = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity) ?? throw new HttpException(401, "Unauthenticated");
            return _context.Channel.Where(ch => ch.chatId == chatId && ch.members.Any(u => u.Id == userId)).ToList();
        }

        public List<Channel> GetOfUserById()
        {
            int? userId = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity) ?? throw new HttpException(401, "Unauthenticated");
            return _context.Channel.Where(channel => channel.members.Any(member => member.Id == userId)).ToList();
        }

        public async Task AddUser(int channelId, int userId)
        {
            await AddOrRemoveUser(channelId, userId, true);
        }
        public async Task RemoveUser(int channelId, int userId)
        {
            await AddOrRemoveUser(channelId, userId, false);
        }

        /// <param name="channelId">ID of channel to manipulate</param>
        /// <param name="userId">ID of user to add or remove</param>
        /// <param name="direction">true to add, false to remove</param>
        private async Task AddOrRemoveUser(int channelId, int userId, bool direction)
        {
            Channel? channel = _context.Channel.Include(c => c.members).Include(c => c.chat).FirstOrDefault(m => m.Id == channelId) ?? throw new HttpException(404, "Channel not found");
            User? user = _userService.GetById(userId) ?? throw new HttpException(404, "User not found");
            Chat owningChat = channel.chat;

            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(_User, owningChat.Id,"ChatAdmin");

            if (!authorizationResult.Succeeded) throw new HttpException(403, "Forbidden");
            bool success = direction ?
                AddUserToChannel(channel, user) :
                RemoveUserFromChannel(channel, user);
            if (success)
            { 
                _context.SaveChanges();
                _hubContext.Clients.User(user.Id.ToString()).ChangedChannelMembership(channel.chatId);
                List<KeyValuePair<string, int>> addedUserConnections = UserConnectionHandler.GetUserConnectionId(userId);
                foreach(KeyValuePair<string, int> pair in addedUserConnections)
                    _hubContext.Groups.AddToGroupAsync(pair.Key, channel.Id.ToString());
            }
            else throw new HttpException(400, "User not added");
        }
    }

}
