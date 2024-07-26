using LifeCom.Server.Users;

namespace LifeCom.Server.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(UserResponse author, string content);
        Task ReceiveMessage(string content);
        Task CreateChannel();
    }
}
