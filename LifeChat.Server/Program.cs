using LifeChat.Server.Data;
using LifeChat.Server.Hubs;
using LifeChat.Server.Models;

using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<LifeComContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("LifeComContext") ?? throw new InvalidOperationException("Connection string 'LifeComContext' not found."));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<LifeComContext>()
    .AddApiEndpoints();

builder.Services.AddAuthentication(IdentityConstants.BearerScheme)
    .AddCookie(IdentityConstants.ApplicationScheme)
    .AddBearerToken(IdentityConstants.BearerScheme);
builder.Services.AddAuthorizationBuilder();

builder.Services.AddDbContext<LifeComContext>();

string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
            policy =>
            {
                policy.WithOrigins("https://localhost:5173/");
            });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
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

app.UseAuthorization();

//app.MapControllers();

app.MapIdentityApi<User>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=index}/{id?}");

//app.UseCors(MyAllowSpecificOrigins);
app.MapFallbackToFile("/index.html");
app.MapHub<ChatHub>("/hub");
app.MapGet("/", (ClaimsPrincipal user) => "kurłaaaa")
    .RequireAuthorization();
app.MapGet("/blocketGet", () => "kurłaaa")
    .RequireAuthorization();



    app.Run();
