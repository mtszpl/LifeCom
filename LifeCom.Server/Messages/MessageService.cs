using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Data;
using LifeCom.Server.Exceptions;
using LifeCom.Server.Hubs;
using LifeCom.Server.Models;
using LifeCom.Server.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LifeCom.Server.Messages
{
    public class MessageService
    {
        private readonly LifeComContext _context;
        private readonly ChannelService _channelService;
        private readonly UserService _userService;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        IHttpContextAccessor _httpContextAccessor;
        private ClaimsPrincipal? _User;

        public MessageService(LifeComContext context,
            ChannelService channelService, UserService userService,
            IHubContext<ChatHub, IChatClient> hubContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _hubContext = hubContext;
            _channelService = channelService;
            _userService = userService;
            _httpContextAccessor = httpContextAccessor;
            if (_httpContextAccessor.HttpContext != null)
                _User = _httpContextAccessor.HttpContext.User;
        }

        public List<Message> GetByChannelId(int id)
        {
            return _context.Message
                .Where(m => m.channelId == id)
                .Include(m => m.author)
                .OrderBy(m => m.timestamp)
                .ToList();
        }

        public async Task<Message> SendMessage(MessageRequest messageRequest)
        {
            if (messageRequest.content == string.Empty || messageRequest.channelId == null) throw new HttpException(400);
            int id = TokenDataReader.TryReadId(_User.Identity as ClaimsIdentity) ?? throw new HttpException(403);
            User author = _userService.GetById(id) ?? throw new HttpException(400, "Error when authenticationg");

            Message message = new Message
            {
                content = messageRequest.content,
                authorId = author.Id,
                channelId = messageRequest.channelId
            };
            await _context.Message.AddAsync(message);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(messageRequest.channelId.ToString()).ReceiveMessage(new UserResponse(author), messageRequest.content);

            return message;
        }

        public List<Message> ReadChannelMessages(int channelId)
        {
               return _context.Message.Where(m => m.channelId == channelId).ToList();
        }
    }
}
