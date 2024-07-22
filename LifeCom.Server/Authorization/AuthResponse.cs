namespace LifeCom.Server.Authorization
{
    public class AuthResponse
    {
        public string username { get; set; } = string.Empty;
        public string token { get; set; } = string.Empty;
        public string refreshToken { get; set; }
    }
}
