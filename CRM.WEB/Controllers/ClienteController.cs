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
            const int pageSize = 25;
            var resultado = await _clienteServiceClient.ObterClientesPaginados("", page, pageSize);
            var clienteIndexViewModel = new ClienteIndexViewModel
            {
                Itens = resultado.Itens,
                Paginacao = new PaginacaoViewModel
                {
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            return View(clienteIndexViewModel);
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

    [HttpGet]
    public async Task<IActionResult> BuscarAjax(string filtro, int page = 1)
    {
        try
        {
            int pageSize = 25;
            var resultado = await _clienteServiceClient.ObterClientesPaginados(filtro ?? "",page, pageSize);

            if (resultado == null || resultado.Itens == null)
            {
                return Json(new PaginacaoResultado<ClienteViewModel>
                {
                    Itens = new List<ClienteViewModel>(),
                    Total = 0,
                    PaginaAtual = page,
                    TotalPaginas = 0
                });
            }

            return Json(resultado);
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

