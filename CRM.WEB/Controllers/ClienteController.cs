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

    public async Task<IActionResult> Index(int page = 1)
    {
        try
        {
            const int pageSize = 15;
            var resultado = await _clienteServiceClient.ObterClientesPaginados(page, pageSize);
            ViewBag.TotalPaginas = resultado.TotalPaginas;
            ViewBag.PaginaAtual = resultado.PaginaAtual;
            return View(resultado.Clientes);
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

