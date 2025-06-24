using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient;

public class ProdutoServiceClient : IProdutoServiceClient
{
    private readonly HttpClient _httpClient;

    public ProdutoServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task ExcluirProduto(int idProduto)
    {
        HttpResponseMessage response = await _httpClient.PostAsync($"api/Produto/Remover?id={idProduto}", null);
        await TrataExcecao.TratarResponseException(response);
    }

    public async Task<ProdutoViewModel> ObterPorId(int id)
    {
        HttpResponseMessage response = await _httpClient.GetAsync($"api/Produto/ObterPorId?id={id}");

        await TrataExcecao.TratarResponseException(response);

        var produto = await response.Content.ReadFromJsonAsync<ProdutoViewModel>();
        return produto!;
    }

    public async Task<List<ProdutoViewModel>> ObterTodosClientes()
    {
        HttpResponseMessage response = await _httpClient.GetAsync("api/Produto/ObterTodosProdutos");

        await TrataExcecao.TratarResponseException(response);

        var produtos = await response.Content.ReadFromJsonAsync<List<ProdutoViewModel>>();
        return produtos ?? new List<ProdutoViewModel>();
    }

    public async Task SalvarProduto(ProdutoViewModel produtoViewModel)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("api/Produto/Salvar", produtoViewModel);

        await TrataExcecao.TratarResponseException(response);
    }
}
