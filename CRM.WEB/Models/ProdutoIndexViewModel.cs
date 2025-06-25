using System.Collections.Generic;

namespace CRM.Web.Models;

public class ProdutoIndexViewModel
{
    public List<ProdutoViewModel> Itens { get; set; }
    public PaginacaoViewModel Paginacao { get; set; }
}
