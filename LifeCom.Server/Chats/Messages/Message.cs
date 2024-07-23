using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Users;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeCom.Server.Chats.Messages
{
    public class Message
    {
        public int Id { get; set; }
        public required string content { get; set; }
        public DateTime timestamp { get; set; } = DateTime.UtcNow;

        public required int channelId { get; set; }
        public Channel channel { get; set; } = null!;
        public required int authorId { get; set; }
        public User author { get; set; } = null!;

    }
}
