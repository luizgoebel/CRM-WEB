namespace CRM.Web.Models;

public class DetalhesDoErro
{
    public int StatusCode { get; set; }
    public string Mensagem { get; set; }
    public object ObjetoErro { get; set; }
}
