using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient;

public class ClienteServiceClient : IClienteServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly IOptions<AppSettings> _settings;
    private readonly string _crmApi;

    public ClienteServiceClient(
        HttpClient httpClient,
        IOptions<AppSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings;
        _crmApi = $"{_settings.Value.CrmApi}/api/Cliente"; 
    }

    public async Task<List<ClienteViewModel>> ObterTodosClientes()
    {
        var uri = URI.ClienteURI.ObterTodosClientes(_crmApi);

        var response = await _httpClient.GetAsync(uri);

        response.EnsureSuccessStatusCode(); // lança exceção se o status não for sucesso

        var clientes = await response.Content.ReadFromJsonAsync<List<ClienteViewModel>>();

        return clientes ?? new List<ClienteViewModel>();
    }
}
