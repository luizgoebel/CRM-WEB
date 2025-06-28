using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using System;
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
        this._httpClient = httpClient;
    }

    public async Task<ClienteViewModel> ObterPorId(int id)
    {
        HttpResponseMessage response = await this._httpClient.GetAsync($"api/Cliente/ObterPorId?id={id}");
        await TrataExcecao.TratarResponseException(response);
        ClienteViewModel cliente = await response.Content.ReadFromJsonAsync<ClienteViewModel>();

        return cliente!;
    }

    public async Task<List<ClienteViewModel>> ObterTodosClientes()
    {
        HttpResponseMessage response = await this._httpClient.GetAsync("api/Cliente/ObterTodosClientes");
        await TrataExcecao.TratarResponseException(response);
        List<ClienteViewModel> clientes = await response.Content.ReadFromJsonAsync<List<ClienteViewModel>>();
        
        return clientes ?? new();
    }

    public async Task<PaginacaoResultado<ClienteViewModel>> ObterClientesPaginados(string filtro, int page, int pageSize)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(
            $"api/Cliente/ObterClientesPaginados?page={page}&pageSize={pageSize}&filtro={Uri.EscapeDataString(filtro ?? string.Empty)}"
        );
        await TrataExcecao.TratarResponseException(response);
        PaginacaoResultado<ClienteViewModel> resultado = await response.Content.ReadFromJsonAsync<PaginacaoResultado<ClienteViewModel>>();

        return resultado!;
    }

    public async Task SalvarCliente(ClienteViewModel clienteViewModel)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("api/Cliente/SalvarCliente", clienteViewModel);

        await TrataExcecao.TratarResponseException(response);
    }
}
