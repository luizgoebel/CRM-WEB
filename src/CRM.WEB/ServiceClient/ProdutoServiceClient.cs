using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using System;
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
        this._httpClient = httpClient;
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
        ProdutoViewModel produto = await response.Content.ReadFromJsonAsync<ProdutoViewModel>();

        return produto!;
    }

    public async Task<PaginacaoResultado<ProdutoViewModel>> ObterProdutosPaginados(string filtro, int page, int pageSize)
    {
        HttpResponseMessage response = await _httpClient.GetAsync($"api/produto/ObterProdutosPaginados?page={page}&pageSize={pageSize}&filtro={Uri.EscapeDataString(filtro ?? string.Empty)}");
        await TrataExcecao.TratarResponseException(response);
        PaginacaoResultado<ProdutoViewModel> resultado = await response.Content.ReadFromJsonAsync<PaginacaoResultado<ProdutoViewModel>>();
        
        return resultado!;
    }

    public async Task<List<ProdutoViewModel>> ObterTodosProdutos()
    {
        HttpResponseMessage response = await _httpClient.GetAsync("api/Produto/ObterTodosProdutos");
        await TrataExcecao.TratarResponseException(response);
        List<ProdutoViewModel> produtos = await response.Content.ReadFromJsonAsync<List<ProdutoViewModel>>();

        return produtos ?? new();
    }

    public async Task SalvarProduto(ProdutoViewModel produtoViewModel)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("api/Produto/Salvar", produtoViewModel);

        await TrataExcecao.TratarResponseException(response);
    }
}
