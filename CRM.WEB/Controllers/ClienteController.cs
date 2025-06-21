using Microsoft.AspNetCore.Mvc;

namespace CRM.Web.Controllers;

public class ClienteController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
