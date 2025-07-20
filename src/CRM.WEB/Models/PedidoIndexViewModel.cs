using System.Collections.Generic;

namespace CRM.Web.Models;

public class PedidoIndexViewModel
{
    public List<PedidoViewModel> Itens { get; set; } = new();
    public PaginacaoViewModel Paginacao { get; set; } = new();
}
