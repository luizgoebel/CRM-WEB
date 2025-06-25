using System.Collections.Generic;

namespace CRM.Web.Models;

public class ClienteIndexViewModel
{
    public List<ClienteViewModel> Itens { get; set; }
    public PaginacaoViewModel Paginacao { get; set; }
}
