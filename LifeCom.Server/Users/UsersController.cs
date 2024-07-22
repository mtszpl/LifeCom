using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;
using Microsoft.AspNet.SignalR;
using System.Security.Claims;

namespace LifeCom.Server.Users
{
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : Controller
    {
        private readonly LifeComContext _context;

        public UsersController(LifeComContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<string> GetUsername() 
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return Forbid("Unauthorized");
            string? idString = identity.FindFirst("id")?.Value;
            if (idString == null)
                return Forbid("Unathorized");
            int userId = int.Parse(idString);
            string? token = Request.Headers.FirstOrDefault(h => h.Key == "Authorization").Value;
            if (token == null)
                return Forbid();
            token = token.Remove(0, "Bearer ".Length);
            User user = _context.Users.FirstOrDefault(user => user.Id == userId);
            if (user == null)
                return BadRequest("User ID not found");

            return Ok(user.username);
        }


        // POST: Users/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("/edit")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,username,passwordHash,password,email")] User user)
        {
            if (id != user.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(user);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(user.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(user);
        }

        // GET: Users/Delete/5
        [HttpDelete]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(m => m.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // POST: Users/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
