using CRM.Web.Exceptions;
using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.Controllers;

public class ProdutoController : Controller
{
    private readonly IProdutoServiceClient _produtoServiceClient;

    public ProdutoController(IProdutoServiceClient produtoServiceClient)
    {
        _produtoServiceClient = produtoServiceClient;
    }

    public async Task<IActionResult> Index(int page = 1)
    {
        try
        {
            const int pageSize = 25;
            var resultado = await _produtoServiceClient.ObterProdutosPaginados("", page, pageSize);
            var produtoIndexViewModel = new ProdutoIndexViewModel
            {
                Itens = resultado.Itens,
                Paginacao = new PaginacaoViewModel
                {
                    PaginaAtual = resultado.PaginaAtual,
                    TotalPaginas = resultado.TotalPaginas
                }
            };

            return View(produtoIndexViewModel);
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
            var resultado = await _produtoServiceClient.ObterProdutosPaginados(filtro ?? "", page, pageSize);

            if (resultado == null || resultado.Itens == null)
            {
                return Json(new PaginacaoResultado<ProdutoViewModel>
                {
                    Itens = new List<ProdutoViewModel>(),
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

    public async Task<IActionResult> ProdutoModal(int? id, bool somenteVisualizacao = false)
    {
        try
        {
            ProdutoViewModel produto = id.HasValue
                ? await _produtoServiceClient.ObterPorId(id.Value)
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
            await _produtoServiceClient.SalvarProduto(produtoViewModel);
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
            await _produtoServiceClient.ExcluirProduto(idProduto);
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
