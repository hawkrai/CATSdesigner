using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Web;
using System.Windows.Forms;
using System.Xml;
using System.Xml.Xsl;
using LMPlatform.Models;
using LMPlatform.Models.DP;
using Microsoft.Office.Interop.Word;
using Font = System.Drawing.Font;

namespace Application.Infrastructure.Export
{
    public static class Word
    {
        #region Export Word document

        public static HttpResponseMessage DiplomProjectToWord(string fileName, DiplomProject work, string lang = "ru")
        {
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            byte[] byteArray = CreateDoc(work, cinfo, lang);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(new MemoryStream(byteArray));
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = fileName + ".docx";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-word");

            return response;
        }

        private static byte[] CreateDoc(DiplomProject work, CultureInfo cultureInfo, string lang = "ru")
        {
            var adp = work.AssignedDiplomProjects.Count == 1 ? work.AssignedDiplomProjects.First() : null;
            var generator = adp is null
                ? new GenerateDpDocument(work, cultureInfo, lang)
                : new GenerateDpDocument(adp, cultureInfo, lang);
            return generator.CreatePackageAsBytes();
        }

        public static HttpResponseMessage DiplomProjectsToArchive(string fileName, IList<DiplomProject> diplomProjects, string lang = "ru")
        {
            IDictionary<string, byte[]> bytelist = CreateDocs(diplomProjects, lang);

            var pushStreamContent = new PushStreamContent((stream, content, context) =>
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    using (var zipArchive = new ZipArchive(ms, ZipArchiveMode.Create, true))
                    {
                        foreach (var attachment in bytelist)
                        {
                            var entry = zipArchive.CreateEntry(attachment.Key);

                            using MemoryStream originalFile = new MemoryStream(attachment.Value);
                            using var zipEntryStream = entry.Open();
                            originalFile.CopyTo(zipEntryStream);
                        }
                    }

                    ms.Seek(0, SeekOrigin.Begin);
                    ms.WriteTo(stream);
                }
                stream.Close();
            }, "application/zip");

            pushStreamContent.Headers.Add("Content-Disposition", "attachment; filename=" + fileName);

