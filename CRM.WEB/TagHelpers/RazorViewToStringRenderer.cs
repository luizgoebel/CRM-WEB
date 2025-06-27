using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CRM.Web.TagHelpers;

public class RazorViewToStringRenderer
{
    private readonly IRazorViewEngine _viewEngine;
    private readonly ITempDataProvider _tempDataProvider;
    private readonly IServiceProvider _serviceProvider;

    public RazorViewToStringRenderer(
        IRazorViewEngine viewEngine,
        ITempDataProvider tempDataProvider,
        IServiceProvider serviceProvider)
    {
        _viewEngine = viewEngine;
        _tempDataProvider = tempDataProvider;
        _serviceProvider = serviceProvider;
    }

    public async Task<string> RenderViewToStringAsync<TModel>(
        ControllerContext context,
        string viewName,
        TModel model)
    {
        var viewResult = _viewEngine.FindView(context, viewName, false);

        if (viewResult.View == null)
            throw new ArgumentNullException($"View '{viewName}' não encontrada.");

        using var sw = new StringWriter();
        var viewContext = new ViewContext(
            context,
            viewResult.View,
            new ViewDataDictionary<TModel>(
                metadataProvider: new EmptyModelMetadataProvider(),
                modelState: context.ModelState)
            {
                Model = model
            },
            new TempDataDictionary(context.HttpContext, _tempDataProvider),
            sw,
            new HtmlHelperOptions()
        );

        await viewResult.View.RenderAsync(viewContext);
        return sw.ToString();
    }
}
