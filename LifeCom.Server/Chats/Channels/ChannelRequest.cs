namespace LifeCom.Server.Chats.Channels
{
    public class ChannelRequest
    {
        public int chatId { get; set; } = -1;
        public string name { get; set; } = string.Empty;
        public bool isAvailableByDefault { get; set; } = true;
    }
}
