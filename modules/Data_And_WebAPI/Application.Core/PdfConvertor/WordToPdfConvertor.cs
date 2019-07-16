using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Spire.Doc;
using Spire.Doc.Documents;
using System.IO;
using System.Configuration;


namespace Application.Core.PdfConvertor
{
    public class WordToPdfConvertor
    {
        private readonly string _storageRootTemp = "";// TODO ConfigurationManager.AppSettings["FileUploadPathTemp"];

        public String Convert(String sourceFile)
        {
            Document document = new Document();
            document.LoadFromFile(sourceFile);

            var fileName = $"{Path.GetFileNameWithoutExtension(sourceFile)}.pdf";
            var fullPath = $"{_storageRootTemp}{fileName}";

            document.SaveToFile(fullPath, FileFormat.PDF);

            return fileName;
        }
    }
}
