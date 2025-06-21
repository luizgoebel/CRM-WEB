using CRM.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CRM.WEB.Controllers;

public class InicioController : BaseController
{
    public async Task<IActionResult> Index()
    {
        try
        {
            return RedirectToAction("Index", "DashBoard");
        }
        catch
        {
            return RedirectToAction("Index", "AcessoNaoAutorizado");
        }
    }
}
