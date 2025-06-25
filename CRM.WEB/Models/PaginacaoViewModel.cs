using System;

namespace CRM.Web.Models;

public class PaginacaoViewModel
{
    public int PaginaAtual { get; set; }
    public int TotalPaginas { get; set; }
    public int PaginasPorGrupo { get; set; } = 5;

    public int InicioGrupo => ((PaginaAtual - 1) / PaginasPorGrupo) * PaginasPorGrupo + 1;
    public int FimGrupo => Math.Min(InicioGrupo + PaginasPorGrupo - 1, TotalPaginas);
}
