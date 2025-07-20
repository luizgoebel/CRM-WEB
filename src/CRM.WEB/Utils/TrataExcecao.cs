using CRM.Web.Exceptions;
using CRM.Web.Models;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace CRM.Web.Utils;

public class TrataExcecao
{
    public static async Task TratarResponseException(HttpResponseMessage httpResponseMessage)
    {
        try
        {
            if (!httpResponseMessage.IsSuccessStatusCode)
            {
                string jsonResponse = await httpResponseMessage.Content.ReadAsStringAsync();

                if (string.IsNullOrWhiteSpace(jsonResponse))
                    throw new Exception("Erro na requisição. Nenhuma resposta foi recebida.");

                var detalhesErro = JsonConvert.DeserializeObject<DetalhesDoErro>(jsonResponse);

                if (detalhesErro is null || string.IsNullOrWhiteSpace(detalhesErro.Mensagem))
                    throw new Exception("Erro desconhecido retornado pela API.");

                switch ((int)httpResponseMessage.StatusCode)
                {
                    case 400:
                        throw new DomainException(detalhesErro.Mensagem, detalhesErro.ObjetoErro);
                    case 503:
                        throw new ServiceException(detalhesErro.Mensagem, detalhesErro.ObjetoErro);
                    case 401:
                    case 403:
                        throw new UnauthorizedAccessException("Você não tem permissão para executar essa operação.");
                    case 500:
                        throw new Exception("Erro interno do servidor.");
                    default:
                        throw new Exception(detalhesErro.Mensagem);
                }
            }
        }
        catch (DomainException ex) { throw ex; }
        catch (ServiceException ex) { throw ex; }
        catch (UnauthorizedAccessException ex) { throw new Exception(ex.Message); }
        catch
        {
            throw new Exception("Ocorreu um erro não tratado pelo sistema, por favor consulte o suporte.");
        }
    }
}
