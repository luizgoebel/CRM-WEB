﻿namespace CRM.Web.Models;

public class PedidoItemViewModel
{
    public int? Id { get; set; }
    public int? ProdutoId { get; set; }
    public int? PedidoId { get; set; }
    public int? Quantidade { get; set; }
    public decimal? PrecoUnitario { get; set; }
}
