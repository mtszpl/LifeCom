using LifeCom.Server.Chats;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Security.Claims;
using static LifeCom.Server.Chats.UserChat;

namespace LifeCom.Server.Auth.Authorization
{
    public class HasChatRole : IAuthorizationRequirement
    { }

    public class ChatRoleHandler : AuthorizationHandler<HasChatRole> 
    {
        private readonly LifeComContext _context;

        public ChatRoleHandler(LifeComContext context)
        {
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasChatRole requirement)
        {
            ClaimsIdentity? identity = context.User.Identity as ClaimsIdentity;
            if (identity == null) 
                return Task.CompletedTask;
            string? idString = identity.FindFirst("id")?.Value;
            if(idString == null) 
                return Task.CompletedTask;
            int id = int.Parse(idString);
            UserChat? userChat = _context.UserChats.FirstOrDefault(u => u.userId == id);
            if(userChat == null) return Task.CompletedTask;

            if (userChat.role == ERole.Admin.ToString())
                context.Succeed(requirement);


            return Task.CompletedTask;
        }
    }
}
