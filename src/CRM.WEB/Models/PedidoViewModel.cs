using System.Collections.Generic;

namespace CRM.Web.Models;

public class PedidoViewModel
{
    public int? Id { get; set; }
    public int? ClienteId { get; set; }
    public string? Cliente { get; set; }
    public decimal? ValorTotal { get; set; }
    public List<PedidoItemViewModel> Itens { get; set; } = new();
}
