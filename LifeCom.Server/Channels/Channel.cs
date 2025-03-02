using LifeCom.Server.Users;
using LifeCom.Server.Chats;
using LifeCom.Server.Messages;

namespace LifeCom.Server.Chats.Channels
{
    public class Channel
    {
        public int Id { get; set; }
        public required string name { get; set; } = string.Empty;
        public List<Message> messages { get; set; } = new List<Message>();

        public List<User> members { get; set; } = [];
        public int chatId { get; set; }
        public Chat chat { get; set; } = null!;
        public bool isPublic { get; set; } = true;

    }
}
