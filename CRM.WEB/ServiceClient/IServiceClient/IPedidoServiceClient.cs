using CRM.Web.Models;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient.IServiceClient;

public interface IPedidoServiceClient
{
    Task<PaginacaoResultado<PedidoViewModel>> ObterPedidosPaginados(string filtro, int pagina, int pageSize);
    Task<PedidoViewModel> ObterPorId(int id);
    Task ExcluirPedido(int idPedido);
    Task SalvarPedido(PedidoViewModel pedidoViewModel);
}
