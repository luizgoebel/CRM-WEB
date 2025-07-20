using CRM.Web.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient.IServiceClient;

public interface IClienteServiceClient
{
    Task<PaginacaoResultado<ClienteViewModel>> ObterClientesPaginados(string filtro, int page, int pageSize);
    Task<List<ClienteViewModel>> ObterTodosClientes();
    Task<ClienteViewModel> ObterPorId(int id);
    Task SalvarCliente(ClienteViewModel clienteViewModel);
}
