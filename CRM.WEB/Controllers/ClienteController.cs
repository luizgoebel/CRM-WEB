using CRM.Web.Exceptions;
using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.TagHelpers;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CRM.Web.Controllers;

public class ClienteController : Controller
{
    private readonly IClienteServiceClient _clienteServiceClient;
    private readonly RazorViewToStringRenderer _renderer;

    public ClienteController(IClienteServiceClient clienteServiceClient, RazorViewToStringRenderer renderer)
    {
        this._clienteServiceClient = clienteServiceClient;
        this._renderer = renderer;
    }

    public IActionResult Index()
    {
        try
        {
            return View(new ClienteIndexViewModel());
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
            PaginacaoResultado<ClienteViewModel> resultado = await this._clienteServiceClient.ObterClientesPaginados(filtro ?? "", page, pageSize);

            ClienteIndexViewModel model = new()
            {
                Itens = resultado.Itens,
                Paginacao = new()
                {
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            string htmlTabela = await this._renderer.RenderViewToStringAsync(this.ControllerContext, "_TabelaClientes", model.Itens);
            string htmlPaginacao = await this._renderer.RenderViewToStringAsync(this.ControllerContext, "_Paginacao", model.Paginacao);

            return Json(new { tabelaHtml = htmlTabela, paginacaoHtml = htmlPaginacao });
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
                ? await this._clienteServiceClient.ObterPorId(id.Value)
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
            await this._clienteServiceClient.SalvarCliente(clienteViewModel);

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

