using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
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

    public async Task<ClienteViewModel> ObterPorId(int id)
    {
        HttpResponseMessage response = await _httpClient.GetAsync($"api/Cliente/ObterPorId?id={id}");

        await TrataExcecao.TratarResponseException(response);

        var cliente = await response.Content.ReadFromJsonAsync<ClienteViewModel>();
        return cliente!;
    }

    public async Task<List<ClienteViewModel>> ObterTodosClientes()
    {
        HttpResponseMessage response = await _httpClient.GetAsync("api/Cliente/ObterTodosClientes");

        await TrataExcecao.TratarResponseException(response);

        var clientes = await response.Content.ReadFromJsonAsync<List<ClienteViewModel>>();
        return clientes ?? new List<ClienteViewModel>();
    }

    public async Task SalvarCliente(ClienteViewModel clienteViewModel)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("api/Cliente/Atualizar", clienteViewModel);

        await TrataExcecao.TratarResponseException(response);
    }
}
