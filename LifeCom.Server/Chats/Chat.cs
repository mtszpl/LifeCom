using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Users;

namespace LifeCom.Server.Chats
{

    public class Chat
    {
        public int Id { get; set; }
        public string name { get; set; } = string.Empty;

        public List<Channel> channels { get; set; } = [];
        public List<User> members { get; set; } = [];
    }
}
