using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using LMPlatform.Models;

namespace LMPlatform.UI.Services.Modules.Concept
{
    public static class EumkMaterialPaths
    {
        private static readonly HashSet<string> ViewableExtensions =
            new HashSet<string>(StringComparer.OrdinalIgnoreCase) { ".pdf", ".doc", ".docx" };

        public static List<string> GetViewablePaths(IEnumerable<Attachment> attachments)
        {
            return (attachments ?? Enumerable.Empty<Attachment>())
                .Where(att => !string.IsNullOrWhiteSpace(att.PathName) && !string.IsNullOrWhiteSpace(att.FileName))
                .Where(att => ViewableExtensions.Contains(Path.GetExtension(att.FileName) ?? string.Empty))
                .Select(att => $"{att.PathName}//{att.FileName}")
                .ToList();
        }
    }
}
