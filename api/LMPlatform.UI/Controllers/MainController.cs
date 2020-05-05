using System.Web.Mvc;

namespace LMPlatform.UI.Controllers
{
    public class MainController : Controller
    {
        public FileResult DownloadApk()
        {
            var filePath = this.Server.MapPath("/lms_1_0.apk");
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var response = new FileContentResult(fileBytes, "application/vnd.android.package-archive")
            {
                FileDownloadName = "lms_1_0.apk"
            };
            return response;
        }
    }
}