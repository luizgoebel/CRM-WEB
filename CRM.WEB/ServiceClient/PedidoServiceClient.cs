using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient;

public class PedidoServiceClient : IPedidoServiceClient
{
    private readonly HttpClient _httpClient;

    public PedidoServiceClient(HttpClient httpClient)
    {
        this._httpClient = httpClient;
    }

    public async Task ExcluirPedido(int idPedido)
    {
        HttpResponseMessage response = await _httpClient.PostAsync($"api/Pedido/Remover?id={idPedido}", null);
        await TrataExcecao.TratarResponseException(response);
    }

    public async Task<PaginacaoResultado<PedidoViewModel>> ObterPedidosPaginados(string filtro, int pagina, int pageSize)
    {
        HttpResponseMessage response = await _httpClient.GetAsync(
            $"api/Pedido/ObterPedidosPaginados?page={pagina}&pageSize={pageSize}&filtro={Uri.EscapeDataString(filtro ?? string.Empty)}"
        );
        await TrataExcecao.TratarResponseException(response);
        PaginacaoResultado<PedidoViewModel> resultado = await response.Content.ReadFromJsonAsync<PaginacaoResultado<PedidoViewModel>>();

        return resultado!;
    }

    public async Task<PedidoViewModel> ObterPorId(int id)
    {
        HttpResponseMessage response = await this._httpClient.GetAsync($"api/Pedido/ObterPorId?id={id}");
        await TrataExcecao.TratarResponseException(response);
        PedidoViewModel resultado = await response.Content.ReadFromJsonAsync<PedidoViewModel>();

        return resultado!;
    }

    public async Task SalvarPedido(PedidoViewModel pedidoViewModel)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync($"api/Pedido/CriarPedido", pedidoViewModel);
        await TrataExcecao.TratarResponseException(response);
    }
}
