using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient;

public class ClienteServiceClient : IClienteServiceClient
{
    private readonly HttpClient _httpClient;

    public ClienteServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ClienteViewModel>> ObterTodosClientes()
    {
        List<ClienteViewModel> clientes = await _httpClient.GetFromJsonAsync<List<ClienteViewModel>>("api/Cliente/ObterTodosClientes");
        return clientes;
    }
}
