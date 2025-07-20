using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CRM.WEB.Controllers;

public class InicioController : Controller
{
    private readonly IInicioServiceClient _inicioServiceClient;

    public InicioController(IInicioServiceClient inicioServiceClient)
    {
        _inicioServiceClient = inicioServiceClient;
    }

    public async Task<IActionResult> Index()
    {
        DashboardViewModel dashboardView = await _inicioServiceClient.ObterDadosDashboard();

        return View(dashboardView);
    }
}
