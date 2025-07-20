using CRM.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CRM.Web.Utils;

public static class GerenciadorRespostaJSON
{
    public static JsonResult create(string mensagem = "", bool contemErro = false, object objeto = null) =>
        new JsonResult(new RespostaJSON
        {
            contemErro = contemErro,
            mensagem = mensagem,
            objeto = objeto
        });
    public static JsonResult create(string objetoJson) =>
        new JsonResult(JsonConvert.DeserializeObject(objetoJson));
    public static JsonResult create(object objetos) =>
        new JsonResult(new RespostaJSON
        {
            contemErro = false,
            mensagem = "",
            objeto = objetos
        });
}
