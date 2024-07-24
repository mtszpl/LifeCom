using LifeCom.Server.Users;

namespace LifeCom.Server.Authorization
{
    public class AuthResponse
    {
        public UserResponse user { get; set; } = null;
        public string token { get; set; } = string.Empty;
        public string refreshToken { get; set; }
    }
}
