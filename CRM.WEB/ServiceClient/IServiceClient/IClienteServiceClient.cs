using CRM.Web.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient.IServiceClient;

public interface IClienteServiceClient
{
    Task<List<ClienteViewModel>> ObterTodosClientes();
    Task<ClienteViewModel> ObterPorId(int id);
}
