using LifeCom.Server.Data;

namespace LifeCom.Server.Chats
{
    public class ChatService
    {
        private readonly LifeComContext _context;

        public ChatService(LifeComContext context) 
        {
            _context = context;
        }

        public Chat? GetById(int? chatId)
        {
            if (chatId == null)
                return null;
            return _context.Chat.FirstOrDefault(c => c.Id == chatId);
        }
    }
}
