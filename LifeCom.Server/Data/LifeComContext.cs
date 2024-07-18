using LifeCom.Server.Users;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Messages;
using LifeCom.Server.Chats.Channels;

namespace LifeCom.Server.Data
{
    public class LifeComContext : DbContext
    {
        public LifeComContext (DbContextOptions<LifeComContext> options) : base(options) 
        { }

        public DbSet<User> Users { get; set; }
        public bool AddUser(User newUser) 
        {
            bool userExists = Users.Any(user => user.username == newUser.username || user.email == newUser.email);
            if (userExists)
                return false;
            Users.Add(newUser);
            return true;
        }

        public DbSet<Message> Message { get; set; } = default!;
        public DbSet<Chat> Chat { get; set; } = default!;
        public DbSet<LifeCom.Server.Chats.Channels.Channel> Channel { get; set; } = default!;
    }
}
