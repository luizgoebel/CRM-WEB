using CRM.Web.Exceptions;
using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
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
        try
        {
            List<ClienteViewModel> clientes = await _clienteServiceClient.ObterTodosClientes();
            return View(clientes);
        }
        catch (DomainException ex)
        {
            return GerenciadorRespostaJSON.create(ex.Message, true);
        }
        catch (Exception ex)
        {
            return GerenciadorRespostaJSON.create("Ocorreu um erro inesperado.", true, ex.Message);
        }
    }

    public async Task<IActionResult> ClienteModal(int? id, bool somenteVisualizacao = false)
    {
        try
        {
            ClienteViewModel cliente = id.HasValue
                ? await _clienteServiceClient.ObterPorId(id.Value)
                : new ClienteViewModel();

            ViewBag.SomenteLeitura = somenteVisualizacao;
            return PartialView("_ClienteModal", cliente);
        }
        catch (DomainException ex)
        {
            return GerenciadorRespostaJSON.create(ex.Message, true);
        }
        catch (Exception ex)
        {
            return GerenciadorRespostaJSON.create("Ocorreu um erro inesperado.", true, ex.Message);
        }
    }
    public async Task<JsonResult> SalvarCliente(ClienteViewModel clienteViewModel)
    {
        try
        {
            await _clienteServiceClient.SalvarCliente(clienteViewModel);
            return GerenciadorRespostaJSON.create();
        }
        catch (DomainException ex)
        {
            return GerenciadorRespostaJSON.create(ex.Message, true);
        }
        catch (Exception ex)
        {
            return GerenciadorRespostaJSON.create("Ocorreu um erro inesperado.", true, ex.Message);
        }
    }
}

