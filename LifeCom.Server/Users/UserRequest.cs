namespace LifeCom.Server.Users
{
    public class UserRequest
    {
        public string username { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string? email { get; set; } = null;

    }
}
