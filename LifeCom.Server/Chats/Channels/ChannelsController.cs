using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using LifeCom.Server.Users;

namespace LifeCom.Server.Chats.Channels
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChannelsController : Controller
    {
        private readonly ChannelService _channelService;

        public ChannelsController(LifeComContext context)
        {
            _channelService = new ChannelService(context);
        }

        // GET: Channels
        //public async Task<IActionResult> Index()
        //{
        //    var lifeComContext = _context.Channel.Include(c => c.chat);
        //    return View(await lifeComContext.ToListAsync());
        //}

        [HttpGet]
        public ActionResult<List<Channel>> GetByUser() 
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Forbid("Unauthorized");
            string? idString = identity.FindFirst("id")?.Value;
            if(idString == null)
                return Forbid("Unathorized");
            int userId = int.Parse(idString);

            return _channelService.GetOfUserById(userId);
        }

        [HttpGet("bychat")]
        public ActionResult<List<Channel>> GetByChat(int chatId)
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Forbid("Unauthorized");
            string? idString = identity.FindFirst("id")?.Value;
            if (idString == null)
                return NotFound("User not found");
            int userId = int.Parse(idString);

            return _channelService.GetByChatOfUser(chatId, userId); ;
        }

        [HttpPost("user")]
        [Authorize(Policy = "ChatAdmin")]
        public void CreateChannel([FromBody]Chat chat, string name)
        {

        }

        [HttpPost("add")]
        [Authorize(Policy = "ChatAdmin")]
        public void AddUser([FromBody]UserRequest user)
        {

        }

        [HttpDelete("user")]
        [Authorize(Policy = "ChatAdmin")]
        public void DeleteUser([FromBody]UserRequest user) 
        {

        }

        // POST: Channels/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Create([Bind("Id,Name,chatId")] Channel channel)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Add(channel);
        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }
        //    ViewData["chatId"] = new SelectList(_context.Chat, "Id", "Id", channel.chatId);
        //    return View(channel);
        //}

        // GET: Channels/Delete/5
        //[HttpDelete]
        //public async Task<IActionResult> Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var channel = await _context.Channel
        //        .Include(c => c.chat)
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (channel == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(channel);
        //}

        // POST: Channels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _channelService.RemoveById(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
