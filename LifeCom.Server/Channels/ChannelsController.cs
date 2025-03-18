using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Authorization;
using LifeCom.Server.Users;
using LifeCom.Server.Exceptions;
using LifeCom.Server.Controllers;

namespace LifeCom.Server.Chats.Channels
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChannelsController : IBaseLifeComController
    {
        private readonly ChannelService _channelService;


        public ChannelsController(ChannelService channelService)
        {
            _channelService = channelService;
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
            return HandleCall(() => _channelService.GetOfUserById());
        }

        [HttpGet("bychat")]
        public ActionResult<List<Channel>> GetByChat(int chatId)
        {
            return HandleCall(() => _channelService.GetByChatOfUser(chatId));
        }

        [HttpPost("create")]
        public async Task<ActionResult<Channel>> CreateChannelAsync(int owningChatId, [FromBody]ChannelRequest request)
        {
            return await HandleCall(() => _channelService.CreateChannel(owningChatId, request));
        }

        [HttpPost("{channelId}/user")]
        public async Task<ActionResult> AddUser(int channelId, [FromBody]int userId)
        {
            return await HandleCall(() => _channelService.AddUser(channelId, userId));
        }

        [HttpDelete("{channelId}/user")]
        public async Task<ActionResult> DeleteUser(int channelId, [FromBody]int userId) 
        {
            return await HandleCall(() => _channelService.RemoveUser(channelId, userId));
        }

        /*[HttpPut("{channelId}/user/{userId}")]
        public async Task<ActionResult> UpdateUserPermissions(int channelId, [FromBody] int userId,
            [FromBody] int permissions)
        {
            return await HandleCall(() => _channelService.ChangePermissions(channelId, userId, permissions));
        }*/

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
