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

            using StreamReader reader = new StreamReader(_httpContextAccessor.HttpContext.Request.Body);
            string queryParams = reader.ReadToEndAsync().Result;
  
            ChatAuthData? requestBody = JsonConvert.DeserializeObject<ChatAuthData>(queryParams);
            if (requestBody == null)
                return Task.CompletedTask;


            UserChat? userChat = _context.UserChats.FirstOrDefault(u => u.userId == id && u.chatId == requestBody.chatId);
            if (userChat == null) return Task.CompletedTask;

            if (userChat.role == ERole.Admin.ToString())
                context.Succeed(requirement);


            return Task.CompletedTask;
        }
    }
}