            return new HttpResponseMessage(HttpStatusCode.OK) { Content = pushStreamContent };
        }

        private static IDictionary<string, byte[]> CreateDocs(IList<DiplomProject> diplomProjects, string lang = "ru")
        {
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            IDictionary<string, byte[]> byteList = new Dictionary<string, byte[]>(diplomProjects.Count());
            Student student = null;
            string docName = null;

            foreach (var item in diplomProjects)
            {
                var adp = item.AssignedDiplomProjects.Count == 1 ? item.AssignedDiplomProjects.First() : null;
                var generator = adp is null ? new GenerateDpDocument(item, cinfo, lang) : new GenerateDpDocument(adp, cinfo, lang);
                byte[] byteArray = generator.CreatePackageAsBytes();

                student = item.AssignedDiplomProjects.FirstOrDefault().Student;
                docName = $"{student.LastName}_{student.FirstName}.doc";

                byteList.Add(docName, byteArray);
            }
            return byteList;
        }
        #endregion

        #region Export Html view

        public static string DiplomProjectToDocView(DiplomProject work, string lang = "ru")
        {
            var sb = new StringBuilder();
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            var doc = DiplomProjectToXml(work, cinfo);
            var xslt = new XslTransform();
            var url = string.Format("{0}.Export.tasklist.xslt", Assembly.GetExecutingAssembly().GetName().Name);
            var xsltFile = Assembly.GetExecutingAssembly().GetManifestResourceStream(url);
            xsltFile.Seek(0, SeekOrigin.Begin);
            using (var xmlr = XmlReader.Create(xsltFile))
            {
                xslt.Load(xmlr);
                using (TextWriter tw = new StringWriter(sb))
                {
                    var args = new XsltArgumentList();
                    args.AddParam("lang", "", lang);
                    xslt.Transform(doc, args, tw);
                }
            }
            return sb.ToString();
        }

        public static string DiplomProjectToDocView(AssignedDiplomProject work, string lang = "ru")
        {
            var sb = new StringBuilder();
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            var doc = DiplomProjectToXml(work, cinfo);
            var xslt = new XslTransform();
            var url = string.Format("{0}.Export.tasklist.xslt", Assembly.GetExecutingAssembly().GetName().Name);
            var xsltFile = Assembly.GetExecutingAssembly().GetManifestResourceStream(url);
            xsltFile.Seek(0, SeekOrigin.Begin);
            using (var xmlr = XmlReader.Create(xsltFile))
            {
                xslt.Load(xmlr);
                using (TextWriter tw = new StringWriter(sb))
                {
                    var args = new XsltArgumentList();
                    args.AddParam("lang", "", lang);
                    xslt.Transform(doc, args, tw);
                }
            }
            return sb.ToString();
        }

        private static XmlDocument DiplomProjectToXml(DiplomProject work, CultureInfo cultureInfo)
        {
            var doc = new XmlDocument();
            var root = doc.CreateElement("YearlyWorks");
            root.SetAttribute("DiplomProjectId", work.DiplomProjectId.ToString());
            root.SetAttribute("year", string.Empty);

            var children = new List<XmlElement>();

            children.AddRange(CreateStringNodes(doc, "Theme", work.Theme, 523, 638, 5));

            var univer = doc.CreateElement("item");
            univer.SetAttribute("name", "Univer");
            univer.InnerText = work.Univer;
            children.Add(univer);

            var faculty = doc.CreateElement("item");
            faculty.SetAttribute("name", "Faculty");
            faculty.InnerText = work.Faculty;
            children.Add(faculty);

            var head = doc.CreateElement("item");
            head.SetAttribute("name", "HeadCathedra");
            head.InnerText = work.HeadCathedra;
            children.Add(head);

            children.AddRange(CreateStringNodes(doc, "InputData", work.InputData, 439, 638, 13));

            children.AddRange(CreateStringNodes(doc, "RPZContent", work.RpzContent, 331, 638, 15));

            children.AddRange(CreateStringNodes(doc, "DrawMaterials", work.DrawMaterials, 403, 638, 5));

            children.AddRange(CreateStringNodes(doc, "Consultants", work.Consultants, 271, 638, 6));

            var ed = doc.CreateElement("item");
            ed.SetAttribute("name", "EndData");
            ed.InnerText = work.DateEnd.HasValue ? work.DateEnd.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            children.Add(ed);

            var pd = doc.CreateElement("item");
            pd.SetAttribute("name", "PublishData");
            pd.InnerText = work.DateStart.HasValue ? work.DateStart.Value.ToString("dd.MM.yyyy") : string.Empty;
            children.Add(pd);
            children.AddRange(CreateStringNodes(doc, "Workflow", string.Empty, 638, 638, 14));

            foreach (var item in children)
            {
                root.AppendChild(item);
            }

            doc.AppendChild(root);
            return doc;
        }

        private static XmlDocument DiplomProjectToXml(AssignedDiplomProject awork, CultureInfo cultureInfo)
        {
            var doc = new XmlDocument();
            var root = doc.CreateElement("YearlyWorks");
            root.SetAttribute("DiplomProjectId", awork.DiplomProject.DiplomProjectId.ToString());
            root.SetAttribute("year", awork.ApproveDate.HasValue ? awork.ApproveDate.Value.ToString("yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty);

            var children = new List<XmlElement>();

            children.AddRange(CreateStringNodes(doc, "Theme", awork.DiplomProject.Theme, 523, 638, 5));

            var student = doc.CreateElement("item");
            student.SetAttribute("name", "Student");
            var s = awork.Student;
            var sFirstInitial = !string.IsNullOrWhiteSpace(s.FirstName)
                ? s.FirstName[0] + "."
                : string.Empty;
            var sMiddleInitial = !string.IsNullOrWhiteSpace(s.MiddleName)
                ? " " + s.MiddleName[0] + "."
                : string.Empty;
            student.InnerText = string.Format("{0}{1} {2}", sFirstInitial, sMiddleInitial, s.LastName);
            children.Add(student);

            var group = doc.CreateElement("item");
            group.SetAttribute("name", "Group");
            group.InnerText = awork.Student.Group.Name;
            children.Add(group);

            var specialty = doc.CreateElement("item");
            specialty.SetAttribute("name", "Specialty");
            //specialty.InnerText = awork.Student.Group.Speciality.Specialty;  TODO
            children.Add(specialty);

            var specialtyShifr = doc.CreateElement("item");
            specialtyShifr.SetAttribute("name", "SpecialtyShifr");
            //specialtyShifr.InnerText = awork.Student.Group.Speciality.SpecialtyShifr;
            children.Add(specialtyShifr);

            var specializationShifr = doc.CreateElement("item");
            specializationShifr.SetAttribute("name", "SpecializationShifr");
            //specializationShifr.InnerText = awork.Student.Group.Speciality.SpecializationShifr;
            children.Add(specializationShifr);

            var specialization = doc.CreateElement("item");
            specialization.SetAttribute("name", "Specialization");
            //specialization.InnerText = awork.Student.Group.Speciality.Specialization;
            children.Add(specialization);

            var univer = doc.CreateElement("item");
            univer.SetAttribute("name", "Univer");
            univer.InnerText = awork.DiplomProject.Univer;
            children.Add(univer);

            var faculty = doc.CreateElement("item");
            faculty.SetAttribute("name", "Faculty");
            faculty.InnerText = awork.DiplomProject.Faculty;
            children.Add(faculty);

            var head = doc.CreateElement("item");
            head.SetAttribute("name", "HeadCathedra");
            head.InnerText = awork.DiplomProject.HeadCathedra;
            children.Add(head);

            var lecturer = doc.CreateElement("item");
            lecturer.SetAttribute("name", "Lecturer");
            if (awork.DiplomProject.Lecturer != null)
            {
                var l = awork.DiplomProject.Lecturer;
                var firstInitial = !string.IsNullOrWhiteSpace(l.FirstName)
                    ? l.FirstName[0] + "."
                    : string.Empty;
                var middleInitial = !string.IsNullOrWhiteSpace(l.MiddleName)
                    ? " " + l.MiddleName[0] + "."
                    : string.Empty;
                lecturer.InnerText = string.Format("{0}{1} {2}", firstInitial, middleInitial, l.LastName);
            }
            else
            {
                lecturer.InnerText = string.Empty;
            }
            children.Add(lecturer);

            children.AddRange(CreateStringNodes(doc, "InputData", awork.DiplomProject.InputData, 439, 638, 13));

            children.AddRange(CreateStringNodes(doc, "RPZContent", awork.DiplomProject.RpzContent, 331, 638, 15));

            children.AddRange(CreateStringNodes(doc, "DrawMaterials", awork.DiplomProject.DrawMaterials, 403, 638, 5));

            children.AddRange(CreateStringNodes(doc, "Consultants", awork.DiplomProject.Consultants, 271, 638, 6));

            var pd = doc.CreateElement("item");
            pd.SetAttribute("name", "PublishData");
            pd.InnerText = awork.DiplomProject.DateStart.HasValue
                ? awork.DiplomProject.DateStart.Value.ToString("dd.MM.yyyy")
                : string.Empty;
            children.Add(pd);

            var ed = doc.CreateElement("item");
            ed.SetAttribute("name", "EndData");
            ed.InnerText = awork.DiplomProject.DateEnd.HasValue
                ? awork.DiplomProject.DateEnd.Value.ToString("dd.MM.yyyy", cultureInfo.DateTimeFormat)
                : string.Empty;
            children.Add(ed);

            var currentYearStart = DateTime.Now.Month >= 9
                ? new DateTime(DateTime.Now.Year, 9, 1)
                : new DateTime(DateTime.Now.Year - 1, 9, 1);
            var currentYearEnd = currentYearStart.AddYears(1);

            var groupId = awork.Student.GroupId;

            var pgs = awork.Student.Group.Secretary != null
                ? awork.Student.Group.Secretary.DiplomPercentagesGraphs
                    .Where(x => x.Date >= currentYearStart && x.Date < currentYearEnd)
                    .Where(x => x.DiplomPercentagesGraphToGroups != null && x.DiplomPercentagesGraphToGroups.Any())
                    .OrderBy(x => x.Date)
                    .ToList()
                : new List<DiplomPercentagesGraph>();

            var percentageGraph = new StringBuilder();
            var i = 1;
            foreach (var pg in pgs)
            {
                percentageGraph.AppendFormat(
                    CultureInfo.CreateSpecificCulture("ru-RU"),
                    "{3}. {0} - {1}% - {2:dd.MM.yyyy}\n",
                    pg.Name, pg.Percentage, pg.Date, i++);
            }

            children.AddRange(CreateStringNodes(doc, "Workflow", percentageGraph.ToString(), 638, 638, 14));

            foreach (var item in children)
            {
                root.AppendChild(item);
            }

            doc.AppendChild(root);
            return doc;
        }

        private static List<XmlElement> CreateStringNodes(XmlDocument document, string name, string value, double firstline, double line, int linescount)
        {
            var elements = new List<XmlElement>();
            var values = SplitText(value, firstline - 30, line - 30, linescount);
            for (var i = 0; i < values.Length; i++)
            {
                var el = document.CreateElement("item");
                el.InnerText = values[i];
                el.SetAttribute("name", name);
                el.SetAttribute("line", i.ToString());
                elements.Add(el);
            }

            return elements;
        }

        private static string[] SplitText(string value, double firstline, double line, int linescount)
        {
            var result = new string[linescount];
            var font = new Font("Times New Roman", (float)12.0, FontStyle.Italic, GraphicsUnit.Point);
            var start = 0;
            var sb = new StringBuilder(value);
            for (var i = 0; i < result.Length; i++)
            {
                var len = (int)Math.Floor(i > 0 ? line : firstline);
                result[i] = CutSubstring(sb, len, font);
                start += len;
            }

            return result;
        }

        private static string CutSubstring(StringBuilder str, int len, Font font)
        {
            if (str.Length > 0)
            {
                var part = new StringBuilder();
                var index = 0;
                var lastgoodlen = 0;
                var skip = 0;
                while (true)
                {
                    var symb = str[index++];
                    if (symb == '\n')
                    {
                        lastgoodlen = index - 1;
                        skip = 1;
                        break;
                    }

                    part.Append(symb);
                    var sz = TextRenderer.MeasureText(part.ToString(), font);
                    if (sz.Width < len)
                    {
                        if (char.IsSeparator(symb) || lastgoodlen == 0)
                        {
                            lastgoodlen = index;
                        }
                    }
                    else
                    {
                        break;
                    }

                    if (index >= str.Length)
                    {
                        lastgoodlen = str.Length;
                        break;
                    }
                }

                var result = str.ToString().Substring(0, lastgoodlen);
                str.Remove(0, lastgoodlen + skip);
                return result;
            }

            return string.Empty;
        }

        #endregion
    }
}
