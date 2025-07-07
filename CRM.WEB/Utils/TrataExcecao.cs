using CRM.Web.Exceptions;
using CRM.Web.Models;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace CRM.Web.Utils;

public static class TrataExcecao
{
    public static async Task TratarResponseException(HttpResponseMessage httpResponseMessage)
    {
        if (!httpResponseMessage.IsSuccessStatusCode)
        {
            // --- NOVAS LINHAS DE LOG PARA DEPURAR ---
            var statusCode = httpResponseMessage.StatusCode;
            var responseBody = await httpResponseMessage.Content.ReadAsStringAsync();
            var requestUri = httpResponseMessage.RequestMessage?.RequestUri;

            Console.WriteLine($"ERRO API - Detalhes da Resposta:");
            Console.WriteLine($"  Status Code: {statusCode}");
            Console.WriteLine($"  Request URI: {requestUri}");
            Console.WriteLine($"  Response Body: {responseBody}");
            // --- FIM DAS NOVAS LINHAS DE LOG ---

            // Linha 49 (ou onde a exceção é lançada no seu código original)
            throw new Exception("Ocorreu um erro não tratado pelo sistema, por favor consulte o suporte.");
        }
    }
}