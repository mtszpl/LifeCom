using Microsoft.AspNetCore.Identity;

namespace LifeChat.Server.Models
{
    public class User : IdentityUser
    {
        public List<int>? chats { get; set; }
    }
}
