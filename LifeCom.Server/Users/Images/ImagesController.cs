using LifeCom.Server.Data;
using LifeCom.Server.Models;
using LifeCom.Server.Users.Images;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace LifeCom.Server.Users.Pictures
{
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {
        public UserService _userService { get; set; }
        public LifeComContext _lifeComContext { get; set; }

        public ImagesController(LifeComContext context)
        {
            _userService = new UserService(context);
            _lifeComContext = context;
        }

        [NonAction]
        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        [HttpGet]
        public ActionResult GetUserPic()
        {
            ClaimsIdentity? identity = HttpContext.User.Identity as ClaimsIdentity;
            int? id = TokenDataReader.TryReadId(identity);
            User? user = _userService.GetById(id);
            if (user == null)
                return NotFound("User not found");
            Image? image = _lifeComContext.Images.FirstOrDefault(i => i.userId == id);
            if (image == null)
                return Ok(null);
            return Ok(Convert.ToBase64String(image.data));
        }

        [HttpGet("{id}")]
        public ActionResult GetByUser(int id)
        {
            Image? img = _lifeComContext.Images.FirstOrDefault(image => image.userId == id);
            if (img == null) return NotFound("User not found");
            byte[] pic = [];
            using (MemoryStream stream = new MemoryStream())
            {
                FormFile file = new FormFile(stream, 0, stream.Length, "picture", "image/jpeg");
                if (!pic.IsNullOrEmpty())
                    return Ok(pic);
                else
                    return Ok(null);
            }
        }

        [Authorize]
        [HttpPut]
        public ActionResult UploadImage(IFormFile file)
        {
            if (file == null)
                return NotFound("No payload");
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);

            using MemoryStream stream = new MemoryStream();
            file.CopyTo(stream);
            byte[] imageByte = stream.ToArray();

            User? user = _userService.GetById(id);
            if (user == null) return NotFound();
            Image newImage = new Image
            {
                userId = user.Id
            };
            newImage.Set(file, user);
            Image? currentImage = _lifeComContext.Images.FirstOrDefault(image => image.userId == user.Id);
            if (currentImage == null)
                _lifeComContext.Images.Add(newImage);
            else
                currentImage.Copy(newImage);
            _lifeComContext.SaveChanges();
            string base64 = Convert.ToBase64String(imageByte);
            return Ok(base64);

        }

        [HttpPut("{id}")]
        public ActionResult DebugUpload(int id, IFormFile file)
        {
            if (file == null) return NotFound();
            using MemoryStream stream = new MemoryStream();
            file.CopyTo(stream);
            byte[] imageByte = stream.ToArray();
            User? user = _userService.GetById(id);
            if(user == null) return NotFound();
            Image newImage = new Image
            { 
                userId = user.Id
            };
            newImage.Set(file, user);
            Image? currentImage = _lifeComContext.Images.FirstOrDefault(image => image.userId == user.Id);
            if (currentImage == null)
                _lifeComContext.Images.Add(newImage);
            else
                currentImage.Copy(newImage);
            _lifeComContext.SaveChanges();
            return Ok(newImage);

        }

        [Authorize]
        [HttpDelete]
        public ActionResult DeleteProfileImage()
        {
            int? id = TokenDataReader.TryReadId(HttpContext.User.Identity as ClaimsIdentity);
            Image? image = _lifeComContext.Images.FirstOrDefault(x => x.userId == id);
            if (image == null)
                return NotFound("User not found");
            _lifeComContext.Images.Remove(image);
            _lifeComContext.SaveChanges();
            return Ok();
        }
    }
}
