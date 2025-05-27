using System;
 using System.Configuration;
using System.IO;
using Microsoft.Office.Interop.Word;

namespace Application.Core.PdfConvertor
{
    public class WordToPdfConvertor
    {
        private readonly string _storageRootTemp = ConfigurationManager.AppSettings["FileUploadPathTemp"];
        private Microsoft.Office.Interop.Word.Application wordApplication;

        public WordToPdfConvertor()
        {
            wordApplication = new Microsoft.Office.Interop.Word.Application
            {
                Visible = false,
            };
        }

        public string Convert(string sourceFile)
        {
            Document doc = null;
            try
            {
                doc = wordApplication.Documents.Open(sourceFile);

                var fileName = $"{Path.GetFileNameWithoutExtension(sourceFile)}.pdf";
                var fullPath = Path.Combine(_storageRootTemp, fileName);

                doc.ExportAsFixedFormat(
                    fullPath,
                    WdExportFormat.wdExportFormatPDF,
                    OptimizeFor: WdExportOptimizeFor.wdExportOptimizeForPrint,
                    Range: WdExportRange.wdExportAllDocument
                );

                return fileName;
            }
            finally
            {
                if (doc != null)
                {
                    doc.Close(false);
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(doc);
                }
            }
        }
        public void Dispose()
        {
            if (wordApplication != null)
            {
                wordApplication.Quit(false);
                System.Runtime.InteropServices.Marshal.ReleaseComObject(wordApplication);
                wordApplication = null;
            }
            GC.SuppressFinalize(this);
        }
    }
}