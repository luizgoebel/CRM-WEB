using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.Controllers;

public class ClienteController : Controller
{
    private readonly IClienteServiceClient _clienteServiceClient;

    public ClienteController(IClienteServiceClient clienteServiceClient)
    {
        _clienteServiceClient = clienteServiceClient;
    }

    public async Task<IActionResult> Index()
    {
        List<ClienteViewModel> clientes = await _clienteServiceClient.ObterTodosClientes();
        return View(clientes);
    }
    
    public async Task<IActionResult> ClienteModal(int? id, bool somenteVisualizacao = false)
    {
        ClienteViewModel cliente = id.HasValue
            ? await _clienteServiceClient.ObterPorId(id.Value)
            : new ClienteViewModel();

        ViewBag.SomenteLeitura = somenteVisualizacao;
        return PartialView("_ClienteModal", cliente);
    }
}
