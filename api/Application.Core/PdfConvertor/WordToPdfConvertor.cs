using System;
using System.Configuration;
using System.Diagnostics;
using System.IO;

namespace Application.Core.PdfConvertor
{
    public class WordToPdfConvertor
    {
        private readonly string _storageRootTemp = ConfigurationManager.AppSettings["FileUploadPathTemp"];

        private static readonly string LibreOfficePath = ConfigurationManager.AppSettings["LibreOfficePath"] 
        ?? @"C:\Program Files\LibreOffice\program\soffice.exe";

        public string Convert(string sourceFile)
        {
            sourceFile = Path.GetFullPath(sourceFile.Replace("//", "\\"));

            if (!File.Exists(sourceFile))
                throw new FileNotFoundException("Source file not found", sourceFile);

            var outputDir = Path.GetFullPath(_storageRootTemp.Replace("//", "\\").TrimEnd('/', '\\'));

            var profileDir = Path.Combine(Path.GetTempPath(), "libreoffice-profile");
            Directory.CreateDirectory(profileDir);
            var profileUrl = new Uri(profileDir).AbsoluteUri;

            var psi = new ProcessStartInfo
            {
                FileName = LibreOfficePath,
                Arguments = $"-env:UserInstallation=\"{profileUrl}\" --headless --convert-to pdf \"{sourceFile}\" --outdir \"{outputDir}\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            string stdout, stderr;
            int exitCode;

            using (var process = Process.Start(psi))
            {
                if (process == null)
                    throw new InvalidOperationException("Failed to start LibreOffice process.");

                stdout = process.StandardOutput.ReadToEnd();
                stderr = process.StandardError.ReadToEnd();
                process.WaitForExit(60000);
                exitCode = process.ExitCode;
            }

            if (exitCode != 0)
                throw new InvalidOperationException(
                    $"LibreOffice conversion failed (exit {exitCode}). stdout: {stdout} stderr: {stderr}");

            var fileName = $"{Path.GetFileNameWithoutExtension(sourceFile)}.pdf";
            var fullOutputPath = Path.Combine(outputDir, fileName);

            if (!File.Exists(fullOutputPath))
                throw new FileNotFoundException(
                    $"Converted PDF not found at '{fullOutputPath}'. stdout: {stdout} stderr: {stderr}");

            return fileName;
        }
    }
}
