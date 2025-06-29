using Microsoft.AspNetCore.Razor.TagHelpers;

namespace CRM.Web.TagHelpers;

[HtmlTargetElement("filtro-tabela")]
public class FiltroTabelaTagHelper : TagHelper
{
    public string TabelaId { get; set; }
    public string Placeholder { get; set; }
    public string InputId { get; set; }
    public string Controller { get; set; }

    public override void Process(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = null;
        string idAttribute = string.IsNullOrEmpty(InputId) ? "" : $"id=\"{InputId}\"";

        output.Content.SetHtmlContent($@"
        <div class=""input-group w-auto"">
            <div class=""position-relative flex-grow-1"">
                <input type=""text"" 
                       class=""form-control filtro-tabela pe-5""
                       {idAttribute}
                       placeholder=""{Placeholder}""
                       data-filter=""#{TabelaId}""
                       data-controller=""{Controller}""
                       data-tabela-id=""{TabelaId}"" />
                
                <button type=""button"" 
                        class=""btn btn-outline-secondary btn-sm btn-limpar-filtro position-absolute""
                        style=""display:none; z-index:2; height: calc(100% - 0.5rem); padding: 0 0.5rem;""
                        data-bs-toggle=""tooltip"" 
                        data-bs-placement=""left"">
                    <i class=""fa-solid fa-filter-circle-xmark""></i>
                </button>
            </div>
        </div>");
    }
}
