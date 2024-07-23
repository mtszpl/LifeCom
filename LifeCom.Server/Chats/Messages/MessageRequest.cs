
using LifeCom.Server.Chats.Channels;

namespace LifeCom.Server.Chats.Messages
{
    public class MessageRequest
    {
        public string content {  get; set; } = string.Empty;
        public int channelId { get; set; } = -1;
    }
}
