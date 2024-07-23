using LifeCom.Server.Users;

namespace LifeCom.Server.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(User author, string content);
        Task ReceiveMessage(string content);
    }
}
