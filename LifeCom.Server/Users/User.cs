using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;

namespace LifeCom.Server.Users
{
    public class User
    {
        public int Id { get; set; }
        public required string username { get; set; } = string.Empty;
        public required string passwordHash { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string refreshToken {  get; set; } = string.Empty;
        public DateTime refreshExpirationTime { get; set; }

        public List<Chat> chats { get; set; } = [];
        public List<Channel> channels { get; set; } = [];
    }
}
