using Microsoft.AspNetCore.Mvc;

namespace CRM.WEB.Controllers;

public class InicioController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
