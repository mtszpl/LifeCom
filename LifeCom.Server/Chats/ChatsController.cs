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

namespace LifeCom.Server.Chats
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChatsController : Controller
    {
        private readonly LifeComContext _context;

        public ChatsController(LifeComContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Chat>> Get()
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            if (id == null)
                return NotFound("User not found");
            var query = _context.UserChats.Where(uc => uc.userId == id).Join(_context.Chat, uc => uc.chatId, u => u.Id, (uc, c) => new { chat = c, role = uc.role}).ToList();
            List<Chat> userChats = _context.Users.Where(user => user.Id == id)
                .SelectMany(u => u.chats)
                .ToList();
  
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

        [HttpPut]
        [Authorize(Policy = "ChatAdmin")]
        public ActionResult ChangeName([FromBody] int chatId, string name) 
        {
            Chat? chat = _context.Chat.FirstOrDefault(c => c.Id == chatId);
            if(chat == null)
                return NotFound("Chat not found");
            chat.name = name;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("roles")]
        [Authorize(Policy = "ChatAdmin")]

        public ActionResult<bool> ChangePermissions([FromBody] int changedUserId, string role)
        {
            UserChat? changedUser = _context.UserChats.FirstOrDefault(uc => uc.userId == changedUserId);
            if (changedUser == null)
                return NotFound("User or chat not found");
            changedUser.role = role;
            _context.SaveChanges();
            return Ok();
        }
    }
}
