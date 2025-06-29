using Microsoft.AspNetCore.Razor.TagHelpers;

namespace CRM.Web.TagHelpers;

[HtmlTargetElement("filtro-tabela")]
public class FiltroTabelaTagHelper : TagHelper
{
    public string TabelaId { get; set; }
    public string Placeholder { get; set; } = "Buscar...";
    public string InputId { get; set; }
    public string Controller { get; set; }  // padrão pode ser cliente

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = null;
        string idAttribute = string.IsNullOrEmpty(InputId) ? "" : $"id=\"{InputId}\"";

        output.Content.SetHtmlContent($@"
<div class=""input-group w-auto"">
    <input type=""text"" 
           class=""form-control filtro-tabela""
           {idAttribute}
           placeholder=""{Placeholder}""
           data-filter=""#{TabelaId}""
           data-controller=""{Controller}""
           data-tabela-id=""{TabelaId}"" />
</div>");

    }
}
