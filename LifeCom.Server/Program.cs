using LifeCom.Server.Data;
using LifeCom.Server.Hubs;
using LifeCom.Server.Models;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.AspNetCore.Authorization;
using LifeCom.Server.Auth.Authorization;
using Microsoft.AspNetCore.SignalR;
using LifeCom.Server.Chats.Channels;
using LifeCom.Server.Chats;
using LifeCom.Server.Users;
using LifeCom.Server.Messages;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//database
builder.Services.AddDbContext<LifeComContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("LifeComContext") ?? throw new InvalidOperationException("Connection string 'LifeComContext' not found."));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme 
    {
        Description = "Authorization header using Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ChannelService>();
builder.Services.AddScoped<ChatService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<MessageService>();

//SignalIR for Websocket
builder.Services.AddSingleton<IUserIdProvider, LiveComIdProvider>();
builder.Services.AddSignalR();


string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
            policy =>
            {
                policy.WithOrigins("https://localhost:5173")
                .WithMethods("GET", "POST", "PUT", "DELETE")
                .WithHeaders("Content-Type", "Authorization")
                .AllowCredentials();
            });
});

//Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if(!string.IsNullOrEmpty(accessToken)
                && path.StartsWithSegments("/hub"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

//Authorization
builder.Services.AddScoped<IAuthorizationHandler, ChatRoleHandler>();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization(options => {
    options.AddPolicy("ChatAdmin", policy =>
        policy.Requirements.Add(new HasChatAdminRole()));
});

builder.Services.AddControllers();
builder.Services.AddScoped<IAuthorizationHandler, ChatRoleHandler>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await SeedData.Initialize(services);
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseWebSockets();

//app.MapIdentityApi<User>();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=index}/{id?}");

app.MapFallbackToFile("/index.html");
app.MapHub<ChatHub>("/hub");
//app.MapGet("/", (ClaimsPrincipal user) => "kurłaaaa")
//    .RequireAuthorization();
//app.MapGet("/blocketGet", () => "kurłaaa")
//    .RequireAuthorization();



app.Run();
