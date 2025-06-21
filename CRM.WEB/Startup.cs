using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.ServiceClient;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Globalization;

namespace CRM.Web;

public class Startup
{
    private IConfiguration Configuration;
    private IWebHostEnvironment Ambiente;

    public Startup(IConfiguration configuration, IWebHostEnvironment ambiente)
    {
        Configuration = configuration;
        Ambiente = ambiente;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMemoryCache();

        this.ConfigurarUsoCamelCaseJSON(services);

        services.AddControllersWithViews();

        services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

        // ✅ Configuração correta do HttpClient e cliente da API
        services.AddHttpClient<IClienteServiceClient, ClienteServiceClient>();

        this.AdicionarMinificacao(services);
    }

    public void Configure(WebApplication app)
    {
        var supportedCultures = new[] { new CultureInfo("pt-BR") };
        app.UseRequestLocalization(new RequestLocalizationOptions
        {
            DefaultRequestCulture = new RequestCulture(culture: "pt-BR", uiCulture: "pt-BR"),
            SupportedCultures = supportedCultures,
            SupportedUICultures = supportedCultures
        });

        if (Ambiente.IsDevelopment() || Ambiente.IsStaging())
        {
            app.UseDeveloperExceptionPage();
        }

        app.Use((context, next) =>
        {
            context.Request.Scheme = "https";
            return next();
        });

        app.UseWebOptimizer();
        app.UseStaticFiles();
        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Inicio}/{action=Index}/{id?}");
        });
    }

    private void ConfigurarUsoCamelCaseJSON(IServiceCollection services)
    {
        services.AddMvcCore().AddNewtonsoftJson(o => o.UseMemberCasing());
    }

    private void AdicionarMinificacao(IServiceCollection services)
    {
        services.AddWebOptimizer(webOptimizer =>
        {
            if (Ambiente.IsDevelopment())
            {
                webOptimizer.AddJavaScriptBundle("/js/bundle.js", NUglify.JavaScript.CodeSettings.Pretty(), "js/views/**/*.js", "js/util/*.js");
                webOptimizer.AddCssBundle("/css/bundle.css", NUglify.Css.CssSettings.Pretty(), "css/views/**/*.css");
            }
            else
            {
                webOptimizer.AddJavaScriptBundle("/js/bundle.js", "js/views/**/*.js", "js/util/*.js");
                webOptimizer.AddCssBundle("/css/bundle.css", "css/views/**/*.css");
                webOptimizer.MinifyJsFiles(
                    "/js/token/*.js",
                    "/js/util/*.js",
                    "/js/views/*.js",
                    "/js/workers/*.js",
                    "/lib/*.js");
                webOptimizer.MinifyCssFiles();
            }
        });
    }
}
