namespace CRM.Web.Models;

public class RespostaJSON
{
    public bool contemErro { get; set; }
    public string mensagem { get; set; }
    public object objeto { get; set; }

    public RespostaJSON() { }
}
