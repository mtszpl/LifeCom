using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Data;
using LifeCom.Server.Exceptions;
using LifeCom.Server.Hubs;
using LifeCom.Server.Models;
using LifeCom.Server.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using static LifeCom.Server.Chats.UserChat;

namespace LifeCom.Server.Chats
{
    public partial class ChatService
    {
        private readonly LifeComContext _context;
        private readonly UserService _userService;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ClaimsPrincipal? _User;


        public ChatService(LifeComContext context, UserService userService,
            IAuthorizationService authorizationService, IHubContext<ChatHub, IChatClient> hubContext, IHttpContextAccessor httpContextAccessor) 
        {
            _context = context;
            _userService = userService;
            _hubContext = hubContext;
            _authorizationService = authorizationService;
            _httpContextAccessor = httpContextAccessor;
            if (_httpContextAccessor.HttpContext != null)
                _User = _httpContextAccessor.HttpContext.User;
        }

        public List<UserChatDto> GetChatsOfUser()
        {
            int? userId = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity) ?? throw new HttpException(401);
            var chatList = _context.UserChats.Where(uc => uc.userId == userId).Join(_context.Chat, uc => uc.chatId, u => u.Id, (uc, c) => new UserChatDto { Chat = c, Role = uc.role }).ToList() ?? throw new HttpException(404, "Chats not found");
            return chatList;
        }

        public Chat? GetById(int? chatId)
        {
            if (chatId == null)
                return null;
            return _context.Chat.FirstOrDefault(c => c.Id == chatId);
        }

        public bool CreateChat(string name)
        {
            int userId = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity) ?? throw new HttpException(401);
            User user = _userService.GetById(userId) ?? throw new HttpException(404, "User not found");
            Chat chat = new Chat { name  = name };
            UserChat userChat = new UserChat { user = user, chat = chat, role = ERole.Admin.ToString() };
            _context.SaveChanges();
            return true;
        }

        private bool ContainsUser(int chatId, int userId)
        {
            return _context.UserChats
                .FirstOrDefault(uc => uc.chatId == chatId && uc.userId == userId) != null;
            // return _context.Chat
            //     .Where(ch => ch.Id == chatId)
            //     .SelectMany(ch => ch.members)
            //     .Any(u => u.Id == userId);
        }
        
        public async Task AddMember(int chatId, int userId)
        {
            User user = _userService.GetById(userId) ?? throw new HttpException(404, "User not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(_User, chatId, ERole.User.ToString());
            if (!authorizationResult.Succeeded) throw new HttpException(403);
            AddUser(chatId, userId);
        }

        public bool AddUser(int chatId, int userId)
        {
            if (ContainsUser(chatId, userId)) return true;
            Chat? chat = _context.Chat.Include(ch => ch.members).Include(ch => ch.channels).FirstOrDefault(ch => ch.Id == chatId);
            if(chat == null) return false;

            if(chat.members.Any(m => m.userId == userId)) return true;

            User? user = _userService.GetById(userId) ?? throw new HttpException(404, "User not found");
            UserChat userChat = new UserChat { user = user, chat = chat };
            chat.members.Add(userChat);
            user.chats.Add(userChat);
            foreach (Channel channel in chat.channels.Where(channel => channel.isPublic))
                channel.members.Add(user);
            
            _context.SaveChanges();
            return true;
        }

        public async Task ChangeName(int chatId, string name)
        {
            if (name == string.Empty) throw new HttpException(400, "Bad name");
            Chat chat = GetById(chatId) ?? throw new HttpException(404, "Chat not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(_User, chat.Id, ERole.Admin.ToString());
            if (!authorizationResult.Succeeded) throw new HttpException(403);
            chat.name = name;
            _context.SaveChanges();
        }

        public async Task ChangePermissions(int chatId, int changedUserId, string role)
        {
            UserChat userChat = _context.UserChats.FirstOrDefault(uc => uc.userId == changedUserId && uc.chatId == chatId) ?? throw new HttpException(404, "User or chat not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(_User, chatId, ERole.Admin.ToString());
            if (!authorizationResult.Succeeded) throw new HttpException(403);
            userChat.role = role;
            _context.SaveChanges();
        }
    }
}
