using LifeCom.Server.Data;
using LifeCom.Server.Users;
using Microsoft.EntityFrameworkCore;

namespace LifeCom.Server.Chats.Channels
{
    public class ChannelService
    {
        private readonly LifeComContext _context;

        public ChannelService(LifeComContext context)
        {
            _context = context;
        }

        public List<Channel> GetOfUserById(int? userId)
        {
            return _context.Channel.Where(channel => channel.members.Any(member => member.Id == userId)).ToList();
        }

        public List<Channel> GetByChat(int chatId)
        {
            return _context.Channel.Where(ch => ch.chatId == chatId).ToList();
        }

        public List<Channel> GetByChatOfUser(int chatId, int userId)
        {
            return _context.Channel.Where(ch => ch.chatId == chatId && ch.members.FirstOrDefault(u => u.Id == userId) != null).ToList();
        }

        public Task<Channel?> GetByIdAsync(int? id)
        {
            return _context.Channel.FirstOrDefaultAsync(m => m.Id == id);
        }
        public Channel? GetById(int? id)
        {
            return _context.Channel.FirstOrDefault(m => m.Id == id);
        }

        public Task<int> Remove(Channel channel)
        {
            _context.Channel.Remove(channel);
            return _context.SaveChangesAsync();
        }

        public async Task<int> RemoveById(int id) 
        {
            Channel channel = await GetByIdAsync(id);
            if(channel != null)            
               return await Remove(channel);
            return 0;
        }

        public bool AddUserToChannel(int channelId, User user)
        {
            Channel? channel = GetById(channelId);
            if(channel == null)
                return false;
            if (!channel.members.Contains(user))
                channel.members.Add(user);
            else
                return false;
            return true;
        }

        public Channel? CreteChannel(int chatId, string name, int? creatorId)
        {
            User? creator = _context.Users.FirstOrDefault(u => u.Id == creatorId);
            if (creator == null)
                return null;             
            
            Channel channel = new Channel
            {
                chatId = chatId,
                name = name,
                members = new List<User> { creator }
            };
            if(!ChannelOfNameExists(chatId, name))
            {
                _context.Add(channel);
                _context.SaveChanges();
                return channel;
            }    
            return null;
        }

        public bool ChannelOfNameExists(int chatId, string channelName)
        {
            return _context.Channel.Join(_context.Chat, cn => cn.chatId, ch => ch.Id, (cn, chatId) => cn).Any(e => e.name == channelName);
        }

        public bool ChannelExists(int id)
        {
            return _context.Channel.Any(e => e.Id == id);
        }
    }
}
