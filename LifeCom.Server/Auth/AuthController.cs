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
        private const string refreshCookieName = "fresh";

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

            Response.Cookies.Delete(refreshCookieName);
            Response.Cookies.Append(refreshCookieName, refresh, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = user.refreshExpirationTime,
                SameSite = SameSiteMode.None,
                IsEssential = true
            });

            string token = CreateToken(user);
            if (_context.AddUser(user))
            {
                _context.SaveChanges();
                AuthResponse response = new AuthResponse
                {
                    user = new UserResponse(user),
                    token = token,
                    refreshToken = user.refreshToken
                };
                return Ok(response);
            }
            return BadRequest("User already exists");
        }

        private bool checkLoginParamsAreProvided(UserRequest request)
        {
            return !(request.username == string.Empty && request.email == string.Empty) || request.password != string.Empty;
        }

        [HttpPost("login")]
        public ActionResult<AuthResponse> Login([FromBody]UserRequest request)
        {
 
            if (!checkLoginParamsAreProvided(request) && Request.Cookies[refreshCookieName] == null)
                return BadRequest("No arguments");

            User? searchedUser = null;
            if (request.username != string.Empty)
                searchedUser = _context.Users
                    .SingleOrDefault(user => user.username == request.username);
            else if (request.email != string.Empty)
                searchedUser = _context.Users
                    .SingleOrDefault(user => user.email == request.email);
            else if (Request.Cookies[refreshCookieName] != null)
            {
                User? debugUser = _context.Users
                    .SingleOrDefault(u => u.refreshToken == Request.Cookies[refreshCookieName]);
                searchedUser = _context.Users
                    .SingleOrDefault(u => u.refreshToken == Request.Cookies[refreshCookieName] && u.refreshExpirationTime.CompareTo(DateTime.UtcNow) >= 0);
            }

            if (searchedUser == null)
                return BadRequest("Username or password wrong");
            if (!BCrypt.Net.BCrypt.Verify(request.password, searchedUser.passwordHash) && Request.Cookies[refreshCookieName] == null)
                return BadRequest("Username or password wrong");

            if(searchedUser.refreshExpirationTime.CompareTo(DateTime.UtcNow) <= 0)
            {
                searchedUser.refreshToken = GenerateRefreshToken();
                searchedUser.refreshExpirationTime = DateTime.UtcNow.AddDays(7);
                _context.SaveChanges();
            }

            Response.Cookies.Delete(refreshCookieName);

            Response.Cookies.Append(refreshCookieName, searchedUser.refreshToken, new CookieOptions {
                HttpOnly = true,
                Secure = true,
                Expires = searchedUser.refreshExpirationTime,
                SameSite = SameSiteMode.None,
                IsEssential = true
            });

            AuthResponse response = new AuthResponse
            {
                user = new UserResponse(searchedUser),
                token = CreateToken(searchedUser),
                //refreshToken = refresh
            };

            return Ok(response);
        }


        [HttpGet("refresh")]
        public ActionResult<string> Refresh()
        {
            string? refreshToken = Request.Cookies[refreshCookieName];
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
                    expires: DateTime.Now.AddHours(1),
                    signingCredentials: cred
                );

            string jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        private string GenerateRefreshToken()
        {
            byte[] randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }


    }
}
