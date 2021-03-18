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
using LMPlatform.Models.CP;
using Microsoft.Office.Interop.Word;
using Font = System.Drawing.Font;

namespace Application.Infrastructure.Export
{
    public static class WordCourseProject
    {
        #region Export Word document

        public static HttpResponseMessage CourseProjectToWord(string fileName, CourseProject work)
        {

            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            byte[] byteArray = CreateDoc(work, cinfo);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(new MemoryStream(byteArray));
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = fileName + ".docx";
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-word");

            return response;
        }

        public static HttpResponseMessage CourseProjectsToArchive(string fileName, IList<CourseProject> courseProjects)
        {
            IDictionary<string, byte[]> bytelist = CreateDocs(courseProjects);

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

        private static IDictionary<string, byte[]> CreateDocs(IList<CourseProject> courseProjects)
        {
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            IDictionary<string, byte[]> byteList = new Dictionary<string, byte[]>(courseProjects.Count());
            Student student = null;
            string docName = null;

            foreach (var item in courseProjects)
            {
                var adp = item.AssignedCourseProjects.Count == 1 ? item.AssignedCourseProjects.First() : null;
                var generator = adp is null ? new GenerateCPDocument(item, cinfo) : new GenerateCPDocument(adp, cinfo);
                byte[] byteArray = generator.CreatePackageAsBytes();

                student = item.AssignedCourseProjects.FirstOrDefault().Student;
                docName = $"{student.LastName}_{student.FirstName}.doc";

                byteList.Add(docName, byteArray);
            }
            return byteList;
        }

        private static byte[] CreateDoc(CourseProject work, CultureInfo cultureInfo)
        {
            var adp = work.AssignedCourseProjects.Count == 1 ? work.AssignedCourseProjects.First() : null;
            var generator = adp is null ? new GenerateCPDocument(work, cultureInfo) : new GenerateCPDocument(adp, cultureInfo);
            var array = generator.CreatePackageAsBytes();
            return array;
        }

        #endregion

        #region Export Html view

        public static string CourseProjectToDocView(CourseProject work)
        {
            var sb = new StringBuilder();
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            var doc = CourseProjectToXml(work, cinfo);
            var xslt = new XslTransform();
            var url = string.Format("{0}.Export.cptasklist.xslt", Assembly.GetExecutingAssembly().GetName().Name);
            var xsltFile = Assembly.GetExecutingAssembly().GetManifestResourceStream(url);
            xsltFile.Seek(0, SeekOrigin.Begin);
            using (var xmlr = XmlReader.Create(xsltFile))
            {
                xslt.Load(xmlr);
                using (TextWriter tw = new StringWriter(sb))
                {
                    var result = new XsltArgumentList();
                    xslt.Transform(doc, result, tw);
                }
            }

            return sb.ToString();
        }

        public static string CourseProjectToDocView(AssignedCourseProject work)
        {
            var sb = new StringBuilder();
            var cinfo = CultureInfo.CreateSpecificCulture("ru-ru");
            var doc = CourseProjectToXml(work, cinfo);
            var xslt = new XslTransform();
            var url = string.Format("{0}.Export.cptasklist.xslt", Assembly.GetExecutingAssembly().GetName().Name);
            var xsltFile = Assembly.GetExecutingAssembly().GetManifestResourceStream(url);
            xsltFile.Seek(0, SeekOrigin.Begin);
            using (var xmlr = XmlReader.Create(xsltFile))
            {
                xslt.Load(xmlr);
                using (TextWriter tw = new StringWriter(sb))
                {
                    var result = new XsltArgumentList();
                    xslt.Transform(doc, result, tw);
                }
            }

            return sb.ToString();
        }

        private static XmlDocument CourseProjectToXml(CourseProject work, CultureInfo cultureInfo)
        {
            var doc = new XmlDocument();
            var root = doc.CreateElement("YearlyWorks");
            root.SetAttribute("DiplomProjectId", work.CourseProjectId.ToString());
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

            children.AddRange(CreateStringNodes(doc, "InputData", work.InputData, 30, 638,8));

            children.AddRange(CreateStringNodes(doc, "RPZContent", work.RpzContent, 30, 638, 16));

            children.AddRange(CreateStringNodes(doc, "DrawMaterials", work.DrawMaterials, 30, 638, 7));

            children.AddRange(CreateStringNodes(doc, "Consultants", work.Consultants, 271, 638, 6));

            var ed = doc.CreateElement("item");
            ed.SetAttribute("name", "EndData");
            ed.InnerText = work.DateEnd.HasValue ? work.DateEnd.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            children.Add(ed);

            var pd = doc.CreateElement("item");
            pd.SetAttribute("name", "PublishData");
            pd.InnerText = work.DateStart.HasValue ? work.DateStart.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            children.Add(pd);
            children.AddRange(CreateStringNodes(doc, "Workflow", string.Empty, 638, 638, 14));

            foreach (var item in children)
            {
                root.AppendChild(item);
            }

            doc.AppendChild(root);
            return doc;
        }

        private static XmlDocument CourseProjectToXml(AssignedCourseProject awork, CultureInfo cultureInfo)
        {
            var doc = new XmlDocument();
            var root = doc.CreateElement("YearlyWorks");
            var publishData = awork.CourseProject.DateStart.HasValue ? awork.CourseProject.DateStart.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            root.SetAttribute("DiplomProjectId", awork.CourseProject.CourseProjectId.ToString());
            root.SetAttribute("year", publishData);

            var children = new List<XmlElement>();

            children.AddRange(CreateStringNodes(doc, "Theme", awork.CourseProject.Theme, 523, 638, 5));

            var student = doc.CreateElement("item");
            student.SetAttribute("name", "Student");
            student.InnerText = string.Format("{0} {1} {2}", awork.Student.LastName, awork.Student.FirstName, awork.Student.MiddleName);
            children.Add(student);

            var group = doc.CreateElement("item");
            group.SetAttribute("name", "Group");
            group.InnerText = awork.Student.Group.Name;
            children.Add(group);

            var specialty = doc.CreateElement("item");
            specialty.SetAttribute("name", "Specialty");

            //            specialty.InnerText = awork.Student.Group.Speciality.Specialty;  TODO
            children.Add(specialty);

            var specialtyShifr = doc.CreateElement("item");
            specialtyShifr.SetAttribute("name", "SpecialtyShifr");

            //            specialtyShifr.InnerText = awork.Student.Group.Speciality.SpecialtyShifr;
            children.Add(specialtyShifr);

            var specializationShifr = doc.CreateElement("item");
            specializationShifr.SetAttribute("name", "SpecializationShifr");

            //            specializationShifr.InnerText = awork.Student.Group.Speciality.SpecializationShifr;
            children.Add(specializationShifr);

            var specialization = doc.CreateElement("item");
            specialization.SetAttribute("name", "Specialization");

            //            specialization.InnerText = awork.Student.Group.Speciality.Specialization;
            children.Add(specialization);

            var univer = doc.CreateElement("item");
            univer.SetAttribute("name", "Univer");
            univer.InnerXml = awork.CourseProject.Univer;
            children.Add(univer);

            var faculty = doc.CreateElement("item");
            faculty.SetAttribute("name", "Faculty");
            faculty.InnerText = awork.CourseProject.Faculty;
            children.Add(faculty);

            var head = doc.CreateElement("item");
            head.SetAttribute("name", "HeadCathedra");
            head.InnerText = awork.CourseProject.HeadCathedra;
            children.Add(head);

            children.AddRange(CreateStringNodes(doc, "InputData", awork.CourseProject.InputData, 30, 638, 8));

            children.AddRange(CreateStringNodes(doc, "RPZContent", awork.CourseProject.RpzContent, 30, 638, 15));

            children.AddRange(CreateStringNodes(doc, "DrawMaterials", awork.CourseProject.DrawMaterials, 30, 638, 7));

            children.AddRange(CreateStringNodes(doc, "Consultants", awork.CourseProject.Consultants, 271, 638, 6));

            var pd = doc.CreateElement("item");
            pd.SetAttribute("name", "PublishData");
            pd.InnerText = awork.CourseProject.DateStart.HasValue ? awork.CourseProject.DateStart.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            children.Add(pd);

            var ed = doc.CreateElement("item");
            ed.SetAttribute("name", "EndData");
            ed.InnerText = awork.CourseProject.DateEnd.HasValue ? awork.CourseProject.DateEnd.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
            children.Add(ed);

            var percentageGraph = new StringBuilder();
            var pgs = awork.CourseProject.Subject.CoursePersentagesGraphs;
            var i = 1;
            foreach (var pg in pgs)
            {
                percentageGraph.AppendFormat(CultureInfo.CreateSpecificCulture("ru-RU"), "{3}. {0} — {1}% — {2:d MMMM yyyy} г.\n", pg.Name, pg.Percentage, pg.Date, i++);
            }

            children.AddRange(CreateStringNodes(doc, "Workflow", percentageGraph.ToString(), 638, 638, 14));

            var pd1 = doc.CreateElement("item");
            pd1.SetAttribute("name", "PublishData_1");
            pd1.InnerText = publishData;
            children.Add(pd1);

            var pd2 = doc.CreateElement("item");
            pd2.SetAttribute("name", "PublishData_2");
            pd2.InnerText = publishData;
            children.Add(pd2);

            var shortStudentName = doc.CreateElement("item");
            shortStudentName.SetAttribute("name", "ShortStudentName");
            shortStudentName.InnerText = string.Format("{0}.{1}. {2}", awork.Student.FirstName[0], awork.Student.MiddleName[0], awork.Student.LastName);
            children.Add(shortStudentName);

            var shortLecturerName = doc.CreateElement("item");
            shortLecturerName.SetAttribute("name", "ShortLecturerName");
            shortLecturerName.InnerText = string.Format("{0}.{1}. {2}", awork.CourseProject.Lecturer.FirstName[0], awork.CourseProject.Lecturer.MiddleName[0], awork.CourseProject.Lecturer.LastName);
            children.Add(shortLecturerName);

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
