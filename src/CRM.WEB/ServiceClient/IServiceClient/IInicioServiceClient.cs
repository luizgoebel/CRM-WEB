using CRM.Web.Models;
using System.Threading.Tasks;

namespace CRM.Web.ServiceClient.IServiceClient;

public interface IInicioServiceClient
{
    Task<DashboardViewModel> ObterDadosDashboard();
}
