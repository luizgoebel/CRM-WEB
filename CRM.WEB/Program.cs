using CRM.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

Startup startup = new(builder.Configuration, builder.Environment);
startup.ConfigureServices(builder.Services);

WebApplication app = builder.Build();
startup.Configure(app);

app.Run();