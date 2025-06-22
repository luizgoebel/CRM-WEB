using CRM.Web.Exceptions;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CRM.Web.Controllers;

public class ProdutoController : Controller
{
    private readonly IProdutoServiceClient _produtoServiceClient;

    public ProdutoController(IProdutoServiceClient produtoServiceClient)
    {
        _produtoServiceClient = produtoServiceClient;
    }

    public async Task<IActionResult> Index()
    {
        try
        {
            var produtos = await _produtoServiceClient.ObterTodosClientes();
            return View(produtos);
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
