using CRM.Web.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient.IServiceClient;

public interface IProdutoServiceClient
{
    Task<List<ProdutoViewModel>> ObterTodosClientes();
    Task<PaginacaoResultado<ProdutoViewModel>> ObterProdutosPaginados(int page, int pageSize);
    Task<ProdutoViewModel> ObterPorId(int id);
    Task SalvarProduto(ProdutoViewModel produtoViewModel);
    Task ExcluirProduto(int idProduto);
}
