using System;

namespace CRM.Web.TagHelpers;

public class PaginacaoHelper
{
    public static (int inicio, int fim) CalcularIntervalo(int paginaAtual, int totalPaginas, int paginasPorGrupo = 5)
    {
        int grupoAtual = (paginaAtual - 1) / paginasPorGrupo;
        int inicio = grupoAtual * paginasPorGrupo + 1;
        int fim = Math.Min(inicio + paginasPorGrupo - 1, totalPaginas);
        return (inicio, fim);
    }
}
