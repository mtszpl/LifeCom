using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authorization;
using LifeCom.Server.Users;
using LifeCom.Server.Hubs;
using LifeCom.Server.Chats.Channels;
using Microsoft.AspNetCore.SignalR;
using LifeCom.Server.Models;
using LifeCom.Server.Controllers;

namespace LifeCom.Server.Messages
{
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : IBaseLifeComController
    {
        private readonly MessageService _messageService;
        public MessagesController(MessageService messageService)
        {
            _messageService = messageService;
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
        }


        // GET: Messages
        [NonAction]
        public async Task<IActionResult> Index()
        {
            return Ok();
        }

        [HttpGet]
        public ActionResult<List<Message>> GetByChannelId(int id)
        {
            return HandleCall(() => _messageService.GetByChannelId(id));
        }

        ////[HttpGet]
        //[NonAction]
        //public async Task<List<Message>> Read()
        //{
        //    ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
        //    if (identity == null)
        //        throw new InvalidOperationException("Unidentified user");

        //    string? userName = identity.FindFirst(ClaimTypes.Name)?.Value;
        //    if (userName == null)
        //        throw new InvalidOperationException("User name is null.");
        //    User? sendingUser = _context.Users.Where(user => user.username == userName).FirstOrDefault();
        //    if (sendingUser == null)
        //        throw new InvalidOperationException("User not found.");
        //    return await _context.Message.Where(msg => msg.authorId == sendingUser.Id)
        //        .ToListAsync();
        //}

        [HttpPost]
        public async Task<ActionResult<Message>> SendMessage([FromBody] MessageRequest messageRequest)
        {
            return await HandleCall(() => _messageService.SendMessage(messageRequest));
        }

        [HttpGet("read")]
        public ActionResult<List<Message>> ReadChannelMessages(int channelId)
        {
            return HandleCall(() => _messageService.ReadChannelMessages(channelId));
        }

        // GET: Messages/Details/5
        //public async Task<IActionResult> Details(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var message = await _context.Message
        //        .FirstOrDefaultAsync(m => m.Id == id);
        //    if (message == null)
        //    {
        //        return NotFound();
        //    }

        //    return View(message);
        //}

        //    // GET: Messages/Create
        //    public IActionResult Create()
        //    {
        //        return View();
        //    }

        //    // POST: Messages/Create
        //    // To protect from overposting attacks, enable the specific properties you want to bind to.
        //    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //    [HttpPost]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> Create([Bind("Id,chatId,content,senderId,receiventId")] Message message)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            _context.Add(message);
        //            await _context.SaveChangesAsync();
        //            return RedirectToAction(nameof(Index));
        //        }
        //        return View(message);
        //    }

        //    // GET: Messages/Edit/5
        //    public async Task<IActionResult> Edit(int? id)
        //    {
        //        if (id == null)
        //        {
        //            return NotFound();
        //        }

        //        var message = await _context.Message.FindAsync(id);
        //        if (message == null)
        //        {
        //            return NotFound();
        //        }
        //        return View(message);
        //    }

        //    // POST: Messages/Edit/5
        //    // To protect from overposting attacks, enable the specific properties you want to bind to.
        //    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //    [HttpPost]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> Edit(int id, [Bind("Id,chatId,content,senderId,receiventId")] Message message)
        //    {
        //        if (id != message.Id)
        //        {
        //            return NotFound();
        //        }

        //        if (ModelState.IsValid)
        //        {
        //            try
        //            {
        //                _context.Update(message);
        //                await _context.SaveChangesAsync();
        //            }
        //            catch (DbUpdateConcurrencyException)
        //            {
        //                if (!MessageExists(message.Id))
        //                {
        //                    return NotFound();
        //                }
        //                else
        //                {
        //                    throw;
        //                }
        //            }
        //            return RedirectToAction(nameof(Index));
        //        }
        //        return View(message);
        //    }

        //    // GET: Messages/Delete/5
        //    public async Task<IActionResult> Delete(int? id)
        //    {
        //        if (id == null)
        //        {
        //            return NotFound();
        //        }

        //        var message = await _context.Message
        //            .FirstOrDefaultAsync(m => m.Id == id);
        //        if (message == null)
        //        {
        //            return NotFound();
        //        }

        //        return View(message);
        //    }

        //    // POST: Messages/Delete/5
        //    [HttpPost, ActionName("Delete")]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> DeleteConfirmed(int id)
        //    {
        //        var message = await _context.Message.FindAsync(id);
        //        if (message != null)
        //        {
        //            _context.Message.Remove(message);
        //        }

        //        await _context.SaveChangesAsync();
        //        return RedirectToAction(nameof(Index));
        //    }

        //    private bool MessageExists(int id)
        //    {
        //        return _context.Message.Any(e => e.Id == id);
        //    }
    }
}
