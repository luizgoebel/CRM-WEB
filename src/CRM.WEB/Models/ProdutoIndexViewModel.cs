using System.Collections.Generic;

namespace CRM.Web.Models;

public class ProdutoIndexViewModel
{
    public List<ProdutoViewModel> Itens { get; set; } = new();
    public PaginacaoViewModel Paginacao { get; set; } = new();
}
