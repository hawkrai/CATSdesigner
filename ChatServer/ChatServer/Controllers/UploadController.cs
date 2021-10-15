using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ChatServer.Controllers
{
    [Route("ChatApi/file/[action]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        public UploadController()
        {
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                StringValues chatId;
                var path = Request.Form.TryGetValue("ChatId", out chatId);
                string newPath = @"new\" + chatId;
                foreach (var file in Request.Form.Files)
                {
                    {
                        if (!Directory.Exists(newPath))
                        {
                            Directory.CreateDirectory(newPath);
                        }
                        if (file.Length > 0)
                        {
                            string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                            string fullPath = Path.Combine(newPath, fileName);
                            using (var stream = new FileStream(fullPath, FileMode.Create))
                            {
                                file.CopyTo(stream);
                            }

                        }
                    }
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest("Upload Failed: " + ex.Message);
            }
            return Ok();
        }

        [HttpGet, DisableRequestSizeLimit]
        public IActionResult Download(int chatId,string file)
        {
            var dir= Directory.GetCurrentDirectory(); 
            
            string filePath = dir+"\\"+"new\\" + chatId+"\\"+file;
            if (!System.IO.File.Exists(filePath))
                return NotFound(filePath);

            return PhysicalFile(filePath, GetContentType(filePath), file);
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }
            return contentType;
        }
    }
}

