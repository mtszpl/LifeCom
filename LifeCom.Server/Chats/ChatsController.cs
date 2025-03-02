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

namespace LifeCom.Server.Chats
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChatsController : Controller
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly LifeComContext _context;
        private readonly ChannelService _channelService;
        private readonly ChatService _chatService;

        public ChatsController(LifeComContext context, IAuthorizationService authorizationService)
        {
            _context = context;
            _channelService = new ChannelService(context);
            _chatService = new ChatService(context);
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public ActionResult<List<Chat>> Get()
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            if (id == null)
                return NotFound("User not found");
            var query = _context.UserChats.Where(uc => uc.userId == id).Join(_context.Chat, uc => uc.chatId, u => u.Id, (uc, c) => new { chat = c, role = uc.role}).ToList();
  
            return Ok(query);
        }

        [HttpPost("create")]
        public ActionResult<bool> CreateChat([FromBody] string name)
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            if (id == null)
                return NotFound("User not found");
            User? user = _context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return NotFound("Unknown user");
            Chat newChat = new Chat {
                name = name
                };

            if (ModelState.IsValid) 
            {
                _context.Add(newChat);

                _context.Add(new UserChat
                {
                    user = user,
                    chat = newChat,
                    role = ERole.Admin.ToString(),
                });

                _context.SaveChanges();
            }


            return Ok(true);
        }

        [HttpPut("rename/{chatId}")]
        public async Task<ActionResult> ChangeName(int chatId, [FromBody]string name) 
        {
            if (name == "")
                return BadRequest("No name");
            Chat? chat = _context.Chat.FirstOrDefault(c => c.Id == chatId);
            if(chat == null)
                return NotFound("Chat not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(User, chat.Id, "ChatAdmin");
            if(authorizationResult.Succeeded)
            {           
                chat.name = name;
                _context.SaveChanges();
            }
            else if (User.Identity.IsAuthenticated)            
                return new ForbidResult();            
            else            
                return new ChallengeResult();
            

            return Ok();
        }

        [HttpPut("{chatId}/roles/{changedUserId}")]

        public async Task<ActionResult<bool>> ChangePermissionsAsync(int chatId, int changedUserId, string role)
        {
            UserChat? changedUser = _context.UserChats.FirstOrDefault(uc => uc.userId == changedUserId);
            if (changedUser == null)
                return NotFound("User or chat not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(User, chatId, "ChatAdmin");
            if(authorizationResult.Succeeded)
            {
                changedUser.role = role;
                _context.SaveChanges();
                return Ok();
            }
            else if (User.Identity.IsAuthenticated)
                return new ForbidResult();
            else
                return new ChallengeResult();
        }

        [HttpPost("{chatId}/{channelId}/members")]
        public async Task<ActionResult<bool>> AddMemberAsync(int chatId, int channelId, [FromBody]int userId)
        {
            User? user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return BadRequest("User not found");
            AuthorizationResult authorizationResult = await _authorizationService
                .AuthorizeAsync(User, chatId, "ChatAdmin");
            if (authorizationResult.Succeeded)
            {
                _channelService.AddUserToChannel(channelId, user);
                return Ok();
            }
            else if (User.Identity.IsAuthenticated)
                return new ForbidResult();
            else
                return new ChallengeResult();
        }
    }
}
