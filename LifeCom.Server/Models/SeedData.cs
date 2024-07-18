using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Chats.Messages;
using LifeCom.Server.Data;
using LifeCom.Server.Users;
using Microsoft.EntityFrameworkCore;

namespace LifeCom.Server.Models
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using(LifeComContext context = new LifeComContext(serviceProvider.GetRequiredService<DbContextOptions<LifeComContext>>())) 
            {
                Chat ferrariChat = new Chat{ Name = "Ferrari inside chat" };
                Channel driversChannel = new Channel 
                {
                    Name = "drivers",
                    chat = ferrariChat
                };
                User charles = new User
                {
                    username = "Shaar",
                    password = "IamStupid1!",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword("IamStupid1!"),
                    email = "charles.legreg@ferrari.it",
                    chats = new List<Chat> { ferrariChat },
                    channels = new List<Channel> { driversChannel }
                };
                User carlos = new User
                {
                    username = "ChilliCarlos",
                    password = "SmoothOperator1!",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword("SmoothOperator1!"),
                    email = "carlos.sainz@ferrari.it",
                    chats = new List<Chat> { ferrariChat },
                    channels = new List<Channel> { driversChannel }
                };
                User kimi = new User
                {
                    username = "KoolKimi",
                    password = "Bwoah1!",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword("Bwoah1!"),
                    email = "kimi.raikkonen@alfa.ch"
                };

                if (!context.Chat.Any())                 
                    context.Chat.AddRange(ferrariChat);
                

                if(!context.Channel.Any())                
                    context.Channel.AddRange(driversChannel);                

                if (!context.Message.Any())
                {
                    context.Message.AddRange(
                        new Message
                        {
                            content = "Can I pls pass?",
                            author = charles,
                            authorId = charles.Id,
                            channel = driversChannel,
                            channelId = driversChannel.Id
                        },
                        new Message
                        {
                            content = "Can you not?",
                            author = carlos,
                            authorId = carlos.Id,
                            channel = driversChannel,
                            channelId = driversChannel.Id
                        });
                }

                if (!context.Users.Any())                
                    context.Users.AddRange(charles, carlos, kimi);
                

                context.SaveChanges();
            }
        }
    }
}
