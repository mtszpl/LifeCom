using LifeChat.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace LifeChat.Server.Models
{
    public class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using(LifeComContext context = new LifeComContext(serviceProvider.GetRequiredService<DbContextOptions<LifeComContext>>())) 
            {
                if (context.Message.Any())
                {
                    return;
                }
                else
                {
                    Console.WriteLine("placeholder");
                }

                context.Message.AddRange(
                    new Message
                    {
                        content = "Can I pls pass?",
                        senderId = 0,
                        receiventId = 1
                    },
                    new Message
                    {
                        content = "Can you not?",
                        senderId = 1,
                        receiventId = 0
                    });

                context.SaveChanges();
            }
        }
    }
}
