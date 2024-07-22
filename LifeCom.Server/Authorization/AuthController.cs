using Microsoft.AspNetCore.Mvc;
using LifeCom.Server.Users;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace LifeCom.Server.Authorization
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly LifeComContext _context;
        private readonly IConfiguration _configuration;

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            base.OnActionExecuting(context);
        }

        public AuthController(LifeComContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public void Index()
        {
        }

        [HttpPost("register")]
        public ActionResult<User> Register([FromBody]UserRequest request)
        {
            if(request.e != null)
                return BadRequest(request.e.ToString());

            string refresh = GenerateRefreshToken();
            string passwordHashed = BCrypt.Net.BCrypt.HashPassword(request.password);

            User user = new User
            {
                username = request.username,
                passwordHash = passwordHashed,
                password = request.password,
                email = request.email,
                refreshToken = refresh,
                refreshExpirationTime = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Delete("fresh");
            Response.Cookies.Append("fresh", refresh, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = user.refreshExpirationTime,
                SameSite = SameSiteMode.None,
                IsEssential = true
            });

            if (_context.AddUser(user))
            {
                _context.SaveChanges();
                return Ok(CreateToken(user));
            }
            return BadRequest("User already exists");
        }

        [HttpPost("login")]
        public ActionResult<AuthResponse> Login([FromBody]UserRequest request)
        {
            if ((request.username == string.Empty && request.email == string.Empty) || request.password == string.Empty)
                return BadRequest("No arguments");

            User? searchedUser = null;
            if(request.username != string.Empty)
                searchedUser = _context.Users
                    .SingleOrDefault(user => user.username == request.username);
            else
                searchedUser = _context.Users
                    .SingleOrDefault(user => user.email == request.email);
            if (searchedUser == null)
                return BadRequest("Username or password wrong");
            if (!BCrypt.Net.BCrypt.Verify(request.password, searchedUser.passwordHash))
                return BadRequest("Username or password wrong");

            string refresh = GenerateRefreshToken();
            searchedUser.refreshToken = refresh;
            searchedUser.refreshExpirationTime = DateTime.UtcNow.AddDays(7);
            _context.SaveChanges();

            Response.Cookies.Delete("fresh");

            Response.Cookies.Append("fresh", refresh, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                Expires = searchedUser.refreshExpirationTime,
                SameSite = SameSiteMode.None,
                IsEssential = true
            });

            AuthResponse response = new AuthResponse
            {
                username = searchedUser.username,
                token = CreateToken(searchedUser),
                refreshToken = refresh
            };

            return Ok(response);
        }

        [HttpGet("refresh")]
        public ActionResult<string> Refresh()
        {
            string? refreshToken = Request.Cookies["fresh"];
            if (refreshToken == null)
                return BadRequest("No refresh token");
            User? user = _context.Users.SingleOrDefault(u => u.refreshToken == refreshToken);
            if (user == null)
                return BadRequest("Invalid refresh token");

            return Ok(CreateToken(user));
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>() 
            {
                new Claim(ClaimTypes.Name, user.username),
                new Claim("id", user.Id.ToString())
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));
            SigningCredentials cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            JwtSecurityToken token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddSeconds(10),
                    signingCredentials: cred
                );

            string jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }


    }
}
