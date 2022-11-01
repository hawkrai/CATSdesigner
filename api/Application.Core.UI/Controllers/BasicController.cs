using System.IO;
using System.Net;
using System.Web.Mvc;
using Application.Core.UI.Enums;
using Application.Core.UI.Http;
using Application.Core.UI.Extentions;

namespace Application.Core.UI.Controllers
{
    public abstract class BasicController : Controller
    {
        public TService ApplicationService<TService>()
        {
            return UnityWrapper.Resolve<TService>();
        }

        public string PartialViewToString(string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName)) viewName = this.ControllerContext.RouteData.GetRequiredString("action");

            this.ViewData.Model = model;

            using (var stringWriter = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(this.ControllerContext, viewName);
                var viewContext = new ViewContext(this.ControllerContext, viewResult.View, this.ViewData, this.TempData,
                    stringWriter);
                viewResult.View.Render(viewContext, stringWriter);
                return stringWriter.GetStringBuilder().ToString();
            }
        }

        public string PartialViewToString(string viewName, object model, bool active)
        {
            if (string.IsNullOrEmpty(viewName)) viewName = this.ControllerContext.RouteData.GetRequiredString("action");

            this.ViewData.Model = model;


            using (var stringWriter = new StringWriter())
            {
                if (active)
                {
                    var viewResult = ViewEngines.Engines.FindPartialView(this.ControllerContext, viewName);
                    var viewContext = new ViewContext(this.ControllerContext, viewResult.View, this.ViewData,
                        this.TempData,
                        stringWriter);
                    viewResult.View.Render(viewContext, stringWriter);
                }

                return stringWriter.GetStringBuilder().ToString();
            }
        }

        public static ActionResult JsonResponse<T>(T obj)
        {
            return new JsonResult
            {
                Data = obj,
                MaxJsonLength = int.MaxValue,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public static ActionResult JsonHttpStatusCode(HttpStatusCode statusCode, ErrorCode errorCode) 
        {
            return new JsonHttpStatusResult(
                new
                {
                    error = errorCode,
                    description = errorCode.GetDescription()
                },
                statusCode
            );
        }

        public static ActionResult StatusCode(HttpStatusCode statusCode, string description = null)
        {
            return new HttpStatusCodeResult(statusCode, description);
        }
    }
}