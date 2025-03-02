using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace LifeCom.Server.Hubs
{
    public class LiveComIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            ClaimsIdentity? identity = connection.User.Identity as ClaimsIdentity;
            if (identity == null) return null;

            // Use a custom claim (e.g., "id") as the user identifier
            return identity.FindFirst("id")?.Value;
            throw new NotImplementedException();
        }
    }
}
