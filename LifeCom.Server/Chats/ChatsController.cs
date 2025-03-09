using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;
using System.Security.Claims;
using LifeCom.Server.Users;
using Microsoft.AspNetCore.Authorization;
using static LifeCom.Server.Chats.UserChat;
using LifeCom.Server.Models;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Exceptions;
using LifeCom.Server.Controllers;
using static LifeCom.Server.Chats.ChatService;

namespace LifeCom.Server.Chats
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChatsController : IBaseLifeComController
    {
        private readonly LifeComContext _context;
        private readonly ChannelService _channelService;
        private readonly ChatService _chatService;

        public ChatsController(LifeComContext context, ChatService chatService, ChannelService channelService)
        {
            _context = context;
            _channelService = channelService;
            _chatService = chatService;
        }

        [HttpGet]
        public ActionResult<List<UserChatDto>> Get()
        {
            //int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            //if (id == null)
            //    return NotFound("User not found");
            //var query = _context.UserChats.Where(uc => uc.userId == id).Join(_context.Chat, uc => uc.chatId, u => u.Id, (uc, c) => new { chat = c, role = uc.role }).ToList();
            //List<UserChatDto> chats = _chatService.GetChatsOfUser();
            return HandleCall(() => _chatService.GetChatsOfUser());
        }

        [HttpPost("create")]
        public ActionResult<bool> CreateChat([FromBody] string name)
        {
            return HandleCall(() => _chatService.CreateChat(name));
        }

        [HttpPut("rename/{chatId}")]
        public async Task<ActionResult> ChangeName(int chatId, [FromBody]string name) 
        {
            return await HandleCall(() => _chatService.ChangeName(chatId, name));
        }

        [HttpPut("{chatId}/roles/{changedUserId}")]
        public async Task<ActionResult<bool>> ChangePermissionsAsync(int chatId, int changedUserId, string role)
        {
            return await HandleCall(() => _chatService.ChangePermissions(chatId, changedUserId, role));
        }

        [HttpPost("{chatId}/members")]
        public async Task<ActionResult<bool>> AddMemberAsync(int chatId, [FromBody]int userId)
        {
            return await HandleCall(() => _chatService.AddMember(chatId, userId));
        }
    }
}
