using LifeCom.Server.Users;

namespace LifeCom.Server.Chats
{
    public class UserChat
    {
        public enum ERole
        {
            Admin, User
        };

        public User user {  get; set; }
        public int userId {  get; set; }
        public Chat chat { get; set; }
        public int chatId { get; set; }
        public string? role { get; set; } = ERole.User.ToString();
    }
}
