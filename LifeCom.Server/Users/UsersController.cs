using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using LifeCom.Server.Models;

namespace LifeCom.Server.Users
{
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : Controller
    {
        private readonly UserService _userService;


        public UsersController(LifeComContext context)
        {
            _userService = new UserService(context);
        }

        [HttpGet]
        public ActionResult<UserResponse> GetSelf() 
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return StatusCode(403);
            string authHeader = Request.Headers["Authorization"].ToString();
            string? idString = identity.FindFirst("id")?.Value;
            if (idString == null)
                return Forbid();
            int userId = int.Parse(idString);
            string? token = Request.Headers.FirstOrDefault(h => h.Key == "Authorization").Value;
            if (token == null)
                return Forbid();
            token = token.Remove(0, "Bearer ".Length);
            User? user = _userService.GetById(userId);
            if (user == null)
                return BadRequest("User ID not found");
            UserResponse response = new UserResponse(user);
            return Ok(response);
        }

        [HttpGet("byName")]
        public ActionResult<List<UserResponse>> GetByName([FromBody] string namePart)
        {
            if(namePart == null)
                return NotFound();
            List<UserResponse> users = _userService.GetByNamePart(namePart).Select(u => new UserResponse(u)).OrderBy(ur => ur.username).Take(20).ToList();
            return users;
        }

        public class ImageDTO
        {
            public string name { get; set; }
            public IFormFile image { get; set; }
        }

        [HttpPut("username")]
        public ActionResult<UserResponse> ChangeUsername([FromBody] string newName)
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            User? user = _userService.ChangeUsername(id, newName);
            if (user != null)
                return Ok(new UserResponse(user));
            else
                return BadRequest("Error occured");
        }

        [HttpPut("email")]
        public ActionResult ChangeEmail([FromBody] string newEmail)
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            User? user = _userService.ChangeEmail(id, newEmail);
            if (user != null)
                return Ok(new UserResponse(user));
            else
                return BadRequest("Error occured");
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
                    await _userService.Update(user);
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

            var user = await _userService.GetByIdAsync(id);
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
            var user = await _userService.FindAsync(id);
            if (user != null)
            {
                await _userService.Remove(user);
            }

            return RedirectToAction(nameof(Index));
        }

        private bool UserExists(int id)
        {
            return _userService.UserExists(id);
        }
    }
}
