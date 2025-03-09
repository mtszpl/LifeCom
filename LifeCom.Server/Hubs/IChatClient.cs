using LifeCom.Server.Chats;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Users;

namespace LifeCom.Server.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(UserResponse author, string content);
        Task ReceiveMessage(string content);
        Task AddedToChannel(Channel channel);
        Task AddedToChat(Chat chat);
        Task CreateChannel();
    }
}
