using System.Collections.Generic;

namespace CRM.Web.Models;

public class PaginacaoResultado<T>
{
    public List<T> Clientes { get; set; } = new();
    public int Total { get; set; }
    public int PaginaAtual { get; set; }
    public int TotalPaginas { get; set; }
}
