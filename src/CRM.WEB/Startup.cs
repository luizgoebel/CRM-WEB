using CRM.Web.ServiceClient;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.TagHelpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
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
        // Tenta ler a URL da API da variável de ambiente primeiro
        var apiBaseUrlFromEnv = Environment.GetEnvironmentVariable("API_BASE_URL");
        Uri crmApiBaseAddress;

        if (!string.IsNullOrEmpty(apiBaseUrlFromEnv))
        {
            crmApiBaseAddress = new Uri(apiBaseUrlFromEnv);
            Console.WriteLine($"Usando API_BASE_URL do ambiente: {apiBaseUrlFromEnv}"); // Log para depuração
        }
        else
        {
            // Fallback para ler do appsettings.json se a variável de ambiente não estiver definida
            crmApiBaseAddress = new Uri(Configuration.GetSection("AppSettings")["CrmApi"]);
            Console.WriteLine($"Usando API_BASE_URL do appsettings.json: {crmApiBaseAddress}"); // Log para depuração
        }

        services.AddMemoryCache();
        services.AddControllersWithViews();
        ConfigurarUsoCamelCaseJSON(services);

        services.AddScoped<RazorViewToStringRenderer>();

        services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

        // Configura o HttpClient já com o BaseAddress obtido (da variável de ambiente ou appsettings.json)
        services.AddHttpClient<IProdutoServiceClient, ProdutoServiceClient>(client =>
        {
            client.BaseAddress = crmApiBaseAddress;
        });
        services.AddHttpClient<IClienteServiceClient, ClienteServiceClient>(client =>
        {
            client.BaseAddress = crmApiBaseAddress;
        });
        services.AddHttpClient<IPedidoServiceClient, PedidoServiceClient>(client =>
        {
            client.BaseAddress = crmApiBaseAddress;
        });
        services.AddHttpClient<IInicioServiceClient, InicioServiceClient>(client =>
        {
            client.BaseAddress = crmApiBaseAddress;
        });

        AdicionarMinificacao(services);
    }

    public void Configure(WebApplication app)
    {
        var supportedCultures = new[] { new CultureInfo("pt-BR") };
        app.UseRequestLocalization(new RequestLocalizationOptions
        {
            DefaultRequestCulture = new RequestCulture("pt-BR"),
            SupportedCultures = supportedCultures,
            SupportedUICultures = supportedCultures
        });

        if (Ambiente.IsDevelopment() || Ambiente.IsStaging())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection(); // Força HTTPS

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
