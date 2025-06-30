using CRM.Web.Exceptions;
using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.TagHelpers;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CRM.WEB.Controllers;

public class PedidoController : Controller
{
    private readonly IPedidoServiceClient _pedidoServiceClient;
    private readonly RazorViewToStringRenderer _renderer;

    public PedidoController(IPedidoServiceClient pedidoServiceClient, RazorViewToStringRenderer renderer)
    {
        this._pedidoServiceClient = pedidoServiceClient;
        this._renderer = renderer;
    }

    public async Task<IActionResult> Index(int pagina = 1, string filtro = "")
    {
        try
        {
            int pageSize = 25;
            PaginacaoResultado<PedidoViewModel> resultado = await this._pedidoServiceClient.ObterPedidosPaginados(filtro, pagina, pageSize);
            PedidoIndexViewModel model = new()
            {
                Itens = resultado.Itens,
                Paginacao = new()
                {
                    Controller = "Pedido",
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            return View(model);
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
            PaginacaoResultado<PedidoViewModel> resultado = await this._pedidoServiceClient.ObterPedidosPaginados(filtro ?? "", page, pageSize);

            PedidoIndexViewModel model = new()
            {
                Itens = resultado.Itens,
                Paginacao = new()
                {
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            string htmlTabela = await this._renderer.RenderViewToStringAsync(this.ControllerContext, "_TabelaPedidos", model.Itens);
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

    public async Task<IActionResult> PedidoModal(int? id, bool somenteVisualizacao = false)
    {
        try
        {
            PedidoViewModel pedido = id.HasValue
                ? await this._pedidoServiceClient.ObterPorId(id.Value)
                : new PedidoViewModel();

            ViewBag.SomenteLeitura = somenteVisualizacao;

            return PartialView("_PedidoModal", pedido);
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

    public async Task<JsonResult> ExcluirPedido(int idPedido)
    {
        try
        {
            await this._pedidoServiceClient.ExcluirPedido(idPedido);

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
