using CRM.Web.Exceptions;
using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.TagHelpers;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.Controllers;

public class ProdutoController : Controller
{
    private readonly IProdutoServiceClient _produtoServiceClient;
    private readonly RazorViewToStringRenderer _renderer;

    public ProdutoController(
        IProdutoServiceClient produtoServiceClient,
        RazorViewToStringRenderer renderer)
    {
        this._produtoServiceClient = produtoServiceClient;
        this._renderer = renderer;
    }

    public async Task<IActionResult> Index(int pagina = 1, string filtro = "")
    {
        try
        {
            int pageSize = 25;
            PaginacaoResultado<ProdutoViewModel> resultado = await this._produtoServiceClient.ObterProdutosPaginados(filtro, pagina, pageSize);

            ProdutoIndexViewModel model = new()
            {
                Itens = resultado.Itens,
                Paginacao = new()
                {
                    Controller = "Produto",
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
            PaginacaoResultado<ProdutoViewModel> resultado = await this._produtoServiceClient.ObterProdutosPaginados(filtro ?? "", page, pageSize);

            ProdutoIndexViewModel model = new()
            {
                Itens = resultado.Itens,
                Paginacao = new()
                {
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            string htmlTabela = await this._renderer.RenderViewToStringAsync(this.ControllerContext, "_TabelaProdutos", model.Itens);
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

    public async Task<IActionResult> ProdutoModal(int? id, bool somenteVisualizacao = false)
    {
        try
        {
            ProdutoViewModel produto = id.HasValue
                ? await this._produtoServiceClient.ObterPorId(id.Value)
                : new ProdutoViewModel();

            ViewBag.SomenteLeitura = somenteVisualizacao;

            return PartialView("_ProdutoModal", produto);
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

    public async Task<JsonResult> SalvarProduto(ProdutoViewModel produtoViewModel)
    {
        try
        {
            await this._produtoServiceClient.SalvarProduto(produtoViewModel);

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

    public async Task<JsonResult> ExcluirProduto(int idProduto)
    {
        try
        {
            await this._produtoServiceClient.ExcluirProduto(idProduto);

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
