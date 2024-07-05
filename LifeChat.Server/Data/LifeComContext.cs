using LifeChat.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LifeChat.Server.Data
{
    public class LifeComContext : IdentityDbContext<User>
    {
        public LifeComContext (DbContextOptions<LifeComContext> options) : base(options) 
        { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultSchema("identity");

        }
        public DbSet<LifeChat.Server.Models.Message> Message { get; set; } = default!;
    }
}
