using LifeCom.Server.Chats;
using LifeCom.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using NuGet.Protocol;
using System.Security.Claims;
using Newtonsoft.Json;
using static LifeCom.Server.Chats.UserChat;
using Microsoft.AspNetCore.Mvc.Controllers;

namespace LifeCom.Server.Auth.Authorization
{
    public class HasChatAdminRole : IAuthorizationRequirement
    { }

    public class ChatRoleHandler : AuthorizationHandler<HasChatAdminRole, int>
    { 

        private readonly LifeComContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ChatRoleHandler(LifeComContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasChatAdminRole requirement, int chatId)
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

            UserChat? userChat = _context.UserChats.FirstOrDefault(u => u.userId == id && u.chatId == chatId);
            if (userChat == null)
                return Task.CompletedTask;

            if (userChat.role == ERole.Admin.ToString())
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
