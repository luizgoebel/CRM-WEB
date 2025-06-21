using Microsoft.AspNetCore.Mvc;

namespace CRM.Web.Controllers;

public class ProdutoController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
