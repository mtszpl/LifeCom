using LifeCom.Server.Data;
using LifeCom.Server.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace LifeCom.Server.Users
{
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {
        public UserService userService { get; set; }

        public ImagesController(LifeComContext context) 
        { 
            userService = new UserService(context);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUserPic()
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            int? id = TokenDataReader.TryReadId(identity);
            User? user = userService.GetById(id);
            if (user == null)
                return NotFound("User not found");
            return File(user.profilePic, "image/jpeg");
        }

        [HttpGet("img/{id}")]
        public ActionResult GetByUser(int id)
        {
            return Ok(userService.GetById(id));
        }
    }
}
