using CRM.Web.Models;
using CRM.Web.ServiceClient.IServiceClient;
using CRM.Web.Utils;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient;

public class InicioServiceClient : IInicioServiceClient
{
    private readonly HttpClient _httpClient;

    public InicioServiceClient(HttpClient httpClient)
    {
        this._httpClient = httpClient;
    }

    public async Task<DashboardViewModel> ObterDadosDashboard()
    {
        HttpResponseMessage response = await this._httpClient.GetAsync($"api/Inicio/ObterDadosDashboard");
        await TrataExcecao.TratarResponseException(response);
        DashboardViewModel dashboardView = await response.Content.ReadFromJsonAsync<DashboardViewModel>();

        return dashboardView!;
    }
}
