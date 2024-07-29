using LifeCom.Server.Chats;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using NuGet.Protocol;
using System.Security.Claims;
using Newtonsoft.Json;
using static LifeCom.Server.Chats.UserChat;

namespace LifeCom.Server.Auth.Authorization
{
    public class HasChatRole : IAuthorizationRequirement
    { }

    public class ChatRoleHandler : AuthorizationHandler<HasChatRole> 
    {
        private class ChatAuthData
        {
            public int chatId = -1;
            public string name = string.Empty;
        }

        private readonly LifeComContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChatRoleHandler(LifeComContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
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
            if (_httpContextAccessor.HttpContext == null)
                return Task.CompletedTask;

            string? chatIdString = _httpContextAccessor.HttpContext.Request.Query["atChat"];
            if (chatIdString == null)
                return Task.CompletedTask;
            int chatId = int.Parse(chatIdString);



            UserChat? userChat = _context.UserChats.FirstOrDefault(u => u.userId == id && u.chatId == chatId);
            if (userChat == null)
                return Task.CompletedTask;

            if (userChat.role == ERole.Admin.ToString())
                context.Succeed(requirement);


            return Task.CompletedTask;
        }
    }
}
