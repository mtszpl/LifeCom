using System.ComponentModel.DataAnnotations.Schema;

namespace LifeChat.Server.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int? chatId { get; set; } = 0;

        public required string content { get; set; }

        public required int senderId { get; set; }

        public required int receiventId { get; set; }
    }
}
