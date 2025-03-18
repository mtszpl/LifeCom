﻿using LifeCom.Server.Users;
using Microsoft.EntityFrameworkCore;
using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Messages;
using LifeCom.Server.Images;

namespace LifeCom.Server.Data
{
    public class LifeComContext : DbContext
    {
        public LifeComContext (DbContextOptions<LifeComContext> options) : base(options) 
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>()
            //    .HasMany(u => u.chats)
            //    .WithMany(c => c.members)
            //    .UsingEntity<UserChat>(j => j.Property(uc => uc.role).HasDefaultValueSql("USER"));

            modelBuilder.Entity<UserChat>()
                .HasKey(uc => new { uc.userId, uc.chatId });
            
            modelBuilder.Entity<UserChat>()
                .HasOne(uc => uc.user)
                .WithMany(u => u.chats)
                .HasForeignKey(uc => uc.userId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<UserChat>()
                .HasOne(uc => uc.chat)
                .WithMany(ch => ch.members)
                .HasForeignKey(uc => uc.chatId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Channel>()
                .HasMany(c => c.messages)
                .WithOne(m => m.channel)
                .HasForeignKey(m => m.channelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Chat>()
                .HasMany(ch => ch.channels)
                .WithOne(channel => channel.chat)
                .OnDelete(DeleteBehavior.Cascade);
        }

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
        public DbSet<UserChat> UserChats { get; set; } = default;
        public DbSet<Channel> Channel { get; set; } = default!;
        public DbSet<Image> Images { get; set; } = default;
    }
}
