using System;

namespace CRM.Web.Models;

public class PaginacaoViewModel
{
    public string Controller { get; set; } = "";

    public int PaginaAtual { get; set; } = 1;
    public int TotalPaginas { get; set; } = 1;
    public int PaginasPorGrupo { get; set; } = 5;

    public int InicioGrupo => ((PaginaAtual - 1) / PaginasPorGrupo) * PaginasPorGrupo + 1;
    public int FimGrupo => Math.Min(InicioGrupo + PaginasPorGrupo - 1, TotalPaginas);
}
