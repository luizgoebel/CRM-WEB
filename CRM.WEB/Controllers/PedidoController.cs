using Microsoft.AspNetCore.Mvc;

namespace CRM.WEB.Controllers;

public class PedidoController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
