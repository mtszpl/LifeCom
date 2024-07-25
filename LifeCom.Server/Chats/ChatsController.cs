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
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Forbid("Unidentified user");

            int? id = int.Parse(identity.FindFirst("id").Value);
            if ( id == null)
                return Forbid("Unidentified user");
           List<Chat> userChats = _context.Users.Where(user => user.Id == id)
                .SelectMany(u => u.chats)
                .ToList();
  
            return Ok(userChats);
        }

        [HttpPost("create")]
        public ActionResult<bool> CreateChannel([FromBody] string name)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Forbid("Unidentified user");
            string? idString = identity.FindFirst("id")?.Value;
            if (idString == null)
                return NotFound("Unknown user");
            int id = int.Parse(idString);
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
    }
}
