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

namespace LifeCom.Server.Chats.Channels
{
    [Route("api/[controller]")]
    [Authorize]
    public class ChannelsController : Controller
    {
        private readonly LifeComContext _context;

        public ChannelsController(LifeComContext context)
        {
            _context = context;
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

            return _context.Channel.Where(channel => channel.members.Any(member => member.Id == userId)).ToList();
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
        [HttpDelete]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var channel = await _context.Channel
                .Include(c => c.chat)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (channel == null)
            {
                return NotFound();
            }

            return View(channel);
        }

        // POST: Channels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var channel = await _context.Channel.FindAsync(id);
            if (channel != null)
            {
                _context.Channel.Remove(channel);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ChannelExists(int id)
        {
            return _context.Channel.Any(e => e.Id == id);
        }
    }
}
