using CRM.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

Startup startup = new(builder.Configuration, builder.Environment);
startup.ConfigureServices(builder.Services);
builder.WebHost.UseUrls($"http://*:{Environment.GetEnvironmentVariable("PORT") ?? "80"}");
WebApplication app = builder.Build();
startup.Configure(app);

app.Run();