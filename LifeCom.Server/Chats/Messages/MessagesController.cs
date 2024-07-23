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

namespace LifeCom.Server.Chats.Messages
{
    [Route("api/[controller]")]
    [Authorize]
    public class MessagesController : Controller
    {
        private readonly LifeComContext _context;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private readonly UserService _userService;
        private readonly ChannelService _channelService;
        public MessagesController(LifeComContext context, IHubContext<ChatHub, IChatClient> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
            _userService = new UserService(context);
            _channelService = new ChannelService(context);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
        }


        // GET: Messages
        [NonAction]
        public async Task<IActionResult> Index()
        {
            return View(await _context.Message.ToListAsync());
        }

        [HttpGet]
        public ActionResult<List<Message>> GetByChannelId(int id)
        {
            List<Message> messages = _context.Message.Where(msg => msg.channelId == id).Include(msg => msg.author).ToList();
            messages.OrderByDescending(msg => msg.timestamp).ToList();
            return Ok(messages);
        }

        //[HttpGet]
        [NonAction]
        public async Task<List<Message>> Read()
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                throw new InvalidOperationException("Unidentified user");

            string? userName = identity.FindFirst(ClaimTypes.Name)?.Value;
            if (userName == null)
                throw new InvalidOperationException("User name is null.");
            User? sendingUser = _context.Users.Where(user => user.username == userName).FirstOrDefault();
            if (sendingUser == null)
                throw new InvalidOperationException("User not found.");
            return await _context.Message.Where(msg => msg.authorId == sendingUser.Id)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Message>> SendMessage([FromBody]MessageRequest messageRequest)
        {
            if (messageRequest.content == string.Empty || messageRequest.channelId == null)            
                return BadRequest("Content missing");
            
            Console.WriteLine(messageRequest);

            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                throw new InvalidOperationException("Unidentified user");

            int? id = int.Parse(identity.FindFirst("id").Value);
            if(!id.HasValue)
                return NotFound("User not found");

            User? author = _userService.GetById(id);
            if (author == null)
                return NotFound("User not found");
            Channel? channel = _channelService.GetById(messageRequest.channelId);
            if (channel == null)
                return NotFound("Channel not found");

            Message message = new Message
            {
                content = messageRequest.content,
                author = null,
                authorId = author.Id,
                channel = null,
                channelId = channel.Id
            };
            await _context.Message.AddAsync(message);
            //await _context.SaveChangesAsync();

            await _hubContext.Clients.Group(channel!.Id.ToString()).ReceiveMessage(author, message.content);

            return Ok(message);
        }

        [HttpGet("read")]
        public Task<List<Message>> ReadChatMessages(int chatId)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;


            List<Message> filteredMesages = _context.Message.Where(msg => msg.channelId == chatId).ToList();
            return Task.FromResult(filteredMesages);
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
