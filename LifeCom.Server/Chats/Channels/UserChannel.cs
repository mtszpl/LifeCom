namespace LifeCom.Server.Chats.Channels
{
    public class UserChannel
    {
        public int userId {  get; set; }
        public int channelId { get; set; }
        public bool connected { get; set; } = false;

    }
}
