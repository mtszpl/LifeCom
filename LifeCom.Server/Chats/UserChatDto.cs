namespace LifeCom.Server.Chats
{
    public partial class ChatService
    {
        public class UserChatDto
        {
            public Chat Chat { get; set; } // Assuming 'Chat' is your chat entity class
            public string Role { get; set; } // Assuming 'role' is a string
        }
    }
}
