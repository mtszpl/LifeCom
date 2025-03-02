using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Messages;
using LifeCom.Server.Data;
using LifeCom.Server.Hubs;
using LifeCom.Server.Users;
using Microsoft.EntityFrameworkCore;

namespace LifeCom.Server.Models
{
    public class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using(LifeComContext context = new LifeComContext(serviceProvider.GetRequiredService<DbContextOptions<LifeComContext>>())) 
            {
                Chat ferrariChat = new Chat{ name = "Ferrari inside chat" };
                Chat theOtherChat = new Chat {  name = "other" };
                Channel driversChannel = new Channel 
                {
                    name = "drivers",
                    chat = ferrariChat
                };
                Channel formerDriversChannel = new Channel 
                {
                    name = "former-drivers",
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
                    username = "SmoothSainz",
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
                    email = "kimi.raikkonen@alfa.ch",
                    chats = new List<Chat> { ferrariChat },
                    channels = new List<Channel> { formerDriversChannel }
                };       
                User seb = new User
                {
                    username = "Seb",
                    password = "Sbinalla1!",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword("Sbinalla1!"),
                    email = "sebastian.vettel@astonmartin.uk",
                    chats = new List<Chat> { ferrariChat },
                    channels = new List<Channel> { formerDriversChannel }
                };
                User sbinotto = new User
                {
                    username = "Sbinotto",
                    password = "ProntoLegreg1!",
                    passwordHash = BCrypt.Net.BCrypt.HashPassword("ProntoLegreg1!"),
                    email = "mattia.binotto@ferrari.it",
                    chats = new List<Chat> { ferrariChat },
                    channels = new List<Channel> { driversChannel, formerDriversChannel }
                };
                UserChat sbinottoChat = new UserChat
                {
                    user = sbinotto,
                    chat = ferrariChat,
                    role = UserChat.ERole.Admin.ToString()
                };

                if (!context.Chat.Any())                 
                    context.Chat.AddRange(ferrariChat, theOtherChat);
                

                if(!context.Channel.Any())                
                    context.Channel.AddRange(driversChannel, formerDriversChannel);                

                if (!context.UserChats.Any())
                    context.UserChats.AddRange(sbinottoChat);

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
                    context.Users.AddRange(charles, carlos, kimi, seb);

                //await chatHub.Groups.AddToGroupAsync(charles.Id.ToString(), driversChannel.Name);
                //await chatHub.Groups.AddToGroupAsync(carlos.Id.ToString(), driversChannel.Name);

                context.SaveChanges();
            }
        }
    }
}
