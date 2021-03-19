using DocumentFormat.OpenXml.Packaging;
using Ap = DocumentFormat.OpenXml.ExtendedProperties;
using Vt = DocumentFormat.OpenXml.VariantTypes;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Wordprocessing;
using M = DocumentFormat.OpenXml.Math;
using Ovml = DocumentFormat.OpenXml.Vml.Office;
using V = DocumentFormat.OpenXml.Vml;
using W14 = DocumentFormat.OpenXml.Office2010.Word;
using W15 = DocumentFormat.OpenXml.Office2013.Word;
using Ds = DocumentFormat.OpenXml.CustomXmlDataProperties;
using A = DocumentFormat.OpenXml.Drawing;
using Thm15 = DocumentFormat.OpenXml.Office2013.Theme;
using LMPlatform.Models.CP;
using System.Globalization;
using System.IO;
using System.Text;
using System.Linq;

namespace Application.Infrastructure.Export
{
    public class GenerateCPDocument
    {
        private AssignedCourseProject awork;
        private CourseProject work;
        private CultureInfo cultureInfo;

        public GenerateCPDocument(AssignedCourseProject awork, CultureInfo cultureInfo)
        {
            this.awork = awork;
            this.cultureInfo = cultureInfo;
        }

        public GenerateCPDocument(CourseProject work, CultureInfo cultureInfo)
        {
            this.work = work;
            this.cultureInfo = cultureInfo;
        }

        // Creates a WordprocessingDocument.
        public void CreatePackage(string filePath)
        {
            using (WordprocessingDocument package = WordprocessingDocument.Create(filePath, WordprocessingDocumentType.Document))
            {
                CreateParts(package);
            }
        }

        public byte[] CreatePackageAsBytes()
        {
            using (var mstm = new MemoryStream())
            {
                using (WordprocessingDocument package = WordprocessingDocument.Create(mstm, WordprocessingDocumentType.Document))
                {
                    CreateParts(package);
                }
                mstm.Flush();
                mstm.Close();
                return mstm.ToArray();
            }
        }

        // Adds child parts and generates content of the specified part.
        private void CreateParts(WordprocessingDocument document)
        {
            ExtendedFilePropertiesPart extendedFilePropertiesPart1 = document.AddNewPart<ExtendedFilePropertiesPart>("rId3");
            GenerateExtendedFilePropertiesPart1Content(extendedFilePropertiesPart1);

            MainDocumentPart mainDocumentPart1 = document.AddMainDocumentPart();
            GenerateMainDocumentPart1Content(mainDocumentPart1);

            DocumentSettingsPart documentSettingsPart1 = mainDocumentPart1.AddNewPart<DocumentSettingsPart>("rId3");
            GenerateDocumentSettingsPart1Content(documentSettingsPart1);

            StyleDefinitionsPart styleDefinitionsPart1 = mainDocumentPart1.AddNewPart<StyleDefinitionsPart>("rId2");
            GenerateStyleDefinitionsPart1Content(styleDefinitionsPart1);

            CustomXmlPart customXmlPart1 = mainDocumentPart1.AddNewPart<CustomXmlPart>("application/xml", "rId1");
            GenerateCustomXmlPart1Content(customXmlPart1);

            CustomXmlPropertiesPart customXmlPropertiesPart1 = customXmlPart1.AddNewPart<CustomXmlPropertiesPart>("rId1");
            GenerateCustomXmlPropertiesPart1Content(customXmlPropertiesPart1);

            ThemePart themePart1 = mainDocumentPart1.AddNewPart<ThemePart>("rId6");
            GenerateThemePart1Content(themePart1);

            FontTablePart fontTablePart1 = mainDocumentPart1.AddNewPart<FontTablePart>("rId5");
            GenerateFontTablePart1Content(fontTablePart1);

            WebSettingsPart webSettingsPart1 = mainDocumentPart1.AddNewPart<WebSettingsPart>("rId4");
            GenerateWebSettingsPart1Content(webSettingsPart1);

            SetPackageProperties(document);
        }

        // Generates content of extendedFilePropertiesPart1.
        private void GenerateExtendedFilePropertiesPart1Content(ExtendedFilePropertiesPart extendedFilePropertiesPart1)
        {
            Ap.Properties properties1 = new Ap.Properties();
            properties1.AddNamespaceDeclaration("vt", "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes");
            Ap.Template template1 = new Ap.Template();
            template1.Text = "Normal.dotm";
            Ap.TotalTime totalTime1 = new Ap.TotalTime();
            totalTime1.Text = "61";
            Ap.Pages pages1 = new Ap.Pages();
            pages1.Text = "1";
            Ap.Words words1 = new Ap.Words();
            words1.Text = "273";
            Ap.Characters characters1 = new Ap.Characters();
            characters1.Text = "1562";
            Ap.Application application1 = new Ap.Application();
            application1.Text = "Microsoft Office Word";
            Ap.DocumentSecurity documentSecurity1 = new Ap.DocumentSecurity();
            documentSecurity1.Text = "0";
            Ap.Lines lines1 = new Ap.Lines();
            lines1.Text = "13";
            Ap.Paragraphs paragraphs1 = new Ap.Paragraphs();
            paragraphs1.Text = "3";
            Ap.ScaleCrop scaleCrop1 = new Ap.ScaleCrop();
            scaleCrop1.Text = "false";

            Ap.HeadingPairs headingPairs1 = new Ap.HeadingPairs();

            Vt.VTVector vTVector1 = new Vt.VTVector() { BaseType = Vt.VectorBaseValues.Variant, Size = (UInt32Value)4U };

            Vt.Variant variant1 = new Vt.Variant();
            Vt.VTLPSTR vTLPSTR1 = new Vt.VTLPSTR();
            vTLPSTR1.Text = "Название";

            variant1.Append(vTLPSTR1);

            Vt.Variant variant2 = new Vt.Variant();
            Vt.VTInt32 vTInt321 = new Vt.VTInt32();
            vTInt321.Text = "1";

            variant2.Append(vTInt321);

            Vt.Variant variant3 = new Vt.Variant();
            Vt.VTLPSTR vTLPSTR2 = new Vt.VTLPSTR();
            vTLPSTR2.Text = "Title";

            variant3.Append(vTLPSTR2);

            Vt.Variant variant4 = new Vt.Variant();
            Vt.VTInt32 vTInt322 = new Vt.VTInt32();
            vTInt322.Text = "1";

            variant4.Append(vTInt322);

            vTVector1.Append(variant1);
            vTVector1.Append(variant2);
            vTVector1.Append(variant3);
            vTVector1.Append(variant4);

            headingPairs1.Append(vTVector1);

            Ap.TitlesOfParts titlesOfParts1 = new Ap.TitlesOfParts();

            Vt.VTVector vTVector2 = new Vt.VTVector() { BaseType = Vt.VectorBaseValues.Lpstr, Size = (UInt32Value)2U };
            Vt.VTLPSTR vTLPSTR3 = new Vt.VTLPSTR();
            vTLPSTR3.Text = awork is null ? work.Univer : awork.CourseProject.Univer;
            vTLPSTR3.Text = vTLPSTR3.Text ?? "";
            Vt.VTLPSTR vTLPSTR4 = new Vt.VTLPSTR();
            vTLPSTR4.Text = awork is null ? work.Univer : awork.CourseProject.Univer;
            vTLPSTR4.Text = vTLPSTR4.Text ?? "";

            vTVector2.Append(vTLPSTR3);
            vTVector2.Append(vTLPSTR4);

            titlesOfParts1.Append(vTVector2);
            Ap.Company company1 = new Ap.Company();
            company1.Text = "";
            Ap.LinksUpToDate linksUpToDate1 = new Ap.LinksUpToDate();
            linksUpToDate1.Text = "false";
            Ap.CharactersWithSpaces charactersWithSpaces1 = new Ap.CharactersWithSpaces();
            charactersWithSpaces1.Text = "1832";
            Ap.SharedDocument sharedDocument1 = new Ap.SharedDocument();
            sharedDocument1.Text = "false";
            Ap.HyperlinksChanged hyperlinksChanged1 = new Ap.HyperlinksChanged();
            hyperlinksChanged1.Text = "false";
            Ap.ApplicationVersion applicationVersion1 = new Ap.ApplicationVersion();
            applicationVersion1.Text = "16.0000";

            properties1.Append(template1);
            properties1.Append(totalTime1);
            properties1.Append(pages1);
            properties1.Append(words1);
            properties1.Append(characters1);
            properties1.Append(application1);
            properties1.Append(documentSecurity1);
            properties1.Append(lines1);
            properties1.Append(paragraphs1);
            properties1.Append(scaleCrop1);
            properties1.Append(headingPairs1);
            properties1.Append(titlesOfParts1);
            properties1.Append(company1);
            properties1.Append(linksUpToDate1);
            properties1.Append(charactersWithSpaces1);
            properties1.Append(sharedDocument1);
            properties1.Append(hyperlinksChanged1);
            properties1.Append(applicationVersion1);

            extendedFilePropertiesPart1.Properties = properties1;
        }

        // Generates content of mainDocumentPart1.
        private void GenerateMainDocumentPart1Content(MainDocumentPart mainDocumentPart1)
        {
            Document document1 = new Document() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "w14 w15 w16se wp14" } };
            document1.AddNamespaceDeclaration("wpc", "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas");
            document1.AddNamespaceDeclaration("cx", "http://schemas.microsoft.com/office/drawing/2014/chartex");
            document1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            document1.AddNamespaceDeclaration("o", "urn:schemas-microsoft-com:office:office");
            document1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            document1.AddNamespaceDeclaration("m", "http://schemas.openxmlformats.org/officeDocument/2006/math");
            document1.AddNamespaceDeclaration("v", "urn:schemas-microsoft-com:vml");
            document1.AddNamespaceDeclaration("wp14", "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing");
            document1.AddNamespaceDeclaration("wp", "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing");
            document1.AddNamespaceDeclaration("w10", "urn:schemas-microsoft-com:office:word");
            document1.AddNamespaceDeclaration("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
            document1.AddNamespaceDeclaration("w14", "http://schemas.microsoft.com/office/word/2010/wordml");
            document1.AddNamespaceDeclaration("w15", "http://schemas.microsoft.com/office/word/2012/wordml");
            document1.AddNamespaceDeclaration("w16se", "http://schemas.microsoft.com/office/word/2015/wordml/symex");
            document1.AddNamespaceDeclaration("wpg", "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup");
            document1.AddNamespaceDeclaration("wpi", "http://schemas.microsoft.com/office/word/2010/wordprocessingInk");
            document1.AddNamespaceDeclaration("wne", "http://schemas.microsoft.com/office/word/2006/wordml");
            document1.AddNamespaceDeclaration("wps", "http://schemas.microsoft.com/office/word/2010/wordprocessingShape");

            string dateStart;
            string dateEnd;
            string lecturer;
            if (awork is null)
            {
                dateStart = work.DateStart.HasValue ? work.DateStart.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                dateEnd = work.DateEnd != null && work.DateEnd.HasValue ? work.DateEnd.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                lecturer = string.Format("{0}.{1}. {2}", work.Lecturer.FirstName[0], work.Lecturer.MiddleName[0], work.Lecturer.LastName);
            }
            else
            {
                dateStart = awork.CourseProject.DateStart.HasValue ? awork.CourseProject.DateStart.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                dateEnd = awork.CourseProject.DateEnd != null && awork.CourseProject.DateEnd.HasValue ? awork.CourseProject.DateEnd.Value.ToString("d' 'MMMM' 'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                lecturer = string.Format("{0}.{1}. {2}", awork.CourseProject.Lecturer.FirstName[0], awork.CourseProject.Lecturer.MiddleName[0], awork.CourseProject.Lecturer.LastName); ;
            }

            Body body1 = new Body();

            Paragraph paragraph1 = new Paragraph() { RsidParagraphMarkRevision = "000D3452", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00B55CB0", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties1 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines1 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification1 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties1 = new ParagraphMarkRunProperties();
            FontSize fontSize1 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript1 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties1.Append(fontSize1);
            paragraphMarkRunProperties1.Append(fontSizeComplexScript1);

            paragraphProperties1.Append(spacingBetweenLines1);
            paragraphProperties1.Append(justification1);
            paragraphProperties1.Append(paragraphMarkRunProperties1);

            Run run1 = new Run() { RsidRunProperties = "000D3452" };

            RunProperties runProperties1 = new RunProperties();
            FontSize fontSize2 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript2 = new FontSizeComplexScript() { Val = "16" };

            runProperties1.Append(fontSize2);
            runProperties1.Append(fontSizeComplexScript2);
            Text text1 = new Text();
            text1.Text = awork is null ? work.Univer : awork.CourseProject.Univer;
            text1.Text = text1.Text ?? "";

            run1.Append(runProperties1);
            run1.Append(text1);

            paragraph1.Append(paragraphProperties1);
            paragraph1.Append(run1);

            Paragraph paragraph2 = new Paragraph() { RsidParagraphMarkRevision = "008766EF", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties2 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines2 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification2 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties2 = new ParagraphMarkRunProperties();
            FontSizeComplexScript fontSizeComplexScript3 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties2.Append(fontSizeComplexScript3);

            paragraphProperties2.Append(spacingBetweenLines2);
            paragraphProperties2.Append(justification2);
            paragraphProperties2.Append(paragraphMarkRunProperties2);

            Run run2 = new Run();

            RunProperties runProperties2 = new RunProperties();
            FontSizeComplexScript fontSizeComplexScript4 = new FontSizeComplexScript() { Val = "16" };

            runProperties2.Append(fontSizeComplexScript4);
            Text text2 = new Text();
            text2.Text = awork is null ? work.Faculty : awork.CourseProject.Faculty;
            text2.Text = text2.Text ?? "";

            run2.Append(runProperties2);
            run2.Append(text2);

            paragraph2.Append(paragraphProperties2);
            paragraph2.Append(run2);

            Paragraph paragraph3 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties3 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines3 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties3 = new ParagraphMarkRunProperties();
            FontSize fontSize3 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript5 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties3.Append(fontSize3);
            paragraphMarkRunProperties3.Append(fontSizeComplexScript5);

            paragraphProperties3.Append(spacingBetweenLines3);
            paragraphProperties3.Append(paragraphMarkRunProperties3);

            paragraph3.Append(paragraphProperties3);

            Paragraph paragraph4 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties4 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines4 = new SpacingBetweenLines() { Before = "60" };
            Justification justification3 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties4 = new ParagraphMarkRunProperties();
            Bold bold1 = new Bold();
            FontSize fontSize4 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript6 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties4.Append(bold1);
            paragraphMarkRunProperties4.Append(fontSize4);
            paragraphMarkRunProperties4.Append(fontSizeComplexScript6);

            paragraphProperties4.Append(spacingBetweenLines4);
            paragraphProperties4.Append(justification3);
            paragraphProperties4.Append(paragraphMarkRunProperties4);

            paragraph4.Append(paragraphProperties4);

            Paragraph paragraph5 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties5 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines5 = new SpacingBetweenLines() { Before = "120", After = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Indentation indentation1 = new Indentation() { Start = "5579" };
            Justification justification4 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties5 = new ParagraphMarkRunProperties();
            FontSize fontSize5 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript7 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties5.Append(fontSize5);
            paragraphMarkRunProperties5.Append(fontSizeComplexScript7);

            paragraphProperties5.Append(spacingBetweenLines5);
            paragraphProperties5.Append(indentation1);
            paragraphProperties5.Append(justification4);
            paragraphProperties5.Append(paragraphMarkRunProperties5);

            Run run3 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties3 = new RunProperties();
            FontSize fontSize6 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript8 = new FontSizeComplexScript() { Val = "22" };

            runProperties3.Append(fontSize6);
            runProperties3.Append(fontSizeComplexScript8);
            Text text3 = new Text();
            text3.Text = "УТВЕРЖДАЮ";

            run3.Append(runProperties3);
            run3.Append(text3);

            paragraph5.Append(paragraphProperties5);
            paragraph5.Append(run3);

            Paragraph paragraph6 = new Paragraph() { RsidParagraphMarkRevision = "0080066D", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties6 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines6 = new SpacingBetweenLines() { Before = "120", After = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Indentation indentation2 = new Indentation() { Start = "5579" };
            Justification justification5 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties6 = new ParagraphMarkRunProperties();
            FontSize fontSize7 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript9 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties6.Append(fontSize7);
            paragraphMarkRunProperties6.Append(fontSizeComplexScript9);

            paragraphProperties6.Append(spacingBetweenLines6);
            paragraphProperties6.Append(indentation2);
            paragraphProperties6.Append(justification5);
            paragraphProperties6.Append(paragraphMarkRunProperties6);

            Run run4 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties4 = new RunProperties();
            FontSize fontSize8 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript10 = new FontSizeComplexScript() { Val = "22" };

            runProperties4.Append(fontSize8);
            runProperties4.Append(fontSizeComplexScript10);
            Text text4 = new Text();
            text4.Text = "Заведующий кафедрой";

            run4.Append(runProperties4);
            run4.Append(text4);

            paragraph6.Append(paragraphProperties6);
            paragraph6.Append(run4);

            Paragraph paragraph7 = new Paragraph() { RsidParagraphMarkRevision = "00251E2C", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00162C1A", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties7 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines7 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Indentation indentation3 = new Indentation() { Start = "5579" };
            Justification justification6 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties7 = new ParagraphMarkRunProperties();
            FontSizeComplexScript fontSizeComplexScript11 = new FontSizeComplexScript() { Val = "22" };
            VerticalTextAlignment verticalTextAlignment1 = new VerticalTextAlignment() { Val = VerticalPositionValues.Subscript };

            paragraphMarkRunProperties7.Append(fontSizeComplexScript11);
            paragraphMarkRunProperties7.Append(verticalTextAlignment1);

            paragraphProperties7.Append(spacingBetweenLines7);
            paragraphProperties7.Append(indentation3);
            paragraphProperties7.Append(justification6);
            paragraphProperties7.Append(paragraphMarkRunProperties7);

            Run run5 = new Run() { RsidRunProperties = "00832C34" };

            RunProperties runProperties5 = new RunProperties();
            FontSize fontSize9 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript12 = new FontSizeComplexScript() { Val = "22" };

            runProperties5.Append(fontSize9);
            runProperties5.Append(fontSizeComplexScript12);
            Text text5 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text5.Text = "_________________     ";

            run5.Append(runProperties5);
            run5.Append(text5);

            Run run6 = new Run() { RsidRunProperties = "00832C34" };

            RunProperties runProperties6 = new RunProperties();
            FontSize fontSize10 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript13 = new FontSizeComplexScript() { Val = "22" };
            Underline underline1 = new Underline() { Val = UnderlineValues.Single };

            runProperties6.Append(fontSize10);
            runProperties6.Append(fontSizeComplexScript13);
            runProperties6.Append(underline1);
            Text text6 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text6.Text = " ";

            run6.Append(runProperties6);
            run6.Append(text6);

            Run run7 = new Run() { RsidRunAddition = "006470F2" };

            RunProperties runProperties7 = new RunProperties();
            FontSize fontSize11 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript14 = new FontSizeComplexScript() { Val = "22" };
            Underline underline2 = new Underline() { Val = UnderlineValues.Single };

            runProperties7.Append(fontSize11);
            runProperties7.Append(fontSizeComplexScript14);
            runProperties7.Append(underline2);
            Text text7 = new Text();
            text7.Text = awork is null ? work.HeadCathedra : awork.CourseProject.HeadCathedra;
            text7.Text = text7.Text ?? "";

            run7.Append(runProperties7);
            run7.Append(text7);

            paragraph7.Append(paragraphProperties7);
            paragraph7.Append(run5);
            paragraph7.Append(run6);
            paragraph7.Append(run7);

            Paragraph paragraph8 = new Paragraph() { RsidParagraphMarkRevision = "008766EF", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties8 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines8 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Indentation indentation4 = new Indentation() { Start = "6287", FirstLine = "85" };
            Justification justification7 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties8 = new ParagraphMarkRunProperties();
            FontSize fontSize12 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript15 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties8.Append(fontSize12);
            paragraphMarkRunProperties8.Append(fontSizeComplexScript15);

            paragraphProperties8.Append(spacingBetweenLines8);
            paragraphProperties8.Append(indentation4);
            paragraphProperties8.Append(justification7);
            paragraphProperties8.Append(paragraphMarkRunProperties8);

            Run run8 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties8 = new RunProperties();
            FontSize fontSize13 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript16 = new FontSizeComplexScript() { Val = "16" };

            runProperties8.Append(fontSize13);
            runProperties8.Append(fontSizeComplexScript16);
            Text text8 = new Text();
            text8.Text = "подпись";

            run8.Append(runProperties8);
            run8.Append(text8);

            Run run9 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties9 = new RunProperties();
            FontSize fontSize14 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript17 = new FontSizeComplexScript() { Val = "16" };

            runProperties9.Append(fontSize14);
            runProperties9.Append(fontSizeComplexScript17);
            TabChar tabChar1 = new TabChar();

            run9.Append(runProperties9);
            run9.Append(tabChar1);

            Run run10 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties10 = new RunProperties();
            FontSize fontSize15 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript18 = new FontSizeComplexScript() { Val = "16" };

            runProperties10.Append(fontSize15);
            runProperties10.Append(fontSizeComplexScript18);
            TabChar tabChar2 = new TabChar();

            run10.Append(runProperties10);
            run10.Append(tabChar2);

            Run run11 = new Run() { RsidRunAddition = "00162C1A" };

            RunProperties runProperties11 = new RunProperties();
            FontSize fontSize16 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript19 = new FontSizeComplexScript() { Val = "16" };

            runProperties11.Append(fontSize16);
            runProperties11.Append(fontSizeComplexScript19);
            Text text9 = new Text();
            text9.Text = "фамилия, инициалы";

            run11.Append(runProperties11);
            run11.Append(text9);

            paragraph8.Append(paragraphProperties8);
            paragraph8.Append(run8);
            paragraph8.Append(run9);
            paragraph8.Append(run10);
            paragraph8.Append(run11);

            Paragraph paragraph9 = new Paragraph() { RsidParagraphMarkRevision = "008766EF", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties9 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines9 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification8 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties9 = new ParagraphMarkRunProperties();
            FontSize fontSize17 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript20 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties9.Append(fontSize17);
            paragraphMarkRunProperties9.Append(fontSizeComplexScript20);

            paragraphProperties9.Append(spacingBetweenLines9);
            paragraphProperties9.Append(justification8);
            paragraphProperties9.Append(paragraphMarkRunProperties9);

            paragraph9.Append(paragraphProperties9);

            Paragraph paragraph10 = new Paragraph() { RsidParagraphMarkRevision = "008766EF", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties10 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines10 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification9 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties10 = new ParagraphMarkRunProperties();
            FontSize fontSize18 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript21 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties10.Append(fontSize18);
            paragraphMarkRunProperties10.Append(fontSizeComplexScript21);

            paragraphProperties10.Append(spacingBetweenLines10);
            paragraphProperties10.Append(justification9);
            paragraphProperties10.Append(paragraphMarkRunProperties10);

            Run run12 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties12 = new RunProperties();
            FontSize fontSize19 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript22 = new FontSizeComplexScript() { Val = "16" };

            runProperties12.Append(fontSize19);
            runProperties12.Append(fontSizeComplexScript22);
            TabChar tabChar3 = new TabChar();

            run12.Append(runProperties12);
            run12.Append(tabChar3);

            Run run13 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties13 = new RunProperties();
            FontSize fontSize20 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript23 = new FontSizeComplexScript() { Val = "16" };

            runProperties13.Append(fontSize20);
            runProperties13.Append(fontSizeComplexScript23);
            TabChar tabChar4 = new TabChar();

            run13.Append(runProperties13);
            run13.Append(tabChar4);

            Run run14 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties14 = new RunProperties();
            FontSize fontSize21 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript24 = new FontSizeComplexScript() { Val = "16" };

            runProperties14.Append(fontSize21);
            runProperties14.Append(fontSizeComplexScript24);
            TabChar tabChar5 = new TabChar();

            run14.Append(runProperties14);
            run14.Append(tabChar5);

            Run run15 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties15 = new RunProperties();
            FontSize fontSize22 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript25 = new FontSizeComplexScript() { Val = "16" };

            runProperties15.Append(fontSize22);
            runProperties15.Append(fontSizeComplexScript25);
            TabChar tabChar6 = new TabChar();

            run15.Append(runProperties15);
            run15.Append(tabChar6);

            Run run16 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties16 = new RunProperties();
            FontSize fontSize23 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript26 = new FontSizeComplexScript() { Val = "16" };

            runProperties16.Append(fontSize23);
            runProperties16.Append(fontSizeComplexScript26);
            TabChar tabChar7 = new TabChar();

            run16.Append(runProperties16);
            run16.Append(tabChar7);

            Run run17 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties17 = new RunProperties();
            FontSize fontSize24 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript27 = new FontSizeComplexScript() { Val = "16" };

            runProperties17.Append(fontSize24);
            runProperties17.Append(fontSizeComplexScript27);
            TabChar tabChar8 = new TabChar();

            run17.Append(runProperties17);
            run17.Append(tabChar8);

            Run run18 = new Run() { RsidRunProperties = "008766EF" };

            RunProperties runProperties18 = new RunProperties();
            FontSize fontSize25 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript28 = new FontSizeComplexScript() { Val = "16" };

            runProperties18.Append(fontSize25);
            runProperties18.Append(fontSizeComplexScript28);
            TabChar tabChar9 = new TabChar();
            Text text10 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text10.Text = "               ";

            run18.Append(runProperties18);
            run18.Append(tabChar9);
            run18.Append(text10);

            paragraph10.Append(paragraphProperties10);
            paragraph10.Append(run12);
            paragraph10.Append(run13);
            paragraph10.Append(run14);
            paragraph10.Append(run15);
            paragraph10.Append(run16);
            paragraph10.Append(run17);
            paragraph10.Append(run18);

            Table table1 = new Table();

            TableProperties tableProperties1 = new TableProperties();
            TableWidth tableWidth1 = new TableWidth() { Width = "3697", Type = TableWidthUnitValues.Dxa };
            TableIndentation tableIndentation1 = new TableIndentation() { Width = 4786, Type = TableWidthUnitValues.Dxa };

            TableBorders tableBorders1 = new TableBorders();
            TopBorder topBorder1 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder1 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder1 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder1 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder1 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder1 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders1.Append(topBorder1);
            tableBorders1.Append(leftBorder1);
            tableBorders1.Append(bottomBorder1);
            tableBorders1.Append(rightBorder1);
            tableBorders1.Append(insideHorizontalBorder1);
            tableBorders1.Append(insideVerticalBorder1);
            TableLook tableLook1 = new TableLook() { Val = "04A0" };

            tableProperties1.Append(tableWidth1);
            tableProperties1.Append(tableIndentation1);
            tableProperties1.Append(tableBorders1);
            tableProperties1.Append(tableLook1);

            TableGrid tableGrid1 = new TableGrid();
            GridColumn gridColumn1 = new GridColumn() { Width = "283" };
            GridColumn gridColumn2 = new GridColumn() { Width = "284" };
            GridColumn gridColumn3 = new GridColumn() { Width = "296" };
            GridColumn gridColumn4 = new GridColumn() { Width = "1972" };
            GridColumn gridColumn5 = new GridColumn() { Width = "862" };

            tableGrid1.Append(gridColumn1);
            tableGrid1.Append(gridColumn2);
            tableGrid1.Append(gridColumn3);
            tableGrid1.Append(gridColumn4);
            tableGrid1.Append(gridColumn5);

            TableRow tableRow1 = new TableRow() { RsidTableRowMarkRevision = "00777639", RsidTableRowAddition = "00777639", RsidTableRowProperties = "00162C1A" };

            TableCell tableCell1 = new TableCell();

            TableCellProperties tableCellProperties1 = new TableCellProperties();
            TableCellWidth tableCellWidth1 = new TableCellWidth() { Width = "283", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders1 = new TableCellBorders();
            TopBorder topBorder2 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder2 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder2 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder2 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders1.Append(topBorder2);
            tableCellBorders1.Append(leftBorder2);
            tableCellBorders1.Append(bottomBorder2);
            tableCellBorders1.Append(rightBorder2);
            Shading shading1 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties1.Append(tableCellWidth1);
            tableCellProperties1.Append(tableCellBorders1);
            tableCellProperties1.Append(shading1);

            Paragraph paragraph11 = new Paragraph() { RsidParagraphMarkRevision = "00777639", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties11 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines11 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification10 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties11 = new ParagraphMarkRunProperties();
            FontSize fontSize26 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript29 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties11.Append(fontSize26);
            paragraphMarkRunProperties11.Append(fontSizeComplexScript29);

            paragraphProperties11.Append(spacingBetweenLines11);
            paragraphProperties11.Append(justification10);
            paragraphProperties11.Append(paragraphMarkRunProperties11);

            paragraph11.Append(paragraphProperties11);

            tableCell1.Append(tableCellProperties1);
            tableCell1.Append(paragraph11);

            TableCell tableCell2 = new TableCell();

            TableCellProperties tableCellProperties2 = new TableCellProperties();
            TableCellWidth tableCellWidth2 = new TableCellWidth() { Width = "284", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders2 = new TableCellBorders();
            TopBorder topBorder3 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder3 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder3 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder3 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders2.Append(topBorder3);
            tableCellBorders2.Append(leftBorder3);
            tableCellBorders2.Append(bottomBorder3);
            tableCellBorders2.Append(rightBorder3);
            Shading shading2 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties2.Append(tableCellWidth2);
            tableCellProperties2.Append(tableCellBorders2);
            tableCellProperties2.Append(shading2);

            Paragraph paragraph12 = new Paragraph() { RsidParagraphMarkRevision = "00777639", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties12 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines12 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification11 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties12 = new ParagraphMarkRunProperties();
            FontSize fontSize27 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript30 = new FontSizeComplexScript() { Val = "16" };
            Languages languages1 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties12.Append(fontSize27);
            paragraphMarkRunProperties12.Append(fontSizeComplexScript30);
            paragraphMarkRunProperties12.Append(languages1);

            paragraphProperties12.Append(spacingBetweenLines12);
            paragraphProperties12.Append(justification11);
            paragraphProperties12.Append(paragraphMarkRunProperties12);

            paragraph12.Append(paragraphProperties12);

            tableCell2.Append(tableCellProperties2);
            tableCell2.Append(paragraph12);

            TableCell tableCell3 = new TableCell();

            TableCellProperties tableCellProperties3 = new TableCellProperties();
            TableCellWidth tableCellWidth3 = new TableCellWidth() { Width = "296", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders3 = new TableCellBorders();
            TopBorder topBorder4 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder4 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder4 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder4 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders3.Append(topBorder4);
            tableCellBorders3.Append(leftBorder4);
            tableCellBorders3.Append(bottomBorder4);
            tableCellBorders3.Append(rightBorder4);
            Shading shading3 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties3.Append(tableCellWidth3);
            tableCellProperties3.Append(tableCellBorders3);
            tableCellProperties3.Append(shading3);

            Paragraph paragraph13 = new Paragraph() { RsidParagraphMarkRevision = "00777639", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties13 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines13 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification12 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties13 = new ParagraphMarkRunProperties();
            FontSize fontSize28 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript31 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties13.Append(fontSize28);
            paragraphMarkRunProperties13.Append(fontSizeComplexScript31);

            paragraphProperties13.Append(spacingBetweenLines13);
            paragraphProperties13.Append(justification12);
            paragraphProperties13.Append(paragraphMarkRunProperties13);

            paragraph13.Append(paragraphProperties13);

            tableCell3.Append(tableCellProperties3);
            tableCell3.Append(paragraph13);

            TableCell tableCell4 = new TableCell();

            TableCellProperties tableCellProperties4 = new TableCellProperties();
            TableCellWidth tableCellWidth4 = new TableCellWidth() { Width = "1972", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders4 = new TableCellBorders();
            TopBorder topBorder5 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder5 = new LeftBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder5 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders4.Append(topBorder5);
            tableCellBorders4.Append(leftBorder5);
            tableCellBorders4.Append(rightBorder5);
            Shading shading4 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties4.Append(tableCellWidth4);
            tableCellProperties4.Append(tableCellBorders4);
            tableCellProperties4.Append(shading4);

            Paragraph paragraph14 = new Paragraph() { RsidParagraphMarkRevision = "002A6E3E", RsidParagraphAddition = "00777639", RsidParagraphProperties = "002A6E3E", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties14 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines14 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification13 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties14 = new ParagraphMarkRunProperties();
            FontSize fontSize29 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript32 = new FontSizeComplexScript() { Val = "22" };
            Languages languages2 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties14.Append(fontSize29);
            paragraphMarkRunProperties14.Append(fontSizeComplexScript32);
            paragraphMarkRunProperties14.Append(languages2);

            paragraphProperties14.Append(spacingBetweenLines14);
            paragraphProperties14.Append(justification13);
            paragraphProperties14.Append(paragraphMarkRunProperties14);

            Run run19 = new Run();

            RunProperties runProperties19 = new RunProperties();
            FontSize fontSize30 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript33 = new FontSizeComplexScript() { Val = "22" };
            Languages languages3 = new Languages() { Val = "en-US" };

            runProperties19.Append(fontSize30);
            runProperties19.Append(fontSizeComplexScript33);
            runProperties19.Append(languages3);
            Text text11 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text11.Text = dateStart ?? "";

            run19.Append(runProperties19);
            run19.Append(text11);
            ProofError proofError1 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph14.Append(paragraphProperties14);
            paragraph14.Append(run19);
            paragraph14.Append(proofError1);

            tableCell4.Append(tableCellProperties4);
            tableCell4.Append(paragraph14);

            TableCell tableCell5 = new TableCell();

            TableCellProperties tableCellProperties5 = new TableCellProperties();
            TableCellWidth tableCellWidth5 = new TableCellWidth() { Width = "862", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders5 = new TableCellBorders();
            TopBorder topBorder6 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder6 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder5 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder6 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders5.Append(topBorder6);
            tableCellBorders5.Append(leftBorder6);
            tableCellBorders5.Append(bottomBorder5);
            tableCellBorders5.Append(rightBorder6);
            Shading shading5 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties5.Append(tableCellWidth5);
            tableCellProperties5.Append(tableCellBorders5);
            tableCellProperties5.Append(shading5);

            Paragraph paragraph15 = new Paragraph() { RsidParagraphMarkRevision = "002A6E3E", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00777639", RsidRunAdditionDefault = "00777639" };

            ParagraphProperties paragraphProperties15 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines15 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification14 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties15 = new ParagraphMarkRunProperties();
            FontSize fontSize33 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript36 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties15.Append(fontSize33);
            paragraphMarkRunProperties15.Append(fontSizeComplexScript36);

            paragraphProperties15.Append(spacingBetweenLines15);
            paragraphProperties15.Append(justification14);
            paragraphProperties15.Append(paragraphMarkRunProperties15);

            paragraph15.Append(paragraphProperties15);

            tableCell5.Append(tableCellProperties5);
            tableCell5.Append(paragraph15);

            tableRow1.Append(tableCell1);
            tableRow1.Append(tableCell2);
            tableRow1.Append(tableCell3);
            tableRow1.Append(tableCell4);
            tableRow1.Append(tableCell5);

            table1.Append(tableProperties1);
            table1.Append(tableGrid1);
            table1.Append(tableRow1);

            Paragraph paragraph16 = new Paragraph() { RsidParagraphMarkRevision = "00777639", RsidParagraphAddition = "00777639", RsidParagraphProperties = "00162C1A", RsidRunAdditionDefault = "009C5A91" };

            ParagraphProperties paragraphProperties16 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines16 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification15 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties16 = new ParagraphMarkRunProperties();
            FontSize fontSize34 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript37 = new FontSizeComplexScript() { Val = "16" };
            Languages languages6 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties16.Append(fontSize34);
            paragraphMarkRunProperties16.Append(fontSizeComplexScript37);
            paragraphMarkRunProperties16.Append(languages6);

            paragraphProperties16.Append(spacingBetweenLines16);
            paragraphProperties16.Append(justification15);
            paragraphProperties16.Append(paragraphMarkRunProperties16);

            Run run22 = new Run();

            RunProperties runProperties22 = new RunProperties();
            FontSize fontSize35 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript38 = new FontSizeComplexScript() { Val = "16" };
            Languages languages7 = new Languages() { Val = "en-US" };

            runProperties22.Append(fontSize35);
            runProperties22.Append(fontSizeComplexScript38);
            runProperties22.Append(languages7);
            TabChar tabChar10 = new TabChar();

            run22.Append(runProperties22);
            run22.Append(tabChar10);

            Run run23 = new Run();

            RunProperties runProperties23 = new RunProperties();
            FontSize fontSize36 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript39 = new FontSizeComplexScript() { Val = "16" };
            Languages languages8 = new Languages() { Val = "en-US" };

            runProperties23.Append(fontSize36);
            runProperties23.Append(fontSizeComplexScript39);
            runProperties23.Append(languages8);
            TabChar tabChar11 = new TabChar();

            run23.Append(runProperties23);
            run23.Append(tabChar11);

            Run run24 = new Run();

            RunProperties runProperties24 = new RunProperties();
            FontSize fontSize37 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript40 = new FontSizeComplexScript() { Val = "16" };
            Languages languages9 = new Languages() { Val = "en-US" };

            runProperties24.Append(fontSize37);
            runProperties24.Append(fontSizeComplexScript40);
            runProperties24.Append(languages9);
            TabChar tabChar12 = new TabChar();

            run24.Append(runProperties24);
            run24.Append(tabChar12);

            Run run25 = new Run();

            RunProperties runProperties25 = new RunProperties();
            FontSize fontSize38 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript41 = new FontSizeComplexScript() { Val = "16" };
            Languages languages10 = new Languages() { Val = "en-US" };

            runProperties25.Append(fontSize38);
            runProperties25.Append(fontSizeComplexScript41);
            runProperties25.Append(languages10);
            TabChar tabChar13 = new TabChar();

            run25.Append(runProperties25);
            run25.Append(tabChar13);

            Run run26 = new Run();

            RunProperties runProperties26 = new RunProperties();
            FontSize fontSize39 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript42 = new FontSizeComplexScript() { Val = "16" };
            Languages languages11 = new Languages() { Val = "en-US" };

            runProperties26.Append(fontSize39);
            runProperties26.Append(fontSizeComplexScript42);
            runProperties26.Append(languages11);
            TabChar tabChar14 = new TabChar();
            Text text14 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text14.Text = "    ";

            run26.Append(runProperties26);
            run26.Append(tabChar14);
            run26.Append(text14);

            Run run27 = new Run() { RsidRunAddition = "00162C1A" };

            RunProperties runProperties27 = new RunProperties();
            FontSize fontSize40 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript43 = new FontSizeComplexScript() { Val = "16" };

            runProperties27.Append(fontSize40);
            runProperties27.Append(fontSizeComplexScript43);
            Text text15 = new Text();
            text15.Text = "дата";

            run27.Append(runProperties27);
            run27.Append(text15);

            Run run28 = new Run() { RsidRunAddition = "00162C1A" };

            RunProperties runProperties28 = new RunProperties();
            FontSize fontSize41 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript44 = new FontSizeComplexScript() { Val = "16" };
            Languages languages12 = new Languages() { Val = "en-US" };

            runProperties28.Append(fontSize41);
            runProperties28.Append(fontSizeComplexScript44);
            runProperties28.Append(languages12);
            TabChar tabChar15 = new TabChar();

            run28.Append(runProperties28);
            run28.Append(tabChar15);

            paragraph16.Append(paragraphProperties16);
            paragraph16.Append(run22);
            paragraph16.Append(run23);
            paragraph16.Append(run24);
            paragraph16.Append(run25);
            paragraph16.Append(run26);
            paragraph16.Append(run27);
            paragraph16.Append(run28);

            Paragraph paragraph17 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties17 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines17 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties17.Append(spacingBetweenLines17);

            paragraph17.Append(paragraphProperties17);

            Paragraph paragraph18 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "000806E4" };

            ParagraphProperties paragraphProperties18 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines18 = new SpacingBetweenLines() { Before = "240" };
            Justification justification16 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties17 = new ParagraphMarkRunProperties();
            FontSize fontSize42 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript45 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties17.Append(fontSize42);
            paragraphMarkRunProperties17.Append(fontSizeComplexScript45);

            paragraphProperties18.Append(spacingBetweenLines18);
            paragraphProperties18.Append(justification16);
            paragraphProperties18.Append(paragraphMarkRunProperties17);

            Run run29 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties29 = new RunProperties();
            FontSize fontSize43 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript46 = new FontSizeComplexScript() { Val = "22" };

            runProperties29.Append(fontSize43);
            runProperties29.Append(fontSizeComplexScript46);
            Text text16 = new Text();
            text16.Text = "Задание на курсовой проект (курсовую работу)";

            run29.Append(runProperties29);
            run29.Append(text16);

            paragraph18.Append(paragraphProperties18);
            paragraph18.Append(run29);

            Paragraph paragraph19 = new Paragraph() { RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "008D0256" };

            ParagraphProperties paragraphProperties19 = new ParagraphProperties();

            Tabs tabs1 = new Tabs();
            TabStop tabStop1 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop2 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop3 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop4 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop5 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop6 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop7 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop8 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop9 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs1.Append(tabStop1);
            tabs1.Append(tabStop2);
            tabs1.Append(tabStop3);
            tabs1.Append(tabStop4);
            tabs1.Append(tabStop5);
            tabs1.Append(tabStop6);
            tabs1.Append(tabStop7);
            tabs1.Append(tabStop8);
            tabs1.Append(tabStop9);
            SpacingBetweenLines spacingBetweenLines19 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties18 = new ParagraphMarkRunProperties();
            FontSize fontSize44 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript47 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties18.Append(fontSize44);
            paragraphMarkRunProperties18.Append(fontSizeComplexScript47);

            paragraphProperties19.Append(tabs1);
            paragraphProperties19.Append(spacingBetweenLines19);
            paragraphProperties19.Append(paragraphMarkRunProperties18);

            Run run30 = new Run() { RsidRunProperties = "00967F75" };

            RunProperties runProperties30 = new RunProperties();
            FontSize fontSize45 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript48 = new FontSizeComplexScript() { Val = "22" };

            runProperties30.Append(fontSize45);
            runProperties30.Append(fontSizeComplexScript48);
            Text text17 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text17.Text = "            ";

            run30.Append(runProperties30);
            run30.Append(text17);

            paragraph19.Append(paragraphProperties19);
            paragraph19.Append(run30);

            Table table2 = new Table();

            TableProperties tableProperties2 = new TableProperties();
            TableWidth tableWidth2 = new TableWidth() { Width = "9497", Type = TableWidthUnitValues.Dxa };

            TableBorders tableBorders2 = new TableBorders();
            TopBorder topBorder7 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder7 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder6 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder7 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder2 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder2 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders2.Append(topBorder7);
            tableBorders2.Append(leftBorder7);
            tableBorders2.Append(bottomBorder6);
            tableBorders2.Append(rightBorder7);
            tableBorders2.Append(insideHorizontalBorder2);
            tableBorders2.Append(insideVerticalBorder2);
            TableLook tableLook2 = new TableLook() { Val = "04A0" };

            tableProperties2.Append(tableWidth2);
            tableProperties2.Append(tableBorders2);
            tableProperties2.Append(tableLook2);

            TableGrid tableGrid2 = new TableGrid();
            GridColumn gridColumn6 = new GridColumn() { Width = "3119" };
            GridColumn gridColumn7 = new GridColumn() { Width = "1701" };
            GridColumn gridColumn8 = new GridColumn() { Width = "708" };
            GridColumn gridColumn9 = new GridColumn() { Width = "3969" };

            tableGrid2.Append(gridColumn6);
            tableGrid2.Append(gridColumn7);
            tableGrid2.Append(gridColumn8);
            tableGrid2.Append(gridColumn9);

            TableRow tableRow2 = new TableRow() { RsidTableRowMarkRevision = "00967F75", RsidTableRowAddition = "00967F75", RsidTableRowProperties = "005472CC" };

            TableCell tableCell6 = new TableCell();

            TableCellProperties tableCellProperties6 = new TableCellProperties();
            TableCellWidth tableCellWidth6 = new TableCellWidth() { Width = "3119", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders6 = new TableCellBorders();
            TopBorder topBorder8 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder8 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder7 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder8 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders6.Append(topBorder8);
            tableCellBorders6.Append(leftBorder8);
            tableCellBorders6.Append(bottomBorder7);
            tableCellBorders6.Append(rightBorder8);
            Shading shading6 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties6.Append(tableCellWidth6);
            tableCellProperties6.Append(tableCellBorders6);
            tableCellProperties6.Append(shading6);

            Paragraph paragraph20 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "003F3715", RsidRunAdditionDefault = "003F3715" };

            ParagraphProperties paragraphProperties20 = new ParagraphProperties();

            Tabs tabs2 = new Tabs();
            TabStop tabStop10 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop11 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop12 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop13 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop14 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop15 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop16 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop17 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop18 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs2.Append(tabStop10);
            tabs2.Append(tabStop11);
            tabs2.Append(tabStop12);
            tabs2.Append(tabStop13);
            tabs2.Append(tabStop14);
            tabs2.Append(tabStop15);
            tabs2.Append(tabStop16);
            tabs2.Append(tabStop17);
            tabs2.Append(tabStop18);
            SpacingBetweenLines spacingBetweenLines20 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties19 = new ParagraphMarkRunProperties();
            FontSize fontSize46 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript49 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties19.Append(fontSize46);
            paragraphMarkRunProperties19.Append(fontSizeComplexScript49);

            paragraphProperties20.Append(tabs2);
            paragraphProperties20.Append(spacingBetweenLines20);
            paragraphProperties20.Append(paragraphMarkRunProperties19);

            Run run31 = new Run();

            RunProperties runProperties31 = new RunProperties();
            FontSize fontSize47 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript50 = new FontSizeComplexScript() { Val = "22" };

            runProperties31.Append(fontSize47);
            runProperties31.Append(fontSizeComplexScript50);
            Text text18 = new Text();
            text18.Text = "Обучающемуся группы";

            run31.Append(runProperties31);
            run31.Append(text18);

            paragraph20.Append(paragraphProperties20);
            paragraph20.Append(run31);

            tableCell6.Append(tableCellProperties6);
            tableCell6.Append(paragraph20);

            TableCell tableCell7 = new TableCell();

            TableCellProperties tableCellProperties7 = new TableCellProperties();
            TableCellWidth tableCellWidth7 = new TableCellWidth() { Width = "1701", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders7 = new TableCellBorders();
            TopBorder topBorder9 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder9 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder8 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder9 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders7.Append(topBorder9);
            tableCellBorders7.Append(leftBorder9);
            tableCellBorders7.Append(bottomBorder8);
            tableCellBorders7.Append(rightBorder9);
            Shading shading7 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties7.Append(tableCellWidth7);
            tableCellProperties7.Append(tableCellBorders7);
            tableCellProperties7.Append(shading7);

            Paragraph paragraph21 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00DD5313", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties21 = new ParagraphProperties();

            Tabs tabs3 = new Tabs();
            TabStop tabStop19 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop20 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop21 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop22 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop23 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop24 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop25 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop26 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop27 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs3.Append(tabStop19);
            tabs3.Append(tabStop20);
            tabs3.Append(tabStop21);
            tabs3.Append(tabStop22);
            tabs3.Append(tabStop23);
            tabs3.Append(tabStop24);
            tabs3.Append(tabStop25);
            tabs3.Append(tabStop26);
            tabs3.Append(tabStop27);
            SpacingBetweenLines spacingBetweenLines21 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification17 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties20 = new ParagraphMarkRunProperties();
            FontSize fontSize50 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript53 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties20.Append(fontSize50);
            paragraphMarkRunProperties20.Append(fontSizeComplexScript53);

            paragraphProperties21.Append(tabs3);
            paragraphProperties21.Append(spacingBetweenLines21);
            paragraphProperties21.Append(justification17);
            paragraphProperties21.Append(paragraphMarkRunProperties20);

            Run run34 = new Run();

            RunProperties runProperties34 = new RunProperties();
            FontSize fontSize51 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript54 = new FontSizeComplexScript() { Val = "22" };

            runProperties34.Append(fontSize51);
            runProperties34.Append(fontSizeComplexScript54);
            Text text20 = new Text();
            text20.Text = awork is null ? "" : awork.Student.Group.Name;

            run34.Append(runProperties34);
            run34.Append(text20);

            paragraph21.Append(paragraphProperties21);
            paragraph21.Append(run34);

            tableCell7.Append(tableCellProperties7);
            tableCell7.Append(paragraph21);

            TableCell tableCell8 = new TableCell();

            TableCellProperties tableCellProperties8 = new TableCellProperties();
            TableCellWidth tableCellWidth8 = new TableCellWidth() { Width = "708", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders8 = new TableCellBorders();
            TopBorder topBorder10 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder10 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder9 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder10 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders8.Append(topBorder10);
            tableCellBorders8.Append(leftBorder10);
            tableCellBorders8.Append(bottomBorder9);
            tableCellBorders8.Append(rightBorder10);
            Shading shading8 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties8.Append(tableCellWidth8);
            tableCellProperties8.Append(tableCellBorders8);
            tableCellProperties8.Append(shading8);

            Paragraph paragraph22 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "00967F75" };

            ParagraphProperties paragraphProperties22 = new ParagraphProperties();

            Tabs tabs4 = new Tabs();
            TabStop tabStop28 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop29 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop30 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop31 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop32 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop33 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop34 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop35 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop36 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs4.Append(tabStop28);
            tabs4.Append(tabStop29);
            tabs4.Append(tabStop30);
            tabs4.Append(tabStop31);
            tabs4.Append(tabStop32);
            tabs4.Append(tabStop33);
            tabs4.Append(tabStop34);
            tabs4.Append(tabStop35);
            tabs4.Append(tabStop36);
            SpacingBetweenLines spacingBetweenLines22 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties21 = new ParagraphMarkRunProperties();
            FontSize fontSize52 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript55 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties21.Append(fontSize52);
            paragraphMarkRunProperties21.Append(fontSizeComplexScript55);

            paragraphProperties22.Append(tabs4);
            paragraphProperties22.Append(spacingBetweenLines22);
            paragraphProperties22.Append(paragraphMarkRunProperties21);

            paragraph22.Append(paragraphProperties22);

            tableCell8.Append(tableCellProperties8);
            tableCell8.Append(paragraph22);

            TableCell tableCell9 = new TableCell();

            TableCellProperties tableCellProperties9 = new TableCellProperties();
            TableCellWidth tableCellWidth9 = new TableCellWidth() { Width = "3969", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders9 = new TableCellBorders();
            TopBorder topBorder11 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder11 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder10 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder11 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders9.Append(topBorder11);
            tableCellBorders9.Append(leftBorder11);
            tableCellBorders9.Append(bottomBorder10);
            tableCellBorders9.Append(rightBorder11);
            Shading shading9 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties9.Append(tableCellWidth9);
            tableCellProperties9.Append(tableCellBorders9);
            tableCellProperties9.Append(shading9);

            Paragraph paragraph23 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00DD5313", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties23 = new ParagraphProperties();

            Tabs tabs5 = new Tabs();
            TabStop tabStop37 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop38 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop39 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop40 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop41 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop42 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop43 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop44 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop45 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs5.Append(tabStop37);
            tabs5.Append(tabStop38);
            tabs5.Append(tabStop39);
            tabs5.Append(tabStop40);
            tabs5.Append(tabStop41);
            tabs5.Append(tabStop42);
            tabs5.Append(tabStop43);
            tabs5.Append(tabStop44);
            tabs5.Append(tabStop45);
            SpacingBetweenLines spacingBetweenLines23 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification18 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties22 = new ParagraphMarkRunProperties();
            FontSize fontSize53 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript56 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties22.Append(fontSize53);
            paragraphMarkRunProperties22.Append(fontSizeComplexScript56);

            paragraphProperties23.Append(tabs5);
            paragraphProperties23.Append(spacingBetweenLines23);
            paragraphProperties23.Append(justification18);
            paragraphProperties23.Append(paragraphMarkRunProperties22);
            ProofError proofError3 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run35 = new Run();

            RunProperties runProperties35 = new RunProperties();
            FontSize fontSize54 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript57 = new FontSizeComplexScript() { Val = "22" };

            runProperties35.Append(fontSize54);
            runProperties35.Append(fontSizeComplexScript57);
            Text text21 = new Text();
            text21.Text = awork is null ? "" : string.Format("{0} {1} {2}", awork.Student.LastName, awork.Student.FirstName, awork.Student.MiddleName);

            run35.Append(runProperties35);
            run35.Append(text21);
            ProofError proofError4 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph23.Append(paragraphProperties23);
            paragraph23.Append(proofError3);
            paragraph23.Append(run35);
            paragraph23.Append(proofError4);

            tableCell9.Append(tableCellProperties9);
            tableCell9.Append(paragraph23);

            tableRow2.Append(tableCell6);
            tableRow2.Append(tableCell7);
            tableRow2.Append(tableCell8);
            tableRow2.Append(tableCell9);

            TableRow tableRow3 = new TableRow() { RsidTableRowMarkRevision = "00967F75", RsidTableRowAddition = "00967F75", RsidTableRowProperties = "005472CC" };

            TableRowProperties tableRowProperties1 = new TableRowProperties();
            TableRowHeight tableRowHeight1 = new TableRowHeight() { Val = (UInt32Value)397U };

            tableRowProperties1.Append(tableRowHeight1);

            TableCell tableCell10 = new TableCell();

            TableCellProperties tableCellProperties10 = new TableCellProperties();
            TableCellWidth tableCellWidth10 = new TableCellWidth() { Width = "3119", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders10 = new TableCellBorders();
            TopBorder topBorder12 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder12 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder11 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder12 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders10.Append(topBorder12);
            tableCellBorders10.Append(leftBorder12);
            tableCellBorders10.Append(bottomBorder11);
            tableCellBorders10.Append(rightBorder12);
            Shading shading10 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties10.Append(tableCellWidth10);
            tableCellProperties10.Append(tableCellBorders10);
            tableCellProperties10.Append(shading10);

            Paragraph paragraph24 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "00967F75" };

            ParagraphProperties paragraphProperties24 = new ParagraphProperties();

            Tabs tabs6 = new Tabs();
            TabStop tabStop46 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop47 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop48 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop49 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop50 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop51 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop52 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop53 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop54 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs6.Append(tabStop46);
            tabs6.Append(tabStop47);
            tabs6.Append(tabStop48);
            tabs6.Append(tabStop49);
            tabs6.Append(tabStop50);
            tabs6.Append(tabStop51);
            tabs6.Append(tabStop52);
            tabs6.Append(tabStop53);
            tabs6.Append(tabStop54);
            SpacingBetweenLines spacingBetweenLines24 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties23 = new ParagraphMarkRunProperties();
            FontSize fontSize59 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript62 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties23.Append(fontSize59);
            paragraphMarkRunProperties23.Append(fontSizeComplexScript62);

            paragraphProperties24.Append(tabs6);
            paragraphProperties24.Append(spacingBetweenLines24);
            paragraphProperties24.Append(paragraphMarkRunProperties23);

            paragraph24.Append(paragraphProperties24);

            tableCell10.Append(tableCellProperties10);
            tableCell10.Append(paragraph24);

            TableCell tableCell11 = new TableCell();

            TableCellProperties tableCellProperties11 = new TableCellProperties();
            TableCellWidth tableCellWidth11 = new TableCellWidth() { Width = "1701", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders11 = new TableCellBorders();
            LeftBorder leftBorder13 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder12 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder13 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders11.Append(leftBorder13);
            tableCellBorders11.Append(bottomBorder12);
            tableCellBorders11.Append(rightBorder13);
            Shading shading11 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties11.Append(tableCellWidth11);
            tableCellProperties11.Append(tableCellBorders11);
            tableCellProperties11.Append(shading11);

            Paragraph paragraph25 = new Paragraph() { RsidParagraphMarkRevision = "0038541A", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "0038541A" };

            ParagraphProperties paragraphProperties25 = new ParagraphProperties();

            Tabs tabs7 = new Tabs();
            TabStop tabStop55 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop56 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop57 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop58 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop59 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop60 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop61 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop62 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop63 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs7.Append(tabStop55);
            tabs7.Append(tabStop56);
            tabs7.Append(tabStop57);
            tabs7.Append(tabStop58);
            tabs7.Append(tabStop59);
            tabs7.Append(tabStop60);
            tabs7.Append(tabStop61);
            tabs7.Append(tabStop62);
            tabs7.Append(tabStop63);
            SpacingBetweenLines spacingBetweenLines25 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification19 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties24 = new ParagraphMarkRunProperties();
            FontSize fontSize60 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript63 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties24.Append(fontSize60);
            paragraphMarkRunProperties24.Append(fontSizeComplexScript63);

            paragraphProperties25.Append(tabs7);
            paragraphProperties25.Append(spacingBetweenLines25);
            paragraphProperties25.Append(justification19);
            paragraphProperties25.Append(paragraphMarkRunProperties24);

            Run run40 = new Run();

            RunProperties runProperties40 = new RunProperties();
            FontSize fontSize61 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript64 = new FontSizeComplexScript() { Val = "16" };

            runProperties40.Append(fontSize61);
            runProperties40.Append(fontSizeComplexScript64);
            Text text26 = new Text();
            text26.Text = "номер группы";

            run40.Append(runProperties40);
            run40.Append(text26);

            paragraph25.Append(paragraphProperties25);
            paragraph25.Append(run40);

            tableCell11.Append(tableCellProperties11);
            tableCell11.Append(paragraph25);

            TableCell tableCell12 = new TableCell();

            TableCellProperties tableCellProperties12 = new TableCellProperties();
            TableCellWidth tableCellWidth12 = new TableCellWidth() { Width = "708", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders12 = new TableCellBorders();
            TopBorder topBorder13 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder14 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder13 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder14 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders12.Append(topBorder13);
            tableCellBorders12.Append(leftBorder14);
            tableCellBorders12.Append(bottomBorder13);
            tableCellBorders12.Append(rightBorder14);
            Shading shading12 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties12.Append(tableCellWidth12);
            tableCellProperties12.Append(tableCellBorders12);
            tableCellProperties12.Append(shading12);

            Paragraph paragraph26 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "00967F75" };

            ParagraphProperties paragraphProperties26 = new ParagraphProperties();

            Tabs tabs8 = new Tabs();
            TabStop tabStop64 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop65 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop66 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop67 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop68 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop69 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop70 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop71 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop72 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs8.Append(tabStop64);
            tabs8.Append(tabStop65);
            tabs8.Append(tabStop66);
            tabs8.Append(tabStop67);
            tabs8.Append(tabStop68);
            tabs8.Append(tabStop69);
            tabs8.Append(tabStop70);
            tabs8.Append(tabStop71);
            tabs8.Append(tabStop72);
            SpacingBetweenLines spacingBetweenLines26 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification20 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties25 = new ParagraphMarkRunProperties();
            FontSize fontSize65 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript68 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties25.Append(fontSize65);
            paragraphMarkRunProperties25.Append(fontSizeComplexScript68);

            paragraphProperties26.Append(tabs8);
            paragraphProperties26.Append(spacingBetweenLines26);
            paragraphProperties26.Append(justification20);
            paragraphProperties26.Append(paragraphMarkRunProperties25);

            paragraph26.Append(paragraphProperties26);

            tableCell12.Append(tableCellProperties12);
            tableCell12.Append(paragraph26);

            TableCell tableCell13 = new TableCell();

            TableCellProperties tableCellProperties13 = new TableCellProperties();
            TableCellWidth tableCellWidth13 = new TableCellWidth() { Width = "3969", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders13 = new TableCellBorders();
            LeftBorder leftBorder15 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder14 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder15 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders13.Append(leftBorder15);
            tableCellBorders13.Append(bottomBorder14);
            tableCellBorders13.Append(rightBorder15);
            Shading shading13 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties13.Append(tableCellWidth13);
            tableCellProperties13.Append(tableCellBorders13);
            tableCellProperties13.Append(shading13);

            Paragraph paragraph27 = new Paragraph() { RsidParagraphMarkRevision = "00967F75", RsidParagraphAddition = "00967F75", RsidParagraphProperties = "00967F75", RsidRunAdditionDefault = "008F4701" };

            ParagraphProperties paragraphProperties27 = new ParagraphProperties();

            Tabs tabs9 = new Tabs();
            TabStop tabStop73 = new TabStop() { Val = TabStopValues.Left, Position = 708 };
            TabStop tabStop74 = new TabStop() { Val = TabStopValues.Left, Position = 1416 };
            TabStop tabStop75 = new TabStop() { Val = TabStopValues.Left, Position = 2124 };
            TabStop tabStop76 = new TabStop() { Val = TabStopValues.Left, Position = 2832 };
            TabStop tabStop77 = new TabStop() { Val = TabStopValues.Left, Position = 3540 };
            TabStop tabStop78 = new TabStop() { Val = TabStopValues.Left, Position = 4248 };
            TabStop tabStop79 = new TabStop() { Val = TabStopValues.Left, Position = 4573 };
            TabStop tabStop80 = new TabStop() { Val = TabStopValues.Left, Position = 4956 };
            TabStop tabStop81 = new TabStop() { Val = TabStopValues.Left, Position = 6725 };

            tabs9.Append(tabStop73);
            tabs9.Append(tabStop74);
            tabs9.Append(tabStop75);
            tabs9.Append(tabStop76);
            tabs9.Append(tabStop77);
            tabs9.Append(tabStop78);
            tabs9.Append(tabStop79);
            tabs9.Append(tabStop80);
            tabs9.Append(tabStop81);
            SpacingBetweenLines spacingBetweenLines27 = new SpacingBetweenLines() { Before = "120", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification21 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties26 = new ParagraphMarkRunProperties();
            FontSize fontSize66 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript69 = new FontSizeComplexScript() { Val = "22" };

            paragraphMarkRunProperties26.Append(fontSize66);
            paragraphMarkRunProperties26.Append(fontSizeComplexScript69);

            paragraphProperties27.Append(tabs9);
            paragraphProperties27.Append(spacingBetweenLines27);
            paragraphProperties27.Append(justification21);
            paragraphProperties27.Append(paragraphMarkRunProperties26);

            Run run44 = new Run();

            RunProperties runProperties44 = new RunProperties();
            FontSize fontSize67 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript70 = new FontSizeComplexScript() { Val = "16" };

            runProperties44.Append(fontSize67);
            runProperties44.Append(fontSizeComplexScript70);
            Text text30 = new Text();
            text30.Text = "ФИО";

            run44.Append(runProperties44);
            run44.Append(text30);

            paragraph27.Append(paragraphProperties27);
            paragraph27.Append(run44);

            tableCell13.Append(tableCellProperties13);
            tableCell13.Append(paragraph27);

            tableRow3.Append(tableRowProperties1);
            tableRow3.Append(tableCell10);
            tableRow3.Append(tableCell11);
            tableRow3.Append(tableCell12);
            tableRow3.Append(tableCell13);

            table2.Append(tableProperties2);
            table2.Append(tableGrid2);
            table2.Append(tableRow2);
            table2.Append(tableRow3);

            Paragraph paragraph28 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "00854557", RsidParagraphProperties = "00854557", RsidRunAdditionDefault = "00854557" };

            ParagraphProperties paragraphProperties28 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines28 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Indentation indentation5 = new Indentation() { Start = "4680" };
            Justification justification22 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties27 = new ParagraphMarkRunProperties();
            FontSize fontSize68 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript71 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties27.Append(fontSize68);
            paragraphMarkRunProperties27.Append(fontSizeComplexScript71);

            paragraphProperties28.Append(spacingBetweenLines28);
            paragraphProperties28.Append(indentation5);
            paragraphProperties28.Append(justification22);
            paragraphProperties28.Append(paragraphMarkRunProperties27);

            Run run45 = new Run() { RsidRunProperties = "00DD5CF8" };

            RunProperties runProperties45 = new RunProperties();
            FontSize fontSize69 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript72 = new FontSizeComplexScript() { Val = "16" };

            runProperties45.Append(fontSize69);
            runProperties45.Append(fontSizeComplexScript72);
            TabChar tabChar17 = new TabChar();

            run45.Append(runProperties45);
            run45.Append(tabChar17);

            paragraph28.Append(paragraphProperties28);
            paragraph28.Append(run45);

            Table table3 = new Table();

            TableProperties tableProperties3 = new TableProperties();
            TableWidth tableWidth3 = new TableWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            TableLook tableLook3 = new TableLook() { Val = "01E0" };

            tableProperties3.Append(tableWidth3);
            tableProperties3.Append(tableLook3);

            TableGrid tableGrid3 = new TableGrid();
            GridColumn gridColumn10 = new GridColumn() { Width = "959" };
            GridColumn gridColumn11 = new GridColumn() { Width = "1309" };
            GridColumn gridColumn12 = new GridColumn() { Width = "534" };
            GridColumn gridColumn13 = new GridColumn() { Width = "1701" };
            GridColumn gridColumn14 = new GridColumn() { Width = "4677" };
            GridColumn gridColumn15 = new GridColumn() { Width = "142" };
            GridColumn gridColumn16 = new GridColumn() { Width = "248" };

            tableGrid3.Append(gridColumn10);
            tableGrid3.Append(gridColumn11);
            tableGrid3.Append(gridColumn12);
            tableGrid3.Append(gridColumn13);
            tableGrid3.Append(gridColumn14);
            tableGrid3.Append(gridColumn15);
            tableGrid3.Append(gridColumn16);

            TableRow tableRow4 = new TableRow() { RsidTableRowMarkRevision = "0062700D", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties2 = new TableRowProperties();
            TableRowHeight tableRowHeight2 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties2.Append(tableRowHeight2);

            TableCell tableCell14 = new TableCell();

            TableCellProperties tableCellProperties14 = new TableCellProperties();
            TableCellWidth tableCellWidth14 = new TableCellWidth() { Width = "959", Type = TableWidthUnitValues.Dxa };
            TableCellVerticalAlignment tableCellVerticalAlignment1 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties14.Append(tableCellWidth14);
            tableCellProperties14.Append(tableCellVerticalAlignment1);

            Paragraph paragraph29 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "003F3715", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties29 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines29 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification23 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties28 = new ParagraphMarkRunProperties();
            FontSize fontSize70 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript73 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties28.Append(fontSize70);
            paragraphMarkRunProperties28.Append(fontSizeComplexScript73);

            paragraphProperties29.Append(spacingBetweenLines29);
            paragraphProperties29.Append(justification23);
            paragraphProperties29.Append(paragraphMarkRunProperties28);

            Run run46 = new Run() { RsidRunProperties = "0062700D" };

            RunProperties runProperties46 = new RunProperties();
            FontSize fontSize71 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript74 = new FontSizeComplexScript() { Val = "20" };

            runProperties46.Append(fontSize71);
            runProperties46.Append(fontSizeComplexScript74);
            Text text31 = new Text();
            text31.Text = "1. Тема";

            run46.Append(runProperties46);
            run46.Append(text31);

            paragraph29.Append(paragraphProperties29);
            paragraph29.Append(run46);

            tableCell14.Append(tableCellProperties14);
            tableCell14.Append(paragraph29);

            TableCell tableCell15 = new TableCell();

            TableCellProperties tableCellProperties15 = new TableCellProperties();
            TableCellWidth tableCellWidth15 = new TableCellWidth() { Width = "8611", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan1 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders14 = new TableCellBorders();
            BottomBorder bottomBorder15 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders14.Append(bottomBorder15);
            TableCellVerticalAlignment tableCellVerticalAlignment2 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties15.Append(tableCellWidth15);
            tableCellProperties15.Append(gridSpan1);
            tableCellProperties15.Append(tableCellBorders14);
            tableCellProperties15.Append(tableCellVerticalAlignment2);

            Paragraph paragraph30 = new Paragraph() { RsidParagraphMarkRevision = "000D3452", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "00123217", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties30 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines30 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification24 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties29 = new ParagraphMarkRunProperties();
            Italic italic1 = new Italic();

            paragraphMarkRunProperties29.Append(italic1);

            paragraphProperties30.Append(spacingBetweenLines30);
            paragraphProperties30.Append(justification24);
            paragraphProperties30.Append(paragraphMarkRunProperties29);

            Run run49 = new Run() { RsidRunProperties = "000D3452" };

            RunProperties runProperties49 = new RunProperties();
            Italic italic2 = new Italic();

            runProperties49.Append(italic2);
            Text text34 = new Text();
            text34.Text = awork is null ? work.Theme : awork.CourseProject.Theme;

            run49.Append(runProperties49);
            run49.Append(text34);

            paragraph30.Append(paragraphProperties30);
            paragraph30.Append(run49);

            tableCell15.Append(tableCellProperties15);
            tableCell15.Append(paragraph30);

            tableRow4.Append(tableRowProperties2);
            tableRow4.Append(tableCell14);
            tableRow4.Append(tableCell15);

            TableRow tableRow5 = new TableRow() { RsidTableRowMarkRevision = "0062700D", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties3 = new TableRowProperties();
            TableRowHeight tableRowHeight3 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties3.Append(tableRowHeight3);

            TableCell tableCell16 = new TableCell();

            TableCellProperties tableCellProperties16 = new TableCellProperties();
            TableCellWidth tableCellWidth16 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan2 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders15 = new TableCellBorders();
            BottomBorder bottomBorder16 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders15.Append(bottomBorder16);
            TableCellVerticalAlignment tableCellVerticalAlignment3 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties16.Append(tableCellWidth16);
            tableCellProperties16.Append(gridSpan2);
            tableCellProperties16.Append(tableCellBorders15);
            tableCellProperties16.Append(tableCellVerticalAlignment3);

            Paragraph paragraph31 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00891E6F", RsidParagraphProperties = "008766EF", RsidRunAdditionDefault = "00891E6F" };

            ParagraphProperties paragraphProperties31 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines31 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties30 = new ParagraphMarkRunProperties();
            Italic italic4 = new Italic();

            paragraphMarkRunProperties30.Append(italic4);

            paragraphProperties31.Append(spacingBetweenLines31);
            paragraphProperties31.Append(paragraphMarkRunProperties30);

            paragraph31.Append(paragraphProperties31);

            tableCell16.Append(tableCellProperties16);
            tableCell16.Append(paragraph31);

            tableRow5.Append(tableRowProperties3);
            tableRow5.Append(tableCell16);

            TableRow tableRow6 = new TableRow() { RsidTableRowMarkRevision = "0062700D", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties4 = new TableRowProperties();
            TableRowHeight tableRowHeight4 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties4.Append(tableRowHeight4);

            TableCell tableCell17 = new TableCell();

            TableCellProperties tableCellProperties17 = new TableCellProperties();
            TableCellWidth tableCellWidth17 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan3 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders16 = new TableCellBorders();
            TopBorder topBorder14 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder17 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders16.Append(topBorder14);
            tableCellBorders16.Append(bottomBorder17);
            TableCellVerticalAlignment tableCellVerticalAlignment4 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties17.Append(tableCellWidth17);
            tableCellProperties17.Append(gridSpan3);
            tableCellProperties17.Append(tableCellBorders16);
            tableCellProperties17.Append(tableCellVerticalAlignment4);

            Paragraph paragraph32 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties32 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines32 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification25 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties31 = new ParagraphMarkRunProperties();
            Italic italic5 = new Italic();

            paragraphMarkRunProperties31.Append(italic5);

            paragraphProperties32.Append(spacingBetweenLines32);
            paragraphProperties32.Append(justification25);
            paragraphProperties32.Append(paragraphMarkRunProperties31);

            paragraph32.Append(paragraphProperties32);

            tableCell17.Append(tableCellProperties17);
            tableCell17.Append(paragraph32);

            tableRow6.Append(tableRowProperties4);
            tableRow6.Append(tableCell17);

            TableRow tableRow7 = new TableRow() { RsidTableRowMarkRevision = "0062700D", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties5 = new TableRowProperties();
            TableRowHeight tableRowHeight5 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties5.Append(tableRowHeight5);

            TableCell tableCell18 = new TableCell();

            TableCellProperties tableCellProperties18 = new TableCellProperties();
            TableCellWidth tableCellWidth18 = new TableCellWidth() { Width = "4503", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan4 = new GridSpan() { Val = 4 };
            TableCellVerticalAlignment tableCellVerticalAlignment5 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties18.Append(tableCellWidth18);
            tableCellProperties18.Append(gridSpan4);
            tableCellProperties18.Append(tableCellVerticalAlignment5);

            Paragraph paragraph33 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "000806E4", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties33 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines33 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification26 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties32 = new ParagraphMarkRunProperties();
            FontSize fontSize74 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript77 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties32.Append(fontSize74);
            paragraphMarkRunProperties32.Append(fontSizeComplexScript77);

            paragraphProperties33.Append(spacingBetweenLines33);
            paragraphProperties33.Append(justification26);
            paragraphProperties33.Append(paragraphMarkRunProperties32);

            Run run51 = new Run() { RsidRunProperties = "0062700D" };

            RunProperties runProperties51 = new RunProperties();
            FontSize fontSize75 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript78 = new FontSizeComplexScript() { Val = "20" };

            runProperties51.Append(fontSize75);
            runProperties51.Append(fontSizeComplexScript78);
            Text text36 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text36.Text = "2. Срок сдачи законченного проекта (работы)     ";

            run51.Append(runProperties51);
            run51.Append(text36);

            paragraph33.Append(paragraphProperties33);
            paragraph33.Append(run51);

            tableCell18.Append(tableCellProperties18);
            tableCell18.Append(paragraph33);

            TableCell tableCell19 = new TableCell();

            TableCellProperties tableCellProperties19 = new TableCellProperties();
            TableCellWidth tableCellWidth19 = new TableCellWidth() { Width = "5067", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan5 = new GridSpan() { Val = 3 };

            TableCellBorders tableCellBorders17 = new TableCellBorders();
            BottomBorder bottomBorder18 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders17.Append(bottomBorder18);
            TableCellVerticalAlignment tableCellVerticalAlignment6 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties19.Append(tableCellWidth19);
            tableCellProperties19.Append(gridSpan5);
            tableCellProperties19.Append(tableCellBorders17);
            tableCellProperties19.Append(tableCellVerticalAlignment6);

            Paragraph paragraph34 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "00DD5313", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties34 = new ParagraphProperties();

            Tabs tabs10 = new Tabs();
            TabStop tabStop82 = new TabStop() { Val = TabStopValues.Left, Position = 1596 };

            tabs10.Append(tabStop82);
            SpacingBetweenLines spacingBetweenLines34 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification27 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties33 = new ParagraphMarkRunProperties();
            Italic italic6 = new Italic();

            paragraphMarkRunProperties33.Append(italic6);

            paragraphProperties34.Append(tabs10);
            paragraphProperties34.Append(spacingBetweenLines34);
            paragraphProperties34.Append(justification27);
            paragraphProperties34.Append(paragraphMarkRunProperties33);

            Run run66 = new Run();

            RunProperties runProperties66 = new RunProperties();
            Italic italic7 = new Italic();

            runProperties66.Append(italic7);
            Text text51 = new Text();
            text51.Text = dateEnd ?? "";

            run66.Append(runProperties66);
            run66.Append(text51);

            paragraph34.Append(paragraphProperties34);
            paragraph34.Append(run66);

            tableCell19.Append(tableCellProperties19);
            tableCell19.Append(paragraph34);

            tableRow7.Append(tableRowProperties5);
            tableRow7.Append(tableCell18);
            tableRow7.Append(tableCell19);

            TableRow tableRow8 = new TableRow() { RsidTableRowMarkRevision = "002E42B4", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties6 = new TableRowProperties();
            TableRowHeight tableRowHeight6 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties6.Append(tableRowHeight6);

            TableCell tableCell20 = new TableCell();

            TableCellProperties tableCellProperties20 = new TableCellProperties();
            TableCellWidth tableCellWidth20 = new TableCellWidth() { Width = "2802", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan6 = new GridSpan() { Val = 3 };
            TableCellVerticalAlignment tableCellVerticalAlignment7 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties20.Append(tableCellWidth20);
            tableCellProperties20.Append(gridSpan6);
            tableCellProperties20.Append(tableCellVerticalAlignment7);

            Paragraph paragraph35 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties35 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines35 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification28 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties34 = new ParagraphMarkRunProperties();
            FontSize fontSize90 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript93 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties34.Append(fontSize90);
            paragraphMarkRunProperties34.Append(fontSizeComplexScript93);

            paragraphProperties35.Append(spacingBetweenLines35);
            paragraphProperties35.Append(justification28);
            paragraphProperties35.Append(paragraphMarkRunProperties34);

            Run run67 = new Run() { RsidRunProperties = "0062700D" };

            RunProperties runProperties67 = new RunProperties();
            FontSize fontSize91 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript94 = new FontSizeComplexScript() { Val = "20" };

            runProperties67.Append(fontSize91);
            runProperties67.Append(fontSizeComplexScript94);
            Text text52 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text52.Text = "3. Исходные данные";

            run67.Append(runProperties67);
            run67.Append(text52);

            paragraph35.Append(paragraphProperties35);
            paragraph35.Append(run67);

            tableCell20.Append(tableCellProperties20);
            tableCell20.Append(paragraph35);

            TableCell tableCell21 = new TableCell();

            TableCellProperties tableCellProperties21 = new TableCellProperties();
            TableCellWidth tableCellWidth21 = new TableCellWidth() { Width = "6768", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan7 = new GridSpan() { Val = 4 };
            TableCellVerticalAlignment tableCellVerticalAlignment8 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties21.Append(tableCellWidth21);
            tableCellProperties21.Append(gridSpan7);
            tableCellProperties21.Append(tableCellVerticalAlignment8);

            Paragraph paragraph36 = new Paragraph() { RsidParagraphMarkRevision = "002E42B4", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties36 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines36 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification29 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties35 = new ParagraphMarkRunProperties();
            Italic italic8 = new Italic();
            Languages languages14 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties35.Append(italic8);
            paragraphMarkRunProperties35.Append(languages14);

            paragraphProperties36.Append(spacingBetweenLines36);
            paragraphProperties36.Append(justification29);
            paragraphProperties36.Append(paragraphMarkRunProperties35);

            paragraph36.Append(paragraphProperties36);

            tableCell21.Append(tableCellProperties21);
            tableCell21.Append(paragraph36);

            tableRow8.Append(tableRowProperties6);
            tableRow8.Append(tableCell20);
            tableRow8.Append(tableCell21);

            TableRow tableRow9 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties7 = new TableRowProperties();
            TableRowHeight tableRowHeight7 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties7.Append(tableRowHeight7);

            TableCell tableCell22 = new TableCell();

            TableCellProperties tableCellProperties22 = new TableCellProperties();
            TableCellWidth tableCellWidth22 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan8 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders18 = new TableCellBorders();
            BottomBorder bottomBorder19 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders18.Append(bottomBorder19);
            TableCellVerticalAlignment tableCellVerticalAlignment9 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties22.Append(tableCellWidth22);
            tableCellProperties22.Append(gridSpan8);
            tableCellProperties22.Append(tableCellBorders18);
            tableCellProperties22.Append(tableCellVerticalAlignment9);

            Paragraph paragraph37 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00891E6F", RsidParagraphProperties = "008766EF", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties37 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines37 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties36 = new ParagraphMarkRunProperties();
            Italic italic9 = new Italic();

            paragraphMarkRunProperties36.Append(italic9);

            paragraphProperties37.Append(spacingBetweenLines37);
            paragraphProperties37.Append(paragraphMarkRunProperties36);

            // Split
            var inputData = awork is null ? work.InputData?.Split('\n') : awork.CourseProject.InputData?.Split('\n');
            int i = 0;
            Run run69 = new Run();

            RunProperties runProperties69 = new RunProperties();
            Italic italic10 = new Italic();

            runProperties69.Append(italic10);
            Text text54 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text54.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run69.Append(runProperties69);
            run69.Append(text54);
            ProofError proofError9 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph37.Append(paragraphProperties37);
            paragraph37.Append(run69);
            paragraph37.Append(proofError9);

            tableCell22.Append(tableCellProperties22);
            tableCell22.Append(paragraph37);

            tableRow9.Append(tableRowProperties7);
            tableRow9.Append(tableCell22);

            TableRow tableRow10 = new TableRow() { RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties8 = new TableRowProperties();
            TableRowHeight tableRowHeight8 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties8.Append(tableRowHeight8);

            TableCell tableCell23 = new TableCell();

            TableCellProperties tableCellProperties23 = new TableCellProperties();
            TableCellWidth tableCellWidth23 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan9 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders19 = new TableCellBorders();
            TopBorder topBorder15 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder20 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders19.Append(topBorder15);
            tableCellBorders19.Append(bottomBorder20);
            TableCellVerticalAlignment tableCellVerticalAlignment10 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties23.Append(tableCellWidth23);
            tableCellProperties23.Append(gridSpan9);
            tableCellProperties23.Append(tableCellBorders19);
            tableCellProperties23.Append(tableCellVerticalAlignment10);

            Paragraph paragraph38 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties38 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines38 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification30 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties37 = new ParagraphMarkRunProperties();
            Italic italic13 = new Italic();

            paragraphMarkRunProperties37.Append(italic13);

            paragraphProperties38.Append(spacingBetweenLines38);
            paragraphProperties38.Append(justification30);
            paragraphProperties38.Append(paragraphMarkRunProperties37);
            ProofError proofError11 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run72 = new Run();

            RunProperties runProperties72 = new RunProperties();
            Italic italic14 = new Italic();

            runProperties72.Append(italic14);
            Text text57 = new Text();
            text57.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run72.Append(runProperties72);
            run72.Append(text57);
            ProofError proofError12 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph38.Append(paragraphProperties38);
            paragraph38.Append(proofError11);
            paragraph38.Append(run72);
            paragraph38.Append(proofError12);

            tableCell23.Append(tableCellProperties23);
            tableCell23.Append(paragraph38);

            tableRow10.Append(tableRowProperties8);
            tableRow10.Append(tableCell23);

            TableRow tableRow11 = new TableRow() { RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties9 = new TableRowProperties();
            TableRowHeight tableRowHeight9 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties9.Append(tableRowHeight9);

            TableCell tableCell24 = new TableCell();

            TableCellProperties tableCellProperties24 = new TableCellProperties();
            TableCellWidth tableCellWidth24 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan10 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders20 = new TableCellBorders();
            TopBorder topBorder16 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder21 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders20.Append(topBorder16);
            tableCellBorders20.Append(bottomBorder21);
            TableCellVerticalAlignment tableCellVerticalAlignment11 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties24.Append(tableCellWidth24);
            tableCellProperties24.Append(gridSpan10);
            tableCellProperties24.Append(tableCellBorders20);
            tableCellProperties24.Append(tableCellVerticalAlignment11);

            Paragraph paragraph39 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties39 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines39 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification31 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties38 = new ParagraphMarkRunProperties();
            Italic italic15 = new Italic();

            paragraphMarkRunProperties38.Append(italic15);

            paragraphProperties39.Append(spacingBetweenLines39);
            paragraphProperties39.Append(justification31);
            paragraphProperties39.Append(paragraphMarkRunProperties38);
            ProofError proofError13 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run73 = new Run();

            RunProperties runProperties73 = new RunProperties();
            Italic italic16 = new Italic();

            runProperties73.Append(italic16);
            Text text58 = new Text();
            text58.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run73.Append(runProperties73);
            run73.Append(text58);
            ProofError proofError14 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph39.Append(paragraphProperties39);
            paragraph39.Append(proofError13);
            paragraph39.Append(run73);
            paragraph39.Append(proofError14);

            tableCell24.Append(tableCellProperties24);
            tableCell24.Append(paragraph39);

            tableRow11.Append(tableRowProperties9);
            tableRow11.Append(tableCell24);

            TableRow tableRow12 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties10 = new TableRowProperties();
            TableRowHeight tableRowHeight10 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties10.Append(tableRowHeight10);

            TableCell tableCell25 = new TableCell();

            TableCellProperties tableCellProperties25 = new TableCellProperties();
            TableCellWidth tableCellWidth25 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan11 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders21 = new TableCellBorders();
            TopBorder topBorder17 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder22 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders21.Append(topBorder17);
            tableCellBorders21.Append(bottomBorder22);
            TableCellVerticalAlignment tableCellVerticalAlignment12 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties25.Append(tableCellWidth25);
            tableCellProperties25.Append(gridSpan11);
            tableCellProperties25.Append(tableCellBorders21);
            tableCellProperties25.Append(tableCellVerticalAlignment12);

            Paragraph paragraph40 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties40 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines40 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification32 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties39 = new ParagraphMarkRunProperties();
            Italic italic17 = new Italic();

            paragraphMarkRunProperties39.Append(italic17);

            paragraphProperties40.Append(spacingBetweenLines40);
            paragraphProperties40.Append(justification32);
            paragraphProperties40.Append(paragraphMarkRunProperties39);
            ProofError proofError15 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run74 = new Run();

            RunProperties runProperties74 = new RunProperties();
            Italic italic18 = new Italic();

            runProperties74.Append(italic18);
            Text text59 = new Text();
            text59.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run74.Append(runProperties74);
            run74.Append(text59);
            ProofError proofError16 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph40.Append(paragraphProperties40);
            paragraph40.Append(proofError15);
            paragraph40.Append(run74);
            paragraph40.Append(proofError16);

            tableCell25.Append(tableCellProperties25);
            tableCell25.Append(paragraph40);

            tableRow12.Append(tableRowProperties10);
            tableRow12.Append(tableCell25);

            TableRow tableRow13 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions1 = new TablePropertyExceptions();

            TableBorders tableBorders3 = new TableBorders();
            TopBorder topBorder18 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder16 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder23 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder16 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder3 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder3 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders3.Append(topBorder18);
            tableBorders3.Append(leftBorder16);
            tableBorders3.Append(bottomBorder23);
            tableBorders3.Append(rightBorder16);
            tableBorders3.Append(insideHorizontalBorder3);
            tableBorders3.Append(insideVerticalBorder3);

            tablePropertyExceptions1.Append(tableBorders3);

            TableRowProperties tableRowProperties11 = new TableRowProperties();
            TableRowHeight tableRowHeight11 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties11.Append(tableRowHeight11);

            TableCell tableCell26 = new TableCell();

            TableCellProperties tableCellProperties26 = new TableCellProperties();
            TableCellWidth tableCellWidth26 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan12 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders22 = new TableCellBorders();
            TopBorder topBorder19 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder17 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder24 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder17 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders22.Append(topBorder19);
            tableCellBorders22.Append(leftBorder17);
            tableCellBorders22.Append(bottomBorder24);
            tableCellBorders22.Append(rightBorder17);
            TableCellVerticalAlignment tableCellVerticalAlignment13 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties26.Append(tableCellWidth26);
            tableCellProperties26.Append(gridSpan12);
            tableCellProperties26.Append(tableCellBorders22);
            tableCellProperties26.Append(tableCellVerticalAlignment13);

            Paragraph paragraph41 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties41 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines41 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification33 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties40 = new ParagraphMarkRunProperties();
            Italic italic19 = new Italic();

            paragraphMarkRunProperties40.Append(italic19);

            paragraphProperties41.Append(spacingBetweenLines41);
            paragraphProperties41.Append(justification33);
            paragraphProperties41.Append(paragraphMarkRunProperties40);
            ProofError proofError17 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run75 = new Run();

            RunProperties runProperties75 = new RunProperties();
            Italic italic20 = new Italic();

            runProperties75.Append(italic20);
            Text text60 = new Text();
            text60.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run75.Append(runProperties75);
            run75.Append(text60);
            ProofError proofError18 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph41.Append(paragraphProperties41);
            paragraph41.Append(proofError17);
            paragraph41.Append(run75);
            paragraph41.Append(proofError18);

            tableCell26.Append(tableCellProperties26);
            tableCell26.Append(paragraph41);

            tableRow13.Append(tablePropertyExceptions1);
            tableRow13.Append(tableRowProperties11);
            tableRow13.Append(tableCell26);

            TableRow tableRow14 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions2 = new TablePropertyExceptions();

            TableBorders tableBorders4 = new TableBorders();
            TopBorder topBorder20 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder18 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder25 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder18 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder4 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder4 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders4.Append(topBorder20);
            tableBorders4.Append(leftBorder18);
            tableBorders4.Append(bottomBorder25);
            tableBorders4.Append(rightBorder18);
            tableBorders4.Append(insideHorizontalBorder4);
            tableBorders4.Append(insideVerticalBorder4);

            tablePropertyExceptions2.Append(tableBorders4);

            TableRowProperties tableRowProperties12 = new TableRowProperties();
            TableRowHeight tableRowHeight12 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties12.Append(tableRowHeight12);

            TableCell tableCell27 = new TableCell();

            TableCellProperties tableCellProperties27 = new TableCellProperties();
            TableCellWidth tableCellWidth27 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan13 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders23 = new TableCellBorders();
            TopBorder topBorder21 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder19 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder26 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder19 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders23.Append(topBorder21);
            tableCellBorders23.Append(leftBorder19);
            tableCellBorders23.Append(bottomBorder26);
            tableCellBorders23.Append(rightBorder19);
            TableCellVerticalAlignment tableCellVerticalAlignment14 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties27.Append(tableCellWidth27);
            tableCellProperties27.Append(gridSpan13);
            tableCellProperties27.Append(tableCellBorders23);
            tableCellProperties27.Append(tableCellVerticalAlignment14);

            Paragraph paragraph42 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties42 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines42 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification34 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties41 = new ParagraphMarkRunProperties();
            Italic italic21 = new Italic();
            Languages languages15 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties41.Append(italic21);
            paragraphMarkRunProperties41.Append(languages15);

            paragraphProperties42.Append(spacingBetweenLines42);
            paragraphProperties42.Append(justification34);
            paragraphProperties42.Append(paragraphMarkRunProperties41);

            Run run76 = new Run();

            RunProperties runProperties76 = new RunProperties();
            Italic italic22 = new Italic();
            Languages languages16 = new Languages() { Val = "en-US" };

            runProperties76.Append(italic22);
            runProperties76.Append(languages16);
            Text text61 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text61.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run76.Append(runProperties76);
            run76.Append(text61);

            paragraph42.Append(paragraphProperties42);
            paragraph42.Append(run76);

            tableCell27.Append(tableCellProperties27);
            tableCell27.Append(paragraph42);

            tableRow14.Append(tablePropertyExceptions2);
            tableRow14.Append(tableRowProperties12);
            tableRow14.Append(tableCell27);

            TableRow tableRow15 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions3 = new TablePropertyExceptions();

            TableBorders tableBorders5 = new TableBorders();
            TopBorder topBorder22 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder20 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder27 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder20 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder5 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder5 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders5.Append(topBorder22);
            tableBorders5.Append(leftBorder20);
            tableBorders5.Append(bottomBorder27);
            tableBorders5.Append(rightBorder20);
            tableBorders5.Append(insideHorizontalBorder5);
            tableBorders5.Append(insideVerticalBorder5);

            tablePropertyExceptions3.Append(tableBorders5);

            TableRowProperties tableRowProperties13 = new TableRowProperties();
            TableRowHeight tableRowHeight13 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties13.Append(tableRowHeight13);

            TableCell tableCell28 = new TableCell();

            TableCellProperties tableCellProperties28 = new TableCellProperties();
            TableCellWidth tableCellWidth28 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan14 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders24 = new TableCellBorders();
            TopBorder topBorder23 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder21 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder28 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder21 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders24.Append(topBorder23);
            tableCellBorders24.Append(leftBorder21);
            tableCellBorders24.Append(bottomBorder28);
            tableCellBorders24.Append(rightBorder21);
            TableCellVerticalAlignment tableCellVerticalAlignment15 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties28.Append(tableCellWidth28);
            tableCellProperties28.Append(gridSpan14);
            tableCellProperties28.Append(tableCellBorders24);
            tableCellProperties28.Append(tableCellVerticalAlignment15);

            Paragraph paragraph43 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties43 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines43 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification35 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties42 = new ParagraphMarkRunProperties();
            Italic italic23 = new Italic();
            Languages languages17 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties42.Append(italic23);
            paragraphMarkRunProperties42.Append(languages17);

            paragraphProperties43.Append(spacingBetweenLines43);
            paragraphProperties43.Append(justification35);
            paragraphProperties43.Append(paragraphMarkRunProperties42);

            Run run77 = new Run();

            RunProperties runProperties77 = new RunProperties();
            Italic italic24 = new Italic();
            Languages languages18 = new Languages() { Val = "en-US" };

            runProperties77.Append(italic24);
            runProperties77.Append(languages18);
            Text text62 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text62.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run77.Append(runProperties77);
            run77.Append(text62);

            paragraph43.Append(paragraphProperties43);
            paragraph43.Append(run77);

            tableCell28.Append(tableCellProperties28);
            tableCell28.Append(paragraph43);

            tableRow15.Append(tablePropertyExceptions3);
            tableRow15.Append(tableRowProperties13);
            tableRow15.Append(tableCell28);

            TableRow tableRow16 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions4 = new TablePropertyExceptions();

            TableBorders tableBorders6 = new TableBorders();
            TopBorder topBorder24 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder22 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder29 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder22 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder6 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder6 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders6.Append(topBorder24);
            tableBorders6.Append(leftBorder22);
            tableBorders6.Append(bottomBorder29);
            tableBorders6.Append(rightBorder22);
            tableBorders6.Append(insideHorizontalBorder6);
            tableBorders6.Append(insideVerticalBorder6);

            tablePropertyExceptions4.Append(tableBorders6);

            TableRowProperties tableRowProperties14 = new TableRowProperties();
            TableRowHeight tableRowHeight14 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties14.Append(tableRowHeight14);

            TableCell tableCell29 = new TableCell();

            TableCellProperties tableCellProperties29 = new TableCellProperties();
            TableCellWidth tableCellWidth29 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan15 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders25 = new TableCellBorders();
            TopBorder topBorder25 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder23 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder30 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder23 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders25.Append(topBorder25);
            tableCellBorders25.Append(leftBorder23);
            tableCellBorders25.Append(bottomBorder30);
            tableCellBorders25.Append(rightBorder23);
            TableCellVerticalAlignment tableCellVerticalAlignment16 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties29.Append(tableCellWidth29);
            tableCellProperties29.Append(gridSpan15);
            tableCellProperties29.Append(tableCellBorders25);
            tableCellProperties29.Append(tableCellVerticalAlignment16);

            Paragraph paragraph44 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "000247F4" };

            ParagraphProperties paragraphProperties44 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines44 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification36 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties43 = new ParagraphMarkRunProperties();
            Italic italic25 = new Italic();
            Languages languages19 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties43.Append(italic25);
            paragraphMarkRunProperties43.Append(languages19);

            paragraphProperties44.Append(spacingBetweenLines44);
            paragraphProperties44.Append(justification36);
            paragraphProperties44.Append(paragraphMarkRunProperties43);

            Run run78 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties78 = new RunProperties();
            Italic italic26 = new Italic();

            runProperties78.Append(italic26);
            Text text63 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text63.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run78.Append(runProperties78);
            run78.Append(text63);

            paragraph44.Append(paragraphProperties44);
            paragraph44.Append(run78);

            tableCell29.Append(tableCellProperties29);
            tableCell29.Append(paragraph44);

            tableRow16.Append(tablePropertyExceptions4);
            tableRow16.Append(tableRowProperties14);
            tableRow16.Append(tableCell29);

            TableRow tableRow17 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions5 = new TablePropertyExceptions();

            TableBorders tableBorders7 = new TableBorders();
            TopBorder topBorder26 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder24 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder31 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder24 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder7 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder7 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders7.Append(topBorder26);
            tableBorders7.Append(leftBorder24);
            tableBorders7.Append(bottomBorder31);
            tableBorders7.Append(rightBorder24);
            tableBorders7.Append(insideHorizontalBorder7);
            tableBorders7.Append(insideVerticalBorder7);

            tablePropertyExceptions5.Append(tableBorders7);

            TableRowProperties tableRowProperties15 = new TableRowProperties();
            TableRowHeight tableRowHeight15 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties15.Append(tableRowHeight15);

            TableCell tableCell30 = new TableCell();

            TableCellProperties tableCellProperties30 = new TableCellProperties();
            TableCellWidth tableCellWidth30 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan16 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders26 = new TableCellBorders();
            TopBorder topBorder27 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder25 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder32 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder25 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders26.Append(topBorder27);
            tableCellBorders26.Append(leftBorder25);
            tableCellBorders26.Append(bottomBorder32);
            tableCellBorders26.Append(rightBorder25);
            TableCellVerticalAlignment tableCellVerticalAlignment17 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties30.Append(tableCellWidth30);
            tableCellProperties30.Append(gridSpan16);
            tableCellProperties30.Append(tableCellBorders26);
            tableCellProperties30.Append(tableCellVerticalAlignment17);

            Paragraph paragraph45 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "000247F4" };

            ParagraphProperties paragraphProperties45 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines45 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification37 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties44 = new ParagraphMarkRunProperties();
            Italic italic28 = new Italic();

            paragraphMarkRunProperties44.Append(italic28);

            paragraphProperties45.Append(spacingBetweenLines45);
            paragraphProperties45.Append(justification37);
            paragraphProperties45.Append(paragraphMarkRunProperties44);

            Run run80 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties80 = new RunProperties();
            Italic italic29 = new Italic();

            runProperties80.Append(italic29);
            Text text65 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text65.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run80.Append(runProperties80);
            run80.Append(text65);

            paragraph45.Append(paragraphProperties45);
            paragraph45.Append(run80);

            tableCell30.Append(tableCellProperties30);
            tableCell30.Append(paragraph45);

            tableRow17.Append(tablePropertyExceptions5);
            tableRow17.Append(tableRowProperties15);
            tableRow17.Append(tableCell30);

            TableRow tableRow18 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions6 = new TablePropertyExceptions();

            TableBorders tableBorders8 = new TableBorders();
            TopBorder topBorder28 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder26 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder33 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder26 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder8 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder8 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders8.Append(topBorder28);
            tableBorders8.Append(leftBorder26);
            tableBorders8.Append(bottomBorder33);
            tableBorders8.Append(rightBorder26);
            tableBorders8.Append(insideHorizontalBorder8);
            tableBorders8.Append(insideVerticalBorder8);

            tablePropertyExceptions6.Append(tableBorders8);

            TableRowProperties tableRowProperties16 = new TableRowProperties();
            TableRowHeight tableRowHeight16 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties16.Append(tableRowHeight16);

            TableCell tableCell31 = new TableCell();

            TableCellProperties tableCellProperties31 = new TableCellProperties();
            TableCellWidth tableCellWidth31 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan17 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders27 = new TableCellBorders();
            TopBorder topBorder29 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder27 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder34 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder27 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders27.Append(topBorder29);
            tableCellBorders27.Append(leftBorder27);
            tableCellBorders27.Append(bottomBorder34);
            tableCellBorders27.Append(rightBorder27);
            TableCellVerticalAlignment tableCellVerticalAlignment18 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties31.Append(tableCellWidth31);
            tableCellProperties31.Append(gridSpan17);
            tableCellProperties31.Append(tableCellBorders27);
            tableCellProperties31.Append(tableCellVerticalAlignment18);

            Paragraph paragraph46 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "000247F4" };

            ParagraphProperties paragraphProperties46 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines46 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification38 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties45 = new ParagraphMarkRunProperties();
            Italic italic30 = new Italic();

            paragraphMarkRunProperties45.Append(italic30);

            paragraphProperties46.Append(spacingBetweenLines46);
            paragraphProperties46.Append(justification38);
            paragraphProperties46.Append(paragraphMarkRunProperties45);

            Run run81 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties81 = new RunProperties();
            Italic italic31 = new Italic();

            runProperties81.Append(italic31);
            Text text66 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text66.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run81.Append(runProperties81);
            run81.Append(text66);

            paragraph46.Append(paragraphProperties46);
            paragraph46.Append(run81);

            tableCell31.Append(tableCellProperties31);
            tableCell31.Append(paragraph46);

            tableRow18.Append(tablePropertyExceptions6);
            tableRow18.Append(tableRowProperties16);
            tableRow18.Append(tableCell31);

            TableRow tableRow19 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions7 = new TablePropertyExceptions();

            TableBorders tableBorders9 = new TableBorders();
            TopBorder topBorder30 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder28 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder35 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder28 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder9 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder9 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders9.Append(topBorder30);
            tableBorders9.Append(leftBorder28);
            tableBorders9.Append(bottomBorder35);
            tableBorders9.Append(rightBorder28);
            tableBorders9.Append(insideHorizontalBorder9);
            tableBorders9.Append(insideVerticalBorder9);

            tablePropertyExceptions7.Append(tableBorders9);

            TableRowProperties tableRowProperties17 = new TableRowProperties();
            TableRowHeight tableRowHeight17 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties17.Append(tableRowHeight17);

            TableCell tableCell32 = new TableCell();

            TableCellProperties tableCellProperties32 = new TableCellProperties();
            TableCellWidth tableCellWidth32 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan18 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders28 = new TableCellBorders();
            TopBorder topBorder31 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder29 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder36 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder29 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders28.Append(topBorder31);
            tableCellBorders28.Append(leftBorder29);
            tableCellBorders28.Append(bottomBorder36);
            tableCellBorders28.Append(rightBorder29);
            TableCellVerticalAlignment tableCellVerticalAlignment19 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties32.Append(tableCellWidth32);
            tableCellProperties32.Append(gridSpan18);
            tableCellProperties32.Append(tableCellBorders28);
            tableCellProperties32.Append(tableCellVerticalAlignment19);

            Paragraph paragraph47 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "000247F4" };

            ParagraphProperties paragraphProperties47 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines47 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification39 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties46 = new ParagraphMarkRunProperties();
            Italic italic32 = new Italic();

            paragraphMarkRunProperties46.Append(italic32);

            paragraphProperties47.Append(spacingBetweenLines47);
            paragraphProperties47.Append(justification39);
            paragraphProperties47.Append(paragraphMarkRunProperties46);

            Run run82 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties82 = new RunProperties();
            Italic italic33 = new Italic();

            runProperties82.Append(italic33);
            Text text67 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text67.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run82.Append(runProperties82);
            run82.Append(text67);

            paragraph47.Append(paragraphProperties47);
            paragraph47.Append(run82);

            tableCell32.Append(tableCellProperties32);
            tableCell32.Append(paragraph47);

            tableRow19.Append(tablePropertyExceptions7);
            tableRow19.Append(tableRowProperties17);
            tableRow19.Append(tableCell32);

            TableRow tableRow20 = new TableRow() { RsidTableRowMarkRevision = "00891E6F", RsidTableRowAddition = "00CF792B", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions8 = new TablePropertyExceptions();

            TableBorders tableBorders10 = new TableBorders();
            TopBorder topBorder32 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder30 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder37 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder30 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder10 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder10 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders10.Append(topBorder32);
            tableBorders10.Append(leftBorder30);
            tableBorders10.Append(bottomBorder37);
            tableBorders10.Append(rightBorder30);
            tableBorders10.Append(insideHorizontalBorder10);
            tableBorders10.Append(insideVerticalBorder10);

            tablePropertyExceptions8.Append(tableBorders10);

            TableRowProperties tableRowProperties18 = new TableRowProperties();
            TableRowHeight tableRowHeight18 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties18.Append(tableRowHeight18);

            TableCell tableCell33 = new TableCell();

            TableCellProperties tableCellProperties33 = new TableCellProperties();
            TableCellWidth tableCellWidth33 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan19 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders29 = new TableCellBorders();
            TopBorder topBorder33 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder31 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder38 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder31 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders29.Append(topBorder33);
            tableCellBorders29.Append(leftBorder31);
            tableCellBorders29.Append(bottomBorder38);
            tableCellBorders29.Append(rightBorder31);
            TableCellVerticalAlignment tableCellVerticalAlignment20 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties33.Append(tableCellWidth33);
            tableCellProperties33.Append(gridSpan19);
            tableCellProperties33.Append(tableCellBorders29);
            tableCellProperties33.Append(tableCellVerticalAlignment20);

            Paragraph paragraph48 = new Paragraph() { RsidParagraphMarkRevision = "00891E6F", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "000247F4" };

            ParagraphProperties paragraphProperties48 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines48 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification40 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties47 = new ParagraphMarkRunProperties();
            Italic italic34 = new Italic();

            paragraphMarkRunProperties47.Append(italic34);

            paragraphProperties48.Append(spacingBetweenLines48);
            paragraphProperties48.Append(justification40);
            paragraphProperties48.Append(paragraphMarkRunProperties47);

            Run run83 = new Run() { RsidRunProperties = "00891E6F" };

            RunProperties runProperties83 = new RunProperties();
            Italic italic35 = new Italic();

            runProperties83.Append(italic35);
            Text text68 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text68.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run83.Append(runProperties83);
            run83.Append(text68);

            paragraph48.Append(paragraphProperties48);
            paragraph48.Append(run83);

            tableCell33.Append(tableCellProperties33);
            tableCell33.Append(paragraph48);

            tableRow20.Append(tablePropertyExceptions8);
            tableRow20.Append(tableRowProperties18);
            tableRow20.Append(tableCell33);

            TableRow tableRow21 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties19 = new TableRowProperties();
            TableRowHeight tableRowHeight19 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties19.Append(tableRowHeight19);

            TableCell tableCell34 = new TableCell();

            TableCellProperties tableCellProperties34 = new TableCellProperties();
            TableCellWidth tableCellWidth34 = new TableCellWidth() { Width = "9322", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan20 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders30 = new TableCellBorders();
            TopBorder topBorder34 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders30.Append(topBorder34);
            TableCellVerticalAlignment tableCellVerticalAlignment21 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties34.Append(tableCellWidth34);
            tableCellProperties34.Append(gridSpan20);
            tableCellProperties34.Append(tableCellBorders30);
            tableCellProperties34.Append(tableCellVerticalAlignment21);

            Paragraph paragraph49 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "000806E4", RsidRunAdditionDefault = "004223B2" };

            ParagraphProperties paragraphProperties49 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines49 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification41 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties48 = new ParagraphMarkRunProperties();
            FontSize fontSize93 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript96 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties48.Append(fontSize93);
            paragraphMarkRunProperties48.Append(fontSizeComplexScript96);

            paragraphProperties49.Append(spacingBetweenLines49);
            paragraphProperties49.Append(justification41);
            paragraphProperties49.Append(paragraphMarkRunProperties48);

            Run run84 = new Run() { RsidRunProperties = "0062700D" };

            RunProperties runProperties84 = new RunProperties();
            FontSize fontSize94 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript97 = new FontSizeComplexScript() { Val = "20" };

            runProperties84.Append(fontSize94);
            runProperties84.Append(fontSizeComplexScript97);
            Text text69 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text69.Text = "4. Содержание пояснительной записки (перечень вопросов, которые подлежат разработке)";

            run84.Append(runProperties84);
            run84.Append(text69);

            paragraph49.Append(paragraphProperties49);
            paragraph49.Append(run84);

            tableCell34.Append(tableCellProperties34);
            tableCell34.Append(paragraph49);

            TableCell tableCell35 = new TableCell();

            TableCellProperties tableCellProperties35 = new TableCellProperties();
            TableCellWidth tableCellWidth35 = new TableCellWidth() { Width = "248", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders31 = new TableCellBorders();
            TopBorder topBorder35 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders31.Append(topBorder35);

            tableCellProperties35.Append(tableCellWidth35);
            tableCellProperties35.Append(tableCellBorders31);

            Paragraph paragraph50 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "00F74A3B", RsidRunAdditionDefault = "004223B2" };

            ParagraphProperties paragraphProperties50 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines50 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties49 = new ParagraphMarkRunProperties();
            Italic italic36 = new Italic();

            paragraphMarkRunProperties49.Append(italic36);

            paragraphProperties50.Append(spacingBetweenLines50);
            paragraphProperties50.Append(paragraphMarkRunProperties49);

            paragraph50.Append(paragraphProperties50);

            tableCell35.Append(tableCellProperties35);
            tableCell35.Append(paragraph50);

            tableRow21.Append(tableRowProperties19);
            tableRow21.Append(tableCell34);
            tableRow21.Append(tableCell35);

            TableRow tableRow22 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties20 = new TableRowProperties();
            TableRowHeight tableRowHeight20 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties20.Append(tableRowHeight20);

            TableCell tableCell36 = new TableCell();

            TableCellProperties tableCellProperties36 = new TableCellProperties();
            TableCellWidth tableCellWidth36 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan21 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders32 = new TableCellBorders();
            BottomBorder bottomBorder39 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders32.Append(bottomBorder39);
            TableCellVerticalAlignment tableCellVerticalAlignment22 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties36.Append(tableCellWidth36);
            tableCellProperties36.Append(gridSpan21);
            tableCellProperties36.Append(tableCellBorders32);
            tableCellProperties36.Append(tableCellVerticalAlignment22);

            Paragraph paragraph51 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties51 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines51 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification42 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties50 = new ParagraphMarkRunProperties();
            Italic italic37 = new Italic();

            paragraphMarkRunProperties50.Append(italic37);

            paragraphProperties51.Append(spacingBetweenLines51);
            paragraphProperties51.Append(justification42);
            paragraphProperties51.Append(paragraphMarkRunProperties50);

            //Split
            var rzpContent = awork is null ? work.RpzContent?.Split('\n') : awork.CourseProject.RpzContent?.Split('\n');
            i = 0;

            Run run87 = new Run();

            RunProperties runProperties87 = new RunProperties();
            Italic italic38 = new Italic();

            runProperties87.Append(italic38);
            Text text72 = new Text();
            text72.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run87.Append(runProperties87);
            run87.Append(text72);

            paragraph51.Append(paragraphProperties51);
            paragraph51.Append(run87);

            tableCell36.Append(tableCellProperties36);
            tableCell36.Append(paragraph51);

            tableRow22.Append(tableRowProperties20);
            tableRow22.Append(tableCell36);

            TableRow tableRow23 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00346393", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions9 = new TablePropertyExceptions();

            TableBorders tableBorders11 = new TableBorders();
            TopBorder topBorder36 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder32 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder40 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder32 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder11 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder11 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders11.Append(topBorder36);
            tableBorders11.Append(leftBorder32);
            tableBorders11.Append(bottomBorder40);
            tableBorders11.Append(rightBorder32);
            tableBorders11.Append(insideHorizontalBorder11);
            tableBorders11.Append(insideVerticalBorder11);

            tablePropertyExceptions9.Append(tableBorders11);

            TableRowProperties tableRowProperties21 = new TableRowProperties();
            TableRowHeight tableRowHeight21 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties21.Append(tableRowHeight21);

            TableCell tableCell37 = new TableCell();

            TableCellProperties tableCellProperties37 = new TableCellProperties();
            TableCellWidth tableCellWidth37 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan22 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders33 = new TableCellBorders();
            TopBorder topBorder37 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder33 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder41 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder33 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders33.Append(topBorder37);
            tableCellBorders33.Append(leftBorder33);
            tableCellBorders33.Append(bottomBorder41);
            tableCellBorders33.Append(rightBorder33);
            TableCellVerticalAlignment tableCellVerticalAlignment23 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties37.Append(tableCellWidth37);
            tableCellProperties37.Append(gridSpan22);
            tableCellProperties37.Append(tableCellBorders33);
            tableCellProperties37.Append(tableCellVerticalAlignment23);

            Paragraph paragraph52 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00346393", RsidParagraphProperties = "00F218C6", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties52 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines52 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification43 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties51 = new ParagraphMarkRunProperties();
            Italic italic39 = new Italic();

            paragraphMarkRunProperties51.Append(italic39);

            paragraphProperties52.Append(spacingBetweenLines52);
            paragraphProperties52.Append(justification43);
            paragraphProperties52.Append(paragraphMarkRunProperties51);

            Run run88 = new Run();

            RunProperties runProperties88 = new RunProperties();
            Italic italic40 = new Italic();

            runProperties88.Append(italic40);
            Text text73 = new Text();
            text73.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run88.Append(runProperties88);
            run88.Append(text73);

            paragraph52.Append(paragraphProperties52);
            paragraph52.Append(run88);

            tableCell37.Append(tableCellProperties37);
            tableCell37.Append(paragraph52);

            tableRow23.Append(tablePropertyExceptions9);
            tableRow23.Append(tableRowProperties21);
            tableRow23.Append(tableCell37);

            TableRow tableRow24 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00346393", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions10 = new TablePropertyExceptions();

            TableBorders tableBorders12 = new TableBorders();
            TopBorder topBorder38 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder34 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder42 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder34 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder12 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder12 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders12.Append(topBorder38);
            tableBorders12.Append(leftBorder34);
            tableBorders12.Append(bottomBorder42);
            tableBorders12.Append(rightBorder34);
            tableBorders12.Append(insideHorizontalBorder12);
            tableBorders12.Append(insideVerticalBorder12);

            tablePropertyExceptions10.Append(tableBorders12);

            TableRowProperties tableRowProperties22 = new TableRowProperties();
            TableRowHeight tableRowHeight22 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties22.Append(tableRowHeight22);

            TableCell tableCell38 = new TableCell();

            TableCellProperties tableCellProperties38 = new TableCellProperties();
            TableCellWidth tableCellWidth38 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan23 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders34 = new TableCellBorders();
            TopBorder topBorder39 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder35 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder43 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder35 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders34.Append(topBorder39);
            tableCellBorders34.Append(leftBorder35);
            tableCellBorders34.Append(bottomBorder43);
            tableCellBorders34.Append(rightBorder35);
            TableCellVerticalAlignment tableCellVerticalAlignment24 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties38.Append(tableCellWidth38);
            tableCellProperties38.Append(gridSpan23);
            tableCellProperties38.Append(tableCellBorders34);
            tableCellProperties38.Append(tableCellVerticalAlignment24);

            Paragraph paragraph53 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00346393", RsidParagraphProperties = "00F218C6", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties53 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines53 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification44 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties52 = new ParagraphMarkRunProperties();
            Italic italic41 = new Italic();

            paragraphMarkRunProperties52.Append(italic41);

            paragraphProperties53.Append(spacingBetweenLines53);
            paragraphProperties53.Append(justification44);
            paragraphProperties53.Append(paragraphMarkRunProperties52);

            Run run89 = new Run();

            RunProperties runProperties89 = new RunProperties();
            Italic italic42 = new Italic();

            runProperties89.Append(italic42);
            Text text74 = new Text();
            text74.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run89.Append(runProperties89);
            run89.Append(text74);

            paragraph53.Append(paragraphProperties53);
            paragraph53.Append(run89);

            tableCell38.Append(tableCellProperties38);
            tableCell38.Append(paragraph53);

            tableRow24.Append(tablePropertyExceptions10);
            tableRow24.Append(tableRowProperties22);
            tableRow24.Append(tableCell38);

            TableRow tableRow25 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties23 = new TableRowProperties();
            TableRowHeight tableRowHeight23 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties23.Append(tableRowHeight23);

            TableCell tableCell39 = new TableCell();

            TableCellProperties tableCellProperties39 = new TableCellProperties();
            TableCellWidth tableCellWidth39 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan24 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders35 = new TableCellBorders();
            TopBorder topBorder40 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder44 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders35.Append(topBorder40);
            tableCellBorders35.Append(bottomBorder44);
            TableCellVerticalAlignment tableCellVerticalAlignment25 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties39.Append(tableCellWidth39);
            tableCellProperties39.Append(gridSpan24);
            tableCellProperties39.Append(tableCellBorders35);
            tableCellProperties39.Append(tableCellVerticalAlignment25);

            Paragraph paragraph54 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties54 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines54 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification45 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties53 = new ParagraphMarkRunProperties();
            Italic italic43 = new Italic();

            paragraphMarkRunProperties53.Append(italic43);

            paragraphProperties54.Append(spacingBetweenLines54);
            paragraphProperties54.Append(justification45);
            paragraphProperties54.Append(paragraphMarkRunProperties53);

            Run run90 = new Run();

            RunProperties runProperties90 = new RunProperties();
            Italic italic44 = new Italic();

            runProperties90.Append(italic44);
            Text text75 = new Text();
            text75.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run90.Append(runProperties90);
            run90.Append(text75);

            paragraph54.Append(paragraphProperties54);
            paragraph54.Append(run90);

            tableCell39.Append(tableCellProperties39);
            tableCell39.Append(paragraph54);

            tableRow25.Append(tableRowProperties23);
            tableRow25.Append(tableCell39);

            TableRow tableRow26 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties24 = new TableRowProperties();
            TableRowHeight tableRowHeight24 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties24.Append(tableRowHeight24);

            TableCell tableCell40 = new TableCell();

            TableCellProperties tableCellProperties40 = new TableCellProperties();
            TableCellWidth tableCellWidth40 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan25 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders36 = new TableCellBorders();
            TopBorder topBorder41 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder45 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders36.Append(topBorder41);
            tableCellBorders36.Append(bottomBorder45);
            TableCellVerticalAlignment tableCellVerticalAlignment26 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties40.Append(tableCellWidth40);
            tableCellProperties40.Append(gridSpan25);
            tableCellProperties40.Append(tableCellBorders36);
            tableCellProperties40.Append(tableCellVerticalAlignment26);

            Paragraph paragraph55 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties55 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines55 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification46 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties54 = new ParagraphMarkRunProperties();
            Italic italic45 = new Italic();

            paragraphMarkRunProperties54.Append(italic45);

            paragraphProperties55.Append(spacingBetweenLines55);
            paragraphProperties55.Append(justification46);
            paragraphProperties55.Append(paragraphMarkRunProperties54);

            Run run91 = new Run();

            RunProperties runProperties91 = new RunProperties();
            Italic italic46 = new Italic();

            runProperties91.Append(italic46);
            Text text76 = new Text();
            text76.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run91.Append(runProperties91);
            run91.Append(text76);

            paragraph55.Append(paragraphProperties55);
            paragraph55.Append(run91);

            tableCell40.Append(tableCellProperties40);
            tableCell40.Append(paragraph55);

            tableRow26.Append(tableRowProperties24);
            tableRow26.Append(tableCell40);

            TableRow tableRow27 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties25 = new TableRowProperties();
            TableRowHeight tableRowHeight25 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties25.Append(tableRowHeight25);

            TableCell tableCell41 = new TableCell();

            TableCellProperties tableCellProperties41 = new TableCellProperties();
            TableCellWidth tableCellWidth41 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan26 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders37 = new TableCellBorders();
            TopBorder topBorder42 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder46 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders37.Append(topBorder42);
            tableCellBorders37.Append(bottomBorder46);
            TableCellVerticalAlignment tableCellVerticalAlignment27 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties41.Append(tableCellWidth41);
            tableCellProperties41.Append(gridSpan26);
            tableCellProperties41.Append(tableCellBorders37);
            tableCellProperties41.Append(tableCellVerticalAlignment27);

            Paragraph paragraph56 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties56 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines56 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification47 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties55 = new ParagraphMarkRunProperties();
            Italic italic47 = new Italic();

            paragraphMarkRunProperties55.Append(italic47);

            paragraphProperties56.Append(spacingBetweenLines56);
            paragraphProperties56.Append(justification47);
            paragraphProperties56.Append(paragraphMarkRunProperties55);

            Run run92 = new Run();

            RunProperties runProperties92 = new RunProperties();
            Italic italic48 = new Italic();

            runProperties92.Append(italic48);
            Text text77 = new Text();
            text77.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run92.Append(runProperties92);
            run92.Append(text77);

            paragraph56.Append(paragraphProperties56);
            paragraph56.Append(run92);

            tableCell41.Append(tableCellProperties41);
            tableCell41.Append(paragraph56);

            tableRow27.Append(tableRowProperties25);
            tableRow27.Append(tableCell41);

            TableRow tableRow28 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "004223B2", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions11 = new TablePropertyExceptions();

            TableBorders tableBorders13 = new TableBorders();
            TopBorder topBorder43 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder36 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder47 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder36 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder13 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder13 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders13.Append(topBorder43);
            tableBorders13.Append(leftBorder36);
            tableBorders13.Append(bottomBorder47);
            tableBorders13.Append(rightBorder36);
            tableBorders13.Append(insideHorizontalBorder13);
            tableBorders13.Append(insideVerticalBorder13);

            tablePropertyExceptions11.Append(tableBorders13);

            TableRowProperties tableRowProperties26 = new TableRowProperties();
            TableRowHeight tableRowHeight26 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties26.Append(tableRowHeight26);

            TableCell tableCell42 = new TableCell();

            TableCellProperties tableCellProperties42 = new TableCellProperties();
            TableCellWidth tableCellWidth42 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan27 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders38 = new TableCellBorders();
            TopBorder topBorder44 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder37 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder48 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder37 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders38.Append(topBorder44);
            tableCellBorders38.Append(leftBorder37);
            tableCellBorders38.Append(bottomBorder48);
            tableCellBorders38.Append(rightBorder37);
            TableCellVerticalAlignment tableCellVerticalAlignment28 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties42.Append(tableCellWidth42);
            tableCellProperties42.Append(gridSpan27);
            tableCellProperties42.Append(tableCellBorders38);
            tableCellProperties42.Append(tableCellVerticalAlignment28);

            Paragraph paragraph57 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "004223B2", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties57 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines57 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification48 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties56 = new ParagraphMarkRunProperties();
            Italic italic49 = new Italic();

            paragraphMarkRunProperties56.Append(italic49);

            paragraphProperties57.Append(spacingBetweenLines57);
            paragraphProperties57.Append(justification48);
            paragraphProperties57.Append(paragraphMarkRunProperties56);

            Run run93 = new Run();

            RunProperties runProperties93 = new RunProperties();
            Italic italic50 = new Italic();

            runProperties93.Append(italic50);
            Text text78 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text78.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run93.Append(runProperties93);
            run93.Append(text78);
            ProofError proofError19 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph57.Append(paragraphProperties57);
            paragraph57.Append(run93);
            paragraph57.Append(proofError19);

            tableCell42.Append(tableCellProperties42);
            tableCell42.Append(paragraph57);

            tableRow28.Append(tablePropertyExceptions11);
            tableRow28.Append(tableRowProperties26);
            tableRow28.Append(tableCell42);

            TableRow tableRow29 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions12 = new TablePropertyExceptions();

            TableBorders tableBorders14 = new TableBorders();
            TopBorder topBorder45 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder38 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder49 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder38 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder14 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder14 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders14.Append(topBorder45);
            tableBorders14.Append(leftBorder38);
            tableBorders14.Append(bottomBorder49);
            tableBorders14.Append(rightBorder38);
            tableBorders14.Append(insideHorizontalBorder14);
            tableBorders14.Append(insideVerticalBorder14);

            tablePropertyExceptions12.Append(tableBorders14);

            TableRowProperties tableRowProperties27 = new TableRowProperties();
            TableRowHeight tableRowHeight27 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties27.Append(tableRowHeight27);

            TableCell tableCell43 = new TableCell();

            TableCellProperties tableCellProperties43 = new TableCellProperties();
            TableCellWidth tableCellWidth43 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan28 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders39 = new TableCellBorders();
            TopBorder topBorder46 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder39 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder50 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder39 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders39.Append(topBorder46);
            tableCellBorders39.Append(leftBorder39);
            tableCellBorders39.Append(bottomBorder50);
            tableCellBorders39.Append(rightBorder39);
            TableCellVerticalAlignment tableCellVerticalAlignment29 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties43.Append(tableCellWidth43);
            tableCellProperties43.Append(gridSpan28);
            tableCellProperties43.Append(tableCellBorders39);
            tableCellProperties43.Append(tableCellVerticalAlignment29);

            Paragraph paragraph58 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties58 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines58 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification49 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties57 = new ParagraphMarkRunProperties();
            Italic italic53 = new Italic();

            paragraphMarkRunProperties57.Append(italic53);

            paragraphProperties58.Append(spacingBetweenLines58);
            paragraphProperties58.Append(justification49);
            paragraphProperties58.Append(paragraphMarkRunProperties57);

            Run run96 = new Run();

            RunProperties runProperties96 = new RunProperties();
            Italic italic54 = new Italic();

            runProperties96.Append(italic54);
            Text text81 = new Text();
            text81.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run96.Append(runProperties96);
            run96.Append(text81);

            paragraph58.Append(paragraphProperties58);
            paragraph58.Append(run96);

            tableCell43.Append(tableCellProperties43);
            tableCell43.Append(paragraph58);

            tableRow29.Append(tablePropertyExceptions12);
            tableRow29.Append(tableRowProperties27);
            tableRow29.Append(tableCell43);

            TableRow tableRow30 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions13 = new TablePropertyExceptions();

            TableBorders tableBorders15 = new TableBorders();
            TopBorder topBorder47 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder40 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder51 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder40 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder15 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder15 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders15.Append(topBorder47);
            tableBorders15.Append(leftBorder40);
            tableBorders15.Append(bottomBorder51);
            tableBorders15.Append(rightBorder40);
            tableBorders15.Append(insideHorizontalBorder15);
            tableBorders15.Append(insideVerticalBorder15);

            tablePropertyExceptions13.Append(tableBorders15);

            TableRowProperties tableRowProperties28 = new TableRowProperties();
            TableRowHeight tableRowHeight28 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties28.Append(tableRowHeight28);

            TableCell tableCell44 = new TableCell();

            TableCellProperties tableCellProperties44 = new TableCellProperties();
            TableCellWidth tableCellWidth44 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan29 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders40 = new TableCellBorders();
            TopBorder topBorder48 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder41 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder52 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder41 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders40.Append(topBorder48);
            tableCellBorders40.Append(leftBorder41);
            tableCellBorders40.Append(bottomBorder52);
            tableCellBorders40.Append(rightBorder41);
            TableCellVerticalAlignment tableCellVerticalAlignment30 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties44.Append(tableCellWidth44);
            tableCellProperties44.Append(gridSpan29);
            tableCellProperties44.Append(tableCellBorders40);
            tableCellProperties44.Append(tableCellVerticalAlignment30);

            Paragraph paragraph59 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties59 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines59 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification50 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties58 = new ParagraphMarkRunProperties();
            Italic italic55 = new Italic();

            paragraphMarkRunProperties58.Append(italic55);

            paragraphProperties59.Append(spacingBetweenLines59);
            paragraphProperties59.Append(justification50);
            paragraphProperties59.Append(paragraphMarkRunProperties58);

            Run run97 = new Run();

            RunProperties runProperties97 = new RunProperties();
            Italic italic56 = new Italic();

            runProperties97.Append(italic56);
            LastRenderedPageBreak lastRenderedPageBreak1 = new LastRenderedPageBreak();
            Text text82 = new Text();
            text82.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run97.Append(runProperties97);
            run97.Append(lastRenderedPageBreak1);
            run97.Append(text82);

            paragraph59.Append(paragraphProperties59);
            paragraph59.Append(run97);

            tableCell44.Append(tableCellProperties44);
            tableCell44.Append(paragraph59);

            tableRow30.Append(tablePropertyExceptions13);
            tableRow30.Append(tableRowProperties28);
            tableRow30.Append(tableCell44);

            TableRow tableRow31 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions14 = new TablePropertyExceptions();

            TableBorders tableBorders16 = new TableBorders();
            TopBorder topBorder49 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder42 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder53 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder42 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder16 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder16 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders16.Append(topBorder49);
            tableBorders16.Append(leftBorder42);
            tableBorders16.Append(bottomBorder53);
            tableBorders16.Append(rightBorder42);
            tableBorders16.Append(insideHorizontalBorder16);
            tableBorders16.Append(insideVerticalBorder16);

            tablePropertyExceptions14.Append(tableBorders16);

            TableRowProperties tableRowProperties29 = new TableRowProperties();
            TableRowHeight tableRowHeight29 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties29.Append(tableRowHeight29);

            TableCell tableCell45 = new TableCell();

            TableCellProperties tableCellProperties45 = new TableCellProperties();
            TableCellWidth tableCellWidth45 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan30 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders41 = new TableCellBorders();
            TopBorder topBorder50 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder43 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder54 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder43 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders41.Append(topBorder50);
            tableCellBorders41.Append(leftBorder43);
            tableCellBorders41.Append(bottomBorder54);
            tableCellBorders41.Append(rightBorder43);
            TableCellVerticalAlignment tableCellVerticalAlignment31 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties45.Append(tableCellWidth45);
            tableCellProperties45.Append(gridSpan30);
            tableCellProperties45.Append(tableCellBorders41);
            tableCellProperties45.Append(tableCellVerticalAlignment31);

            Paragraph paragraph60 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties60 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines60 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification51 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties59 = new ParagraphMarkRunProperties();
            Italic italic57 = new Italic();

            paragraphMarkRunProperties59.Append(italic57);

            paragraphProperties60.Append(spacingBetweenLines60);
            paragraphProperties60.Append(justification51);
            paragraphProperties60.Append(paragraphMarkRunProperties59);

            Run run98 = new Run();

            RunProperties runProperties98 = new RunProperties();
            Italic italic58 = new Italic();

            runProperties98.Append(italic58);
            Text text83 = new Text();
            text83.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run98.Append(runProperties98);
            run98.Append(text83);

            paragraph60.Append(paragraphProperties60);
            paragraph60.Append(run98);

            tableCell45.Append(tableCellProperties45);
            tableCell45.Append(paragraph60);

            tableRow31.Append(tablePropertyExceptions14);
            tableRow31.Append(tableRowProperties29);
            tableRow31.Append(tableCell45);

            TableRow tableRow32 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions15 = new TablePropertyExceptions();

            TableBorders tableBorders17 = new TableBorders();
            TopBorder topBorder51 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder44 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder55 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder44 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder17 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder17 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders17.Append(topBorder51);
            tableBorders17.Append(leftBorder44);
            tableBorders17.Append(bottomBorder55);
            tableBorders17.Append(rightBorder44);
            tableBorders17.Append(insideHorizontalBorder17);
            tableBorders17.Append(insideVerticalBorder17);

            tablePropertyExceptions15.Append(tableBorders17);

            TableRowProperties tableRowProperties30 = new TableRowProperties();
            TableRowHeight tableRowHeight30 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties30.Append(tableRowHeight30);

            TableCell tableCell46 = new TableCell();

            TableCellProperties tableCellProperties46 = new TableCellProperties();
            TableCellWidth tableCellWidth46 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan31 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders42 = new TableCellBorders();
            TopBorder topBorder52 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder45 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder56 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder45 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders42.Append(topBorder52);
            tableCellBorders42.Append(leftBorder45);
            tableCellBorders42.Append(bottomBorder56);
            tableCellBorders42.Append(rightBorder45);
            TableCellVerticalAlignment tableCellVerticalAlignment32 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties46.Append(tableCellWidth46);
            tableCellProperties46.Append(gridSpan31);
            tableCellProperties46.Append(tableCellBorders42);
            tableCellProperties46.Append(tableCellVerticalAlignment32);

            Paragraph paragraph61 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties61 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines61 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification52 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties60 = new ParagraphMarkRunProperties();
            Italic italic59 = new Italic();

            paragraphMarkRunProperties60.Append(italic59);

            paragraphProperties61.Append(spacingBetweenLines61);
            paragraphProperties61.Append(justification52);
            paragraphProperties61.Append(paragraphMarkRunProperties60);

            Run run99 = new Run();

            RunProperties runProperties99 = new RunProperties();
            Italic italic60 = new Italic();

            runProperties99.Append(italic60);
            Text text84 = new Text();
            text84.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run99.Append(runProperties99);
            run99.Append(text84);

            paragraph61.Append(paragraphProperties61);
            paragraph61.Append(run99);

            tableCell46.Append(tableCellProperties46);
            tableCell46.Append(paragraph61);

            tableRow32.Append(tablePropertyExceptions15);
            tableRow32.Append(tableRowProperties30);
            tableRow32.Append(tableCell46);

            TableRow tableRow33 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions16 = new TablePropertyExceptions();

            TableBorders tableBorders18 = new TableBorders();
            TopBorder topBorder53 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder46 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder57 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder46 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder18 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder18 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders18.Append(topBorder53);
            tableBorders18.Append(leftBorder46);
            tableBorders18.Append(bottomBorder57);
            tableBorders18.Append(rightBorder46);
            tableBorders18.Append(insideHorizontalBorder18);
            tableBorders18.Append(insideVerticalBorder18);

            tablePropertyExceptions16.Append(tableBorders18);

            TableRowProperties tableRowProperties31 = new TableRowProperties();
            TableRowHeight tableRowHeight31 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties31.Append(tableRowHeight31);

            TableCell tableCell47 = new TableCell();

            TableCellProperties tableCellProperties47 = new TableCellProperties();
            TableCellWidth tableCellWidth47 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan32 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders43 = new TableCellBorders();
            TopBorder topBorder54 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder47 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder58 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder47 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders43.Append(topBorder54);
            tableCellBorders43.Append(leftBorder47);
            tableCellBorders43.Append(bottomBorder58);
            tableCellBorders43.Append(rightBorder47);
            TableCellVerticalAlignment tableCellVerticalAlignment33 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties47.Append(tableCellWidth47);
            tableCellProperties47.Append(gridSpan32);
            tableCellProperties47.Append(tableCellBorders43);
            tableCellProperties47.Append(tableCellVerticalAlignment33);

            Paragraph paragraph62 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties62 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines62 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification53 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties61 = new ParagraphMarkRunProperties();
            Italic italic61 = new Italic();

            paragraphMarkRunProperties61.Append(italic61);

            paragraphProperties62.Append(spacingBetweenLines62);
            paragraphProperties62.Append(justification53);
            paragraphProperties62.Append(paragraphMarkRunProperties61);

            Run run100 = new Run();

            RunProperties runProperties100 = new RunProperties();
            Italic italic62 = new Italic();

            runProperties100.Append(italic62);
            Text text85 = new Text();
            text85.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run100.Append(runProperties100);
            run100.Append(text85);

            paragraph62.Append(paragraphProperties62);
            paragraph62.Append(run100);

            tableCell47.Append(tableCellProperties47);
            tableCell47.Append(paragraph62);

            tableRow33.Append(tablePropertyExceptions16);
            tableRow33.Append(tableRowProperties31);
            tableRow33.Append(tableCell47);

            TableRow tableRow34 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions17 = new TablePropertyExceptions();

            TableBorders tableBorders19 = new TableBorders();
            TopBorder topBorder55 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder48 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder59 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder48 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder19 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder19 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders19.Append(topBorder55);
            tableBorders19.Append(leftBorder48);
            tableBorders19.Append(bottomBorder59);
            tableBorders19.Append(rightBorder48);
            tableBorders19.Append(insideHorizontalBorder19);
            tableBorders19.Append(insideVerticalBorder19);

            tablePropertyExceptions17.Append(tableBorders19);

            TableRowProperties tableRowProperties32 = new TableRowProperties();
            TableRowHeight tableRowHeight32 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties32.Append(tableRowHeight32);

            TableCell tableCell48 = new TableCell();

            TableCellProperties tableCellProperties48 = new TableCellProperties();
            TableCellWidth tableCellWidth48 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan33 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders44 = new TableCellBorders();
            TopBorder topBorder56 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder49 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder60 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder49 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders44.Append(topBorder56);
            tableCellBorders44.Append(leftBorder49);
            tableCellBorders44.Append(bottomBorder60);
            tableCellBorders44.Append(rightBorder49);
            TableCellVerticalAlignment tableCellVerticalAlignment34 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties48.Append(tableCellWidth48);
            tableCellProperties48.Append(gridSpan33);
            tableCellProperties48.Append(tableCellBorders44);
            tableCellProperties48.Append(tableCellVerticalAlignment34);

            Paragraph paragraph63 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties63 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines63 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification54 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties62 = new ParagraphMarkRunProperties();
            Italic italic63 = new Italic();

            paragraphMarkRunProperties62.Append(italic63);

            paragraphProperties63.Append(spacingBetweenLines63);
            paragraphProperties63.Append(justification54);
            paragraphProperties63.Append(paragraphMarkRunProperties62);

            Run run101 = new Run();

            RunProperties runProperties101 = new RunProperties();
            Italic italic64 = new Italic();

            runProperties101.Append(italic64);
            Text text86 = new Text();
            text86.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run101.Append(runProperties101);
            run101.Append(text86);

            paragraph63.Append(paragraphProperties63);
            paragraph63.Append(run101);

            tableCell48.Append(tableCellProperties48);
            tableCell48.Append(paragraph63);

            tableRow34.Append(tablePropertyExceptions17);
            tableRow34.Append(tableRowProperties32);
            tableRow34.Append(tableCell48);

            TableRow tableRow35 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00EF1E49", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties33 = new TableRowProperties();
            TableRowHeight tableRowHeight33 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties33.Append(tableRowHeight33);

            TableCell tableCell49 = new TableCell();

            TableCellProperties tableCellProperties49 = new TableCellProperties();
            TableCellWidth tableCellWidth49 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan34 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders45 = new TableCellBorders();
            TopBorder topBorder57 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder61 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders45.Append(topBorder57);
            tableCellBorders45.Append(bottomBorder61);
            TableCellVerticalAlignment tableCellVerticalAlignment35 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties49.Append(tableCellWidth49);
            tableCellProperties49.Append(gridSpan34);
            tableCellProperties49.Append(tableCellBorders45);
            tableCellProperties49.Append(tableCellVerticalAlignment35);

            Paragraph paragraph64 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00EF1E49", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties64 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines64 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification55 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties63 = new ParagraphMarkRunProperties();
            Italic italic65 = new Italic();

            paragraphMarkRunProperties63.Append(italic65);

            paragraphProperties64.Append(spacingBetweenLines64);
            paragraphProperties64.Append(justification55);
            paragraphProperties64.Append(paragraphMarkRunProperties63);

            Run run102 = new Run();

            RunProperties runProperties102 = new RunProperties();
            Italic italic66 = new Italic();

            runProperties102.Append(italic66);
            Text text87 = new Text();
            text87.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run102.Append(runProperties102);
            run102.Append(text87);

            paragraph64.Append(paragraphProperties64);
            paragraph64.Append(run102);

            tableCell49.Append(tableCellProperties49);
            tableCell49.Append(paragraph64);

            tableRow35.Append(tableRowProperties33);
            tableRow35.Append(tableCell49);

            TableRow tableRow36 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "0091399C", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties34 = new TableRowProperties();
            TableRowHeight tableRowHeight34 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties34.Append(tableRowHeight34);

            TableCell tableCell50 = new TableCell();

            TableCellProperties tableCellProperties50 = new TableCellProperties();
            TableCellWidth tableCellWidth50 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan35 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders46 = new TableCellBorders();
            TopBorder topBorder58 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder62 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders46.Append(topBorder58);
            tableCellBorders46.Append(bottomBorder62);
            TableCellVerticalAlignment tableCellVerticalAlignment36 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties50.Append(tableCellWidth50);
            tableCellProperties50.Append(gridSpan35);
            tableCellProperties50.Append(tableCellBorders46);
            tableCellProperties50.Append(tableCellVerticalAlignment36);

            Paragraph paragraph65 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "0091399C", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties65 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines65 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification56 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties64 = new ParagraphMarkRunProperties();
            Italic italic67 = new Italic();

            paragraphMarkRunProperties64.Append(italic67);

            paragraphProperties65.Append(spacingBetweenLines65);
            paragraphProperties65.Append(justification56);
            paragraphProperties65.Append(paragraphMarkRunProperties64);

            Run run103 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties103 = new RunProperties();
            Italic italic68 = new Italic();

            runProperties103.Append(italic68);
            Text text88 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text88.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run103.Append(runProperties103);
            run103.Append(text88);

            paragraph65.Append(paragraphProperties65);
            paragraph65.Append(run103);

            tableCell50.Append(tableCellProperties50);
            tableCell50.Append(paragraph65);

            tableRow36.Append(tableRowProperties34);
            tableRow36.Append(tableCell50);

            TableRow tableRow37 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00940F7D", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties35 = new TableRowProperties();
            TableRowHeight tableRowHeight35 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties35.Append(tableRowHeight35);

            TableCell tableCell51 = new TableCell();

            TableCellProperties tableCellProperties51 = new TableCellProperties();
            TableCellWidth tableCellWidth51 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan36 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders47 = new TableCellBorders();
            TopBorder topBorder59 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder63 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders47.Append(topBorder59);
            tableCellBorders47.Append(bottomBorder63);
            TableCellVerticalAlignment tableCellVerticalAlignment37 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties51.Append(tableCellWidth51);
            tableCellProperties51.Append(gridSpan36);
            tableCellProperties51.Append(tableCellBorders47);
            tableCellProperties51.Append(tableCellVerticalAlignment37);

            Paragraph paragraph66 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00940F7D", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties66 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines66 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification57 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties65 = new ParagraphMarkRunProperties();
            Italic italic69 = new Italic();

            paragraphMarkRunProperties65.Append(italic69);

            paragraphProperties66.Append(spacingBetweenLines66);
            paragraphProperties66.Append(justification57);
            paragraphProperties66.Append(paragraphMarkRunProperties65);

            Run run104 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties104 = new RunProperties();
            Italic italic70 = new Italic();

            runProperties104.Append(italic70);
            Text text89 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text89.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run104.Append(runProperties104);
            run104.Append(text89);

            paragraph66.Append(paragraphProperties66);
            paragraph66.Append(run104);

            tableCell51.Append(tableCellProperties51);
            tableCell51.Append(paragraph66);

            tableRow37.Append(tableRowProperties35);
            tableRow37.Append(tableCell51);

            TableRow tableRow38 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00940F7D", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties36 = new TableRowProperties();
            TableRowHeight tableRowHeight36 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties36.Append(tableRowHeight36);

            TableCell tableCell52 = new TableCell();

            TableCellProperties tableCellProperties52 = new TableCellProperties();
            TableCellWidth tableCellWidth52 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan37 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders48 = new TableCellBorders();
            TopBorder topBorder60 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder64 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders48.Append(topBorder60);
            tableCellBorders48.Append(bottomBorder64);
            TableCellVerticalAlignment tableCellVerticalAlignment38 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties52.Append(tableCellWidth52);
            tableCellProperties52.Append(gridSpan37);
            tableCellProperties52.Append(tableCellBorders48);
            tableCellProperties52.Append(tableCellVerticalAlignment38);

            Paragraph paragraph67 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00940F7D", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties67 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines67 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification58 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties66 = new ParagraphMarkRunProperties();
            Italic italic71 = new Italic();

            paragraphMarkRunProperties66.Append(italic71);

            paragraphProperties67.Append(spacingBetweenLines67);
            paragraphProperties67.Append(justification58);
            paragraphProperties67.Append(paragraphMarkRunProperties66);

            Run run105 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties105 = new RunProperties();
            Italic italic72 = new Italic();

            runProperties105.Append(italic72);
            Text text90 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text90.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run105.Append(runProperties105);
            run105.Append(text90);

            paragraph67.Append(paragraphProperties67);
            paragraph67.Append(run105);

            tableCell52.Append(tableCellProperties52);
            tableCell52.Append(paragraph67);

            tableRow38.Append(tableRowProperties36);
            tableRow38.Append(tableCell52);

            TableRow tableRow39 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00940F7D", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties37 = new TableRowProperties();
            TableRowHeight tableRowHeight37 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties37.Append(tableRowHeight37);

            TableCell tableCell53 = new TableCell();

            TableCellProperties tableCellProperties53 = new TableCellProperties();
            TableCellWidth tableCellWidth53 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan38 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders49 = new TableCellBorders();
            TopBorder topBorder61 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder65 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders49.Append(topBorder61);
            tableCellBorders49.Append(bottomBorder65);
            TableCellVerticalAlignment tableCellVerticalAlignment39 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties53.Append(tableCellWidth53);
            tableCellProperties53.Append(gridSpan38);
            tableCellProperties53.Append(tableCellBorders49);
            tableCellProperties53.Append(tableCellVerticalAlignment39);

            Paragraph paragraph68 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00940F7D", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties68 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines68 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification59 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties67 = new ParagraphMarkRunProperties();
            Italic italic73 = new Italic();

            paragraphMarkRunProperties67.Append(italic73);

            paragraphProperties68.Append(spacingBetweenLines68);
            paragraphProperties68.Append(justification59);
            paragraphProperties68.Append(paragraphMarkRunProperties67);

            Run run106 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties106 = new RunProperties();
            Italic italic74 = new Italic();

            runProperties106.Append(italic74);
            Text text91 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text91.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run106.Append(runProperties106);
            run106.Append(text91);

            paragraph68.Append(paragraphProperties68);
            paragraph68.Append(run106);

            tableCell53.Append(tableCellProperties53);
            tableCell53.Append(paragraph68);

            tableRow39.Append(tableRowProperties37);
            tableRow39.Append(tableCell53);

            TableRow tableRow40 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "003240C9", RsidTableRowProperties = "008A54B3" };

            TableRowProperties tableRowProperties38 = new TableRowProperties();
            TableRowHeight tableRowHeight38 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties38.Append(tableRowHeight38);

            TableCell tableCell54 = new TableCell();

            TableCellProperties tableCellProperties54 = new TableCellProperties();
            TableCellWidth tableCellWidth54 = new TableCellWidth() { Width = "9322", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan39 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders50 = new TableCellBorders();
            TopBorder topBorder62 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders50.Append(topBorder62);
            TableCellVerticalAlignment tableCellVerticalAlignment40 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties54.Append(tableCellWidth54);
            tableCellProperties54.Append(gridSpan39);
            tableCellProperties54.Append(tableCellBorders50);
            tableCellProperties54.Append(tableCellVerticalAlignment40);

            Paragraph paragraph69 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "004105F6" };

            ParagraphProperties paragraphProperties69 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines69 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification60 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties68 = new ParagraphMarkRunProperties();
            FontSize fontSize97 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript100 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties68.Append(fontSize97);
            paragraphMarkRunProperties68.Append(fontSizeComplexScript100);

            paragraphProperties69.Append(spacingBetweenLines69);
            paragraphProperties69.Append(justification60);
            paragraphProperties69.Append(paragraphMarkRunProperties68);

            Run run107 = new Run() { RsidRunProperties = "0062700D" };

            RunProperties runProperties107 = new RunProperties();
            FontSize fontSize98 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript101 = new FontSizeComplexScript() { Val = "20" };

            runProperties107.Append(fontSize98);
            runProperties107.Append(fontSizeComplexScript101);
            Text text92 = new Text();
            text92.Text = "5. Перечень графического материала (с точным указанием обязательных чертежей и графиков)";

            run107.Append(runProperties107);
            run107.Append(text92);

            paragraph69.Append(paragraphProperties69);
            paragraph69.Append(run107);

            tableCell54.Append(tableCellProperties54);
            tableCell54.Append(paragraph69);

            TableCell tableCell55 = new TableCell();

            TableCellProperties tableCellProperties55 = new TableCellProperties();
            TableCellWidth tableCellWidth55 = new TableCellWidth() { Width = "248", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders51 = new TableCellBorders();
            TopBorder topBorder63 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders51.Append(topBorder63);
            TableCellVerticalAlignment tableCellVerticalAlignment41 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties55.Append(tableCellWidth55);
            tableCellProperties55.Append(tableCellBorders51);
            tableCellProperties55.Append(tableCellVerticalAlignment41);

            Paragraph paragraph70 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "003240C9", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "003240C9" };

            ParagraphProperties paragraphProperties70 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines70 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification61 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties69 = new ParagraphMarkRunProperties();
            Italic italic76 = new Italic();

            paragraphMarkRunProperties69.Append(italic76);

            paragraphProperties70.Append(spacingBetweenLines70);
            paragraphProperties70.Append(justification61);
            paragraphProperties70.Append(paragraphMarkRunProperties69);

            paragraph70.Append(paragraphProperties70);

            tableCell55.Append(tableCellProperties55);
            tableCell55.Append(paragraph70);

            tableRow40.Append(tableRowProperties38);
            tableRow40.Append(tableCell54);
            tableRow40.Append(tableCell55);

            TableRow tableRow41 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions18 = new TablePropertyExceptions();

            TableBorders tableBorders20 = new TableBorders();
            TopBorder topBorder64 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder50 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder66 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder50 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder20 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder20 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders20.Append(topBorder64);
            tableBorders20.Append(leftBorder50);
            tableBorders20.Append(bottomBorder66);
            tableBorders20.Append(rightBorder50);
            tableBorders20.Append(insideHorizontalBorder20);
            tableBorders20.Append(insideVerticalBorder20);

            tablePropertyExceptions18.Append(tableBorders20);

            TableRowProperties tableRowProperties39 = new TableRowProperties();
            TableRowHeight tableRowHeight39 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties39.Append(tableRowHeight39);

            TableCell tableCell56 = new TableCell();

            TableCellProperties tableCellProperties56 = new TableCellProperties();
            TableCellWidth tableCellWidth56 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan40 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders52 = new TableCellBorders();
            TopBorder topBorder65 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder51 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder67 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder51 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders52.Append(topBorder65);
            tableCellBorders52.Append(leftBorder51);
            tableCellBorders52.Append(bottomBorder67);
            tableCellBorders52.Append(rightBorder51);
            TableCellVerticalAlignment tableCellVerticalAlignment42 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties56.Append(tableCellWidth56);
            tableCellProperties56.Append(gridSpan40);
            tableCellProperties56.Append(tableCellBorders52);
            tableCellProperties56.Append(tableCellVerticalAlignment42);

            Paragraph paragraph71 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties71 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines71 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification62 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties70 = new ParagraphMarkRunProperties();
            Italic italic77 = new Italic();

            paragraphMarkRunProperties70.Append(italic77);

            paragraphProperties71.Append(spacingBetweenLines71);
            paragraphProperties71.Append(justification62);
            paragraphProperties71.Append(paragraphMarkRunProperties70);

            // Split
            var drawMaterials = awork is null ? work.DrawMaterials?.Split('\n') : awork.CourseProject.DrawMaterials?.Split('\n');
            i = 0;

            Run run112 = new Run();

            RunProperties runProperties112 = new RunProperties();
            Italic italic78 = new Italic();

            runProperties112.Append(italic78);
            Text text97 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text97.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run112.Append(runProperties112);
            run112.Append(text97);
            ProofError proofError21 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph71.Append(paragraphProperties71);
            paragraph71.Append(run112);
            paragraph71.Append(proofError21);

            tableCell56.Append(tableCellProperties56);
            tableCell56.Append(paragraph71);

            tableRow41.Append(tablePropertyExceptions18);
            tableRow41.Append(tableRowProperties39);
            tableRow41.Append(tableCell56);

            TableRow tableRow42 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions19 = new TablePropertyExceptions();

            TableBorders tableBorders21 = new TableBorders();
            TopBorder topBorder66 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder52 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder68 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder52 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder21 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder21 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders21.Append(topBorder66);
            tableBorders21.Append(leftBorder52);
            tableBorders21.Append(bottomBorder68);
            tableBorders21.Append(rightBorder52);
            tableBorders21.Append(insideHorizontalBorder21);
            tableBorders21.Append(insideVerticalBorder21);

            tablePropertyExceptions19.Append(tableBorders21);

            TableRowProperties tableRowProperties40 = new TableRowProperties();
            TableRowHeight tableRowHeight40 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties40.Append(tableRowHeight40);

            TableCell tableCell57 = new TableCell();

            TableCellProperties tableCellProperties57 = new TableCellProperties();
            TableCellWidth tableCellWidth57 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan41 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders53 = new TableCellBorders();
            TopBorder topBorder67 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder53 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder69 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder53 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders53.Append(topBorder67);
            tableCellBorders53.Append(leftBorder53);
            tableCellBorders53.Append(bottomBorder69);
            tableCellBorders53.Append(rightBorder53);
            TableCellVerticalAlignment tableCellVerticalAlignment43 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties57.Append(tableCellWidth57);
            tableCellProperties57.Append(gridSpan41);
            tableCellProperties57.Append(tableCellBorders53);
            tableCellProperties57.Append(tableCellVerticalAlignment43);

            Paragraph paragraph72 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties72 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines72 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification63 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties71 = new ParagraphMarkRunProperties();
            Italic italic81 = new Italic();

            paragraphMarkRunProperties71.Append(italic81);

            paragraphProperties72.Append(spacingBetweenLines72);
            paragraphProperties72.Append(justification63);
            paragraphProperties72.Append(paragraphMarkRunProperties71);

            Run run115 = new Run();

            RunProperties runProperties115 = new RunProperties();
            Italic italic82 = new Italic();

            runProperties115.Append(italic82);
            Text text100 = new Text();
            text100.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run115.Append(runProperties115);
            run115.Append(text100);

            paragraph72.Append(paragraphProperties72);
            paragraph72.Append(run115);

            tableCell57.Append(tableCellProperties57);
            tableCell57.Append(paragraph72);

            tableRow42.Append(tablePropertyExceptions19);
            tableRow42.Append(tableRowProperties40);
            tableRow42.Append(tableCell57);

            TableRow tableRow43 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions20 = new TablePropertyExceptions();

            TableBorders tableBorders22 = new TableBorders();
            TopBorder topBorder68 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder54 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder70 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder54 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder22 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder22 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders22.Append(topBorder68);
            tableBorders22.Append(leftBorder54);
            tableBorders22.Append(bottomBorder70);
            tableBorders22.Append(rightBorder54);
            tableBorders22.Append(insideHorizontalBorder22);
            tableBorders22.Append(insideVerticalBorder22);

            tablePropertyExceptions20.Append(tableBorders22);

            TableRowProperties tableRowProperties41 = new TableRowProperties();
            TableRowHeight tableRowHeight41 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties41.Append(tableRowHeight41);

            TableCell tableCell58 = new TableCell();

            TableCellProperties tableCellProperties58 = new TableCellProperties();
            TableCellWidth tableCellWidth58 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan42 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders54 = new TableCellBorders();
            TopBorder topBorder69 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder55 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder71 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder55 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders54.Append(topBorder69);
            tableCellBorders54.Append(leftBorder55);
            tableCellBorders54.Append(bottomBorder71);
            tableCellBorders54.Append(rightBorder55);
            TableCellVerticalAlignment tableCellVerticalAlignment44 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties58.Append(tableCellWidth58);
            tableCellProperties58.Append(gridSpan42);
            tableCellProperties58.Append(tableCellBorders54);
            tableCellProperties58.Append(tableCellVerticalAlignment44);

            Paragraph paragraph73 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties73 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines73 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification64 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties72 = new ParagraphMarkRunProperties();
            Italic italic83 = new Italic();

            paragraphMarkRunProperties72.Append(italic83);

            paragraphProperties73.Append(spacingBetweenLines73);
            paragraphProperties73.Append(justification64);
            paragraphProperties73.Append(paragraphMarkRunProperties72);

            Run run116 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties116 = new RunProperties();
            Italic italic84 = new Italic();

            runProperties116.Append(italic84);
            Text text101 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text101.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run116.Append(runProperties116);
            run116.Append(text101);

            paragraph73.Append(paragraphProperties73);
            paragraph73.Append(run116);

            tableCell58.Append(tableCellProperties58);
            tableCell58.Append(paragraph73);

            tableRow43.Append(tablePropertyExceptions20);
            tableRow43.Append(tableRowProperties41);
            tableRow43.Append(tableCell58);

            TableRow tableRow44 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions21 = new TablePropertyExceptions();

            TableBorders tableBorders23 = new TableBorders();
            TopBorder topBorder70 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder56 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder72 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder56 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder23 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder23 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders23.Append(topBorder70);
            tableBorders23.Append(leftBorder56);
            tableBorders23.Append(bottomBorder72);
            tableBorders23.Append(rightBorder56);
            tableBorders23.Append(insideHorizontalBorder23);
            tableBorders23.Append(insideVerticalBorder23);

            tablePropertyExceptions21.Append(tableBorders23);

            TableRowProperties tableRowProperties42 = new TableRowProperties();
            TableRowHeight tableRowHeight42 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties42.Append(tableRowHeight42);

            TableCell tableCell59 = new TableCell();

            TableCellProperties tableCellProperties59 = new TableCellProperties();
            TableCellWidth tableCellWidth59 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan43 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders55 = new TableCellBorders();
            TopBorder topBorder71 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder57 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder73 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder57 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders55.Append(topBorder71);
            tableCellBorders55.Append(leftBorder57);
            tableCellBorders55.Append(bottomBorder73);
            tableCellBorders55.Append(rightBorder57);
            TableCellVerticalAlignment tableCellVerticalAlignment45 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties59.Append(tableCellWidth59);
            tableCellProperties59.Append(gridSpan43);
            tableCellProperties59.Append(tableCellBorders55);
            tableCellProperties59.Append(tableCellVerticalAlignment45);

            Paragraph paragraph74 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties74 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines74 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification65 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties73 = new ParagraphMarkRunProperties();
            Italic italic85 = new Italic();

            paragraphMarkRunProperties73.Append(italic85);

            paragraphProperties74.Append(spacingBetweenLines74);
            paragraphProperties74.Append(justification65);
            paragraphProperties74.Append(paragraphMarkRunProperties73);

            Run run117 = new Run() { RsidRunProperties = "00A757B8" };

            RunProperties runProperties117 = new RunProperties();
            Italic italic86 = new Italic();

            runProperties117.Append(italic86);
            Text text102 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text102.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run117.Append(runProperties117);
            run117.Append(text102);

            paragraph74.Append(paragraphProperties74);
            paragraph74.Append(run117);

            tableCell59.Append(tableCellProperties59);
            tableCell59.Append(paragraph74);

            tableRow44.Append(tablePropertyExceptions21);
            tableRow44.Append(tableRowProperties42);
            tableRow44.Append(tableCell59);

            TableRow tableRow45 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00A757B8", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions22 = new TablePropertyExceptions();

            TableBorders tableBorders24 = new TableBorders();
            TopBorder topBorder72 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder58 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder74 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder58 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder24 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder24 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders24.Append(topBorder72);
            tableBorders24.Append(leftBorder58);
            tableBorders24.Append(bottomBorder74);
            tableBorders24.Append(rightBorder58);
            tableBorders24.Append(insideHorizontalBorder24);
            tableBorders24.Append(insideVerticalBorder24);

            tablePropertyExceptions22.Append(tableBorders24);

            TableRowProperties tableRowProperties43 = new TableRowProperties();
            TableRowHeight tableRowHeight43 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties43.Append(tableRowHeight43);

            TableCell tableCell60 = new TableCell();

            TableCellProperties tableCellProperties60 = new TableCellProperties();
            TableCellWidth tableCellWidth60 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan44 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders56 = new TableCellBorders();
            TopBorder topBorder73 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder59 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder75 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder59 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders56.Append(topBorder73);
            tableCellBorders56.Append(leftBorder59);
            tableCellBorders56.Append(bottomBorder75);
            tableCellBorders56.Append(rightBorder59);
            TableCellVerticalAlignment tableCellVerticalAlignment46 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties60.Append(tableCellWidth60);
            tableCellProperties60.Append(gridSpan44);
            tableCellProperties60.Append(tableCellBorders56);
            tableCellProperties60.Append(tableCellVerticalAlignment46);

            Paragraph paragraph75 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00A757B8", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00A757B8" };

            ParagraphProperties paragraphProperties75 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines75 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification66 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties74 = new ParagraphMarkRunProperties();
            Italic italic87 = new Italic();

            paragraphMarkRunProperties74.Append(italic87);

            paragraphProperties75.Append(spacingBetweenLines75);
            paragraphProperties75.Append(justification66);
            paragraphProperties75.Append(paragraphMarkRunProperties74);

            Run run118 = new Run();

            RunProperties runProperties118 = new RunProperties();
            Italic italic88 = new Italic();

            runProperties118.Append(italic88);
            Text text103 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text103.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run118.Append(runProperties118);
            run118.Append(text103);

            paragraph75.Append(paragraphProperties75);
            paragraph75.Append(run118);

            tableCell60.Append(tableCellProperties60);
            tableCell60.Append(paragraph75);

            tableRow45.Append(tablePropertyExceptions22);
            tableRow45.Append(tableRowProperties43);
            tableRow45.Append(tableCell60);

            TableRow tableRow46 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00A757B8", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions23 = new TablePropertyExceptions();

            TableBorders tableBorders25 = new TableBorders();
            TopBorder topBorder74 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder60 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder76 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder60 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder25 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder25 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders25.Append(topBorder74);
            tableBorders25.Append(leftBorder60);
            tableBorders25.Append(bottomBorder76);
            tableBorders25.Append(rightBorder60);
            tableBorders25.Append(insideHorizontalBorder25);
            tableBorders25.Append(insideVerticalBorder25);

            tablePropertyExceptions23.Append(tableBorders25);

            TableRowProperties tableRowProperties44 = new TableRowProperties();
            TableRowHeight tableRowHeight44 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties44.Append(tableRowHeight44);

            TableCell tableCell61 = new TableCell();

            TableCellProperties tableCellProperties61 = new TableCellProperties();
            TableCellWidth tableCellWidth61 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan45 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders57 = new TableCellBorders();
            TopBorder topBorder75 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder61 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder77 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder61 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders57.Append(topBorder75);
            tableCellBorders57.Append(leftBorder61);
            tableCellBorders57.Append(bottomBorder77);
            tableCellBorders57.Append(rightBorder61);
            TableCellVerticalAlignment tableCellVerticalAlignment47 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties61.Append(tableCellWidth61);
            tableCellProperties61.Append(gridSpan45);
            tableCellProperties61.Append(tableCellBorders57);
            tableCellProperties61.Append(tableCellVerticalAlignment47);

            Paragraph paragraph76 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00A757B8", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00A757B8" };

            ParagraphProperties paragraphProperties76 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines76 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification67 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties75 = new ParagraphMarkRunProperties();
            Italic italic89 = new Italic();

            paragraphMarkRunProperties75.Append(italic89);

            paragraphProperties76.Append(spacingBetweenLines76);
            paragraphProperties76.Append(justification67);
            paragraphProperties76.Append(paragraphMarkRunProperties75);

            Run run119 = new Run();

            RunProperties runProperties119 = new RunProperties();
            Italic italic90 = new Italic();

            runProperties119.Append(italic90);
            Text text104 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text104.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run119.Append(runProperties119);
            run119.Append(text104);

            paragraph76.Append(paragraphProperties76);
            paragraph76.Append(run119);

            tableCell61.Append(tableCellProperties61);
            tableCell61.Append(paragraph76);

            tableRow46.Append(tablePropertyExceptions23);
            tableRow46.Append(tableRowProperties44);
            tableRow46.Append(tableCell61);

            TableRow tableRow47 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00A757B8", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions24 = new TablePropertyExceptions();

            TableBorders tableBorders26 = new TableBorders();
            TopBorder topBorder76 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder62 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder78 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder62 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder26 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder26 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders26.Append(topBorder76);
            tableBorders26.Append(leftBorder62);
            tableBorders26.Append(bottomBorder78);
            tableBorders26.Append(rightBorder62);
            tableBorders26.Append(insideHorizontalBorder26);
            tableBorders26.Append(insideVerticalBorder26);

            tablePropertyExceptions24.Append(tableBorders26);

            TableRowProperties tableRowProperties45 = new TableRowProperties();
            TableRowHeight tableRowHeight45 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties45.Append(tableRowHeight45);

            TableCell tableCell62 = new TableCell();

            TableCellProperties tableCellProperties62 = new TableCellProperties();
            TableCellWidth tableCellWidth62 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan46 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders58 = new TableCellBorders();
            TopBorder topBorder77 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder63 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder79 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder63 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders58.Append(topBorder77);
            tableCellBorders58.Append(leftBorder63);
            tableCellBorders58.Append(bottomBorder79);
            tableCellBorders58.Append(rightBorder63);
            TableCellVerticalAlignment tableCellVerticalAlignment48 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties62.Append(tableCellWidth62);
            tableCellProperties62.Append(gridSpan46);
            tableCellProperties62.Append(tableCellBorders58);
            tableCellProperties62.Append(tableCellVerticalAlignment48);

            Paragraph paragraph77 = new Paragraph() { RsidParagraphMarkRevision = "00A757B8", RsidParagraphAddition = "00A757B8", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00A757B8" };

            ParagraphProperties paragraphProperties77 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines77 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification68 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties76 = new ParagraphMarkRunProperties();
            Italic italic91 = new Italic();

            paragraphMarkRunProperties76.Append(italic91);

            paragraphProperties77.Append(spacingBetweenLines77);
            paragraphProperties77.Append(justification68);
            paragraphProperties77.Append(paragraphMarkRunProperties76);

            Run run120 = new Run();

            RunProperties runProperties120 = new RunProperties();
            Italic italic92 = new Italic();

            runProperties120.Append(italic92);
            Text text105 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text105.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run120.Append(runProperties120);
            run120.Append(text105);

            paragraph77.Append(paragraphProperties77);
            paragraph77.Append(run120);

            tableCell62.Append(tableCellProperties62);
            tableCell62.Append(paragraph77);

            tableRow47.Append(tablePropertyExceptions24);
            tableRow47.Append(tableRowProperties45);
            tableRow47.Append(tableCell62);

            TableRow tableRow48 = new TableRow() { RsidTableRowMarkRevision = "0062700D", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties46 = new TableRowProperties();
            TableRowHeight tableRowHeight46 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties46.Append(tableRowHeight46);

            TableCell tableCell63 = new TableCell();

            TableCellProperties tableCellProperties63 = new TableCellProperties();
            TableCellWidth tableCellWidth63 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan47 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders59 = new TableCellBorders();
            TopBorder topBorder78 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders59.Append(topBorder78);
            TableCellVerticalAlignment tableCellVerticalAlignment49 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties63.Append(tableCellWidth63);
            tableCellProperties63.Append(gridSpan47);
            tableCellProperties63.Append(tableCellBorders59);
            tableCellProperties63.Append(tableCellVerticalAlignment49);

            Paragraph paragraph78 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00677C9F" };

            ParagraphProperties paragraphProperties78 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines78 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification69 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties77 = new ParagraphMarkRunProperties();
            FontSize fontSize102 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript106 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties77.Append(fontSize102);
            paragraphMarkRunProperties77.Append(fontSizeComplexScript106);

            paragraphProperties78.Append(spacingBetweenLines78);
            paragraphProperties78.Append(justification69);
            paragraphProperties78.Append(paragraphMarkRunProperties77);

            Run run121 = new Run();

            RunProperties runProperties121 = new RunProperties();
            FontSize fontSize103 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript107 = new FontSizeComplexScript() { Val = "20" };

            runProperties121.Append(fontSize103);
            runProperties121.Append(fontSizeComplexScript107);
            Text text106 = new Text();
            text106.Text = "6. Дата выдачи задания";

            run121.Append(runProperties121);
            run121.Append(text106);

            paragraph78.Append(paragraphProperties78);
            paragraph78.Append(run121);

            tableCell63.Append(tableCellProperties63);
            tableCell63.Append(paragraph78);

            TableCell tableCell64 = new TableCell();

            TableCellProperties tableCellProperties64 = new TableCellProperties();
            TableCellWidth tableCellWidth64 = new TableCellWidth() { Width = "7302", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan48 = new GridSpan() { Val = 5 };

            TableCellBorders tableCellBorders60 = new TableCellBorders();
            TopBorder topBorder79 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder80 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders60.Append(topBorder79);
            tableCellBorders60.Append(bottomBorder80);
            TableCellVerticalAlignment tableCellVerticalAlignment50 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties64.Append(tableCellWidth64);
            tableCellProperties64.Append(gridSpan48);
            tableCellProperties64.Append(tableCellBorders60);
            tableCellProperties64.Append(tableCellVerticalAlignment50);

            Paragraph paragraph79 = new Paragraph() { RsidParagraphMarkRevision = "000247F4", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties79 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines79 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification70 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties78 = new ParagraphMarkRunProperties();
            Italic italic93 = new Italic();
            Languages languages21 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties78.Append(italic93);
            paragraphMarkRunProperties78.Append(languages21);

            paragraphProperties79.Append(spacingBetweenLines79);
            paragraphProperties79.Append(justification70);
            paragraphProperties79.Append(paragraphMarkRunProperties78);

            Run run125 = new Run();

            RunProperties runProperties124 = new RunProperties();
            Italic italic94 = new Italic();
            Languages languages22 = new Languages() { Val = "en-US" };

            runProperties124.Append(italic94);
            runProperties124.Append(languages22);
            Text text110 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text110.Text = dateStart ?? "";

            run125.Append(runProperties124);
            run125.Append(text110);
            ProofError proofError23 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph79.Append(paragraphProperties79);
            paragraph79.Append(run125);
            paragraph79.Append(proofError23);

            tableCell64.Append(tableCellProperties64);
            tableCell64.Append(paragraph79);

            tableRow48.Append(tableRowProperties46);
            tableRow48.Append(tableCell63);
            tableRow48.Append(tableCell64);

            TableRow tableRow49 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions25 = new TablePropertyExceptions();

            TableBorders tableBorders27 = new TableBorders();
            TopBorder topBorder80 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder64 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder81 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder64 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder27 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder27 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders27.Append(topBorder80);
            tableBorders27.Append(leftBorder64);
            tableBorders27.Append(bottomBorder81);
            tableBorders27.Append(rightBorder64);
            tableBorders27.Append(insideHorizontalBorder27);
            tableBorders27.Append(insideVerticalBorder27);

            tablePropertyExceptions25.Append(tableBorders27);

            TableRowProperties tableRowProperties47 = new TableRowProperties();
            TableRowHeight tableRowHeight47 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties47.Append(tableRowHeight47);

            TableCell tableCell65 = new TableCell();

            TableCellProperties tableCellProperties65 = new TableCellProperties();
            TableCellWidth tableCellWidth65 = new TableCellWidth() { Width = "9180", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan49 = new GridSpan() { Val = 5 };

            TableCellBorders tableCellBorders61 = new TableCellBorders();
            TopBorder topBorder81 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder65 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder82 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder65 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders61.Append(topBorder81);
            tableCellBorders61.Append(leftBorder65);
            tableCellBorders61.Append(bottomBorder82);
            tableCellBorders61.Append(rightBorder65);
            TableCellVerticalAlignment tableCellVerticalAlignment51 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties65.Append(tableCellWidth65);
            tableCellProperties65.Append(gridSpan49);
            tableCellProperties65.Append(tableCellBorders61);
            tableCellProperties65.Append(tableCellVerticalAlignment51);

            Paragraph paragraph80 = new Paragraph() { RsidParagraphMarkRevision = "0062700D", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00677C9F" };

            ParagraphProperties paragraphProperties80 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines80 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification71 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties79 = new ParagraphMarkRunProperties();
            FontSize fontSize106 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript110 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties79.Append(fontSize106);
            paragraphMarkRunProperties79.Append(fontSizeComplexScript110);

            paragraphProperties80.Append(spacingBetweenLines80);
            paragraphProperties80.Append(justification71);
            paragraphProperties80.Append(paragraphMarkRunProperties79);

            Run run128 = new Run();

            RunProperties runProperties127 = new RunProperties();
            FontSize fontSize107 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript111 = new FontSizeComplexScript() { Val = "20" };

            runProperties127.Append(fontSize107);
            runProperties127.Append(fontSizeComplexScript111);
            Text text113 = new Text();
            text113.Text = "7. Календарный график выполнения с указанием сроков выполнения и трудоемкости отдельных этапов";

            run128.Append(runProperties127);
            run128.Append(text113);

            paragraph80.Append(paragraphProperties80);
            paragraph80.Append(run128);

            tableCell65.Append(tableCellProperties65);
            tableCell65.Append(paragraph80);

            TableCell tableCell66 = new TableCell();

            TableCellProperties tableCellProperties66 = new TableCellProperties();
            TableCellWidth tableCellWidth66 = new TableCellWidth() { Width = "390", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan50 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders62 = new TableCellBorders();
            TopBorder topBorder82 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder66 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder83 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder66 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders62.Append(topBorder82);
            tableCellBorders62.Append(leftBorder66);
            tableCellBorders62.Append(bottomBorder83);
            tableCellBorders62.Append(rightBorder66);

            tableCellProperties66.Append(tableCellWidth66);
            tableCellProperties66.Append(gridSpan50);
            tableCellProperties66.Append(tableCellBorders62);

            Paragraph paragraph81 = new Paragraph() { RsidParagraphMarkRevision = "00BE751C", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "00891E6F", RsidRunAdditionDefault = "00DD28CF" };

            ParagraphProperties paragraphProperties81 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines81 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification72 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties80 = new ParagraphMarkRunProperties();
            Italic italic97 = new Italic();

            paragraphMarkRunProperties80.Append(italic97);

            paragraphProperties81.Append(spacingBetweenLines81);
            paragraphProperties81.Append(justification72);
            paragraphProperties81.Append(paragraphMarkRunProperties80);

            paragraph81.Append(paragraphProperties81);

            tableCell66.Append(tableCellProperties66);
            tableCell66.Append(paragraph81);

            tableRow49.Append(tablePropertyExceptions25);
            tableRow49.Append(tableRowProperties47);
            tableRow49.Append(tableCell65);
            tableRow49.Append(tableCell66);

            TableRow tableRow50 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties48 = new TableRowProperties();
            TableRowHeight tableRowHeight48 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties48.Append(tableRowHeight48);

            TableCell tableCell67 = new TableCell();

            TableCellProperties tableCellProperties67 = new TableCellProperties();
            TableCellWidth tableCellWidth67 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan51 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders63 = new TableCellBorders();
            BottomBorder bottomBorder84 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders63.Append(bottomBorder84);
            TableCellVerticalAlignment tableCellVerticalAlignment52 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties67.Append(tableCellWidth67);
            tableCellProperties67.Append(gridSpan51);
            tableCellProperties67.Append(tableCellBorders63);
            tableCellProperties67.Append(tableCellVerticalAlignment52);

            Paragraph paragraph82 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties82 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines82 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification73 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties81 = new ParagraphMarkRunProperties();
            Italic italic98 = new Italic();

            paragraphMarkRunProperties81.Append(italic98);

            paragraphProperties82.Append(spacingBetweenLines82);
            paragraphProperties82.Append(justification73);
            paragraphProperties82.Append(paragraphMarkRunProperties81);

            // Split
            var percentageGraph = new StringBuilder();
            var pgs = awork is null ? work.Subject.CoursePersentagesGraphs : awork.CourseProject.Subject.CoursePersentagesGraphs;
            var y = 1;
            if (pgs != null)
            {
                foreach (var pg in pgs)
                {
                    percentageGraph.AppendFormat(CultureInfo.CreateSpecificCulture("ru-RU"), "{3}. {0} — {1}% — {2:d MMMM yyyy} г.\n", pg.Name, pg.Percentage, pg.Date, y++);
                }
            }

            i = 0;
            var graphs = percentageGraph.ToString().Split('\n');

            Run run133 = new Run();

            RunProperties runProperties131 = new RunProperties();
            Italic italic99 = new Italic();

            runProperties131.Append(italic99);
            Text text118 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text118.Text = graphs.Length > i ? graphs[i++] : "";

            run133.Append(runProperties131);
            run133.Append(text118);

            paragraph82.Append(paragraphProperties82);
            paragraph82.Append(run133);

            tableCell67.Append(tableCellProperties67);
            tableCell67.Append(paragraph82);

            tableRow50.Append(tableRowProperties48);
            tableRow50.Append(tableCell67);

            TableRow tableRow51 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions26 = new TablePropertyExceptions();

            TableBorders tableBorders28 = new TableBorders();
            TopBorder topBorder83 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder67 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder85 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder67 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder28 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder28 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders28.Append(topBorder83);
            tableBorders28.Append(leftBorder67);
            tableBorders28.Append(bottomBorder85);
            tableBorders28.Append(rightBorder67);
            tableBorders28.Append(insideHorizontalBorder28);
            tableBorders28.Append(insideVerticalBorder28);

            tablePropertyExceptions26.Append(tableBorders28);

            TableRowProperties tableRowProperties49 = new TableRowProperties();
            TableRowHeight tableRowHeight49 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties49.Append(tableRowHeight49);

            TableCell tableCell68 = new TableCell();

            TableCellProperties tableCellProperties68 = new TableCellProperties();
            TableCellWidth tableCellWidth68 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan52 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders64 = new TableCellBorders();
            TopBorder topBorder84 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder68 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder86 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder68 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders64.Append(topBorder84);
            tableCellBorders64.Append(leftBorder68);
            tableCellBorders64.Append(bottomBorder86);
            tableCellBorders64.Append(rightBorder68);
            TableCellVerticalAlignment tableCellVerticalAlignment53 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties68.Append(tableCellWidth68);
            tableCellProperties68.Append(gridSpan52);
            tableCellProperties68.Append(tableCellBorders64);
            tableCellProperties68.Append(tableCellVerticalAlignment53);

            Paragraph paragraph83 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties83 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines83 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification74 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties82 = new ParagraphMarkRunProperties();
            Italic italic102 = new Italic();

            paragraphMarkRunProperties82.Append(italic102);

            paragraphProperties83.Append(spacingBetweenLines83);
            paragraphProperties83.Append(justification74);
            paragraphProperties83.Append(paragraphMarkRunProperties82);

            Run run136 = new Run();

            RunProperties runProperties134 = new RunProperties();
            Italic italic103 = new Italic();

            runProperties134.Append(italic103);
            Text text121 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text121.Text = graphs.Length > i ? graphs[i++] : "";

            run136.Append(runProperties134);
            run136.Append(text121);

            paragraph83.Append(paragraphProperties83);
            paragraph83.Append(run136);

            tableCell68.Append(tableCellProperties68);
            tableCell68.Append(paragraph83);

            tableRow51.Append(tablePropertyExceptions26);
            tableRow51.Append(tableRowProperties49);
            tableRow51.Append(tableCell68);

            TableRow tableRow52 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions27 = new TablePropertyExceptions();

            TableBorders tableBorders29 = new TableBorders();
            TopBorder topBorder85 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder69 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder87 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder69 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder29 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder29 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders29.Append(topBorder85);
            tableBorders29.Append(leftBorder69);
            tableBorders29.Append(bottomBorder87);
            tableBorders29.Append(rightBorder69);
            tableBorders29.Append(insideHorizontalBorder29);
            tableBorders29.Append(insideVerticalBorder29);

            tablePropertyExceptions27.Append(tableBorders29);

            TableRowProperties tableRowProperties50 = new TableRowProperties();
            TableRowHeight tableRowHeight50 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties50.Append(tableRowHeight50);

            TableCell tableCell69 = new TableCell();

            TableCellProperties tableCellProperties69 = new TableCellProperties();
            TableCellWidth tableCellWidth69 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan53 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders65 = new TableCellBorders();
            TopBorder topBorder86 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder70 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder88 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder70 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders65.Append(topBorder86);
            tableCellBorders65.Append(leftBorder70);
            tableCellBorders65.Append(bottomBorder88);
            tableCellBorders65.Append(rightBorder70);
            TableCellVerticalAlignment tableCellVerticalAlignment54 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties69.Append(tableCellWidth69);
            tableCellProperties69.Append(gridSpan53);
            tableCellProperties69.Append(tableCellBorders65);
            tableCellProperties69.Append(tableCellVerticalAlignment54);

            Paragraph paragraph84 = new Paragraph() { RsidParagraphMarkRevision = "00867258", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties84 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines84 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification75 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties83 = new ParagraphMarkRunProperties();
            Italic italic106 = new Italic();

            paragraphMarkRunProperties83.Append(italic106);

            paragraphProperties84.Append(spacingBetweenLines84);
            paragraphProperties84.Append(justification75);
            paragraphProperties84.Append(paragraphMarkRunProperties83);

            Run run139 = new Run();

            RunProperties runProperties137 = new RunProperties();
            Italic italic107 = new Italic();

            runProperties137.Append(italic107);
            Text text124 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text124.Text = graphs.Length > i ? graphs[i++] : "";

            run139.Append(runProperties137);
            run139.Append(text124);

            paragraph84.Append(paragraphProperties84);
            paragraph84.Append(run139);

            tableCell69.Append(tableCellProperties69);
            tableCell69.Append(paragraph84);

            tableRow52.Append(tablePropertyExceptions27);
            tableRow52.Append(tableRowProperties50);
            tableRow52.Append(tableCell69);

            TableRow tableRow53 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions28 = new TablePropertyExceptions();

            TableBorders tableBorders30 = new TableBorders();
            TopBorder topBorder87 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder71 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder89 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder71 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder30 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder30 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders30.Append(topBorder87);
            tableBorders30.Append(leftBorder71);
            tableBorders30.Append(bottomBorder89);
            tableBorders30.Append(rightBorder71);
            tableBorders30.Append(insideHorizontalBorder30);
            tableBorders30.Append(insideVerticalBorder30);

            tablePropertyExceptions28.Append(tableBorders30);

            TableRowProperties tableRowProperties51 = new TableRowProperties();
            TableRowHeight tableRowHeight51 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties51.Append(tableRowHeight51);

            TableCell tableCell70 = new TableCell();

            TableCellProperties tableCellProperties70 = new TableCellProperties();
            TableCellWidth tableCellWidth70 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan54 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders66 = new TableCellBorders();
            TopBorder topBorder88 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder72 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder90 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder72 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders66.Append(topBorder88);
            tableCellBorders66.Append(leftBorder72);
            tableCellBorders66.Append(bottomBorder90);
            tableCellBorders66.Append(rightBorder72);
            TableCellVerticalAlignment tableCellVerticalAlignment55 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties70.Append(tableCellWidth70);
            tableCellProperties70.Append(gridSpan54);
            tableCellProperties70.Append(tableCellBorders66);
            tableCellProperties70.Append(tableCellVerticalAlignment55);

            Paragraph paragraph85 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties85 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines85 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification76 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties84 = new ParagraphMarkRunProperties();
            Italic italic110 = new Italic();
            Languages languages25 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties84.Append(italic110);
            paragraphMarkRunProperties84.Append(languages25);

            paragraphProperties85.Append(spacingBetweenLines85);
            paragraphProperties85.Append(justification76);
            paragraphProperties85.Append(paragraphMarkRunProperties84);

            Run run142 = new Run();

            RunProperties runProperties140 = new RunProperties();
            Italic italic111 = new Italic();
            Languages languages26 = new Languages() { Val = "en-US" };

            runProperties140.Append(italic111);
            runProperties140.Append(languages26);
            Text text127 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text127.Text = graphs.Length > i ? graphs[i++] : "";

            run142.Append(runProperties140);
            run142.Append(text127);

            paragraph85.Append(paragraphProperties85);
            paragraph85.Append(run142);

            tableCell70.Append(tableCellProperties70);
            tableCell70.Append(paragraph85);

            tableRow53.Append(tablePropertyExceptions28);
            tableRow53.Append(tableRowProperties51);
            tableRow53.Append(tableCell70);

            TableRow tableRow54 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TableRowProperties tableRowProperties52 = new TableRowProperties();
            TableRowHeight tableRowHeight52 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties52.Append(tableRowHeight52);

            TableCell tableCell71 = new TableCell();

            TableCellProperties tableCellProperties71 = new TableCellProperties();
            TableCellWidth tableCellWidth71 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan55 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders67 = new TableCellBorders();
            TopBorder topBorder89 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder91 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders67.Append(topBorder89);
            tableCellBorders67.Append(bottomBorder91);
            TableCellVerticalAlignment tableCellVerticalAlignment56 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties71.Append(tableCellWidth71);
            tableCellProperties71.Append(gridSpan55);
            tableCellProperties71.Append(tableCellBorders67);
            tableCellProperties71.Append(tableCellVerticalAlignment56);

            Paragraph paragraph86 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties86 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines86 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification77 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties85 = new ParagraphMarkRunProperties();
            Italic italic112 = new Italic();
            Languages languages27 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties85.Append(italic112);
            paragraphMarkRunProperties85.Append(languages27);

            paragraphProperties86.Append(spacingBetweenLines86);
            paragraphProperties86.Append(justification77);
            paragraphProperties86.Append(paragraphMarkRunProperties85);

            Run run143 = new Run();

            RunProperties runProperties141 = new RunProperties();
            Italic italic113 = new Italic();
            Languages languages28 = new Languages() { Val = "en-US" };

            runProperties141.Append(italic113);
            runProperties141.Append(languages28);
            Text text128 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text128.Text = graphs.Length > i ? graphs[i++] : "";

            run143.Append(runProperties141);
            run143.Append(text128);

            paragraph86.Append(paragraphProperties86);
            paragraph86.Append(run143);

            tableCell71.Append(tableCellProperties71);
            tableCell71.Append(paragraph86);

            tableRow54.Append(tableRowProperties52);
            tableRow54.Append(tableCell71);

            TableRow tableRow55 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions29 = new TablePropertyExceptions();

            TableBorders tableBorders31 = new TableBorders();
            TopBorder topBorder90 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder73 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder92 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder73 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder31 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder31 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders31.Append(topBorder90);
            tableBorders31.Append(leftBorder73);
            tableBorders31.Append(bottomBorder92);
            tableBorders31.Append(rightBorder73);
            tableBorders31.Append(insideHorizontalBorder31);
            tableBorders31.Append(insideVerticalBorder31);

            tablePropertyExceptions29.Append(tableBorders31);

            TableRowProperties tableRowProperties53 = new TableRowProperties();
            TableRowHeight tableRowHeight53 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties53.Append(tableRowHeight53);

            TableCell tableCell72 = new TableCell();

            TableCellProperties tableCellProperties72 = new TableCellProperties();
            TableCellWidth tableCellWidth72 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan56 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders68 = new TableCellBorders();
            TopBorder topBorder91 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder74 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder93 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder74 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders68.Append(topBorder91);
            tableCellBorders68.Append(leftBorder74);
            tableCellBorders68.Append(bottomBorder93);
            tableCellBorders68.Append(rightBorder74);
            TableCellVerticalAlignment tableCellVerticalAlignment57 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties72.Append(tableCellWidth72);
            tableCellProperties72.Append(gridSpan56);
            tableCellProperties72.Append(tableCellBorders68);
            tableCellProperties72.Append(tableCellVerticalAlignment57);

            Paragraph paragraph87 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties87 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines87 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification78 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties86 = new ParagraphMarkRunProperties();
            Italic italic114 = new Italic();
            Languages languages29 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties86.Append(italic114);
            paragraphMarkRunProperties86.Append(languages29);

            paragraphProperties87.Append(spacingBetweenLines87);
            paragraphProperties87.Append(justification78);
            paragraphProperties87.Append(paragraphMarkRunProperties86);

            Run run144 = new Run();

            RunProperties runProperties142 = new RunProperties();
            Italic italic115 = new Italic();
            Languages languages30 = new Languages() { Val = "en-US" };

            runProperties142.Append(italic115);
            runProperties142.Append(languages30);
            Text text129 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text129.Text = graphs.Length > i ? graphs[i++] : "";

            run144.Append(runProperties142);
            run144.Append(text129);

            paragraph87.Append(paragraphProperties87);
            paragraph87.Append(run144);

            tableCell72.Append(tableCellProperties72);
            tableCell72.Append(paragraph87);

            tableRow55.Append(tablePropertyExceptions29);
            tableRow55.Append(tableRowProperties53);
            tableRow55.Append(tableCell72);

            TableRow tableRow56 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions30 = new TablePropertyExceptions();

            TableBorders tableBorders32 = new TableBorders();
            TopBorder topBorder92 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder75 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder94 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder75 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder32 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder32 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders32.Append(topBorder92);
            tableBorders32.Append(leftBorder75);
            tableBorders32.Append(bottomBorder94);
            tableBorders32.Append(rightBorder75);
            tableBorders32.Append(insideHorizontalBorder32);
            tableBorders32.Append(insideVerticalBorder32);

            tablePropertyExceptions30.Append(tableBorders32);

            TableRowProperties tableRowProperties54 = new TableRowProperties();
            TableRowHeight tableRowHeight54 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties54.Append(tableRowHeight54);

            TableCell tableCell73 = new TableCell();

            TableCellProperties tableCellProperties73 = new TableCellProperties();
            TableCellWidth tableCellWidth73 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan57 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders69 = new TableCellBorders();
            TopBorder topBorder93 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder76 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder95 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder76 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders69.Append(topBorder93);
            tableCellBorders69.Append(leftBorder76);
            tableCellBorders69.Append(bottomBorder95);
            tableCellBorders69.Append(rightBorder76);
            TableCellVerticalAlignment tableCellVerticalAlignment58 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties73.Append(tableCellWidth73);
            tableCellProperties73.Append(gridSpan57);
            tableCellProperties73.Append(tableCellBorders69);
            tableCellProperties73.Append(tableCellVerticalAlignment58);

            Paragraph paragraph88 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties88 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines88 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification79 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties87 = new ParagraphMarkRunProperties();
            Italic italic116 = new Italic();
            Languages languages31 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties87.Append(italic116);
            paragraphMarkRunProperties87.Append(languages31);

            paragraphProperties88.Append(spacingBetweenLines88);
            paragraphProperties88.Append(justification79);
            paragraphProperties88.Append(paragraphMarkRunProperties87);

            Run run145 = new Run();

            RunProperties runProperties143 = new RunProperties();
            Italic italic117 = new Italic();
            Languages languages32 = new Languages() { Val = "en-US" };

            runProperties143.Append(italic117);
            runProperties143.Append(languages32);
            Text text130 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text130.Text = graphs.Length > i ? graphs[i++] : "";

            run145.Append(runProperties143);
            run145.Append(text130);

            paragraph88.Append(paragraphProperties88);
            paragraph88.Append(run145);

            tableCell73.Append(tableCellProperties73);
            tableCell73.Append(paragraph88);

            tableRow56.Append(tablePropertyExceptions30);
            tableRow56.Append(tableRowProperties54);
            tableRow56.Append(tableCell73);

            TableRow tableRow57 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "00DD28CF", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions31 = new TablePropertyExceptions();

            TableBorders tableBorders33 = new TableBorders();
            TopBorder topBorder94 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder77 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder96 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder77 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder33 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder33 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders33.Append(topBorder94);
            tableBorders33.Append(leftBorder77);
            tableBorders33.Append(bottomBorder96);
            tableBorders33.Append(rightBorder77);
            tableBorders33.Append(insideHorizontalBorder33);
            tableBorders33.Append(insideVerticalBorder33);

            tablePropertyExceptions31.Append(tableBorders33);

            TableRowProperties tableRowProperties55 = new TableRowProperties();
            TableRowHeight tableRowHeight55 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties55.Append(tableRowHeight55);

            TableCell tableCell74 = new TableCell();

            TableCellProperties tableCellProperties74 = new TableCellProperties();
            TableCellWidth tableCellWidth74 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan58 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders70 = new TableCellBorders();
            TopBorder topBorder95 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder78 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder97 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder78 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders70.Append(topBorder95);
            tableCellBorders70.Append(leftBorder78);
            tableCellBorders70.Append(bottomBorder97);
            tableCellBorders70.Append(rightBorder78);
            TableCellVerticalAlignment tableCellVerticalAlignment59 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties74.Append(tableCellWidth74);
            tableCellProperties74.Append(gridSpan58);
            tableCellProperties74.Append(tableCellBorders70);
            tableCellProperties74.Append(tableCellVerticalAlignment59);

            Paragraph paragraph89 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "00DD28CF", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties89 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines89 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification80 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties88 = new ParagraphMarkRunProperties();
            Italic italic118 = new Italic();
            Languages languages33 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties88.Append(italic118);
            paragraphMarkRunProperties88.Append(languages33);

            paragraphProperties89.Append(spacingBetweenLines89);
            paragraphProperties89.Append(justification80);
            paragraphProperties89.Append(paragraphMarkRunProperties88);

            Run run146 = new Run();

            RunProperties runProperties144 = new RunProperties();
            Italic italic119 = new Italic();
            Languages languages34 = new Languages() { Val = "en-US" };

            runProperties144.Append(italic119);
            runProperties144.Append(languages34);
            Text text131 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text131.Text = graphs.Length > i ? graphs[i++] : "";

            run146.Append(runProperties144);
            run146.Append(text131);

            paragraph89.Append(paragraphProperties89);
            paragraph89.Append(run146);

            tableCell74.Append(tableCellProperties74);
            tableCell74.Append(paragraph89);

            tableRow57.Append(tablePropertyExceptions31);
            tableRow57.Append(tableRowProperties55);
            tableRow57.Append(tableCell74);

            TableRow tableRow58 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "000806E4", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions32 = new TablePropertyExceptions();

            TableBorders tableBorders34 = new TableBorders();
            TopBorder topBorder96 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder79 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder98 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder79 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder34 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder34 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders34.Append(topBorder96);
            tableBorders34.Append(leftBorder79);
            tableBorders34.Append(bottomBorder98);
            tableBorders34.Append(rightBorder79);
            tableBorders34.Append(insideHorizontalBorder34);
            tableBorders34.Append(insideVerticalBorder34);

            tablePropertyExceptions32.Append(tableBorders34);

            TableRowProperties tableRowProperties56 = new TableRowProperties();
            TableRowHeight tableRowHeight56 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties56.Append(tableRowHeight56);

            TableCell tableCell75 = new TableCell();

            TableCellProperties tableCellProperties75 = new TableCellProperties();
            TableCellWidth tableCellWidth75 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan59 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders71 = new TableCellBorders();
            TopBorder topBorder97 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder80 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder99 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder80 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders71.Append(topBorder97);
            tableCellBorders71.Append(leftBorder80);
            tableCellBorders71.Append(bottomBorder99);
            tableCellBorders71.Append(rightBorder80);
            TableCellVerticalAlignment tableCellVerticalAlignment60 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties75.Append(tableCellWidth75);
            tableCellProperties75.Append(gridSpan59);
            tableCellProperties75.Append(tableCellBorders71);
            tableCellProperties75.Append(tableCellVerticalAlignment60);

            Paragraph paragraph90 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "000806E4", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties90 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines90 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification81 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties89 = new ParagraphMarkRunProperties();
            Italic italic120 = new Italic();
            Languages languages35 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties89.Append(italic120);
            paragraphMarkRunProperties89.Append(languages35);

            paragraphProperties90.Append(spacingBetweenLines90);
            paragraphProperties90.Append(justification81);
            paragraphProperties90.Append(paragraphMarkRunProperties89);

            Run run147 = new Run();

            RunProperties runProperties145 = new RunProperties();
            Italic italic121 = new Italic();
            Languages languages36 = new Languages() { Val = "en-US" };

            runProperties145.Append(italic121);
            runProperties145.Append(languages36);
            Text text132 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text132.Text = graphs.Length > i ? graphs[i++] : "";

            run147.Append(runProperties145);
            run147.Append(text132);

            paragraph90.Append(paragraphProperties90);
            paragraph90.Append(run147);

            tableCell75.Append(tableCellProperties75);
            tableCell75.Append(paragraph90);

            tableRow58.Append(tablePropertyExceptions32);
            tableRow58.Append(tableRowProperties56);
            tableRow58.Append(tableCell75);

            TableRow tableRow59 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "000806E4", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions33 = new TablePropertyExceptions();

            TableBorders tableBorders35 = new TableBorders();
            TopBorder topBorder98 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder81 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder100 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder81 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder35 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder35 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders35.Append(topBorder98);
            tableBorders35.Append(leftBorder81);
            tableBorders35.Append(bottomBorder100);
            tableBorders35.Append(rightBorder81);
            tableBorders35.Append(insideHorizontalBorder35);
            tableBorders35.Append(insideVerticalBorder35);

            tablePropertyExceptions33.Append(tableBorders35);

            TableRowProperties tableRowProperties57 = new TableRowProperties();
            TableRowHeight tableRowHeight57 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties57.Append(tableRowHeight57);

            TableCell tableCell76 = new TableCell();

            TableCellProperties tableCellProperties76 = new TableCellProperties();
            TableCellWidth tableCellWidth76 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan60 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders72 = new TableCellBorders();
            TopBorder topBorder99 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder82 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder101 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder82 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders72.Append(topBorder99);
            tableCellBorders72.Append(leftBorder82);
            tableCellBorders72.Append(bottomBorder101);
            tableCellBorders72.Append(rightBorder82);
            TableCellVerticalAlignment tableCellVerticalAlignment61 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties76.Append(tableCellWidth76);
            tableCellProperties76.Append(gridSpan60);
            tableCellProperties76.Append(tableCellBorders72);
            tableCellProperties76.Append(tableCellVerticalAlignment61);

            Paragraph paragraph91 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "000806E4", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties91 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines91 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification82 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties90 = new ParagraphMarkRunProperties();
            Italic italic122 = new Italic();
            Languages languages37 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties90.Append(italic122);
            paragraphMarkRunProperties90.Append(languages37);

            paragraphProperties91.Append(spacingBetweenLines91);
            paragraphProperties91.Append(justification82);
            paragraphProperties91.Append(paragraphMarkRunProperties90);

            Run run148 = new Run();

            RunProperties runProperties146 = new RunProperties();
            Italic italic123 = new Italic();
            Languages languages38 = new Languages() { Val = "en-US" };

            runProperties146.Append(italic123);
            runProperties146.Append(languages38);
            Text text133 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text133.Text = graphs.Length > i ? graphs[i++] : "";

            run148.Append(runProperties146);
            run148.Append(text133);

            paragraph91.Append(paragraphProperties91);
            paragraph91.Append(run148);

            tableCell76.Append(tableCellProperties76);
            tableCell76.Append(paragraph91);
            BookmarkStart bookmarkStart1 = new BookmarkStart() { Name = "_GoBack", Id = "0" };
            BookmarkEnd bookmarkEnd1 = new BookmarkEnd() { Id = "0" };

            tableRow59.Append(tablePropertyExceptions33);
            tableRow59.Append(tableRowProperties57);
            tableRow59.Append(tableCell76);
            tableRow59.Append(bookmarkStart1);
            tableRow59.Append(bookmarkEnd1);

            TableRow tableRow60 = new TableRow() { RsidTableRowMarkRevision = "00867258", RsidTableRowAddition = "000806E4", RsidTableRowProperties = "00ED0CB2" };

            TablePropertyExceptions tablePropertyExceptions34 = new TablePropertyExceptions();

            TableBorders tableBorders36 = new TableBorders();
            TopBorder topBorder100 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder83 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder102 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder83 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder36 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder36 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders36.Append(topBorder100);
            tableBorders36.Append(leftBorder83);
            tableBorders36.Append(bottomBorder102);
            tableBorders36.Append(rightBorder83);
            tableBorders36.Append(insideHorizontalBorder36);
            tableBorders36.Append(insideVerticalBorder36);

            tablePropertyExceptions34.Append(tableBorders36);

            TableRowProperties tableRowProperties58 = new TableRowProperties();
            TableRowHeight tableRowHeight58 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties58.Append(tableRowHeight58);

            TableCell tableCell77 = new TableCell();

            TableCellProperties tableCellProperties77 = new TableCellProperties();
            TableCellWidth tableCellWidth77 = new TableCellWidth() { Width = "9570", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan61 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders73 = new TableCellBorders();
            TopBorder topBorder101 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder84 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder103 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder84 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders73.Append(topBorder101);
            tableCellBorders73.Append(leftBorder84);
            tableCellBorders73.Append(bottomBorder103);
            tableCellBorders73.Append(rightBorder84);
            TableCellVerticalAlignment tableCellVerticalAlignment62 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties77.Append(tableCellWidth77);
            tableCellProperties77.Append(gridSpan61);
            tableCellProperties77.Append(tableCellBorders73);
            tableCellProperties77.Append(tableCellVerticalAlignment62);

            Paragraph paragraph92 = new Paragraph() { RsidParagraphMarkRevision = "00123217", RsidParagraphAddition = "000806E4", RsidParagraphProperties = "0062700D", RsidRunAdditionDefault = "00123217" };

            ParagraphProperties paragraphProperties92 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines92 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification83 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties91 = new ParagraphMarkRunProperties();
            Italic italic124 = new Italic();
            Languages languages39 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties91.Append(italic124);
            paragraphMarkRunProperties91.Append(languages39);

            paragraphProperties92.Append(spacingBetweenLines92);
            paragraphProperties92.Append(justification83);
            paragraphProperties92.Append(paragraphMarkRunProperties91);

            Run run149 = new Run();

            RunProperties runProperties147 = new RunProperties();
            Italic italic125 = new Italic();
            Languages languages40 = new Languages() { Val = "en-US" };

            runProperties147.Append(italic125);
            runProperties147.Append(languages40);
            Text text134 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text134.Text = graphs.Length > i ? graphs[i++] : "";

            run149.Append(runProperties147);
            run149.Append(text134);

            paragraph92.Append(paragraphProperties92);
            paragraph92.Append(run149);

            tableCell77.Append(tableCellProperties77);
            tableCell77.Append(paragraph92);

            tableRow60.Append(tablePropertyExceptions34);
            tableRow60.Append(tableRowProperties58);
            tableRow60.Append(tableCell77);

            table3.Append(tableProperties3);
            table3.Append(tableGrid3);
            table3.Append(tableRow4);
            table3.Append(tableRow5);
            table3.Append(tableRow6);
            table3.Append(tableRow7);
            table3.Append(tableRow8);
            table3.Append(tableRow9);
            table3.Append(tableRow10);
            table3.Append(tableRow11);
            table3.Append(tableRow12);
            table3.Append(tableRow13);
            table3.Append(tableRow14);
            table3.Append(tableRow15);
            table3.Append(tableRow16);
            table3.Append(tableRow17);
            table3.Append(tableRow18);
            table3.Append(tableRow19);
            table3.Append(tableRow20);
            table3.Append(tableRow21);
            table3.Append(tableRow22);
            table3.Append(tableRow23);
            table3.Append(tableRow24);
            table3.Append(tableRow25);
            table3.Append(tableRow26);
            table3.Append(tableRow27);
            table3.Append(tableRow28);
            table3.Append(tableRow29);
            table3.Append(tableRow30);
            table3.Append(tableRow31);
            table3.Append(tableRow32);
            table3.Append(tableRow33);
            table3.Append(tableRow34);
            table3.Append(tableRow35);
            table3.Append(tableRow36);
            table3.Append(tableRow37);
            table3.Append(tableRow38);
            table3.Append(tableRow39);
            table3.Append(tableRow40);
            table3.Append(tableRow41);
            table3.Append(tableRow42);
            table3.Append(tableRow43);
            table3.Append(tableRow44);
            table3.Append(tableRow45);
            table3.Append(tableRow46);
            table3.Append(tableRow47);
            table3.Append(tableRow48);
            table3.Append(tableRow49);
            table3.Append(tableRow50);
            table3.Append(tableRow51);
            table3.Append(tableRow52);
            table3.Append(tableRow53);
            table3.Append(tableRow54);
            table3.Append(tableRow55);
            table3.Append(tableRow56);
            table3.Append(tableRow57);
            table3.Append(tableRow58);
            table3.Append(tableRow59);
            table3.Append(tableRow60);

            Paragraph paragraph93 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "00CF792B", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "00CF792B" };

            ParagraphProperties paragraphProperties93 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines93 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties93.Append(spacingBetweenLines93);

            paragraph93.Append(paragraphProperties93);

            Paragraph paragraph94 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties94 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines94 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties94.Append(spacingBetweenLines94);

            paragraph94.Append(paragraphProperties94);

            Paragraph paragraph95 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties95 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines95 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties95.Append(spacingBetweenLines95);

            paragraph95.Append(paragraphProperties95);

            Paragraph paragraph96 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties96 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines96 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties96.Append(spacingBetweenLines96);

            paragraph96.Append(paragraphProperties96);

            Paragraph paragraph97 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties97 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines97 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties97.Append(spacingBetweenLines97);

            paragraph97.Append(paragraphProperties97);

            Table table4 = new Table();

            TableProperties tableProperties4 = new TableProperties();
            TableWidth tableWidth4 = new TableWidth() { Width = "9606", Type = TableWidthUnitValues.Dxa };
            TableLook tableLook4 = new TableLook() { Val = "01E0" };

            tableProperties4.Append(tableWidth4);
            tableProperties4.Append(tableLook4);

            TableGrid tableGrid4 = new TableGrid();
            GridColumn gridColumn17 = new GridColumn() { Width = "3227" };
            GridColumn gridColumn18 = new GridColumn() { Width = "3402" };
            GridColumn gridColumn19 = new GridColumn() { Width = "567" };
            GridColumn gridColumn20 = new GridColumn() { Width = "2410" };

            tableGrid4.Append(gridColumn17);
            tableGrid4.Append(gridColumn18);
            tableGrid4.Append(gridColumn19);
            tableGrid4.Append(gridColumn20);

            TableRow tableRow61 = new TableRow() { RsidTableRowMarkRevision = "00DD5CF8", RsidTableRowAddition = "0078633D", RsidTableRowProperties = "00A15D69" };

            TableCell tableCell78 = new TableCell();

            TableCellProperties tableCellProperties78 = new TableCellProperties();
            TableCellWidth tableCellWidth78 = new TableCellWidth() { Width = "3227", Type = TableWidthUnitValues.Dxa };
            Shading shading14 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties78.Append(tableCellWidth78);
            tableCellProperties78.Append(shading14);

            Paragraph paragraph98 = new Paragraph() { RsidParagraphMarkRevision = "000806E4", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties98 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines98 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties98.Append(spacingBetweenLines98);

            Run run150 = new Run() { RsidRunProperties = "000806E4" };
            Text text135 = new Text();
            text135.Text = "Руководитель";

            run150.Append(text135);

            paragraph98.Append(paragraphProperties98);
            paragraph98.Append(run150);

            tableCell78.Append(tableCellProperties78);
            tableCell78.Append(paragraph98);

            TableCell tableCell79 = new TableCell();

            TableCellProperties tableCellProperties79 = new TableCellProperties();
            TableCellWidth tableCellWidth79 = new TableCellWidth() { Width = "3402", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders74 = new TableCellBorders();
            BottomBorder bottomBorder104 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders74.Append(bottomBorder104);
            Shading shading15 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties79.Append(tableCellWidth79);
            tableCellProperties79.Append(tableCellBorders74);
            tableCellProperties79.Append(shading15);

            Paragraph paragraph99 = new Paragraph() { RsidParagraphMarkRevision = "00590E10", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00FB35FE", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties99 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines99 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification84 = new Justification() { Val = JustificationValues.Right };

            ParagraphMarkRunProperties paragraphMarkRunProperties92 = new ParagraphMarkRunProperties();
            Italic italic126 = new Italic();

            paragraphMarkRunProperties92.Append(italic126);

            paragraphProperties99.Append(spacingBetweenLines99);
            paragraphProperties99.Append(justification84);
            paragraphProperties99.Append(paragraphMarkRunProperties92);

            Run run151 = new Run();

            RunProperties runProperties148 = new RunProperties();
            Italic italic127 = new Italic();

            runProperties148.Append(italic127);
            Text text136 = new Text();
            text136.Text = dateStart ?? "";

            run151.Append(runProperties148);
            run151.Append(text136);

            paragraph99.Append(paragraphProperties99);
            paragraph99.Append(run151);

            tableCell79.Append(tableCellProperties79);
            tableCell79.Append(paragraph99);

            TableCell tableCell80 = new TableCell();

            TableCellProperties tableCellProperties80 = new TableCellProperties();
            TableCellWidth tableCellWidth80 = new TableCellWidth() { Width = "567", Type = TableWidthUnitValues.Dxa };
            Shading shading16 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties80.Append(tableCellWidth80);
            tableCellProperties80.Append(shading16);

            Paragraph paragraph100 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties100 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines100 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties93 = new ParagraphMarkRunProperties();
            Bold bold2 = new Bold();

            paragraphMarkRunProperties93.Append(bold2);

            paragraphProperties100.Append(spacingBetweenLines100);
            paragraphProperties100.Append(paragraphMarkRunProperties93);

            paragraph100.Append(paragraphProperties100);

            tableCell80.Append(tableCellProperties80);
            tableCell80.Append(paragraph100);

            TableCell tableCell81 = new TableCell();

            TableCellProperties tableCellProperties81 = new TableCellProperties();
            TableCellWidth tableCellWidth81 = new TableCellWidth() { Width = "2410", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders75 = new TableCellBorders();
            BottomBorder bottomBorder105 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders75.Append(bottomBorder105);
            Shading shading17 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties81.Append(tableCellWidth81);
            tableCellProperties81.Append(tableCellBorders75);
            tableCellProperties81.Append(shading17);

            Paragraph paragraph101 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00CF0375", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties101 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines101 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification85 = new Justification() { Val = JustificationValues.Center };

            paragraphProperties101.Append(spacingBetweenLines101);
            paragraphProperties101.Append(justification85);

            Run run152 = new Run();
            Text text137 = new Text();
            text137.Text = lecturer;

            run152.Append(text137);

            paragraph101.Append(paragraphProperties101);
            paragraph101.Append(run152);

            tableCell81.Append(tableCellProperties81);
            tableCell81.Append(paragraph101);

            tableRow61.Append(tableCell78);
            tableRow61.Append(tableCell79);
            tableRow61.Append(tableCell80);
            tableRow61.Append(tableCell81);

            TableRow tableRow62 = new TableRow() { RsidTableRowMarkRevision = "00DD5CF8", RsidTableRowAddition = "0078633D", RsidTableRowProperties = "00A15D69" };

            TableCell tableCell82 = new TableCell();

            TableCellProperties tableCellProperties82 = new TableCellProperties();
            TableCellWidth tableCellWidth82 = new TableCellWidth() { Width = "3227", Type = TableWidthUnitValues.Dxa };
            Shading shading18 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties82.Append(tableCellWidth82);
            tableCellProperties82.Append(shading18);

            Paragraph paragraph102 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties102 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines102 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            paragraphProperties102.Append(spacingBetweenLines102);

            paragraph102.Append(paragraphProperties102);

            tableCell82.Append(tableCellProperties82);
            tableCell82.Append(paragraph102);

            TableCell tableCell83 = new TableCell();

            TableCellProperties tableCellProperties83 = new TableCellProperties();
            TableCellWidth tableCellWidth83 = new TableCellWidth() { Width = "3402", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders76 = new TableCellBorders();
            TopBorder topBorder102 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders76.Append(topBorder102);
            Shading shading19 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties83.Append(tableCellWidth83);
            tableCellProperties83.Append(tableCellBorders76);
            tableCellProperties83.Append(shading19);

            Paragraph paragraph103 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties103 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines103 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification86 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties94 = new ParagraphMarkRunProperties();
            VerticalTextAlignment verticalTextAlignment2 = new VerticalTextAlignment() { Val = VerticalPositionValues.Superscript };

            paragraphMarkRunProperties94.Append(verticalTextAlignment2);

            paragraphProperties103.Append(spacingBetweenLines103);
            paragraphProperties103.Append(justification86);
            paragraphProperties103.Append(paragraphMarkRunProperties94);

            Run run153 = new Run() { RsidRunProperties = "0078633D" };

            RunProperties runProperties149 = new RunProperties();
            VerticalTextAlignment verticalTextAlignment3 = new VerticalTextAlignment() { Val = VerticalPositionValues.Superscript };

            runProperties149.Append(verticalTextAlignment3);
            Text text138 = new Text();
            text138.Text = "подпись, дата";

            run153.Append(runProperties149);
            run153.Append(text138);

            paragraph103.Append(paragraphProperties103);
            paragraph103.Append(run153);

            tableCell83.Append(tableCellProperties83);
            tableCell83.Append(paragraph103);

            TableCell tableCell84 = new TableCell();

            TableCellProperties tableCellProperties84 = new TableCellProperties();
            TableCellWidth tableCellWidth84 = new TableCellWidth() { Width = "567", Type = TableWidthUnitValues.Dxa };
            Shading shading20 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties84.Append(tableCellWidth84);
            tableCellProperties84.Append(shading20);

            Paragraph paragraph104 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties104 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines104 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties95 = new ParagraphMarkRunProperties();
            Bold bold3 = new Bold();

            paragraphMarkRunProperties95.Append(bold3);

            paragraphProperties104.Append(spacingBetweenLines104);
            paragraphProperties104.Append(paragraphMarkRunProperties95);

            paragraph104.Append(paragraphProperties104);

            tableCell84.Append(tableCellProperties84);
            tableCell84.Append(paragraph104);

            TableCell tableCell85 = new TableCell();

            TableCellProperties tableCellProperties85 = new TableCellProperties();
            TableCellWidth tableCellWidth85 = new TableCellWidth() { Width = "2410", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders77 = new TableCellBorders();
            TopBorder topBorder103 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders77.Append(topBorder103);
            Shading shading21 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties85.Append(tableCellWidth85);
            tableCellProperties85.Append(tableCellBorders77);
            tableCellProperties85.Append(shading21);

            Paragraph paragraph105 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties105 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines105 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification87 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties96 = new ParagraphMarkRunProperties();
            FontSize fontSize111 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript115 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties96.Append(fontSize111);
            paragraphMarkRunProperties96.Append(fontSizeComplexScript115);

            paragraphProperties105.Append(spacingBetweenLines105);
            paragraphProperties105.Append(justification87);
            paragraphProperties105.Append(paragraphMarkRunProperties96);

            Run run154 = new Run() { RsidRunProperties = "0078633D" };

            RunProperties runProperties150 = new RunProperties();
            FontSize fontSize112 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript116 = new FontSizeComplexScript() { Val = "16" };

            runProperties150.Append(fontSize112);
            runProperties150.Append(fontSizeComplexScript116);
            Text text139 = new Text();
            text139.Text = "инициалы, фамилия";

            run154.Append(runProperties150);
            run154.Append(text139);

            paragraph105.Append(paragraphProperties105);
            paragraph105.Append(run154);

            tableCell85.Append(tableCellProperties85);
            tableCell85.Append(paragraph105);

            tableRow62.Append(tableCell82);
            tableRow62.Append(tableCell83);
            tableRow62.Append(tableCell84);
            tableRow62.Append(tableCell85);

            table4.Append(tableProperties4);
            table4.Append(tableGrid4);
            table4.Append(tableRow61);
            table4.Append(tableRow62);

            Paragraph paragraph106 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties106 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines106 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties97 = new ParagraphMarkRunProperties();
            FontSize fontSize113 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript117 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties97.Append(fontSize113);
            paragraphMarkRunProperties97.Append(fontSizeComplexScript117);

            paragraphProperties106.Append(spacingBetweenLines106);
            paragraphProperties106.Append(paragraphMarkRunProperties97);

            paragraph106.Append(paragraphProperties106);

            Table table5 = new Table();

            TableProperties tableProperties5 = new TableProperties();
            TableWidth tableWidth5 = new TableWidth() { Width = "9606", Type = TableWidthUnitValues.Dxa };

            TableBorders tableBorders37 = new TableBorders();
            TopBorder topBorder104 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder85 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder106 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder85 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder37 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder37 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders37.Append(topBorder104);
            tableBorders37.Append(leftBorder85);
            tableBorders37.Append(bottomBorder106);
            tableBorders37.Append(rightBorder85);
            tableBorders37.Append(insideHorizontalBorder37);
            tableBorders37.Append(insideVerticalBorder37);
            TableLook tableLook5 = new TableLook() { Val = "01E0" };

            tableProperties5.Append(tableWidth5);
            tableProperties5.Append(tableBorders37);
            tableProperties5.Append(tableLook5);

            TableGrid tableGrid5 = new TableGrid();
            GridColumn gridColumn21 = new GridColumn() { Width = "3168" };
            GridColumn gridColumn22 = new GridColumn() { Width = "3461" };
            GridColumn gridColumn23 = new GridColumn() { Width = "567" };
            GridColumn gridColumn24 = new GridColumn() { Width = "2410" };

            tableGrid5.Append(gridColumn21);
            tableGrid5.Append(gridColumn22);
            tableGrid5.Append(gridColumn23);
            tableGrid5.Append(gridColumn24);

            TableRow tableRow63 = new TableRow() { RsidTableRowMarkRevision = "0078633D", RsidTableRowAddition = "0078633D", RsidTableRowProperties = "00A15D69" };

            TableRowProperties tableRowProperties59 = new TableRowProperties();
            TableRowHeight tableRowHeight59 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties59.Append(tableRowHeight59);

            TableCell tableCell86 = new TableCell();

            TableCellProperties tableCellProperties86 = new TableCellProperties();
            TableCellWidth tableCellWidth86 = new TableCellWidth() { Width = "3168", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders78 = new TableCellBorders();
            TopBorder topBorder105 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder86 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder107 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder86 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders78.Append(topBorder105);
            tableCellBorders78.Append(leftBorder86);
            tableCellBorders78.Append(bottomBorder107);
            tableCellBorders78.Append(rightBorder86);
            Shading shading22 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment63 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties86.Append(tableCellWidth86);
            tableCellProperties86.Append(tableCellBorders78);
            tableCellProperties86.Append(shading22);
            tableCellProperties86.Append(tableCellVerticalAlignment63);

            Paragraph paragraph107 = new Paragraph() { RsidParagraphMarkRevision = "00FB35FE", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "000806E4" };

            ParagraphProperties paragraphProperties107 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines107 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification88 = new Justification() { Val = JustificationValues.Left };

            paragraphProperties107.Append(spacingBetweenLines107);
            paragraphProperties107.Append(justification88);

            Run run155 = new Run() { RsidRunProperties = "00FB35FE" };
            Text text140 = new Text();
            text140.Text = "Подпись обучающегося";

            run155.Append(text140);

            paragraph107.Append(paragraphProperties107);
            paragraph107.Append(run155);

            tableCell86.Append(tableCellProperties86);
            tableCell86.Append(paragraph107);

            TableCell tableCell87 = new TableCell();

            TableCellProperties tableCellProperties87 = new TableCellProperties();
            TableCellWidth tableCellWidth87 = new TableCellWidth() { Width = "3461", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders79 = new TableCellBorders();
            TopBorder topBorder106 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder87 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder108 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder87 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders79.Append(topBorder106);
            tableCellBorders79.Append(leftBorder87);
            tableCellBorders79.Append(bottomBorder108);
            tableCellBorders79.Append(rightBorder87);
            Shading shading23 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment64 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties87.Append(tableCellWidth87);
            tableCellProperties87.Append(tableCellBorders79);
            tableCellProperties87.Append(shading23);
            tableCellProperties87.Append(tableCellVerticalAlignment64);

            Paragraph paragraph108 = new Paragraph() { RsidParagraphMarkRevision = "00FB35FE", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00FB35FE", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties108 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines108 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification89 = new Justification() { Val = JustificationValues.Right };

            ParagraphMarkRunProperties paragraphMarkRunProperties98 = new ParagraphMarkRunProperties();
            Italic italic128 = new Italic();

            paragraphMarkRunProperties98.Append(italic128);

            paragraphProperties108.Append(spacingBetweenLines108);
            paragraphProperties108.Append(justification89);
            paragraphProperties108.Append(paragraphMarkRunProperties98);

            Run run156 = new Run();

            RunProperties runProperties151 = new RunProperties();
            Italic italic129 = new Italic();

            runProperties151.Append(italic129);
            Text text141 = new Text();
            text141.Text = dateStart ?? "";

            run156.Append(runProperties151);
            run156.Append(text141);

            paragraph108.Append(paragraphProperties108);
            paragraph108.Append(run156);

            tableCell87.Append(tableCellProperties87);
            tableCell87.Append(paragraph108);

            TableCell tableCell88 = new TableCell();

            TableCellProperties tableCellProperties88 = new TableCellProperties();
            TableCellWidth tableCellWidth88 = new TableCellWidth() { Width = "567", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders80 = new TableCellBorders();
            TopBorder topBorder107 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder88 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder109 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder88 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders80.Append(topBorder107);
            tableCellBorders80.Append(leftBorder88);
            tableCellBorders80.Append(bottomBorder109);
            tableCellBorders80.Append(rightBorder88);
            Shading shading24 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment65 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties88.Append(tableCellWidth88);
            tableCellProperties88.Append(tableCellBorders80);
            tableCellProperties88.Append(shading24);
            tableCellProperties88.Append(tableCellVerticalAlignment65);

            Paragraph paragraph109 = new Paragraph() { RsidParagraphMarkRevision = "00DD5CF8", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties109 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines109 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification90 = new Justification() { Val = JustificationValues.Left };

            paragraphProperties109.Append(spacingBetweenLines109);
            paragraphProperties109.Append(justification90);

            paragraph109.Append(paragraphProperties109);

            tableCell88.Append(tableCellProperties88);
            tableCell88.Append(paragraph109);

            TableCell tableCell89 = new TableCell();

            TableCellProperties tableCellProperties89 = new TableCellProperties();
            TableCellWidth tableCellWidth89 = new TableCellWidth() { Width = "2410", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders81 = new TableCellBorders();
            TopBorder topBorder108 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder89 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder110 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder89 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders81.Append(topBorder108);
            tableCellBorders81.Append(leftBorder89);
            tableCellBorders81.Append(bottomBorder110);
            tableCellBorders81.Append(rightBorder89);
            Shading shading25 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment66 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties89.Append(tableCellWidth89);
            tableCellProperties89.Append(tableCellBorders81);
            tableCellProperties89.Append(shading25);
            tableCellProperties89.Append(tableCellVerticalAlignment66);

            Paragraph paragraph110 = new Paragraph() { RsidParagraphMarkRevision = "00CF0375", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00CF0375", RsidRunAdditionDefault = "006470F2" };

            ParagraphProperties paragraphProperties110 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines110 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification91 = new Justification() { Val = JustificationValues.Center };

            paragraphProperties110.Append(spacingBetweenLines110);
            paragraphProperties110.Append(justification91);

            Run run157 = new Run();
            Text text142 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            if (awork.Student.MiddleName is null || awork.Student.MiddleName == "")
            {
                text142.Text = awork is null ? "" : string.Format("{0}. {1}", awork.Student.FirstName[0], awork.Student.LastName);
            }
            else
            {
                text142.Text = awork is null ? "" : string.Format("{0}.{1}. {2}", awork.Student.FirstName[0], awork.Student.MiddleName[0], awork.Student.LastName);
            }
            

            run157.Append(text142);
            ProofError proofError25 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            paragraph110.Append(paragraphProperties110);
            paragraph110.Append(run157);
            paragraph110.Append(proofError25);

            tableCell89.Append(tableCellProperties89);
            tableCell89.Append(paragraph110);

            tableRow63.Append(tableRowProperties59);
            tableRow63.Append(tableCell86);
            tableRow63.Append(tableCell87);
            tableRow63.Append(tableCell88);
            tableRow63.Append(tableCell89);

            TableRow tableRow64 = new TableRow() { RsidTableRowMarkRevision = "0078633D", RsidTableRowAddition = "0078633D", RsidTableRowProperties = "00A15D69" };

            TableRowProperties tableRowProperties60 = new TableRowProperties();
            TableRowHeight tableRowHeight60 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties60.Append(tableRowHeight60);

            TableCell tableCell90 = new TableCell();

            TableCellProperties tableCellProperties90 = new TableCellProperties();
            TableCellWidth tableCellWidth90 = new TableCellWidth() { Width = "3168", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders82 = new TableCellBorders();
            TopBorder topBorder109 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder90 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder111 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder90 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders82.Append(topBorder109);
            tableCellBorders82.Append(leftBorder90);
            tableCellBorders82.Append(bottomBorder111);
            tableCellBorders82.Append(rightBorder90);
            Shading shading26 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment67 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties90.Append(tableCellWidth90);
            tableCellProperties90.Append(tableCellBorders82);
            tableCellProperties90.Append(shading26);
            tableCellProperties90.Append(tableCellVerticalAlignment67);

            Paragraph paragraph111 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties111 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines111 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification92 = new Justification() { Val = JustificationValues.Left };

            ParagraphMarkRunProperties paragraphMarkRunProperties99 = new ParagraphMarkRunProperties();
            FontSize fontSize114 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript118 = new FontSizeComplexScript() { Val = "20" };

            paragraphMarkRunProperties99.Append(fontSize114);
            paragraphMarkRunProperties99.Append(fontSizeComplexScript118);

            paragraphProperties111.Append(spacingBetweenLines111);
            paragraphProperties111.Append(justification92);
            paragraphProperties111.Append(paragraphMarkRunProperties99);

            paragraph111.Append(paragraphProperties111);

            tableCell90.Append(tableCellProperties90);
            tableCell90.Append(paragraph111);

            TableCell tableCell91 = new TableCell();

            TableCellProperties tableCellProperties91 = new TableCellProperties();
            TableCellWidth tableCellWidth91 = new TableCellWidth() { Width = "3461", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders83 = new TableCellBorders();
            TopBorder topBorder110 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder91 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder112 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder91 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders83.Append(topBorder110);
            tableCellBorders83.Append(leftBorder91);
            tableCellBorders83.Append(bottomBorder112);
            tableCellBorders83.Append(rightBorder91);
            Shading shading27 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties91.Append(tableCellWidth91);
            tableCellProperties91.Append(tableCellBorders83);
            tableCellProperties91.Append(shading27);

            Paragraph paragraph112 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties112 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines112 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification93 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties100 = new ParagraphMarkRunProperties();
            FontSize fontSize115 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript119 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties100.Append(fontSize115);
            paragraphMarkRunProperties100.Append(fontSizeComplexScript119);

            paragraphProperties112.Append(spacingBetweenLines112);
            paragraphProperties112.Append(justification93);
            paragraphProperties112.Append(paragraphMarkRunProperties100);

            Run run159 = new Run() { RsidRunProperties = "0078633D" };

            RunProperties runProperties152 = new RunProperties();
            FontSize fontSize116 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript120 = new FontSizeComplexScript() { Val = "16" };

            runProperties152.Append(fontSize116);
            runProperties152.Append(fontSizeComplexScript120);
            Text text144 = new Text();
            text144.Text = "подпись, дата";

            run159.Append(runProperties152);
            run159.Append(text144);

            paragraph112.Append(paragraphProperties112);
            paragraph112.Append(run159);

            tableCell91.Append(tableCellProperties91);
            tableCell91.Append(paragraph112);

            TableCell tableCell92 = new TableCell();

            TableCellProperties tableCellProperties92 = new TableCellProperties();
            TableCellWidth tableCellWidth92 = new TableCellWidth() { Width = "567", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders84 = new TableCellBorders();
            TopBorder topBorder111 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder92 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder113 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder92 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders84.Append(topBorder111);
            tableCellBorders84.Append(leftBorder92);
            tableCellBorders84.Append(bottomBorder113);
            tableCellBorders84.Append(rightBorder92);
            Shading shading28 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties92.Append(tableCellWidth92);
            tableCellProperties92.Append(tableCellBorders84);
            tableCellProperties92.Append(shading28);

            Paragraph paragraph113 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties113 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines113 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification94 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties101 = new ParagraphMarkRunProperties();
            FontSize fontSize117 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript121 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties101.Append(fontSize117);
            paragraphMarkRunProperties101.Append(fontSizeComplexScript121);

            paragraphProperties113.Append(spacingBetweenLines113);
            paragraphProperties113.Append(justification94);
            paragraphProperties113.Append(paragraphMarkRunProperties101);

            paragraph113.Append(paragraphProperties113);

            tableCell92.Append(tableCellProperties92);
            tableCell92.Append(paragraph113);

            TableCell tableCell93 = new TableCell();

            TableCellProperties tableCellProperties93 = new TableCellProperties();
            TableCellWidth tableCellWidth93 = new TableCellWidth() { Width = "2410", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders85 = new TableCellBorders();
            TopBorder topBorder112 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder93 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder114 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder93 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders85.Append(topBorder112);
            tableCellBorders85.Append(leftBorder93);
            tableCellBorders85.Append(bottomBorder114);
            tableCellBorders85.Append(rightBorder93);
            Shading shading29 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties93.Append(tableCellWidth93);
            tableCellProperties93.Append(tableCellBorders85);
            tableCellProperties93.Append(shading29);

            Paragraph paragraph114 = new Paragraph() { RsidParagraphMarkRevision = "0078633D", RsidParagraphAddition = "0078633D", RsidParagraphProperties = "0078633D", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties114 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines114 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };
            Justification justification95 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties102 = new ParagraphMarkRunProperties();
            FontSize fontSize118 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript122 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties102.Append(fontSize118);
            paragraphMarkRunProperties102.Append(fontSizeComplexScript122);

            paragraphProperties114.Append(spacingBetweenLines114);
            paragraphProperties114.Append(justification95);
            paragraphProperties114.Append(paragraphMarkRunProperties102);

            Run run160 = new Run() { RsidRunProperties = "0078633D" };

            RunProperties runProperties153 = new RunProperties();
            FontSize fontSize119 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript123 = new FontSizeComplexScript() { Val = "16" };

            runProperties153.Append(fontSize119);
            runProperties153.Append(fontSizeComplexScript123);
            Text text145 = new Text();
            text145.Text = "инициалы, фамилия";

            run160.Append(runProperties153);
            run160.Append(text145);

            paragraph114.Append(paragraphProperties114);
            paragraph114.Append(run160);

            tableCell93.Append(tableCellProperties93);
            tableCell93.Append(paragraph114);

            tableRow64.Append(tableRowProperties60);
            tableRow64.Append(tableCell90);
            tableRow64.Append(tableCell91);
            tableRow64.Append(tableCell92);
            tableRow64.Append(tableCell93);

            table5.Append(tableProperties5);
            table5.Append(tableGrid5);
            table5.Append(tableRow63);
            table5.Append(tableRow64);

            Paragraph paragraph115 = new Paragraph() { RsidParagraphAddition = "0078633D", RsidParagraphProperties = "00391EBF", RsidRunAdditionDefault = "0078633D" };

            ParagraphProperties paragraphProperties115 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines115 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            ParagraphMarkRunProperties paragraphMarkRunProperties103 = new ParagraphMarkRunProperties();
            Languages languages41 = new Languages() { Val = "en-US" };

            paragraphMarkRunProperties103.Append(languages41);

            paragraphProperties115.Append(spacingBetweenLines115);
            paragraphProperties115.Append(paragraphMarkRunProperties103);

            paragraph115.Append(paragraphProperties115);

            SectionProperties sectionProperties1 = new SectionProperties() { RsidR = "0078633D", RsidSect = "00CF792B" };
            PageSize pageSize1 = new PageSize() { Width = (UInt32Value)11906U, Height = (UInt32Value)16838U };
            PageMargin pageMargin1 = new PageMargin() { Top = 567, Right = (UInt32Value)851U, Bottom = 1134, Left = (UInt32Value)1418U, Header = (UInt32Value)709U, Footer = (UInt32Value)709U, Gutter = (UInt32Value)0U };
            Columns columns1 = new Columns() { Space = "708" };
            DocGrid docGrid1 = new DocGrid() { LinePitch = 360 };

            sectionProperties1.Append(pageSize1);
            sectionProperties1.Append(pageMargin1);
            sectionProperties1.Append(columns1);
            sectionProperties1.Append(docGrid1);

            body1.Append(paragraph1);
            body1.Append(paragraph2);
            body1.Append(paragraph3);
            body1.Append(paragraph4);
            body1.Append(paragraph5);
            body1.Append(paragraph6);
            body1.Append(paragraph7);
            body1.Append(paragraph8);
            body1.Append(paragraph9);
            body1.Append(paragraph10);
            body1.Append(table1);
            body1.Append(paragraph16);
            body1.Append(paragraph17);
            body1.Append(paragraph18);
            body1.Append(paragraph19);
            body1.Append(table2);
            body1.Append(paragraph28);
            body1.Append(table3);
            body1.Append(paragraph93);
            body1.Append(paragraph94);
            body1.Append(paragraph95);
            body1.Append(paragraph96);
            body1.Append(paragraph97);
            body1.Append(table4);
            body1.Append(paragraph106);
            body1.Append(table5);
            body1.Append(paragraph115);
            body1.Append(sectionProperties1);

            document1.Append(body1);

            mainDocumentPart1.Document = document1;
        }

        // Generates content of documentSettingsPart1.
        private void GenerateDocumentSettingsPart1Content(DocumentSettingsPart documentSettingsPart1)
        {
            Settings settings1 = new Settings() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "w14 w15 w16se" } };
            settings1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            settings1.AddNamespaceDeclaration("o", "urn:schemas-microsoft-com:office:office");
            settings1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            settings1.AddNamespaceDeclaration("m", "http://schemas.openxmlformats.org/officeDocument/2006/math");
            settings1.AddNamespaceDeclaration("v", "urn:schemas-microsoft-com:vml");
            settings1.AddNamespaceDeclaration("w10", "urn:schemas-microsoft-com:office:word");
            settings1.AddNamespaceDeclaration("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
            settings1.AddNamespaceDeclaration("w14", "http://schemas.microsoft.com/office/word/2010/wordml");
            settings1.AddNamespaceDeclaration("w15", "http://schemas.microsoft.com/office/word/2012/wordml");
            settings1.AddNamespaceDeclaration("w16se", "http://schemas.microsoft.com/office/word/2015/wordml/symex");
            settings1.AddNamespaceDeclaration("sl", "http://schemas.openxmlformats.org/schemaLibrary/2006/main");
            Zoom zoom1 = new Zoom() { Percent = "100" };
            ProofState proofState1 = new ProofState() { Spelling = ProofingStateValues.Clean, Grammar = ProofingStateValues.Clean };
            StylePaneFormatFilter stylePaneFormatFilter1 = new StylePaneFormatFilter() { Val = "3F01", AllStyles = true, CustomStyles = false, LatentStyles = false, StylesInUse = false, HeadingStyles = false, NumberingStyles = false, TableStyles = false, DirectFormattingOnRuns = true, DirectFormattingOnParagraphs = true, DirectFormattingOnNumbering = true, DirectFormattingOnTables = true, ClearFormatting = true, Top3HeadingStyles = true, VisibleStyles = false, AlternateStyleNames = false };
            DefaultTabStop defaultTabStop1 = new DefaultTabStop() { Val = 708 };
            NoPunctuationKerning noPunctuationKerning1 = new NoPunctuationKerning();
            CharacterSpacingControl characterSpacingControl1 = new CharacterSpacingControl() { Val = CharacterSpacingValues.DoNotCompress };

            Compatibility compatibility1 = new Compatibility();
            CompatibilitySetting compatibilitySetting1 = new CompatibilitySetting() { Name = CompatSettingNameValues.CompatibilityMode, Uri = "http://schemas.microsoft.com/office/word", Val = "15" };
            CompatibilitySetting compatibilitySetting2 = new CompatibilitySetting() { Name = CompatSettingNameValues.OverrideTableStyleFontSizeAndJustification, Uri = "http://schemas.microsoft.com/office/word", Val = "1" };
            CompatibilitySetting compatibilitySetting3 = new CompatibilitySetting() { Name = CompatSettingNameValues.EnableOpenTypeFeatures, Uri = "http://schemas.microsoft.com/office/word", Val = "1" };
            CompatibilitySetting compatibilitySetting4 = new CompatibilitySetting() { Name = CompatSettingNameValues.DoNotFlipMirrorIndents, Uri = "http://schemas.microsoft.com/office/word", Val = "1" };
            CompatibilitySetting compatibilitySetting5 = new CompatibilitySetting() { Name = CompatSettingNameValues.DifferentiateMultirowTableHeaders, Uri = "http://schemas.microsoft.com/office/word", Val = "1" };

            compatibility1.Append(compatibilitySetting1);
            compatibility1.Append(compatibilitySetting2);
            compatibility1.Append(compatibilitySetting3);
            compatibility1.Append(compatibilitySetting4);
            compatibility1.Append(compatibilitySetting5);

            Rsids rsids1 = new Rsids();
            RsidRoot rsidRoot1 = new RsidRoot() { Val = "00C94CB2" };
            Rsid rsid1 = new Rsid() { Val = "00003A77" };
            Rsid rsid2 = new Rsid() { Val = "00004431" };
            Rsid rsid3 = new Rsid() { Val = "00006153" };
            Rsid rsid4 = new Rsid() { Val = "000114AF" };
            Rsid rsid5 = new Rsid() { Val = "00014C85" };
            Rsid rsid6 = new Rsid() { Val = "00017B7A" };
            Rsid rsid7 = new Rsid() { Val = "00020A60" };
            Rsid rsid8 = new Rsid() { Val = "00022518" };
            Rsid rsid9 = new Rsid() { Val = "00022647" };
            Rsid rsid10 = new Rsid() { Val = "000247F4" };
            Rsid rsid11 = new Rsid() { Val = "0003473B" };
            Rsid rsid12 = new Rsid() { Val = "00035DEE" };
            Rsid rsid13 = new Rsid() { Val = "00040750" };
            Rsid rsid14 = new Rsid() { Val = "0004352C" };
            Rsid rsid15 = new Rsid() { Val = "00046E57" };
            Rsid rsid16 = new Rsid() { Val = "00047DDA" };
            Rsid rsid17 = new Rsid() { Val = "0005213E" };
            Rsid rsid18 = new Rsid() { Val = "00053D44" };
            Rsid rsid19 = new Rsid() { Val = "00064FC0" };
            Rsid rsid20 = new Rsid() { Val = "00066066" };
            Rsid rsid21 = new Rsid() { Val = "00071018" };
            Rsid rsid22 = new Rsid() { Val = "000727B1" };
            Rsid rsid23 = new Rsid() { Val = "000748AA" };
            Rsid rsid24 = new Rsid() { Val = "00080405" };
            Rsid rsid25 = new Rsid() { Val = "000806E4" };
            Rsid rsid26 = new Rsid() { Val = "00080B94" };
            Rsid rsid27 = new Rsid() { Val = "00084129" };
            Rsid rsid28 = new Rsid() { Val = "00086851" };
            Rsid rsid29 = new Rsid() { Val = "00093BAE" };
            Rsid rsid30 = new Rsid() { Val = "000968F3" };
            Rsid rsid31 = new Rsid() { Val = "000A630D" };
            Rsid rsid32 = new Rsid() { Val = "000B78C0" };
            Rsid rsid33 = new Rsid() { Val = "000D042B" };
            Rsid rsid34 = new Rsid() { Val = "000D0C5B" };
            Rsid rsid35 = new Rsid() { Val = "000D3452" };
            Rsid rsid36 = new Rsid() { Val = "000D59B0" };
            Rsid rsid37 = new Rsid() { Val = "000D7C23" };
            Rsid rsid38 = new Rsid() { Val = "000E394E" };
            Rsid rsid39 = new Rsid() { Val = "000E527B" };
            Rsid rsid40 = new Rsid() { Val = "000F250B" };
            Rsid rsid41 = new Rsid() { Val = "000F56B7" };
            Rsid rsid42 = new Rsid() { Val = "000F6300" };
            Rsid rsid43 = new Rsid() { Val = "000F70DA" };
            Rsid rsid44 = new Rsid() { Val = "00104788" };
            Rsid rsid45 = new Rsid() { Val = "00111475" };
            Rsid rsid46 = new Rsid() { Val = "00112397" };
            Rsid rsid47 = new Rsid() { Val = "00123217" };
            Rsid rsid48 = new Rsid() { Val = "00126F3A" };
            Rsid rsid49 = new Rsid() { Val = "00134FA4" };
            Rsid rsid50 = new Rsid() { Val = "0013605C" };
            Rsid rsid51 = new Rsid() { Val = "00145353" };
            Rsid rsid52 = new Rsid() { Val = "00146D3E" };
            Rsid rsid53 = new Rsid() { Val = "00151E89" };
            Rsid rsid54 = new Rsid() { Val = "00154B65" };
            Rsid rsid55 = new Rsid() { Val = "001553A7" };
            Rsid rsid56 = new Rsid() { Val = "00162886" };
            Rsid rsid57 = new Rsid() { Val = "00162C1A" };
            Rsid rsid58 = new Rsid() { Val = "00171D05" };
            Rsid rsid59 = new Rsid() { Val = "001749B0" };
            Rsid rsid60 = new Rsid() { Val = "00184F7D" };
            Rsid rsid61 = new Rsid() { Val = "00184FEA" };
            Rsid rsid62 = new Rsid() { Val = "001C4B57" };
            Rsid rsid63 = new Rsid() { Val = "001D3C40" };
            Rsid rsid64 = new Rsid() { Val = "001D703A" };
            Rsid rsid65 = new Rsid() { Val = "001F5383" };
            Rsid rsid66 = new Rsid() { Val = "001F6658" };
            Rsid rsid67 = new Rsid() { Val = "002202A4" };
            Rsid rsid68 = new Rsid() { Val = "002207B2" };
            Rsid rsid69 = new Rsid() { Val = "00222067" };
            Rsid rsid70 = new Rsid() { Val = "00222407" };
            Rsid rsid71 = new Rsid() { Val = "002253D8" };
            Rsid rsid72 = new Rsid() { Val = "00225963" };
            Rsid rsid73 = new Rsid() { Val = "002335FC" };
            Rsid rsid74 = new Rsid() { Val = "00240E92" };
            Rsid rsid75 = new Rsid() { Val = "00251E2C" };
            Rsid rsid76 = new Rsid() { Val = "00256149" };
            Rsid rsid77 = new Rsid() { Val = "0025739F" };
            Rsid rsid78 = new Rsid() { Val = "00257C94" };
            Rsid rsid79 = new Rsid() { Val = "00263C9D" };
            Rsid rsid80 = new Rsid() { Val = "002708BA" };
            Rsid rsid81 = new Rsid() { Val = "002732F9" };
            Rsid rsid82 = new Rsid() { Val = "0027768F" };
            Rsid rsid83 = new Rsid() { Val = "00277C50" };
            Rsid rsid84 = new Rsid() { Val = "0028264A" };
            Rsid rsid85 = new Rsid() { Val = "00285194" };
            Rsid rsid86 = new Rsid() { Val = "0028711C" };
            Rsid rsid87 = new Rsid() { Val = "00294ED8" };
            Rsid rsid88 = new Rsid() { Val = "002953AB" };
            Rsid rsid89 = new Rsid() { Val = "002A417E" };
            Rsid rsid90 = new Rsid() { Val = "002A5F24" };
            Rsid rsid91 = new Rsid() { Val = "002A6E3E" };
            Rsid rsid92 = new Rsid() { Val = "002A6F21" };
            Rsid rsid93 = new Rsid() { Val = "002B4C61" };
            Rsid rsid94 = new Rsid() { Val = "002B5D0B" };
            Rsid rsid95 = new Rsid() { Val = "002C06B9" };
            Rsid rsid96 = new Rsid() { Val = "002C42EC" };
            Rsid rsid97 = new Rsid() { Val = "002D1E58" };
            Rsid rsid98 = new Rsid() { Val = "002E1B79" };
            Rsid rsid99 = new Rsid() { Val = "002E1E76" };
            Rsid rsid100 = new Rsid() { Val = "002E42B4" };
            Rsid rsid101 = new Rsid() { Val = "002F13A0" };
            Rsid rsid102 = new Rsid() { Val = "002F3754" };
            Rsid rsid103 = new Rsid() { Val = "002F4AFE" };
            Rsid rsid104 = new Rsid() { Val = "00300908" };
            Rsid rsid105 = new Rsid() { Val = "0031304C" };
            Rsid rsid106 = new Rsid() { Val = "00316A6D" };
            Rsid rsid107 = new Rsid() { Val = "00321FCC" };
            Rsid rsid108 = new Rsid() { Val = "003240C9" };
            Rsid rsid109 = new Rsid() { Val = "00325D65" };
            Rsid rsid110 = new Rsid() { Val = "00330589" };
            Rsid rsid111 = new Rsid() { Val = "003327F1" };
            Rsid rsid112 = new Rsid() { Val = "003345BB" };
            Rsid rsid113 = new Rsid() { Val = "00334B8C" };
            Rsid rsid114 = new Rsid() { Val = "0034057D" };
            Rsid rsid115 = new Rsid() { Val = "00346393" };
            Rsid rsid116 = new Rsid() { Val = "00350BBF" };
            Rsid rsid117 = new Rsid() { Val = "00351672" };
            Rsid rsid118 = new Rsid() { Val = "0035767B" };
            Rsid rsid119 = new Rsid() { Val = "00362068" };
            Rsid rsid120 = new Rsid() { Val = "00363309" };
            Rsid rsid121 = new Rsid() { Val = "00365CC2" };
            Rsid rsid122 = new Rsid() { Val = "0036759A" };
            Rsid rsid123 = new Rsid() { Val = "00384808" };
            Rsid rsid124 = new Rsid() { Val = "0038541A" };
            Rsid rsid125 = new Rsid() { Val = "003868F3" };
            Rsid rsid126 = new Rsid() { Val = "00391EBF" };
            Rsid rsid127 = new Rsid() { Val = "00392F1C" };
            Rsid rsid128 = new Rsid() { Val = "003A6CBE" };
            Rsid rsid129 = new Rsid() { Val = "003B2FCD" };
            Rsid rsid130 = new Rsid() { Val = "003B567C" };
            Rsid rsid131 = new Rsid() { Val = "003B645A" };
            Rsid rsid132 = new Rsid() { Val = "003C140E" };
            Rsid rsid133 = new Rsid() { Val = "003C473A" };
            Rsid rsid134 = new Rsid() { Val = "003E6FE4" };
            Rsid rsid135 = new Rsid() { Val = "003F3715" };
            Rsid rsid136 = new Rsid() { Val = "003F7F0F" };
            Rsid rsid137 = new Rsid() { Val = "00404BF7" };
            Rsid rsid138 = new Rsid() { Val = "004079D9" };
            Rsid rsid139 = new Rsid() { Val = "004105F6" };
            Rsid rsid140 = new Rsid() { Val = "004223B2" };
            Rsid rsid141 = new Rsid() { Val = "0042668C" };
            Rsid rsid142 = new Rsid() { Val = "00447AAA" };
            Rsid rsid143 = new Rsid() { Val = "00454648" };
            Rsid rsid144 = new Rsid() { Val = "00455EFE" };
            Rsid rsid145 = new Rsid() { Val = "004570F0" };
            Rsid rsid146 = new Rsid() { Val = "004602F1" };
            Rsid rsid147 = new Rsid() { Val = "00473974" };
            Rsid rsid148 = new Rsid() { Val = "004833DE" };
            Rsid rsid149 = new Rsid() { Val = "00490DDA" };
            Rsid rsid150 = new Rsid() { Val = "004A1886" };
            Rsid rsid151 = new Rsid() { Val = "004A5A71" };
            Rsid rsid152 = new Rsid() { Val = "004A5FAC" };
            Rsid rsid153 = new Rsid() { Val = "004B293A" };
            Rsid rsid154 = new Rsid() { Val = "004B7195" };
            Rsid rsid155 = new Rsid() { Val = "004C4F7D" };
            Rsid rsid156 = new Rsid() { Val = "004C5DD3" };
            Rsid rsid157 = new Rsid() { Val = "004D25D3" };
            Rsid rsid158 = new Rsid() { Val = "004F2A6A" };
            Rsid rsid159 = new Rsid() { Val = "004F6A13" };
            Rsid rsid160 = new Rsid() { Val = "004F7FB1" };
            Rsid rsid161 = new Rsid() { Val = "00500114" };
            Rsid rsid162 = new Rsid() { Val = "00500B15" };
            Rsid rsid163 = new Rsid() { Val = "00501E0B" };
            Rsid rsid164 = new Rsid() { Val = "00512ED7" };
            Rsid rsid165 = new Rsid() { Val = "005135DC" };
            Rsid rsid166 = new Rsid() { Val = "00515D1C" };
            Rsid rsid167 = new Rsid() { Val = "00521C40" };
            Rsid rsid168 = new Rsid() { Val = "00526B33" };
            Rsid rsid169 = new Rsid() { Val = "0053180D" };
            Rsid rsid170 = new Rsid() { Val = "005472CC" };
            Rsid rsid171 = new Rsid() { Val = "00552CC0" };
            Rsid rsid172 = new Rsid() { Val = "005571F2" };
            Rsid rsid173 = new Rsid() { Val = "00560FFD" };
            Rsid rsid174 = new Rsid() { Val = "005662DF" };
            Rsid rsid175 = new Rsid() { Val = "005801D8" };
            Rsid rsid176 = new Rsid() { Val = "00590E10" };
            Rsid rsid177 = new Rsid() { Val = "00597C37" };
            Rsid rsid178 = new Rsid() { Val = "005A75CF" };
            Rsid rsid179 = new Rsid() { Val = "005B02DE" };
            Rsid rsid180 = new Rsid() { Val = "005B6A5B" };
            Rsid rsid181 = new Rsid() { Val = "005C5ABE" };
            Rsid rsid182 = new Rsid() { Val = "005C61CC" };
            Rsid rsid183 = new Rsid() { Val = "005C6526" };
            Rsid rsid184 = new Rsid() { Val = "005C74B2" };
            Rsid rsid185 = new Rsid() { Val = "005D2A13" };
            Rsid rsid186 = new Rsid() { Val = "005D48DA" };
            Rsid rsid187 = new Rsid() { Val = "005E3AAC" };
            Rsid rsid188 = new Rsid() { Val = "005E7F5B" };
            Rsid rsid189 = new Rsid() { Val = "005F0C3F" };
            Rsid rsid190 = new Rsid() { Val = "005F4B4F" };
            Rsid rsid191 = new Rsid() { Val = "00601A11" };
            Rsid rsid192 = new Rsid() { Val = "00602EC8" };
            Rsid rsid193 = new Rsid() { Val = "00603BE2" };
            Rsid rsid194 = new Rsid() { Val = "00612473" };
            Rsid rsid195 = new Rsid() { Val = "00612F4A" };
            Rsid rsid196 = new Rsid() { Val = "00617E00" };
            Rsid rsid197 = new Rsid() { Val = "006219A5" };
            Rsid rsid198 = new Rsid() { Val = "00622626" };
            Rsid rsid199 = new Rsid() { Val = "00623051" };
            Rsid rsid200 = new Rsid() { Val = "00626147" };
            Rsid rsid201 = new Rsid() { Val = "0062700D" };
            Rsid rsid202 = new Rsid() { Val = "00631672" };
            Rsid rsid203 = new Rsid() { Val = "0063751A" };
            Rsid rsid204 = new Rsid() { Val = "006400B2" };
            Rsid rsid205 = new Rsid() { Val = "00643990" };
            Rsid rsid206 = new Rsid() { Val = "006470F2" };
            Rsid rsid207 = new Rsid() { Val = "006510F9" };
            Rsid rsid208 = new Rsid() { Val = "00671859" };
            Rsid rsid209 = new Rsid() { Val = "00677C9F" };
            Rsid rsid210 = new Rsid() { Val = "00694A8B" };
            Rsid rsid211 = new Rsid() { Val = "006A08CF" };
            Rsid rsid212 = new Rsid() { Val = "006A4FAA" };
            Rsid rsid213 = new Rsid() { Val = "006B0483" };
            Rsid rsid214 = new Rsid() { Val = "006B0F47" };
            Rsid rsid215 = new Rsid() { Val = "006B537A" };
            Rsid rsid216 = new Rsid() { Val = "006B5556" };
            Rsid rsid217 = new Rsid() { Val = "006C2DC4" };
            Rsid rsid218 = new Rsid() { Val = "006E5689" };
            Rsid rsid219 = new Rsid() { Val = "006F235B" };
            Rsid rsid220 = new Rsid() { Val = "006F5293" };
            Rsid rsid221 = new Rsid() { Val = "006F6E49" };
            Rsid rsid222 = new Rsid() { Val = "006F7F83" };
            Rsid rsid223 = new Rsid() { Val = "00701090" };
            Rsid rsid224 = new Rsid() { Val = "00701E5A" };
            Rsid rsid225 = new Rsid() { Val = "007044DB" };
            Rsid rsid226 = new Rsid() { Val = "007049FD" };
            Rsid rsid227 = new Rsid() { Val = "007070B9" };
            Rsid rsid228 = new Rsid() { Val = "00707156" };
            Rsid rsid229 = new Rsid() { Val = "00711AFA" };
            Rsid rsid230 = new Rsid() { Val = "007132B1" };
            Rsid rsid231 = new Rsid() { Val = "00720A78" };
            Rsid rsid232 = new Rsid() { Val = "00721CC0" };
            Rsid rsid233 = new Rsid() { Val = "00725A87" };
            Rsid rsid234 = new Rsid() { Val = "00725F05" };
            Rsid rsid235 = new Rsid() { Val = "00733EBB" };
            Rsid rsid236 = new Rsid() { Val = "00737093" };
            Rsid rsid237 = new Rsid() { Val = "00740395" };
            Rsid rsid238 = new Rsid() { Val = "00742D16" };
            Rsid rsid239 = new Rsid() { Val = "00751C96" };
            Rsid rsid240 = new Rsid() { Val = "00751F23" };
            Rsid rsid241 = new Rsid() { Val = "007525C8" };
            Rsid rsid242 = new Rsid() { Val = "0075373B" };
            Rsid rsid243 = new Rsid() { Val = "00754311" };
            Rsid rsid244 = new Rsid() { Val = "00754770" };
            Rsid rsid245 = new Rsid() { Val = "00757893" };
            Rsid rsid246 = new Rsid() { Val = "00757EBC" };
            Rsid rsid247 = new Rsid() { Val = "007645C1" };
            Rsid rsid248 = new Rsid() { Val = "00770379" };
            Rsid rsid249 = new Rsid() { Val = "00774673" };
            Rsid rsid250 = new Rsid() { Val = "00777639" };
            Rsid rsid251 = new Rsid() { Val = "00781281" };
            Rsid rsid252 = new Rsid() { Val = "00782748" };
            Rsid rsid253 = new Rsid() { Val = "00782776" };
            Rsid rsid254 = new Rsid() { Val = "00785071" };
            Rsid rsid255 = new Rsid() { Val = "0078633D" };
            Rsid rsid256 = new Rsid() { Val = "0078672E" };
            Rsid rsid257 = new Rsid() { Val = "0078760A" };
            Rsid rsid258 = new Rsid() { Val = "00791B6E" };
            Rsid rsid259 = new Rsid() { Val = "00792B11" };
            Rsid rsid260 = new Rsid() { Val = "00795EC7" };
            Rsid rsid261 = new Rsid() { Val = "00797679" };
            Rsid rsid262 = new Rsid() { Val = "007B56BE" };
            Rsid rsid263 = new Rsid() { Val = "007C0669" };
            Rsid rsid264 = new Rsid() { Val = "007C3AE6" };
            Rsid rsid265 = new Rsid() { Val = "007C4BDC" };
            Rsid rsid266 = new Rsid() { Val = "007C5789" };
            Rsid rsid267 = new Rsid() { Val = "007D5255" };
            Rsid rsid268 = new Rsid() { Val = "007D6518" };
            Rsid rsid269 = new Rsid() { Val = "007E4621" };
            Rsid rsid270 = new Rsid() { Val = "007E4700" };
            Rsid rsid271 = new Rsid() { Val = "007E7543" };
            Rsid rsid272 = new Rsid() { Val = "007F1B9A" };
            Rsid rsid273 = new Rsid() { Val = "007F3F85" };
            Rsid rsid274 = new Rsid() { Val = "0080066D" };
            Rsid rsid275 = new Rsid() { Val = "0080348B" };
            Rsid rsid276 = new Rsid() { Val = "00803EAB" };
            Rsid rsid277 = new Rsid() { Val = "00811BC2" };
            Rsid rsid278 = new Rsid() { Val = "00812BD7" };
            Rsid rsid279 = new Rsid() { Val = "00813B70" };
            Rsid rsid280 = new Rsid() { Val = "008143C1" };
            Rsid rsid281 = new Rsid() { Val = "00815CAF" };
            Rsid rsid282 = new Rsid() { Val = "00832C34" };
            Rsid rsid283 = new Rsid() { Val = "00837AC1" };
            Rsid rsid284 = new Rsid() { Val = "008401C3" };
            Rsid rsid285 = new Rsid() { Val = "00844BF9" };
            Rsid rsid286 = new Rsid() { Val = "00845115" };
            Rsid rsid287 = new Rsid() { Val = "00854557" };
            Rsid rsid288 = new Rsid() { Val = "008667FE" };
            Rsid rsid289 = new Rsid() { Val = "00867258" };
            Rsid rsid290 = new Rsid() { Val = "008673CE" };
            Rsid rsid291 = new Rsid() { Val = "008766EF" };
            Rsid rsid292 = new Rsid() { Val = "00876C45" };
            Rsid rsid293 = new Rsid() { Val = "00882C1F" };
            Rsid rsid294 = new Rsid() { Val = "00891E6F" };
            Rsid rsid295 = new Rsid() { Val = "00892AC4" };
            Rsid rsid296 = new Rsid() { Val = "00896BC9" };
            Rsid rsid297 = new Rsid() { Val = "008A138A" };
            Rsid rsid298 = new Rsid() { Val = "008A54B3" };
            Rsid rsid299 = new Rsid() { Val = "008A5678" };
            Rsid rsid300 = new Rsid() { Val = "008A5ECE" };
            Rsid rsid301 = new Rsid() { Val = "008B2B5D" };
            Rsid rsid302 = new Rsid() { Val = "008B5EFE" };
            Rsid rsid303 = new Rsid() { Val = "008B7409" };
            Rsid rsid304 = new Rsid() { Val = "008C1690" };
            Rsid rsid305 = new Rsid() { Val = "008C4EBC" };
            Rsid rsid306 = new Rsid() { Val = "008D0256" };
            Rsid rsid307 = new Rsid() { Val = "008E7585" };
            Rsid rsid308 = new Rsid() { Val = "008F244C" };
            Rsid rsid309 = new Rsid() { Val = "008F4701" };
            Rsid rsid310 = new Rsid() { Val = "00903F82" };
            Rsid rsid311 = new Rsid() { Val = "00910F96" };
            Rsid rsid312 = new Rsid() { Val = "0091399C" };
            Rsid rsid313 = new Rsid() { Val = "0091599F" };
            Rsid rsid314 = new Rsid() { Val = "009220C4" };
            Rsid rsid315 = new Rsid() { Val = "0092248A" };
            Rsid rsid316 = new Rsid() { Val = "00923D4F" };
            Rsid rsid317 = new Rsid() { Val = "009276E9" };
            Rsid rsid318 = new Rsid() { Val = "0093053D" };
            Rsid rsid319 = new Rsid() { Val = "00940F7D" };
            Rsid rsid320 = new Rsid() { Val = "00947677" };
            Rsid rsid321 = new Rsid() { Val = "00954923" };
            Rsid rsid322 = new Rsid() { Val = "00955AB7" };
            Rsid rsid323 = new Rsid() { Val = "00955BA7" };
            Rsid rsid324 = new Rsid() { Val = "00957D52" };
            Rsid rsid325 = new Rsid() { Val = "00963432" };
            Rsid rsid326 = new Rsid() { Val = "009646A8" };
            Rsid rsid327 = new Rsid() { Val = "00967B0F" };
            Rsid rsid328 = new Rsid() { Val = "00967F75" };
            Rsid rsid329 = new Rsid() { Val = "00970BAC" };
            Rsid rsid330 = new Rsid() { Val = "00973CEE" };
            Rsid rsid331 = new Rsid() { Val = "0097506F" };
            Rsid rsid332 = new Rsid() { Val = "00981248" };
            Rsid rsid333 = new Rsid() { Val = "0098273B" };
            Rsid rsid334 = new Rsid() { Val = "009861E0" };
            Rsid rsid335 = new Rsid() { Val = "00994930" };
            Rsid rsid336 = new Rsid() { Val = "00994F8D" };
            Rsid rsid337 = new Rsid() { Val = "00997AC2" };
            Rsid rsid338 = new Rsid() { Val = "00997EC0" };
            Rsid rsid339 = new Rsid() { Val = "009A0DB8" };
            Rsid rsid340 = new Rsid() { Val = "009A2999" };
            Rsid rsid341 = new Rsid() { Val = "009A5290" };
            Rsid rsid342 = new Rsid() { Val = "009B04C5" };
            Rsid rsid343 = new Rsid() { Val = "009B481A" };
            Rsid rsid344 = new Rsid() { Val = "009C2857" };
            Rsid rsid345 = new Rsid() { Val = "009C4054" };
            Rsid rsid346 = new Rsid() { Val = "009C54A8" };
            Rsid rsid347 = new Rsid() { Val = "009C5A91" };
            Rsid rsid348 = new Rsid() { Val = "009D5B19" };
            Rsid rsid349 = new Rsid() { Val = "009D6664" };
            Rsid rsid350 = new Rsid() { Val = "009E0BF7" };
            Rsid rsid351 = new Rsid() { Val = "009E6BCA" };
            Rsid rsid352 = new Rsid() { Val = "009E6EE5" };
            Rsid rsid353 = new Rsid() { Val = "009F035E" };
            Rsid rsid354 = new Rsid() { Val = "009F495F" };
            Rsid rsid355 = new Rsid() { Val = "00A00940" };
            Rsid rsid356 = new Rsid() { Val = "00A036E8" };
            Rsid rsid357 = new Rsid() { Val = "00A03D66" };
            Rsid rsid358 = new Rsid() { Val = "00A07C23" };
            Rsid rsid359 = new Rsid() { Val = "00A15D69" };
            Rsid rsid360 = new Rsid() { Val = "00A27EF6" };
            Rsid rsid361 = new Rsid() { Val = "00A35FC8" };
            Rsid rsid362 = new Rsid() { Val = "00A36749" };
            Rsid rsid363 = new Rsid() { Val = "00A37E84" };
            Rsid rsid364 = new Rsid() { Val = "00A409E1" };
            Rsid rsid365 = new Rsid() { Val = "00A43E52" };
            Rsid rsid366 = new Rsid() { Val = "00A5328F" };
            Rsid rsid367 = new Rsid() { Val = "00A539F5" };
            Rsid rsid368 = new Rsid() { Val = "00A56083" };
            Rsid rsid369 = new Rsid() { Val = "00A56790" };
            Rsid rsid370 = new Rsid() { Val = "00A62A87" };
            Rsid rsid371 = new Rsid() { Val = "00A63EBA" };
            Rsid rsid372 = new Rsid() { Val = "00A64D88" };
            Rsid rsid373 = new Rsid() { Val = "00A67E43" };
            Rsid rsid374 = new Rsid() { Val = "00A7108D" };
            Rsid rsid375 = new Rsid() { Val = "00A7444D" };
            Rsid rsid376 = new Rsid() { Val = "00A757B8" };
            Rsid rsid377 = new Rsid() { Val = "00A81001" };
            Rsid rsid378 = new Rsid() { Val = "00A810C8" };
            Rsid rsid379 = new Rsid() { Val = "00A86AD5" };
            Rsid rsid380 = new Rsid() { Val = "00A90A98" };
            Rsid rsid381 = new Rsid() { Val = "00A9145B" };
            Rsid rsid382 = new Rsid() { Val = "00A92BE8" };
            Rsid rsid383 = new Rsid() { Val = "00A92E9F" };
            Rsid rsid384 = new Rsid() { Val = "00A978E5" };
            Rsid rsid385 = new Rsid() { Val = "00AA0116" };
            Rsid rsid386 = new Rsid() { Val = "00AC05B6" };
            Rsid rsid387 = new Rsid() { Val = "00AC3FAF" };
            Rsid rsid388 = new Rsid() { Val = "00AC792B" };
            Rsid rsid389 = new Rsid() { Val = "00AE566C" };
            Rsid rsid390 = new Rsid() { Val = "00AE5FEA" };
            Rsid rsid391 = new Rsid() { Val = "00AE774B" };
            Rsid rsid392 = new Rsid() { Val = "00B07F55" };
            Rsid rsid393 = new Rsid() { Val = "00B1512F" };
            Rsid rsid394 = new Rsid() { Val = "00B2211E" };
            Rsid rsid395 = new Rsid() { Val = "00B22D49" };
            Rsid rsid396 = new Rsid() { Val = "00B2460F" };
            Rsid rsid397 = new Rsid() { Val = "00B33080" };
            Rsid rsid398 = new Rsid() { Val = "00B411F2" };
            Rsid rsid399 = new Rsid() { Val = "00B44E54" };
            Rsid rsid400 = new Rsid() { Val = "00B52D3D" };
            Rsid rsid401 = new Rsid() { Val = "00B53CDE" };
            Rsid rsid402 = new Rsid() { Val = "00B55CB0" };
            Rsid rsid403 = new Rsid() { Val = "00B57E9C" };
            Rsid rsid404 = new Rsid() { Val = "00B60964" };
            Rsid rsid405 = new Rsid() { Val = "00B667AD" };
            Rsid rsid406 = new Rsid() { Val = "00B66DF3" };
            Rsid rsid407 = new Rsid() { Val = "00B67414" };
            Rsid rsid408 = new Rsid() { Val = "00B737E1" };
            Rsid rsid409 = new Rsid() { Val = "00B87DE7" };
            Rsid rsid410 = new Rsid() { Val = "00BA2258" };
            Rsid rsid411 = new Rsid() { Val = "00BB1D0C" };
            Rsid rsid412 = new Rsid() { Val = "00BB4C1E" };
            Rsid rsid413 = new Rsid() { Val = "00BB642F" };
            Rsid rsid414 = new Rsid() { Val = "00BC3F48" };
            Rsid rsid415 = new Rsid() { Val = "00BD2409" };
            Rsid rsid416 = new Rsid() { Val = "00BD2AA2" };
            Rsid rsid417 = new Rsid() { Val = "00BD4E0C" };
            Rsid rsid418 = new Rsid() { Val = "00BD70FF" };
            Rsid rsid419 = new Rsid() { Val = "00BE5107" };
            Rsid rsid420 = new Rsid() { Val = "00BE53FA" };
            Rsid rsid421 = new Rsid() { Val = "00BE751C" };
            Rsid rsid422 = new Rsid() { Val = "00C009AF" };
            Rsid rsid423 = new Rsid() { Val = "00C029E4" };
            Rsid rsid424 = new Rsid() { Val = "00C065AE" };
            Rsid rsid425 = new Rsid() { Val = "00C11967" };
            Rsid rsid426 = new Rsid() { Val = "00C136BD" };
            Rsid rsid427 = new Rsid() { Val = "00C139CD" };
            Rsid rsid428 = new Rsid() { Val = "00C157AD" };
            Rsid rsid429 = new Rsid() { Val = "00C1641A" };
            Rsid rsid430 = new Rsid() { Val = "00C202B5" };
            Rsid rsid431 = new Rsid() { Val = "00C21514" };
            Rsid rsid432 = new Rsid() { Val = "00C215BC" };
            Rsid rsid433 = new Rsid() { Val = "00C24712" };
            Rsid rsid434 = new Rsid() { Val = "00C34995" };
            Rsid rsid435 = new Rsid() { Val = "00C42464" };
            Rsid rsid436 = new Rsid() { Val = "00C65FCB" };
            Rsid rsid437 = new Rsid() { Val = "00C723C0" };
            Rsid rsid438 = new Rsid() { Val = "00C7543C" };
            Rsid rsid439 = new Rsid() { Val = "00C85661" };
            Rsid rsid440 = new Rsid() { Val = "00C8741F" };
            Rsid rsid441 = new Rsid() { Val = "00C87E30" };
            Rsid rsid442 = new Rsid() { Val = "00C90333" };
            Rsid rsid443 = new Rsid() { Val = "00C94CB2" };
            Rsid rsid444 = new Rsid() { Val = "00C950FD" };
            Rsid rsid445 = new Rsid() { Val = "00C952AE" };
            Rsid rsid446 = new Rsid() { Val = "00CA0E15" };
            Rsid rsid447 = new Rsid() { Val = "00CA1707" };
            Rsid rsid448 = new Rsid() { Val = "00CA3462" };
            Rsid rsid449 = new Rsid() { Val = "00CA385E" };
            Rsid rsid450 = new Rsid() { Val = "00CB0973" };
            Rsid rsid451 = new Rsid() { Val = "00CB24AC" };
            Rsid rsid452 = new Rsid() { Val = "00CB5BC3" };
            Rsid rsid453 = new Rsid() { Val = "00CB65C2" };
            Rsid rsid454 = new Rsid() { Val = "00CB7786" };
            Rsid rsid455 = new Rsid() { Val = "00CC0140" };
            Rsid rsid456 = new Rsid() { Val = "00CC09DB" };
            Rsid rsid457 = new Rsid() { Val = "00CC5C8B" };
            Rsid rsid458 = new Rsid() { Val = "00CC72F3" };
            Rsid rsid459 = new Rsid() { Val = "00CD1D95" };
            Rsid rsid460 = new Rsid() { Val = "00CD640D" };
            Rsid rsid461 = new Rsid() { Val = "00CD7822" };
            Rsid rsid462 = new Rsid() { Val = "00CE00F4" };
            Rsid rsid463 = new Rsid() { Val = "00CE2697" };
            Rsid rsid464 = new Rsid() { Val = "00CE4190" };
            Rsid rsid465 = new Rsid() { Val = "00CF0375" };
            Rsid rsid466 = new Rsid() { Val = "00CF1A39" };
            Rsid rsid467 = new Rsid() { Val = "00CF6CD9" };
            Rsid rsid468 = new Rsid() { Val = "00CF792B" };
            Rsid rsid469 = new Rsid() { Val = "00D044F7" };
            Rsid rsid470 = new Rsid() { Val = "00D21010" };
            Rsid rsid471 = new Rsid() { Val = "00D30FD4" };
            Rsid rsid472 = new Rsid() { Val = "00D45D86" };
            Rsid rsid473 = new Rsid() { Val = "00D472D3" };
            Rsid rsid474 = new Rsid() { Val = "00D476E9" };
            Rsid rsid475 = new Rsid() { Val = "00D54479" };
            Rsid rsid476 = new Rsid() { Val = "00D56F2A" };
            Rsid rsid477 = new Rsid() { Val = "00D61688" };
            Rsid rsid478 = new Rsid() { Val = "00D638CF" };
            Rsid rsid479 = new Rsid() { Val = "00D82451" };
            Rsid rsid480 = new Rsid() { Val = "00D964F7" };
            Rsid rsid481 = new Rsid() { Val = "00DA0438" };
            Rsid rsid482 = new Rsid() { Val = "00DB1812" };
            Rsid rsid483 = new Rsid() { Val = "00DC60A9" };
            Rsid rsid484 = new Rsid() { Val = "00DD1507" };
            Rsid rsid485 = new Rsid() { Val = "00DD28CF" };
            Rsid rsid486 = new Rsid() { Val = "00DD5313" };
            Rsid rsid487 = new Rsid() { Val = "00DE1E9E" };
            Rsid rsid488 = new Rsid() { Val = "00DE4E85" };
            Rsid rsid489 = new Rsid() { Val = "00DE5150" };
            Rsid rsid490 = new Rsid() { Val = "00DF7991" };
            Rsid rsid491 = new Rsid() { Val = "00DF7A00" };
            Rsid rsid492 = new Rsid() { Val = "00E05978" };
            Rsid rsid493 = new Rsid() { Val = "00E12989" };
            Rsid rsid494 = new Rsid() { Val = "00E13215" };
            Rsid rsid495 = new Rsid() { Val = "00E233D6" };
            Rsid rsid496 = new Rsid() { Val = "00E23827" };
            Rsid rsid497 = new Rsid() { Val = "00E3019A" };
            Rsid rsid498 = new Rsid() { Val = "00E3244C" };
            Rsid rsid499 = new Rsid() { Val = "00E42427" };
            Rsid rsid500 = new Rsid() { Val = "00E43317" };
            Rsid rsid501 = new Rsid() { Val = "00E5414D" };
            Rsid rsid502 = new Rsid() { Val = "00E548D5" };
            Rsid rsid503 = new Rsid() { Val = "00E57C83" };
            Rsid rsid504 = new Rsid() { Val = "00E700AE" };
            Rsid rsid505 = new Rsid() { Val = "00E731A9" };
            Rsid rsid506 = new Rsid() { Val = "00E73F4D" };
            Rsid rsid507 = new Rsid() { Val = "00E76CF0" };
            Rsid rsid508 = new Rsid() { Val = "00E800B3" };
            Rsid rsid509 = new Rsid() { Val = "00E826C3" };
            Rsid rsid510 = new Rsid() { Val = "00E842EE" };
            Rsid rsid511 = new Rsid() { Val = "00E845C9" };
            Rsid rsid512 = new Rsid() { Val = "00EA5022" };
            Rsid rsid513 = new Rsid() { Val = "00EB7CE4" };
            Rsid rsid514 = new Rsid() { Val = "00EC6F22" };
            Rsid rsid515 = new Rsid() { Val = "00ED0CB2" };
            Rsid rsid516 = new Rsid() { Val = "00ED29AE" };
            Rsid rsid517 = new Rsid() { Val = "00ED7E90" };
            Rsid rsid518 = new Rsid() { Val = "00EF0804" };
            Rsid rsid519 = new Rsid() { Val = "00EF1E49" };
            Rsid rsid520 = new Rsid() { Val = "00EF618A" };
            Rsid rsid521 = new Rsid() { Val = "00F01E8A" };
            Rsid rsid522 = new Rsid() { Val = "00F05B5D" };
            Rsid rsid523 = new Rsid() { Val = "00F075DE" };
            Rsid rsid524 = new Rsid() { Val = "00F07CF4" };
            Rsid rsid525 = new Rsid() { Val = "00F103A5" };
            Rsid rsid526 = new Rsid() { Val = "00F119DC" };
            Rsid rsid527 = new Rsid() { Val = "00F17F5E" };
            Rsid rsid528 = new Rsid() { Val = "00F218C6" };
            Rsid rsid529 = new Rsid() { Val = "00F26825" };
            Rsid rsid530 = new Rsid() { Val = "00F35ED0" };
            Rsid rsid531 = new Rsid() { Val = "00F37B19" };
            Rsid rsid532 = new Rsid() { Val = "00F46486" };
            Rsid rsid533 = new Rsid() { Val = "00F53809" };
            Rsid rsid534 = new Rsid() { Val = "00F53D5B" };
            Rsid rsid535 = new Rsid() { Val = "00F54FB2" };
            Rsid rsid536 = new Rsid() { Val = "00F62376" };
            Rsid rsid537 = new Rsid() { Val = "00F74A3B" };
            Rsid rsid538 = new Rsid() { Val = "00F7642D" };
            Rsid rsid539 = new Rsid() { Val = "00F842B6" };
            Rsid rsid540 = new Rsid() { Val = "00FA6B76" };
            Rsid rsid541 = new Rsid() { Val = "00FB35FE" };
            Rsid rsid542 = new Rsid() { Val = "00FB5302" };
            Rsid rsid543 = new Rsid() { Val = "00FB6F7F" };
            Rsid rsid544 = new Rsid() { Val = "00FC2FFD" };
            Rsid rsid545 = new Rsid() { Val = "00FC69BE" };
            Rsid rsid546 = new Rsid() { Val = "00FD191C" };
            Rsid rsid547 = new Rsid() { Val = "00FD1BF1" };
            Rsid rsid548 = new Rsid() { Val = "00FD5503" };
            Rsid rsid549 = new Rsid() { Val = "00FE129D" };
            Rsid rsid550 = new Rsid() { Val = "00FE1F8F" };
            Rsid rsid551 = new Rsid() { Val = "00FE2DB8" };
            Rsid rsid552 = new Rsid() { Val = "00FE2E92" };

            rsids1.Append(rsidRoot1);
            rsids1.Append(rsid1);
            rsids1.Append(rsid2);
            rsids1.Append(rsid3);
            rsids1.Append(rsid4);
            rsids1.Append(rsid5);
            rsids1.Append(rsid6);
            rsids1.Append(rsid7);
            rsids1.Append(rsid8);
            rsids1.Append(rsid9);
            rsids1.Append(rsid10);
            rsids1.Append(rsid11);
            rsids1.Append(rsid12);
            rsids1.Append(rsid13);
            rsids1.Append(rsid14);
            rsids1.Append(rsid15);
            rsids1.Append(rsid16);
            rsids1.Append(rsid17);
            rsids1.Append(rsid18);
            rsids1.Append(rsid19);
            rsids1.Append(rsid20);
            rsids1.Append(rsid21);
            rsids1.Append(rsid22);
            rsids1.Append(rsid23);
            rsids1.Append(rsid24);
            rsids1.Append(rsid25);
            rsids1.Append(rsid26);
            rsids1.Append(rsid27);
            rsids1.Append(rsid28);
            rsids1.Append(rsid29);
            rsids1.Append(rsid30);
            rsids1.Append(rsid31);
            rsids1.Append(rsid32);
            rsids1.Append(rsid33);
            rsids1.Append(rsid34);
            rsids1.Append(rsid35);
            rsids1.Append(rsid36);
            rsids1.Append(rsid37);
            rsids1.Append(rsid38);
            rsids1.Append(rsid39);
            rsids1.Append(rsid40);
            rsids1.Append(rsid41);
            rsids1.Append(rsid42);
            rsids1.Append(rsid43);
            rsids1.Append(rsid44);
            rsids1.Append(rsid45);
            rsids1.Append(rsid46);
            rsids1.Append(rsid47);
            rsids1.Append(rsid48);
            rsids1.Append(rsid49);
            rsids1.Append(rsid50);
            rsids1.Append(rsid51);
            rsids1.Append(rsid52);
            rsids1.Append(rsid53);
            rsids1.Append(rsid54);
            rsids1.Append(rsid55);
            rsids1.Append(rsid56);
            rsids1.Append(rsid57);
            rsids1.Append(rsid58);
            rsids1.Append(rsid59);
            rsids1.Append(rsid60);
            rsids1.Append(rsid61);
            rsids1.Append(rsid62);
            rsids1.Append(rsid63);
            rsids1.Append(rsid64);
            rsids1.Append(rsid65);
            rsids1.Append(rsid66);
            rsids1.Append(rsid67);
            rsids1.Append(rsid68);
            rsids1.Append(rsid69);
            rsids1.Append(rsid70);
            rsids1.Append(rsid71);
            rsids1.Append(rsid72);
            rsids1.Append(rsid73);
            rsids1.Append(rsid74);
            rsids1.Append(rsid75);
            rsids1.Append(rsid76);
            rsids1.Append(rsid77);
            rsids1.Append(rsid78);
            rsids1.Append(rsid79);
            rsids1.Append(rsid80);
            rsids1.Append(rsid81);
            rsids1.Append(rsid82);
            rsids1.Append(rsid83);
            rsids1.Append(rsid84);
            rsids1.Append(rsid85);
            rsids1.Append(rsid86);
            rsids1.Append(rsid87);
            rsids1.Append(rsid88);
            rsids1.Append(rsid89);
            rsids1.Append(rsid90);
            rsids1.Append(rsid91);
            rsids1.Append(rsid92);
            rsids1.Append(rsid93);
            rsids1.Append(rsid94);
            rsids1.Append(rsid95);
            rsids1.Append(rsid96);
            rsids1.Append(rsid97);
            rsids1.Append(rsid98);
            rsids1.Append(rsid99);
            rsids1.Append(rsid100);
            rsids1.Append(rsid101);
            rsids1.Append(rsid102);
            rsids1.Append(rsid103);
            rsids1.Append(rsid104);
            rsids1.Append(rsid105);
            rsids1.Append(rsid106);
            rsids1.Append(rsid107);
            rsids1.Append(rsid108);
            rsids1.Append(rsid109);
            rsids1.Append(rsid110);
            rsids1.Append(rsid111);
            rsids1.Append(rsid112);
            rsids1.Append(rsid113);
            rsids1.Append(rsid114);
            rsids1.Append(rsid115);
            rsids1.Append(rsid116);
            rsids1.Append(rsid117);
            rsids1.Append(rsid118);
            rsids1.Append(rsid119);
            rsids1.Append(rsid120);
            rsids1.Append(rsid121);
            rsids1.Append(rsid122);
            rsids1.Append(rsid123);
            rsids1.Append(rsid124);
            rsids1.Append(rsid125);
            rsids1.Append(rsid126);
            rsids1.Append(rsid127);
            rsids1.Append(rsid128);
            rsids1.Append(rsid129);
            rsids1.Append(rsid130);
            rsids1.Append(rsid131);
            rsids1.Append(rsid132);
            rsids1.Append(rsid133);
            rsids1.Append(rsid134);
            rsids1.Append(rsid135);
            rsids1.Append(rsid136);
            rsids1.Append(rsid137);
            rsids1.Append(rsid138);
            rsids1.Append(rsid139);
            rsids1.Append(rsid140);
            rsids1.Append(rsid141);
            rsids1.Append(rsid142);
            rsids1.Append(rsid143);
            rsids1.Append(rsid144);
            rsids1.Append(rsid145);
            rsids1.Append(rsid146);
            rsids1.Append(rsid147);
            rsids1.Append(rsid148);
            rsids1.Append(rsid149);
            rsids1.Append(rsid150);
            rsids1.Append(rsid151);
            rsids1.Append(rsid152);
            rsids1.Append(rsid153);
            rsids1.Append(rsid154);
            rsids1.Append(rsid155);
            rsids1.Append(rsid156);
            rsids1.Append(rsid157);
            rsids1.Append(rsid158);
            rsids1.Append(rsid159);
            rsids1.Append(rsid160);
            rsids1.Append(rsid161);
            rsids1.Append(rsid162);
            rsids1.Append(rsid163);
            rsids1.Append(rsid164);
            rsids1.Append(rsid165);
            rsids1.Append(rsid166);
            rsids1.Append(rsid167);
            rsids1.Append(rsid168);
            rsids1.Append(rsid169);
            rsids1.Append(rsid170);
            rsids1.Append(rsid171);
            rsids1.Append(rsid172);
            rsids1.Append(rsid173);
            rsids1.Append(rsid174);
            rsids1.Append(rsid175);
            rsids1.Append(rsid176);
            rsids1.Append(rsid177);
            rsids1.Append(rsid178);
            rsids1.Append(rsid179);
            rsids1.Append(rsid180);
            rsids1.Append(rsid181);
            rsids1.Append(rsid182);
            rsids1.Append(rsid183);
            rsids1.Append(rsid184);
            rsids1.Append(rsid185);
            rsids1.Append(rsid186);
            rsids1.Append(rsid187);
            rsids1.Append(rsid188);
            rsids1.Append(rsid189);
            rsids1.Append(rsid190);
            rsids1.Append(rsid191);
            rsids1.Append(rsid192);
            rsids1.Append(rsid193);
            rsids1.Append(rsid194);
            rsids1.Append(rsid195);
            rsids1.Append(rsid196);
            rsids1.Append(rsid197);
            rsids1.Append(rsid198);
            rsids1.Append(rsid199);
            rsids1.Append(rsid200);
            rsids1.Append(rsid201);
            rsids1.Append(rsid202);
            rsids1.Append(rsid203);
            rsids1.Append(rsid204);
            rsids1.Append(rsid205);
            rsids1.Append(rsid206);
            rsids1.Append(rsid207);
            rsids1.Append(rsid208);
            rsids1.Append(rsid209);
            rsids1.Append(rsid210);
            rsids1.Append(rsid211);
            rsids1.Append(rsid212);
            rsids1.Append(rsid213);
            rsids1.Append(rsid214);
            rsids1.Append(rsid215);
            rsids1.Append(rsid216);
            rsids1.Append(rsid217);
            rsids1.Append(rsid218);
            rsids1.Append(rsid219);
            rsids1.Append(rsid220);
            rsids1.Append(rsid221);
            rsids1.Append(rsid222);
            rsids1.Append(rsid223);
            rsids1.Append(rsid224);
            rsids1.Append(rsid225);
            rsids1.Append(rsid226);
            rsids1.Append(rsid227);
            rsids1.Append(rsid228);
            rsids1.Append(rsid229);
            rsids1.Append(rsid230);
            rsids1.Append(rsid231);
            rsids1.Append(rsid232);
            rsids1.Append(rsid233);
            rsids1.Append(rsid234);
            rsids1.Append(rsid235);
            rsids1.Append(rsid236);
            rsids1.Append(rsid237);
            rsids1.Append(rsid238);
            rsids1.Append(rsid239);
            rsids1.Append(rsid240);
            rsids1.Append(rsid241);
            rsids1.Append(rsid242);
            rsids1.Append(rsid243);
            rsids1.Append(rsid244);
            rsids1.Append(rsid245);
            rsids1.Append(rsid246);
            rsids1.Append(rsid247);
            rsids1.Append(rsid248);
            rsids1.Append(rsid249);
            rsids1.Append(rsid250);
            rsids1.Append(rsid251);
            rsids1.Append(rsid252);
            rsids1.Append(rsid253);
            rsids1.Append(rsid254);
            rsids1.Append(rsid255);
            rsids1.Append(rsid256);
            rsids1.Append(rsid257);
            rsids1.Append(rsid258);
            rsids1.Append(rsid259);
            rsids1.Append(rsid260);
            rsids1.Append(rsid261);
            rsids1.Append(rsid262);
            rsids1.Append(rsid263);
            rsids1.Append(rsid264);
            rsids1.Append(rsid265);
            rsids1.Append(rsid266);
            rsids1.Append(rsid267);
            rsids1.Append(rsid268);
            rsids1.Append(rsid269);
            rsids1.Append(rsid270);
            rsids1.Append(rsid271);
            rsids1.Append(rsid272);
            rsids1.Append(rsid273);
            rsids1.Append(rsid274);
            rsids1.Append(rsid275);
            rsids1.Append(rsid276);
            rsids1.Append(rsid277);
            rsids1.Append(rsid278);
            rsids1.Append(rsid279);
            rsids1.Append(rsid280);
            rsids1.Append(rsid281);
            rsids1.Append(rsid282);
            rsids1.Append(rsid283);
            rsids1.Append(rsid284);
            rsids1.Append(rsid285);
            rsids1.Append(rsid286);
            rsids1.Append(rsid287);
            rsids1.Append(rsid288);
            rsids1.Append(rsid289);
            rsids1.Append(rsid290);
            rsids1.Append(rsid291);
            rsids1.Append(rsid292);
            rsids1.Append(rsid293);
            rsids1.Append(rsid294);
            rsids1.Append(rsid295);
            rsids1.Append(rsid296);
            rsids1.Append(rsid297);
            rsids1.Append(rsid298);
            rsids1.Append(rsid299);
            rsids1.Append(rsid300);
            rsids1.Append(rsid301);
            rsids1.Append(rsid302);
            rsids1.Append(rsid303);
            rsids1.Append(rsid304);
            rsids1.Append(rsid305);
            rsids1.Append(rsid306);
            rsids1.Append(rsid307);
            rsids1.Append(rsid308);
            rsids1.Append(rsid309);
            rsids1.Append(rsid310);
            rsids1.Append(rsid311);
            rsids1.Append(rsid312);
            rsids1.Append(rsid313);
            rsids1.Append(rsid314);
            rsids1.Append(rsid315);
            rsids1.Append(rsid316);
            rsids1.Append(rsid317);
            rsids1.Append(rsid318);
            rsids1.Append(rsid319);
            rsids1.Append(rsid320);
            rsids1.Append(rsid321);
            rsids1.Append(rsid322);
            rsids1.Append(rsid323);
            rsids1.Append(rsid324);
            rsids1.Append(rsid325);
            rsids1.Append(rsid326);
            rsids1.Append(rsid327);
            rsids1.Append(rsid328);
            rsids1.Append(rsid329);
            rsids1.Append(rsid330);
            rsids1.Append(rsid331);
            rsids1.Append(rsid332);
            rsids1.Append(rsid333);
            rsids1.Append(rsid334);
            rsids1.Append(rsid335);
            rsids1.Append(rsid336);
            rsids1.Append(rsid337);
            rsids1.Append(rsid338);
            rsids1.Append(rsid339);
            rsids1.Append(rsid340);
            rsids1.Append(rsid341);
            rsids1.Append(rsid342);
            rsids1.Append(rsid343);
            rsids1.Append(rsid344);
            rsids1.Append(rsid345);
            rsids1.Append(rsid346);
            rsids1.Append(rsid347);
            rsids1.Append(rsid348);
            rsids1.Append(rsid349);
            rsids1.Append(rsid350);
            rsids1.Append(rsid351);
            rsids1.Append(rsid352);
            rsids1.Append(rsid353);
            rsids1.Append(rsid354);
            rsids1.Append(rsid355);
            rsids1.Append(rsid356);
            rsids1.Append(rsid357);
            rsids1.Append(rsid358);
            rsids1.Append(rsid359);
            rsids1.Append(rsid360);
            rsids1.Append(rsid361);
            rsids1.Append(rsid362);
            rsids1.Append(rsid363);
            rsids1.Append(rsid364);
            rsids1.Append(rsid365);
            rsids1.Append(rsid366);
            rsids1.Append(rsid367);
            rsids1.Append(rsid368);
            rsids1.Append(rsid369);
            rsids1.Append(rsid370);
            rsids1.Append(rsid371);
            rsids1.Append(rsid372);
            rsids1.Append(rsid373);
            rsids1.Append(rsid374);
            rsids1.Append(rsid375);
            rsids1.Append(rsid376);
            rsids1.Append(rsid377);
            rsids1.Append(rsid378);
            rsids1.Append(rsid379);
            rsids1.Append(rsid380);
            rsids1.Append(rsid381);
            rsids1.Append(rsid382);
            rsids1.Append(rsid383);
            rsids1.Append(rsid384);
            rsids1.Append(rsid385);
            rsids1.Append(rsid386);
            rsids1.Append(rsid387);
            rsids1.Append(rsid388);
            rsids1.Append(rsid389);
            rsids1.Append(rsid390);
            rsids1.Append(rsid391);
            rsids1.Append(rsid392);
            rsids1.Append(rsid393);
            rsids1.Append(rsid394);
            rsids1.Append(rsid395);
            rsids1.Append(rsid396);
            rsids1.Append(rsid397);
            rsids1.Append(rsid398);
            rsids1.Append(rsid399);
            rsids1.Append(rsid400);
            rsids1.Append(rsid401);
            rsids1.Append(rsid402);
            rsids1.Append(rsid403);
            rsids1.Append(rsid404);
            rsids1.Append(rsid405);
            rsids1.Append(rsid406);
            rsids1.Append(rsid407);
            rsids1.Append(rsid408);
            rsids1.Append(rsid409);
            rsids1.Append(rsid410);
            rsids1.Append(rsid411);
            rsids1.Append(rsid412);
            rsids1.Append(rsid413);
            rsids1.Append(rsid414);
            rsids1.Append(rsid415);
            rsids1.Append(rsid416);
            rsids1.Append(rsid417);
            rsids1.Append(rsid418);
            rsids1.Append(rsid419);
            rsids1.Append(rsid420);
            rsids1.Append(rsid421);
            rsids1.Append(rsid422);
            rsids1.Append(rsid423);
            rsids1.Append(rsid424);
            rsids1.Append(rsid425);
            rsids1.Append(rsid426);
            rsids1.Append(rsid427);
            rsids1.Append(rsid428);
            rsids1.Append(rsid429);
            rsids1.Append(rsid430);
            rsids1.Append(rsid431);
            rsids1.Append(rsid432);
            rsids1.Append(rsid433);
            rsids1.Append(rsid434);
            rsids1.Append(rsid435);
            rsids1.Append(rsid436);
            rsids1.Append(rsid437);
            rsids1.Append(rsid438);
            rsids1.Append(rsid439);
            rsids1.Append(rsid440);
            rsids1.Append(rsid441);
            rsids1.Append(rsid442);
            rsids1.Append(rsid443);
            rsids1.Append(rsid444);
            rsids1.Append(rsid445);
            rsids1.Append(rsid446);
            rsids1.Append(rsid447);
            rsids1.Append(rsid448);
            rsids1.Append(rsid449);
            rsids1.Append(rsid450);
            rsids1.Append(rsid451);
            rsids1.Append(rsid452);
            rsids1.Append(rsid453);
            rsids1.Append(rsid454);
            rsids1.Append(rsid455);
            rsids1.Append(rsid456);
            rsids1.Append(rsid457);
            rsids1.Append(rsid458);
            rsids1.Append(rsid459);
            rsids1.Append(rsid460);
            rsids1.Append(rsid461);
            rsids1.Append(rsid462);
            rsids1.Append(rsid463);
            rsids1.Append(rsid464);
            rsids1.Append(rsid465);
            rsids1.Append(rsid466);
            rsids1.Append(rsid467);
            rsids1.Append(rsid468);
            rsids1.Append(rsid469);
            rsids1.Append(rsid470);
            rsids1.Append(rsid471);
            rsids1.Append(rsid472);
            rsids1.Append(rsid473);
            rsids1.Append(rsid474);
            rsids1.Append(rsid475);
            rsids1.Append(rsid476);
            rsids1.Append(rsid477);
            rsids1.Append(rsid478);
            rsids1.Append(rsid479);
            rsids1.Append(rsid480);
            rsids1.Append(rsid481);
            rsids1.Append(rsid482);
            rsids1.Append(rsid483);
            rsids1.Append(rsid484);
            rsids1.Append(rsid485);
            rsids1.Append(rsid486);
            rsids1.Append(rsid487);
            rsids1.Append(rsid488);
            rsids1.Append(rsid489);
            rsids1.Append(rsid490);
            rsids1.Append(rsid491);
            rsids1.Append(rsid492);
            rsids1.Append(rsid493);
            rsids1.Append(rsid494);
            rsids1.Append(rsid495);
            rsids1.Append(rsid496);
            rsids1.Append(rsid497);
            rsids1.Append(rsid498);
            rsids1.Append(rsid499);
            rsids1.Append(rsid500);
            rsids1.Append(rsid501);
            rsids1.Append(rsid502);
            rsids1.Append(rsid503);
            rsids1.Append(rsid504);
            rsids1.Append(rsid505);
            rsids1.Append(rsid506);
            rsids1.Append(rsid507);
            rsids1.Append(rsid508);
            rsids1.Append(rsid509);
            rsids1.Append(rsid510);
            rsids1.Append(rsid511);
            rsids1.Append(rsid512);
            rsids1.Append(rsid513);
            rsids1.Append(rsid514);
            rsids1.Append(rsid515);
            rsids1.Append(rsid516);
            rsids1.Append(rsid517);
            rsids1.Append(rsid518);
            rsids1.Append(rsid519);
            rsids1.Append(rsid520);
            rsids1.Append(rsid521);
            rsids1.Append(rsid522);
            rsids1.Append(rsid523);
            rsids1.Append(rsid524);
            rsids1.Append(rsid525);
            rsids1.Append(rsid526);
            rsids1.Append(rsid527);
            rsids1.Append(rsid528);
            rsids1.Append(rsid529);
            rsids1.Append(rsid530);
            rsids1.Append(rsid531);
            rsids1.Append(rsid532);
            rsids1.Append(rsid533);
            rsids1.Append(rsid534);
            rsids1.Append(rsid535);
            rsids1.Append(rsid536);
            rsids1.Append(rsid537);
            rsids1.Append(rsid538);
            rsids1.Append(rsid539);
            rsids1.Append(rsid540);
            rsids1.Append(rsid541);
            rsids1.Append(rsid542);
            rsids1.Append(rsid543);
            rsids1.Append(rsid544);
            rsids1.Append(rsid545);
            rsids1.Append(rsid546);
            rsids1.Append(rsid547);
            rsids1.Append(rsid548);
            rsids1.Append(rsid549);
            rsids1.Append(rsid550);
            rsids1.Append(rsid551);
            rsids1.Append(rsid552);

            M.MathProperties mathProperties1 = new M.MathProperties();
            M.MathFont mathFont1 = new M.MathFont() { Val = "Cambria Math" };
            M.BreakBinary breakBinary1 = new M.BreakBinary() { Val = M.BreakBinaryOperatorValues.Before };
            M.BreakBinarySubtraction breakBinarySubtraction1 = new M.BreakBinarySubtraction() { Val = M.BreakBinarySubtractionValues.MinusMinus };
            M.SmallFraction smallFraction1 = new M.SmallFraction() { Val = M.BooleanValues.Zero };
            M.DisplayDefaults displayDefaults1 = new M.DisplayDefaults();
            M.LeftMargin leftMargin1 = new M.LeftMargin() { Val = (UInt32Value)0U };
            M.RightMargin rightMargin1 = new M.RightMargin() { Val = (UInt32Value)0U };
            M.DefaultJustification defaultJustification1 = new M.DefaultJustification() { Val = M.JustificationValues.CenterGroup };
            M.WrapIndent wrapIndent1 = new M.WrapIndent() { Val = (UInt32Value)1440U };
            M.IntegralLimitLocation integralLimitLocation1 = new M.IntegralLimitLocation() { Val = M.LimitLocationValues.SubscriptSuperscript };
            M.NaryLimitLocation naryLimitLocation1 = new M.NaryLimitLocation() { Val = M.LimitLocationValues.UnderOver };

            mathProperties1.Append(mathFont1);
            mathProperties1.Append(breakBinary1);
            mathProperties1.Append(breakBinarySubtraction1);
            mathProperties1.Append(smallFraction1);
            mathProperties1.Append(displayDefaults1);
            mathProperties1.Append(leftMargin1);
            mathProperties1.Append(rightMargin1);
            mathProperties1.Append(defaultJustification1);
            mathProperties1.Append(wrapIndent1);
            mathProperties1.Append(integralLimitLocation1);
            mathProperties1.Append(naryLimitLocation1);
            ThemeFontLanguages themeFontLanguages1 = new ThemeFontLanguages() { Val = "ru-RU" };
            ColorSchemeMapping colorSchemeMapping1 = new ColorSchemeMapping() { Background1 = ColorSchemeIndexValues.Light1, Text1 = ColorSchemeIndexValues.Dark1, Background2 = ColorSchemeIndexValues.Light2, Text2 = ColorSchemeIndexValues.Dark2, Accent1 = ColorSchemeIndexValues.Accent1, Accent2 = ColorSchemeIndexValues.Accent2, Accent3 = ColorSchemeIndexValues.Accent3, Accent4 = ColorSchemeIndexValues.Accent4, Accent5 = ColorSchemeIndexValues.Accent5, Accent6 = ColorSchemeIndexValues.Accent6, Hyperlink = ColorSchemeIndexValues.Hyperlink, FollowedHyperlink = ColorSchemeIndexValues.FollowedHyperlink };
            DoNotIncludeSubdocsInStats doNotIncludeSubdocsInStats1 = new DoNotIncludeSubdocsInStats();

            ShapeDefaults shapeDefaults1 = new ShapeDefaults();
            Ovml.ShapeDefaults shapeDefaults2 = new Ovml.ShapeDefaults() { Extension = V.ExtensionHandlingBehaviorValues.Edit, MaxShapeId = 1026 };

            Ovml.ShapeLayout shapeLayout1 = new Ovml.ShapeLayout() { Extension = V.ExtensionHandlingBehaviorValues.Edit };
            Ovml.ShapeIdMap shapeIdMap1 = new Ovml.ShapeIdMap() { Extension = V.ExtensionHandlingBehaviorValues.Edit, Data = "1" };

            shapeLayout1.Append(shapeIdMap1);

            shapeDefaults1.Append(shapeDefaults2);
            shapeDefaults1.Append(shapeLayout1);
            DecimalSymbol decimalSymbol1 = new DecimalSymbol() { Val = "," };
            ListSeparator listSeparator1 = new ListSeparator() { Val = ";" };
            W14.DocumentId documentId1 = new W14.DocumentId() { Val = "655F343C" };
            W15.ChartTrackingRefBased chartTrackingRefBased1 = new W15.ChartTrackingRefBased();
            W15.PersistentDocumentId persistentDocumentId1 = new W15.PersistentDocumentId() { Val = "{10DD053B-A9A3-4AC5-BDCA-E15B05B07C90}" };

            settings1.Append(zoom1);
            settings1.Append(proofState1);
            settings1.Append(stylePaneFormatFilter1);
            settings1.Append(defaultTabStop1);
            settings1.Append(noPunctuationKerning1);
            settings1.Append(characterSpacingControl1);
            settings1.Append(compatibility1);
            settings1.Append(rsids1);
            settings1.Append(mathProperties1);
            settings1.Append(themeFontLanguages1);
            settings1.Append(colorSchemeMapping1);
            settings1.Append(doNotIncludeSubdocsInStats1);
            settings1.Append(shapeDefaults1);
            settings1.Append(decimalSymbol1);
            settings1.Append(listSeparator1);
            settings1.Append(documentId1);
            settings1.Append(chartTrackingRefBased1);
            settings1.Append(persistentDocumentId1);

            documentSettingsPart1.Settings = settings1;
        }

        // Generates content of styleDefinitionsPart1.
        private void GenerateStyleDefinitionsPart1Content(StyleDefinitionsPart styleDefinitionsPart1)
        {
            Styles styles1 = new Styles() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "w14 w15 w16se" } };
            styles1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            styles1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            styles1.AddNamespaceDeclaration("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
            styles1.AddNamespaceDeclaration("w14", "http://schemas.microsoft.com/office/word/2010/wordml");
            styles1.AddNamespaceDeclaration("w15", "http://schemas.microsoft.com/office/word/2012/wordml");
            styles1.AddNamespaceDeclaration("w16se", "http://schemas.microsoft.com/office/word/2015/wordml/symex");

            DocDefaults docDefaults1 = new DocDefaults();

            RunPropertiesDefault runPropertiesDefault1 = new RunPropertiesDefault();

            RunPropertiesBaseStyle runPropertiesBaseStyle1 = new RunPropertiesBaseStyle();
            RunFonts runFonts1 = new RunFonts() { Ascii = "Times New Roman", HighAnsi = "Times New Roman", EastAsia = "Times New Roman", ComplexScript = "Times New Roman" };
            Languages languages42 = new Languages() { Val = "ru-RU", EastAsia = "ru-RU", Bidi = "ar-SA" };

            runPropertiesBaseStyle1.Append(runFonts1);
            runPropertiesBaseStyle1.Append(languages42);

            runPropertiesDefault1.Append(runPropertiesBaseStyle1);
            ParagraphPropertiesDefault paragraphPropertiesDefault1 = new ParagraphPropertiesDefault();

            docDefaults1.Append(runPropertiesDefault1);
            docDefaults1.Append(paragraphPropertiesDefault1);

            LatentStyles latentStyles1 = new LatentStyles() { DefaultLockedState = false, DefaultUiPriority = 0, DefaultSemiHidden = false, DefaultUnhideWhenUsed = false, DefaultPrimaryStyle = false, Count = 371 };
            LatentStyleExceptionInfo latentStyleExceptionInfo1 = new LatentStyleExceptionInfo() { Name = "Normal", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo2 = new LatentStyleExceptionInfo() { Name = "heading 1", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo3 = new LatentStyleExceptionInfo() { Name = "heading 2", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo4 = new LatentStyleExceptionInfo() { Name = "heading 3", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo5 = new LatentStyleExceptionInfo() { Name = "heading 4", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo6 = new LatentStyleExceptionInfo() { Name = "heading 5", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo7 = new LatentStyleExceptionInfo() { Name = "heading 6", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo8 = new LatentStyleExceptionInfo() { Name = "heading 7", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo9 = new LatentStyleExceptionInfo() { Name = "heading 8", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo10 = new LatentStyleExceptionInfo() { Name = "heading 9", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo11 = new LatentStyleExceptionInfo() { Name = "caption", SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo12 = new LatentStyleExceptionInfo() { Name = "Title", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo13 = new LatentStyleExceptionInfo() { Name = "Subtitle", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo14 = new LatentStyleExceptionInfo() { Name = "Strong", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo15 = new LatentStyleExceptionInfo() { Name = "Emphasis", PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo16 = new LatentStyleExceptionInfo() { Name = "Normal Table", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo17 = new LatentStyleExceptionInfo() { Name = "Table Simple 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo18 = new LatentStyleExceptionInfo() { Name = "Table Simple 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo19 = new LatentStyleExceptionInfo() { Name = "Table Simple 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo20 = new LatentStyleExceptionInfo() { Name = "Table Classic 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo21 = new LatentStyleExceptionInfo() { Name = "Table Classic 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo22 = new LatentStyleExceptionInfo() { Name = "Table Classic 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo23 = new LatentStyleExceptionInfo() { Name = "Table Classic 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo24 = new LatentStyleExceptionInfo() { Name = "Table Colorful 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo25 = new LatentStyleExceptionInfo() { Name = "Table Colorful 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo26 = new LatentStyleExceptionInfo() { Name = "Table Colorful 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo27 = new LatentStyleExceptionInfo() { Name = "Table Columns 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo28 = new LatentStyleExceptionInfo() { Name = "Table Columns 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo29 = new LatentStyleExceptionInfo() { Name = "Table Columns 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo30 = new LatentStyleExceptionInfo() { Name = "Table Columns 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo31 = new LatentStyleExceptionInfo() { Name = "Table Columns 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo32 = new LatentStyleExceptionInfo() { Name = "Table Grid 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo33 = new LatentStyleExceptionInfo() { Name = "Table Grid 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo34 = new LatentStyleExceptionInfo() { Name = "Table Grid 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo35 = new LatentStyleExceptionInfo() { Name = "Table Grid 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo36 = new LatentStyleExceptionInfo() { Name = "Table Grid 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo37 = new LatentStyleExceptionInfo() { Name = "Table Grid 6", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo38 = new LatentStyleExceptionInfo() { Name = "Table Grid 7", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo39 = new LatentStyleExceptionInfo() { Name = "Table Grid 8", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo40 = new LatentStyleExceptionInfo() { Name = "Table List 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo41 = new LatentStyleExceptionInfo() { Name = "Table List 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo42 = new LatentStyleExceptionInfo() { Name = "Table List 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo43 = new LatentStyleExceptionInfo() { Name = "Table List 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo44 = new LatentStyleExceptionInfo() { Name = "Table List 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo45 = new LatentStyleExceptionInfo() { Name = "Table List 6", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo46 = new LatentStyleExceptionInfo() { Name = "Table List 7", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo47 = new LatentStyleExceptionInfo() { Name = "Table List 8", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo48 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo49 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo50 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo51 = new LatentStyleExceptionInfo() { Name = "Table Contemporary", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo52 = new LatentStyleExceptionInfo() { Name = "Table Elegant", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo53 = new LatentStyleExceptionInfo() { Name = "Table Professional", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo54 = new LatentStyleExceptionInfo() { Name = "Table Subtle 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo55 = new LatentStyleExceptionInfo() { Name = "Table Subtle 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo56 = new LatentStyleExceptionInfo() { Name = "Table Web 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo57 = new LatentStyleExceptionInfo() { Name = "Table Web 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo58 = new LatentStyleExceptionInfo() { Name = "Table Web 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo59 = new LatentStyleExceptionInfo() { Name = "Table Theme", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo60 = new LatentStyleExceptionInfo() { Name = "Placeholder Text", UiPriority = 99, SemiHidden = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo61 = new LatentStyleExceptionInfo() { Name = "No Spacing", UiPriority = 1, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo62 = new LatentStyleExceptionInfo() { Name = "Light Shading", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo63 = new LatentStyleExceptionInfo() { Name = "Light List", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo64 = new LatentStyleExceptionInfo() { Name = "Light Grid", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo65 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo66 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo67 = new LatentStyleExceptionInfo() { Name = "Medium List 1", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo68 = new LatentStyleExceptionInfo() { Name = "Medium List 2", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo69 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo70 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo71 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo72 = new LatentStyleExceptionInfo() { Name = "Dark List", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo73 = new LatentStyleExceptionInfo() { Name = "Colorful Shading", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo74 = new LatentStyleExceptionInfo() { Name = "Colorful List", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo75 = new LatentStyleExceptionInfo() { Name = "Colorful Grid", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo76 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 1", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo77 = new LatentStyleExceptionInfo() { Name = "Light List Accent 1", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo78 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 1", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo79 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 1", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo80 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 1", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo81 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 1", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo82 = new LatentStyleExceptionInfo() { Name = "Revision", UiPriority = 99, SemiHidden = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo83 = new LatentStyleExceptionInfo() { Name = "List Paragraph", UiPriority = 34, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo84 = new LatentStyleExceptionInfo() { Name = "Quote", UiPriority = 29, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo85 = new LatentStyleExceptionInfo() { Name = "Intense Quote", UiPriority = 30, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo86 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 1", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo87 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 1", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo88 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 1", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo89 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 1", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo90 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 1", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo91 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 1", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo92 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 1", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo93 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 1", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo94 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 2", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo95 = new LatentStyleExceptionInfo() { Name = "Light List Accent 2", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo96 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 2", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo97 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 2", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo98 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 2", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo99 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 2", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo100 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 2", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo101 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 2", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo102 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 2", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo103 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 2", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo104 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 2", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo105 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 2", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo106 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 2", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo107 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 2", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo108 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 3", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo109 = new LatentStyleExceptionInfo() { Name = "Light List Accent 3", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo110 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 3", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo111 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 3", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo112 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 3", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo113 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 3", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo114 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 3", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo115 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 3", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo116 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 3", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo117 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 3", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo118 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 3", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo119 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 3", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo120 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 3", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo121 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 3", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo122 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 4", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo123 = new LatentStyleExceptionInfo() { Name = "Light List Accent 4", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo124 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 4", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo125 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 4", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo126 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 4", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo127 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 4", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo128 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 4", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo129 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 4", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo130 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 4", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo131 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 4", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo132 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 4", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo133 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 4", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo134 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 4", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo135 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 4", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo136 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 5", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo137 = new LatentStyleExceptionInfo() { Name = "Light List Accent 5", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo138 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 5", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo139 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 5", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo140 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 5", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo141 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 5", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo142 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 5", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo143 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 5", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo144 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 5", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo145 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 5", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo146 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 5", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo147 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 5", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo148 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 5", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo149 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 5", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo150 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 6", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo151 = new LatentStyleExceptionInfo() { Name = "Light List Accent 6", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo152 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 6", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo153 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 6", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo154 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 6", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo155 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 6", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo156 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 6", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo157 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 6", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo158 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 6", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo159 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 6", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo160 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 6", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo161 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 6", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo162 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 6", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo163 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 6", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo164 = new LatentStyleExceptionInfo() { Name = "Subtle Emphasis", UiPriority = 19, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo165 = new LatentStyleExceptionInfo() { Name = "Intense Emphasis", UiPriority = 21, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo166 = new LatentStyleExceptionInfo() { Name = "Subtle Reference", UiPriority = 31, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo167 = new LatentStyleExceptionInfo() { Name = "Intense Reference", UiPriority = 32, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo168 = new LatentStyleExceptionInfo() { Name = "Book Title", UiPriority = 33, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo169 = new LatentStyleExceptionInfo() { Name = "Bibliography", UiPriority = 37, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo170 = new LatentStyleExceptionInfo() { Name = "TOC Heading", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo171 = new LatentStyleExceptionInfo() { Name = "Plain Table 1", UiPriority = 41 };
            LatentStyleExceptionInfo latentStyleExceptionInfo172 = new LatentStyleExceptionInfo() { Name = "Plain Table 2", UiPriority = 42 };
            LatentStyleExceptionInfo latentStyleExceptionInfo173 = new LatentStyleExceptionInfo() { Name = "Plain Table 3", UiPriority = 43 };
            LatentStyleExceptionInfo latentStyleExceptionInfo174 = new LatentStyleExceptionInfo() { Name = "Plain Table 4", UiPriority = 44 };
            LatentStyleExceptionInfo latentStyleExceptionInfo175 = new LatentStyleExceptionInfo() { Name = "Plain Table 5", UiPriority = 45 };
            LatentStyleExceptionInfo latentStyleExceptionInfo176 = new LatentStyleExceptionInfo() { Name = "Grid Table Light", UiPriority = 40 };
            LatentStyleExceptionInfo latentStyleExceptionInfo177 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo178 = new LatentStyleExceptionInfo() { Name = "Grid Table 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo179 = new LatentStyleExceptionInfo() { Name = "Grid Table 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo180 = new LatentStyleExceptionInfo() { Name = "Grid Table 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo181 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo182 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo183 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo184 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 1", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo185 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 1", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo186 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 1", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo187 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 1", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo188 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 1", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo189 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 1", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo190 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 1", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo191 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 2", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo192 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo193 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 2", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo194 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 2", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo195 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 2", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo196 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 2", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo197 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 2", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo198 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 3", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo199 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 3", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo200 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo201 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 3", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo202 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 3", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo203 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 3", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo204 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 3", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo205 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 4", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo206 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 4", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo207 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 4", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo208 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo209 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 4", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo210 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 4", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo211 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 4", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo212 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 5", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo213 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 5", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo214 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 5", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo215 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 5", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo216 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 5", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo217 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 5", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo218 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 5", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo219 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 6", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo220 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 6", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo221 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 6", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo222 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 6", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo223 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 6", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo224 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 6", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo225 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 6", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo226 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo227 = new LatentStyleExceptionInfo() { Name = "List Table 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo228 = new LatentStyleExceptionInfo() { Name = "List Table 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo229 = new LatentStyleExceptionInfo() { Name = "List Table 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo230 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo231 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo232 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo233 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 1", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo234 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 1", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo235 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 1", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo236 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 1", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo237 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 1", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo238 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 1", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo239 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 1", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo240 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 2", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo241 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo242 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 2", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo243 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 2", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo244 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 2", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo245 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 2", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo246 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 2", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo247 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 3", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo248 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 3", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo249 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo250 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 3", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo251 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 3", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo252 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 3", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo253 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 3", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo254 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 4", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo255 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 4", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo256 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 4", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo257 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo258 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 4", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo259 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 4", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo260 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 4", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo261 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 5", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo262 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 5", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo263 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 5", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo264 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 5", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo265 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 5", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo266 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 5", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo267 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 5", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo268 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 6", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo269 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 6", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo270 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 6", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo271 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 6", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo272 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 6", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo273 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 6", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo274 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 6", UiPriority = 52 };

            latentStyles1.Append(latentStyleExceptionInfo1);
            latentStyles1.Append(latentStyleExceptionInfo2);
            latentStyles1.Append(latentStyleExceptionInfo3);
            latentStyles1.Append(latentStyleExceptionInfo4);
            latentStyles1.Append(latentStyleExceptionInfo5);
            latentStyles1.Append(latentStyleExceptionInfo6);
            latentStyles1.Append(latentStyleExceptionInfo7);
            latentStyles1.Append(latentStyleExceptionInfo8);
            latentStyles1.Append(latentStyleExceptionInfo9);
            latentStyles1.Append(latentStyleExceptionInfo10);
            latentStyles1.Append(latentStyleExceptionInfo11);
            latentStyles1.Append(latentStyleExceptionInfo12);
            latentStyles1.Append(latentStyleExceptionInfo13);
            latentStyles1.Append(latentStyleExceptionInfo14);
            latentStyles1.Append(latentStyleExceptionInfo15);
            latentStyles1.Append(latentStyleExceptionInfo16);
            latentStyles1.Append(latentStyleExceptionInfo17);
            latentStyles1.Append(latentStyleExceptionInfo18);
            latentStyles1.Append(latentStyleExceptionInfo19);
            latentStyles1.Append(latentStyleExceptionInfo20);
            latentStyles1.Append(latentStyleExceptionInfo21);
            latentStyles1.Append(latentStyleExceptionInfo22);
            latentStyles1.Append(latentStyleExceptionInfo23);
            latentStyles1.Append(latentStyleExceptionInfo24);
            latentStyles1.Append(latentStyleExceptionInfo25);
            latentStyles1.Append(latentStyleExceptionInfo26);
            latentStyles1.Append(latentStyleExceptionInfo27);
            latentStyles1.Append(latentStyleExceptionInfo28);
            latentStyles1.Append(latentStyleExceptionInfo29);
            latentStyles1.Append(latentStyleExceptionInfo30);
            latentStyles1.Append(latentStyleExceptionInfo31);
            latentStyles1.Append(latentStyleExceptionInfo32);
            latentStyles1.Append(latentStyleExceptionInfo33);
            latentStyles1.Append(latentStyleExceptionInfo34);
            latentStyles1.Append(latentStyleExceptionInfo35);
            latentStyles1.Append(latentStyleExceptionInfo36);
            latentStyles1.Append(latentStyleExceptionInfo37);
            latentStyles1.Append(latentStyleExceptionInfo38);
            latentStyles1.Append(latentStyleExceptionInfo39);
            latentStyles1.Append(latentStyleExceptionInfo40);
            latentStyles1.Append(latentStyleExceptionInfo41);
            latentStyles1.Append(latentStyleExceptionInfo42);
            latentStyles1.Append(latentStyleExceptionInfo43);
            latentStyles1.Append(latentStyleExceptionInfo44);
            latentStyles1.Append(latentStyleExceptionInfo45);
            latentStyles1.Append(latentStyleExceptionInfo46);
            latentStyles1.Append(latentStyleExceptionInfo47);
            latentStyles1.Append(latentStyleExceptionInfo48);
            latentStyles1.Append(latentStyleExceptionInfo49);
            latentStyles1.Append(latentStyleExceptionInfo50);
            latentStyles1.Append(latentStyleExceptionInfo51);
            latentStyles1.Append(latentStyleExceptionInfo52);
            latentStyles1.Append(latentStyleExceptionInfo53);
            latentStyles1.Append(latentStyleExceptionInfo54);
            latentStyles1.Append(latentStyleExceptionInfo55);
            latentStyles1.Append(latentStyleExceptionInfo56);
            latentStyles1.Append(latentStyleExceptionInfo57);
            latentStyles1.Append(latentStyleExceptionInfo58);
            latentStyles1.Append(latentStyleExceptionInfo59);
            latentStyles1.Append(latentStyleExceptionInfo60);
            latentStyles1.Append(latentStyleExceptionInfo61);
            latentStyles1.Append(latentStyleExceptionInfo62);
            latentStyles1.Append(latentStyleExceptionInfo63);
            latentStyles1.Append(latentStyleExceptionInfo64);
            latentStyles1.Append(latentStyleExceptionInfo65);
            latentStyles1.Append(latentStyleExceptionInfo66);
            latentStyles1.Append(latentStyleExceptionInfo67);
            latentStyles1.Append(latentStyleExceptionInfo68);
            latentStyles1.Append(latentStyleExceptionInfo69);
            latentStyles1.Append(latentStyleExceptionInfo70);
            latentStyles1.Append(latentStyleExceptionInfo71);
            latentStyles1.Append(latentStyleExceptionInfo72);
            latentStyles1.Append(latentStyleExceptionInfo73);
            latentStyles1.Append(latentStyleExceptionInfo74);
            latentStyles1.Append(latentStyleExceptionInfo75);
            latentStyles1.Append(latentStyleExceptionInfo76);
            latentStyles1.Append(latentStyleExceptionInfo77);
            latentStyles1.Append(latentStyleExceptionInfo78);
            latentStyles1.Append(latentStyleExceptionInfo79);
            latentStyles1.Append(latentStyleExceptionInfo80);
            latentStyles1.Append(latentStyleExceptionInfo81);
            latentStyles1.Append(latentStyleExceptionInfo82);
            latentStyles1.Append(latentStyleExceptionInfo83);
            latentStyles1.Append(latentStyleExceptionInfo84);
            latentStyles1.Append(latentStyleExceptionInfo85);
            latentStyles1.Append(latentStyleExceptionInfo86);
            latentStyles1.Append(latentStyleExceptionInfo87);
            latentStyles1.Append(latentStyleExceptionInfo88);
            latentStyles1.Append(latentStyleExceptionInfo89);
            latentStyles1.Append(latentStyleExceptionInfo90);
            latentStyles1.Append(latentStyleExceptionInfo91);
            latentStyles1.Append(latentStyleExceptionInfo92);
            latentStyles1.Append(latentStyleExceptionInfo93);
            latentStyles1.Append(latentStyleExceptionInfo94);
            latentStyles1.Append(latentStyleExceptionInfo95);
            latentStyles1.Append(latentStyleExceptionInfo96);
            latentStyles1.Append(latentStyleExceptionInfo97);
            latentStyles1.Append(latentStyleExceptionInfo98);
            latentStyles1.Append(latentStyleExceptionInfo99);
            latentStyles1.Append(latentStyleExceptionInfo100);
            latentStyles1.Append(latentStyleExceptionInfo101);
            latentStyles1.Append(latentStyleExceptionInfo102);
            latentStyles1.Append(latentStyleExceptionInfo103);
            latentStyles1.Append(latentStyleExceptionInfo104);
            latentStyles1.Append(latentStyleExceptionInfo105);
            latentStyles1.Append(latentStyleExceptionInfo106);
            latentStyles1.Append(latentStyleExceptionInfo107);
            latentStyles1.Append(latentStyleExceptionInfo108);
            latentStyles1.Append(latentStyleExceptionInfo109);
            latentStyles1.Append(latentStyleExceptionInfo110);
            latentStyles1.Append(latentStyleExceptionInfo111);
            latentStyles1.Append(latentStyleExceptionInfo112);
            latentStyles1.Append(latentStyleExceptionInfo113);
            latentStyles1.Append(latentStyleExceptionInfo114);
            latentStyles1.Append(latentStyleExceptionInfo115);
            latentStyles1.Append(latentStyleExceptionInfo116);
            latentStyles1.Append(latentStyleExceptionInfo117);
            latentStyles1.Append(latentStyleExceptionInfo118);
            latentStyles1.Append(latentStyleExceptionInfo119);
            latentStyles1.Append(latentStyleExceptionInfo120);
            latentStyles1.Append(latentStyleExceptionInfo121);
            latentStyles1.Append(latentStyleExceptionInfo122);
            latentStyles1.Append(latentStyleExceptionInfo123);
            latentStyles1.Append(latentStyleExceptionInfo124);
            latentStyles1.Append(latentStyleExceptionInfo125);
            latentStyles1.Append(latentStyleExceptionInfo126);
            latentStyles1.Append(latentStyleExceptionInfo127);
            latentStyles1.Append(latentStyleExceptionInfo128);
            latentStyles1.Append(latentStyleExceptionInfo129);
            latentStyles1.Append(latentStyleExceptionInfo130);
            latentStyles1.Append(latentStyleExceptionInfo131);
            latentStyles1.Append(latentStyleExceptionInfo132);
            latentStyles1.Append(latentStyleExceptionInfo133);
            latentStyles1.Append(latentStyleExceptionInfo134);
            latentStyles1.Append(latentStyleExceptionInfo135);
            latentStyles1.Append(latentStyleExceptionInfo136);
            latentStyles1.Append(latentStyleExceptionInfo137);
            latentStyles1.Append(latentStyleExceptionInfo138);
            latentStyles1.Append(latentStyleExceptionInfo139);
            latentStyles1.Append(latentStyleExceptionInfo140);
            latentStyles1.Append(latentStyleExceptionInfo141);
            latentStyles1.Append(latentStyleExceptionInfo142);
            latentStyles1.Append(latentStyleExceptionInfo143);
            latentStyles1.Append(latentStyleExceptionInfo144);
            latentStyles1.Append(latentStyleExceptionInfo145);
            latentStyles1.Append(latentStyleExceptionInfo146);
            latentStyles1.Append(latentStyleExceptionInfo147);
            latentStyles1.Append(latentStyleExceptionInfo148);
            latentStyles1.Append(latentStyleExceptionInfo149);
            latentStyles1.Append(latentStyleExceptionInfo150);
            latentStyles1.Append(latentStyleExceptionInfo151);
            latentStyles1.Append(latentStyleExceptionInfo152);
            latentStyles1.Append(latentStyleExceptionInfo153);
            latentStyles1.Append(latentStyleExceptionInfo154);
            latentStyles1.Append(latentStyleExceptionInfo155);
            latentStyles1.Append(latentStyleExceptionInfo156);
            latentStyles1.Append(latentStyleExceptionInfo157);
            latentStyles1.Append(latentStyleExceptionInfo158);
            latentStyles1.Append(latentStyleExceptionInfo159);
            latentStyles1.Append(latentStyleExceptionInfo160);
            latentStyles1.Append(latentStyleExceptionInfo161);
            latentStyles1.Append(latentStyleExceptionInfo162);
            latentStyles1.Append(latentStyleExceptionInfo163);
            latentStyles1.Append(latentStyleExceptionInfo164);
            latentStyles1.Append(latentStyleExceptionInfo165);
            latentStyles1.Append(latentStyleExceptionInfo166);
            latentStyles1.Append(latentStyleExceptionInfo167);
            latentStyles1.Append(latentStyleExceptionInfo168);
            latentStyles1.Append(latentStyleExceptionInfo169);
            latentStyles1.Append(latentStyleExceptionInfo170);
            latentStyles1.Append(latentStyleExceptionInfo171);
            latentStyles1.Append(latentStyleExceptionInfo172);
            latentStyles1.Append(latentStyleExceptionInfo173);
            latentStyles1.Append(latentStyleExceptionInfo174);
            latentStyles1.Append(latentStyleExceptionInfo175);
            latentStyles1.Append(latentStyleExceptionInfo176);
            latentStyles1.Append(latentStyleExceptionInfo177);
            latentStyles1.Append(latentStyleExceptionInfo178);
            latentStyles1.Append(latentStyleExceptionInfo179);
            latentStyles1.Append(latentStyleExceptionInfo180);
            latentStyles1.Append(latentStyleExceptionInfo181);
            latentStyles1.Append(latentStyleExceptionInfo182);
            latentStyles1.Append(latentStyleExceptionInfo183);
            latentStyles1.Append(latentStyleExceptionInfo184);
            latentStyles1.Append(latentStyleExceptionInfo185);
            latentStyles1.Append(latentStyleExceptionInfo186);
            latentStyles1.Append(latentStyleExceptionInfo187);
            latentStyles1.Append(latentStyleExceptionInfo188);
            latentStyles1.Append(latentStyleExceptionInfo189);
            latentStyles1.Append(latentStyleExceptionInfo190);
            latentStyles1.Append(latentStyleExceptionInfo191);
            latentStyles1.Append(latentStyleExceptionInfo192);
            latentStyles1.Append(latentStyleExceptionInfo193);
            latentStyles1.Append(latentStyleExceptionInfo194);
            latentStyles1.Append(latentStyleExceptionInfo195);
            latentStyles1.Append(latentStyleExceptionInfo196);
            latentStyles1.Append(latentStyleExceptionInfo197);
            latentStyles1.Append(latentStyleExceptionInfo198);
            latentStyles1.Append(latentStyleExceptionInfo199);
            latentStyles1.Append(latentStyleExceptionInfo200);
            latentStyles1.Append(latentStyleExceptionInfo201);
            latentStyles1.Append(latentStyleExceptionInfo202);
            latentStyles1.Append(latentStyleExceptionInfo203);
            latentStyles1.Append(latentStyleExceptionInfo204);
            latentStyles1.Append(latentStyleExceptionInfo205);
            latentStyles1.Append(latentStyleExceptionInfo206);
            latentStyles1.Append(latentStyleExceptionInfo207);
            latentStyles1.Append(latentStyleExceptionInfo208);
            latentStyles1.Append(latentStyleExceptionInfo209);
            latentStyles1.Append(latentStyleExceptionInfo210);
            latentStyles1.Append(latentStyleExceptionInfo211);
            latentStyles1.Append(latentStyleExceptionInfo212);
            latentStyles1.Append(latentStyleExceptionInfo213);
            latentStyles1.Append(latentStyleExceptionInfo214);
            latentStyles1.Append(latentStyleExceptionInfo215);
            latentStyles1.Append(latentStyleExceptionInfo216);
            latentStyles1.Append(latentStyleExceptionInfo217);
            latentStyles1.Append(latentStyleExceptionInfo218);
            latentStyles1.Append(latentStyleExceptionInfo219);
            latentStyles1.Append(latentStyleExceptionInfo220);
            latentStyles1.Append(latentStyleExceptionInfo221);
            latentStyles1.Append(latentStyleExceptionInfo222);
            latentStyles1.Append(latentStyleExceptionInfo223);
            latentStyles1.Append(latentStyleExceptionInfo224);
            latentStyles1.Append(latentStyleExceptionInfo225);
            latentStyles1.Append(latentStyleExceptionInfo226);
            latentStyles1.Append(latentStyleExceptionInfo227);
            latentStyles1.Append(latentStyleExceptionInfo228);
            latentStyles1.Append(latentStyleExceptionInfo229);
            latentStyles1.Append(latentStyleExceptionInfo230);
            latentStyles1.Append(latentStyleExceptionInfo231);
            latentStyles1.Append(latentStyleExceptionInfo232);
            latentStyles1.Append(latentStyleExceptionInfo233);
            latentStyles1.Append(latentStyleExceptionInfo234);
            latentStyles1.Append(latentStyleExceptionInfo235);
            latentStyles1.Append(latentStyleExceptionInfo236);
            latentStyles1.Append(latentStyleExceptionInfo237);
            latentStyles1.Append(latentStyleExceptionInfo238);
            latentStyles1.Append(latentStyleExceptionInfo239);
            latentStyles1.Append(latentStyleExceptionInfo240);
            latentStyles1.Append(latentStyleExceptionInfo241);
            latentStyles1.Append(latentStyleExceptionInfo242);
            latentStyles1.Append(latentStyleExceptionInfo243);
            latentStyles1.Append(latentStyleExceptionInfo244);
            latentStyles1.Append(latentStyleExceptionInfo245);
            latentStyles1.Append(latentStyleExceptionInfo246);
            latentStyles1.Append(latentStyleExceptionInfo247);
            latentStyles1.Append(latentStyleExceptionInfo248);
            latentStyles1.Append(latentStyleExceptionInfo249);
            latentStyles1.Append(latentStyleExceptionInfo250);
            latentStyles1.Append(latentStyleExceptionInfo251);
            latentStyles1.Append(latentStyleExceptionInfo252);
            latentStyles1.Append(latentStyleExceptionInfo253);
            latentStyles1.Append(latentStyleExceptionInfo254);
            latentStyles1.Append(latentStyleExceptionInfo255);
            latentStyles1.Append(latentStyleExceptionInfo256);
            latentStyles1.Append(latentStyleExceptionInfo257);
            latentStyles1.Append(latentStyleExceptionInfo258);
            latentStyles1.Append(latentStyleExceptionInfo259);
            latentStyles1.Append(latentStyleExceptionInfo260);
            latentStyles1.Append(latentStyleExceptionInfo261);
            latentStyles1.Append(latentStyleExceptionInfo262);
            latentStyles1.Append(latentStyleExceptionInfo263);
            latentStyles1.Append(latentStyleExceptionInfo264);
            latentStyles1.Append(latentStyleExceptionInfo265);
            latentStyles1.Append(latentStyleExceptionInfo266);
            latentStyles1.Append(latentStyleExceptionInfo267);
            latentStyles1.Append(latentStyleExceptionInfo268);
            latentStyles1.Append(latentStyleExceptionInfo269);
            latentStyles1.Append(latentStyleExceptionInfo270);
            latentStyles1.Append(latentStyleExceptionInfo271);
            latentStyles1.Append(latentStyleExceptionInfo272);
            latentStyles1.Append(latentStyleExceptionInfo273);
            latentStyles1.Append(latentStyleExceptionInfo274);

            Style style1 = new Style() { Type = StyleValues.Paragraph, StyleId = "a", Default = true };
            StyleName styleName1 = new StyleName() { Val = "Normal" };
            PrimaryStyle primaryStyle1 = new PrimaryStyle();
            Rsid rsid553 = new Rsid() { Val = "0005213E" };

            StyleParagraphProperties styleParagraphProperties1 = new StyleParagraphProperties();
            SpacingBetweenLines spacingBetweenLines116 = new SpacingBetweenLines() { Line = "360", LineRule = LineSpacingRuleValues.Auto };
            Justification justification96 = new Justification() { Val = JustificationValues.Both };

            styleParagraphProperties1.Append(spacingBetweenLines116);
            styleParagraphProperties1.Append(justification96);

            StyleRunProperties styleRunProperties1 = new StyleRunProperties();
            FontSize fontSize120 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript124 = new FontSizeComplexScript() { Val = "24" };

            styleRunProperties1.Append(fontSize120);
            styleRunProperties1.Append(fontSizeComplexScript124);

            style1.Append(styleName1);
            style1.Append(primaryStyle1);
            style1.Append(rsid553);
            style1.Append(styleParagraphProperties1);
            style1.Append(styleRunProperties1);

            Style style2 = new Style() { Type = StyleValues.Character, StyleId = "a0", Default = true };
            StyleName styleName2 = new StyleName() { Val = "Default Paragraph Font" };
            UIPriority uIPriority1 = new UIPriority() { Val = 1 };
            SemiHidden semiHidden1 = new SemiHidden();
            UnhideWhenUsed unhideWhenUsed1 = new UnhideWhenUsed();

            style2.Append(styleName2);
            style2.Append(uIPriority1);
            style2.Append(semiHidden1);
            style2.Append(unhideWhenUsed1);

            Style style3 = new Style() { Type = StyleValues.Table, StyleId = "a1", Default = true };
            StyleName styleName3 = new StyleName() { Val = "Normal Table" };
            UIPriority uIPriority2 = new UIPriority() { Val = 99 };
            SemiHidden semiHidden2 = new SemiHidden();
            UnhideWhenUsed unhideWhenUsed2 = new UnhideWhenUsed();

            StyleTableProperties styleTableProperties1 = new StyleTableProperties();
            TableIndentation tableIndentation2 = new TableIndentation() { Width = 0, Type = TableWidthUnitValues.Dxa };

            TableCellMarginDefault tableCellMarginDefault1 = new TableCellMarginDefault();
            TopMargin topMargin1 = new TopMargin() { Width = "0", Type = TableWidthUnitValues.Dxa };
            TableCellLeftMargin tableCellLeftMargin1 = new TableCellLeftMargin() { Width = 108, Type = TableWidthValues.Dxa };
            BottomMargin bottomMargin1 = new BottomMargin() { Width = "0", Type = TableWidthUnitValues.Dxa };
            TableCellRightMargin tableCellRightMargin1 = new TableCellRightMargin() { Width = 108, Type = TableWidthValues.Dxa };

            tableCellMarginDefault1.Append(topMargin1);
            tableCellMarginDefault1.Append(tableCellLeftMargin1);
            tableCellMarginDefault1.Append(bottomMargin1);
            tableCellMarginDefault1.Append(tableCellRightMargin1);

            styleTableProperties1.Append(tableIndentation2);
            styleTableProperties1.Append(tableCellMarginDefault1);

            style3.Append(styleName3);
            style3.Append(uIPriority2);
            style3.Append(semiHidden2);
            style3.Append(unhideWhenUsed2);
            style3.Append(styleTableProperties1);

            Style style4 = new Style() { Type = StyleValues.Numbering, StyleId = "a2", Default = true };
            StyleName styleName4 = new StyleName() { Val = "No List" };
            UIPriority uIPriority3 = new UIPriority() { Val = 99 };
            SemiHidden semiHidden3 = new SemiHidden();
            UnhideWhenUsed unhideWhenUsed3 = new UnhideWhenUsed();

            style4.Append(styleName4);
            style4.Append(uIPriority3);
            style4.Append(semiHidden3);
            style4.Append(unhideWhenUsed3);

            Style style5 = new Style() { Type = StyleValues.Table, StyleId = "a3" };
            StyleName styleName5 = new StyleName() { Val = "Table Grid" };
            BasedOn basedOn1 = new BasedOn() { Val = "a1" };
            Rsid rsid554 = new Rsid() { Val = "00391EBF" };

            StyleParagraphProperties styleParagraphProperties2 = new StyleParagraphProperties();
            SpacingBetweenLines spacingBetweenLines117 = new SpacingBetweenLines() { Line = "360", LineRule = LineSpacingRuleValues.Auto };
            Justification justification97 = new Justification() { Val = JustificationValues.Both };

            styleParagraphProperties2.Append(spacingBetweenLines117);
            styleParagraphProperties2.Append(justification97);

            StyleTableProperties styleTableProperties2 = new StyleTableProperties();

            TableBorders tableBorders38 = new TableBorders();
            TopBorder topBorder113 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder94 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder115 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder94 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder38 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder38 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders38.Append(topBorder113);
            tableBorders38.Append(leftBorder94);
            tableBorders38.Append(bottomBorder115);
            tableBorders38.Append(rightBorder94);
            tableBorders38.Append(insideHorizontalBorder38);
            tableBorders38.Append(insideVerticalBorder38);

            styleTableProperties2.Append(tableBorders38);

            style5.Append(styleName5);
            style5.Append(basedOn1);
            style5.Append(rsid554);
            style5.Append(styleParagraphProperties2);
            style5.Append(styleTableProperties2);

            Style style6 = new Style() { Type = StyleValues.Character, StyleId = "a4" };
            StyleName styleName6 = new StyleName() { Val = "annotation reference" };
            Rsid rsid555 = new Rsid() { Val = "00770379" };

            StyleRunProperties styleRunProperties2 = new StyleRunProperties();
            FontSize fontSize121 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript125 = new FontSizeComplexScript() { Val = "16" };

            styleRunProperties2.Append(fontSize121);
            styleRunProperties2.Append(fontSizeComplexScript125);

            style6.Append(styleName6);
            style6.Append(rsid555);
            style6.Append(styleRunProperties2);

            Style style7 = new Style() { Type = StyleValues.Paragraph, StyleId = "a5" };
            StyleName styleName7 = new StyleName() { Val = "annotation text" };
            BasedOn basedOn2 = new BasedOn() { Val = "a" };
            LinkedStyle linkedStyle1 = new LinkedStyle() { Val = "a6" };
            Rsid rsid556 = new Rsid() { Val = "00770379" };

            StyleRunProperties styleRunProperties3 = new StyleRunProperties();
            FontSize fontSize122 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript126 = new FontSizeComplexScript() { Val = "20" };

            styleRunProperties3.Append(fontSize122);
            styleRunProperties3.Append(fontSizeComplexScript126);

            style7.Append(styleName7);
            style7.Append(basedOn2);
            style7.Append(linkedStyle1);
            style7.Append(rsid556);
            style7.Append(styleRunProperties3);

            Style style8 = new Style() { Type = StyleValues.Character, StyleId = "a6", CustomStyle = true };
            StyleName styleName8 = new StyleName() { Val = "Текст примечания Знак" };
            BasedOn basedOn3 = new BasedOn() { Val = "a0" };
            LinkedStyle linkedStyle2 = new LinkedStyle() { Val = "a5" };
            Rsid rsid557 = new Rsid() { Val = "00770379" };

            style8.Append(styleName8);
            style8.Append(basedOn3);
            style8.Append(linkedStyle2);
            style8.Append(rsid557);

            Style style9 = new Style() { Type = StyleValues.Paragraph, StyleId = "a7" };
            StyleName styleName9 = new StyleName() { Val = "annotation subject" };
            BasedOn basedOn4 = new BasedOn() { Val = "a5" };
            NextParagraphStyle nextParagraphStyle1 = new NextParagraphStyle() { Val = "a5" };
            LinkedStyle linkedStyle3 = new LinkedStyle() { Val = "a8" };
            Rsid rsid558 = new Rsid() { Val = "00770379" };

            StyleRunProperties styleRunProperties4 = new StyleRunProperties();
            Bold bold4 = new Bold();
            BoldComplexScript boldComplexScript1 = new BoldComplexScript();

            styleRunProperties4.Append(bold4);
            styleRunProperties4.Append(boldComplexScript1);

            style9.Append(styleName9);
            style9.Append(basedOn4);
            style9.Append(nextParagraphStyle1);
            style9.Append(linkedStyle3);
            style9.Append(rsid558);
            style9.Append(styleRunProperties4);

            Style style10 = new Style() { Type = StyleValues.Character, StyleId = "a8", CustomStyle = true };
            StyleName styleName10 = new StyleName() { Val = "Тема примечания Знак" };
            LinkedStyle linkedStyle4 = new LinkedStyle() { Val = "a7" };
            Rsid rsid559 = new Rsid() { Val = "00770379" };

            StyleRunProperties styleRunProperties5 = new StyleRunProperties();
            Bold bold5 = new Bold();
            BoldComplexScript boldComplexScript2 = new BoldComplexScript();

            styleRunProperties5.Append(bold5);
            styleRunProperties5.Append(boldComplexScript2);

            style10.Append(styleName10);
            style10.Append(linkedStyle4);
            style10.Append(rsid559);
            style10.Append(styleRunProperties5);

            Style style11 = new Style() { Type = StyleValues.Paragraph, StyleId = "a9" };
            StyleName styleName11 = new StyleName() { Val = "Balloon Text" };
            BasedOn basedOn5 = new BasedOn() { Val = "a" };
            LinkedStyle linkedStyle5 = new LinkedStyle() { Val = "aa" };
            Rsid rsid560 = new Rsid() { Val = "00770379" };

            StyleParagraphProperties styleParagraphProperties3 = new StyleParagraphProperties();
            SpacingBetweenLines spacingBetweenLines118 = new SpacingBetweenLines() { Line = "240", LineRule = LineSpacingRuleValues.Auto };

            styleParagraphProperties3.Append(spacingBetweenLines118);

            StyleRunProperties styleRunProperties6 = new StyleRunProperties();
            RunFonts runFonts2 = new RunFonts() { Ascii = "Segoe UI", HighAnsi = "Segoe UI", ComplexScript = "Segoe UI" };
            FontSize fontSize123 = new FontSize() { Val = "18" };
            FontSizeComplexScript fontSizeComplexScript127 = new FontSizeComplexScript() { Val = "18" };

            styleRunProperties6.Append(runFonts2);
            styleRunProperties6.Append(fontSize123);
            styleRunProperties6.Append(fontSizeComplexScript127);

            style11.Append(styleName11);
            style11.Append(basedOn5);
            style11.Append(linkedStyle5);
            style11.Append(rsid560);
            style11.Append(styleParagraphProperties3);
            style11.Append(styleRunProperties6);

            Style style12 = new Style() { Type = StyleValues.Character, StyleId = "aa", CustomStyle = true };
            StyleName styleName12 = new StyleName() { Val = "Текст выноски Знак" };
            LinkedStyle linkedStyle6 = new LinkedStyle() { Val = "a9" };
            Rsid rsid561 = new Rsid() { Val = "00770379" };

            StyleRunProperties styleRunProperties7 = new StyleRunProperties();
            RunFonts runFonts3 = new RunFonts() { Ascii = "Segoe UI", HighAnsi = "Segoe UI", ComplexScript = "Segoe UI" };
            FontSize fontSize124 = new FontSize() { Val = "18" };
            FontSizeComplexScript fontSizeComplexScript128 = new FontSizeComplexScript() { Val = "18" };

            styleRunProperties7.Append(runFonts3);
            styleRunProperties7.Append(fontSize124);
            styleRunProperties7.Append(fontSizeComplexScript128);

            style12.Append(styleName12);
            style12.Append(linkedStyle6);
            style12.Append(rsid561);
            style12.Append(styleRunProperties7);

            styles1.Append(docDefaults1);
            styles1.Append(latentStyles1);
            styles1.Append(style1);
            styles1.Append(style2);
            styles1.Append(style3);
            styles1.Append(style4);
            styles1.Append(style5);
            styles1.Append(style6);
            styles1.Append(style7);
            styles1.Append(style8);
            styles1.Append(style9);
            styles1.Append(style10);
            styles1.Append(style11);
            styles1.Append(style12);

            styleDefinitionsPart1.Styles = styles1;
        }

        // Generates content of customXmlPart1.
        private void GenerateCustomXmlPart1Content(CustomXmlPart customXmlPart1)
        {
            System.Xml.XmlTextWriter writer = new System.Xml.XmlTextWriter(customXmlPart1.GetStream(System.IO.FileMode.Create), System.Text.Encoding.UTF8);
            writer.WriteRaw("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><b:Sources SelectedStyle=\"\\APA.XSL\" StyleName=\"APA\" xmlns:b=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\"></b:Sources>");
            writer.Flush();
            writer.Close();
        }

        // Generates content of customXmlPropertiesPart1.
        private void GenerateCustomXmlPropertiesPart1Content(CustomXmlPropertiesPart customXmlPropertiesPart1)
        {
            Ds.DataStoreItem dataStoreItem1 = new Ds.DataStoreItem() { ItemId = "{DF880FD6-4006-4C77-8D1E-C4765B2049AF}" };
            dataStoreItem1.AddNamespaceDeclaration("ds", "http://schemas.openxmlformats.org/officeDocument/2006/customXml");

            Ds.SchemaReferences schemaReferences1 = new Ds.SchemaReferences();
            Ds.SchemaReference schemaReference1 = new Ds.SchemaReference() { Uri = "http://schemas.openxmlformats.org/officeDocument/2006/bibliography" };

            schemaReferences1.Append(schemaReference1);

            dataStoreItem1.Append(schemaReferences1);

            customXmlPropertiesPart1.DataStoreItem = dataStoreItem1;
        }

        // Generates content of themePart1.
        private void GenerateThemePart1Content(ThemePart themePart1)
        {
            A.Theme theme1 = new A.Theme() { Name = "Тема Office" };
            theme1.AddNamespaceDeclaration("a", "http://schemas.openxmlformats.org/drawingml/2006/main");

            A.ThemeElements themeElements1 = new A.ThemeElements();

            A.ColorScheme colorScheme1 = new A.ColorScheme() { Name = "Стандартная" };

            A.Dark1Color dark1Color1 = new A.Dark1Color();
            A.SystemColor systemColor1 = new A.SystemColor() { Val = A.SystemColorValues.WindowText, LastColor = "000000" };

            dark1Color1.Append(systemColor1);

            A.Light1Color light1Color1 = new A.Light1Color();
            A.SystemColor systemColor2 = new A.SystemColor() { Val = A.SystemColorValues.Window, LastColor = "FFFFFF" };

            light1Color1.Append(systemColor2);

            A.Dark2Color dark2Color1 = new A.Dark2Color();
            A.RgbColorModelHex rgbColorModelHex1 = new A.RgbColorModelHex() { Val = "44546A" };

            dark2Color1.Append(rgbColorModelHex1);

            A.Light2Color light2Color1 = new A.Light2Color();
            A.RgbColorModelHex rgbColorModelHex2 = new A.RgbColorModelHex() { Val = "E7E6E6" };

            light2Color1.Append(rgbColorModelHex2);

            A.Accent1Color accent1Color1 = new A.Accent1Color();
            A.RgbColorModelHex rgbColorModelHex3 = new A.RgbColorModelHex() { Val = "5B9BD5" };

            accent1Color1.Append(rgbColorModelHex3);

            A.Accent2Color accent2Color1 = new A.Accent2Color();
            A.RgbColorModelHex rgbColorModelHex4 = new A.RgbColorModelHex() { Val = "ED7D31" };

            accent2Color1.Append(rgbColorModelHex4);

            A.Accent3Color accent3Color1 = new A.Accent3Color();
            A.RgbColorModelHex rgbColorModelHex5 = new A.RgbColorModelHex() { Val = "A5A5A5" };

            accent3Color1.Append(rgbColorModelHex5);

            A.Accent4Color accent4Color1 = new A.Accent4Color();
            A.RgbColorModelHex rgbColorModelHex6 = new A.RgbColorModelHex() { Val = "FFC000" };

            accent4Color1.Append(rgbColorModelHex6);

            A.Accent5Color accent5Color1 = new A.Accent5Color();
            A.RgbColorModelHex rgbColorModelHex7 = new A.RgbColorModelHex() { Val = "4472C4" };

            accent5Color1.Append(rgbColorModelHex7);

            A.Accent6Color accent6Color1 = new A.Accent6Color();
            A.RgbColorModelHex rgbColorModelHex8 = new A.RgbColorModelHex() { Val = "70AD47" };

            accent6Color1.Append(rgbColorModelHex8);

            A.Hyperlink hyperlink1 = new A.Hyperlink();
            A.RgbColorModelHex rgbColorModelHex9 = new A.RgbColorModelHex() { Val = "0563C1" };

            hyperlink1.Append(rgbColorModelHex9);

            A.FollowedHyperlinkColor followedHyperlinkColor1 = new A.FollowedHyperlinkColor();
            A.RgbColorModelHex rgbColorModelHex10 = new A.RgbColorModelHex() { Val = "954F72" };

            followedHyperlinkColor1.Append(rgbColorModelHex10);

            colorScheme1.Append(dark1Color1);
            colorScheme1.Append(light1Color1);
            colorScheme1.Append(dark2Color1);
            colorScheme1.Append(light2Color1);
            colorScheme1.Append(accent1Color1);
            colorScheme1.Append(accent2Color1);
            colorScheme1.Append(accent3Color1);
            colorScheme1.Append(accent4Color1);
            colorScheme1.Append(accent5Color1);
            colorScheme1.Append(accent6Color1);
            colorScheme1.Append(hyperlink1);
            colorScheme1.Append(followedHyperlinkColor1);

            A.FontScheme fontScheme1 = new A.FontScheme() { Name = "Стандартная" };

            A.MajorFont majorFont1 = new A.MajorFont();
            A.LatinFont latinFont1 = new A.LatinFont() { Typeface = "Calibri Light", Panose = "020F0302020204030204" };
            A.EastAsianFont eastAsianFont1 = new A.EastAsianFont() { Typeface = "" };
            A.ComplexScriptFont complexScriptFont1 = new A.ComplexScriptFont() { Typeface = "" };
            A.SupplementalFont supplementalFont1 = new A.SupplementalFont() { Script = "Jpan", Typeface = "游ゴシック Light" };
            A.SupplementalFont supplementalFont2 = new A.SupplementalFont() { Script = "Hang", Typeface = "맑은 고딕" };
            A.SupplementalFont supplementalFont3 = new A.SupplementalFont() { Script = "Hans", Typeface = "等线 Light" };
            A.SupplementalFont supplementalFont4 = new A.SupplementalFont() { Script = "Hant", Typeface = "新細明體" };
            A.SupplementalFont supplementalFont5 = new A.SupplementalFont() { Script = "Arab", Typeface = "Times New Roman" };
            A.SupplementalFont supplementalFont6 = new A.SupplementalFont() { Script = "Hebr", Typeface = "Times New Roman" };
            A.SupplementalFont supplementalFont7 = new A.SupplementalFont() { Script = "Thai", Typeface = "Angsana New" };
            A.SupplementalFont supplementalFont8 = new A.SupplementalFont() { Script = "Ethi", Typeface = "Nyala" };
            A.SupplementalFont supplementalFont9 = new A.SupplementalFont() { Script = "Beng", Typeface = "Vrinda" };
            A.SupplementalFont supplementalFont10 = new A.SupplementalFont() { Script = "Gujr", Typeface = "Shruti" };
            A.SupplementalFont supplementalFont11 = new A.SupplementalFont() { Script = "Khmr", Typeface = "MoolBoran" };
            A.SupplementalFont supplementalFont12 = new A.SupplementalFont() { Script = "Knda", Typeface = "Tunga" };
            A.SupplementalFont supplementalFont13 = new A.SupplementalFont() { Script = "Guru", Typeface = "Raavi" };
            A.SupplementalFont supplementalFont14 = new A.SupplementalFont() { Script = "Cans", Typeface = "Euphemia" };
            A.SupplementalFont supplementalFont15 = new A.SupplementalFont() { Script = "Cher", Typeface = "Plantagenet Cherokee" };
            A.SupplementalFont supplementalFont16 = new A.SupplementalFont() { Script = "Yiii", Typeface = "Microsoft Yi Baiti" };
            A.SupplementalFont supplementalFont17 = new A.SupplementalFont() { Script = "Tibt", Typeface = "Microsoft Himalaya" };
            A.SupplementalFont supplementalFont18 = new A.SupplementalFont() { Script = "Thaa", Typeface = "MV Boli" };
            A.SupplementalFont supplementalFont19 = new A.SupplementalFont() { Script = "Deva", Typeface = "Mangal" };
            A.SupplementalFont supplementalFont20 = new A.SupplementalFont() { Script = "Telu", Typeface = "Gautami" };
            A.SupplementalFont supplementalFont21 = new A.SupplementalFont() { Script = "Taml", Typeface = "Latha" };
            A.SupplementalFont supplementalFont22 = new A.SupplementalFont() { Script = "Syrc", Typeface = "Estrangelo Edessa" };
            A.SupplementalFont supplementalFont23 = new A.SupplementalFont() { Script = "Orya", Typeface = "Kalinga" };
            A.SupplementalFont supplementalFont24 = new A.SupplementalFont() { Script = "Mlym", Typeface = "Kartika" };
            A.SupplementalFont supplementalFont25 = new A.SupplementalFont() { Script = "Laoo", Typeface = "DokChampa" };
            A.SupplementalFont supplementalFont26 = new A.SupplementalFont() { Script = "Sinh", Typeface = "Iskoola Pota" };
            A.SupplementalFont supplementalFont27 = new A.SupplementalFont() { Script = "Mong", Typeface = "Mongolian Baiti" };
            A.SupplementalFont supplementalFont28 = new A.SupplementalFont() { Script = "Viet", Typeface = "Times New Roman" };
            A.SupplementalFont supplementalFont29 = new A.SupplementalFont() { Script = "Uigh", Typeface = "Microsoft Uighur" };
            A.SupplementalFont supplementalFont30 = new A.SupplementalFont() { Script = "Geor", Typeface = "Sylfaen" };

            majorFont1.Append(latinFont1);
            majorFont1.Append(eastAsianFont1);
            majorFont1.Append(complexScriptFont1);
            majorFont1.Append(supplementalFont1);
            majorFont1.Append(supplementalFont2);
            majorFont1.Append(supplementalFont3);
            majorFont1.Append(supplementalFont4);
            majorFont1.Append(supplementalFont5);
            majorFont1.Append(supplementalFont6);
            majorFont1.Append(supplementalFont7);
            majorFont1.Append(supplementalFont8);
            majorFont1.Append(supplementalFont9);
            majorFont1.Append(supplementalFont10);
            majorFont1.Append(supplementalFont11);
            majorFont1.Append(supplementalFont12);
            majorFont1.Append(supplementalFont13);
            majorFont1.Append(supplementalFont14);
            majorFont1.Append(supplementalFont15);
            majorFont1.Append(supplementalFont16);
            majorFont1.Append(supplementalFont17);
            majorFont1.Append(supplementalFont18);
            majorFont1.Append(supplementalFont19);
            majorFont1.Append(supplementalFont20);
            majorFont1.Append(supplementalFont21);
            majorFont1.Append(supplementalFont22);
            majorFont1.Append(supplementalFont23);
            majorFont1.Append(supplementalFont24);
            majorFont1.Append(supplementalFont25);
            majorFont1.Append(supplementalFont26);
            majorFont1.Append(supplementalFont27);
            majorFont1.Append(supplementalFont28);
            majorFont1.Append(supplementalFont29);
            majorFont1.Append(supplementalFont30);

            A.MinorFont minorFont1 = new A.MinorFont();
            A.LatinFont latinFont2 = new A.LatinFont() { Typeface = "Calibri", Panose = "020F0502020204030204" };
            A.EastAsianFont eastAsianFont2 = new A.EastAsianFont() { Typeface = "" };
            A.ComplexScriptFont complexScriptFont2 = new A.ComplexScriptFont() { Typeface = "" };
            A.SupplementalFont supplementalFont31 = new A.SupplementalFont() { Script = "Jpan", Typeface = "游明朝" };
            A.SupplementalFont supplementalFont32 = new A.SupplementalFont() { Script = "Hang", Typeface = "맑은 고딕" };
            A.SupplementalFont supplementalFont33 = new A.SupplementalFont() { Script = "Hans", Typeface = "等线" };
            A.SupplementalFont supplementalFont34 = new A.SupplementalFont() { Script = "Hant", Typeface = "新細明體" };
            A.SupplementalFont supplementalFont35 = new A.SupplementalFont() { Script = "Arab", Typeface = "Arial" };
            A.SupplementalFont supplementalFont36 = new A.SupplementalFont() { Script = "Hebr", Typeface = "Arial" };
            A.SupplementalFont supplementalFont37 = new A.SupplementalFont() { Script = "Thai", Typeface = "Cordia New" };
            A.SupplementalFont supplementalFont38 = new A.SupplementalFont() { Script = "Ethi", Typeface = "Nyala" };
            A.SupplementalFont supplementalFont39 = new A.SupplementalFont() { Script = "Beng", Typeface = "Vrinda" };
            A.SupplementalFont supplementalFont40 = new A.SupplementalFont() { Script = "Gujr", Typeface = "Shruti" };
            A.SupplementalFont supplementalFont41 = new A.SupplementalFont() { Script = "Khmr", Typeface = "DaunPenh" };
            A.SupplementalFont supplementalFont42 = new A.SupplementalFont() { Script = "Knda", Typeface = "Tunga" };
            A.SupplementalFont supplementalFont43 = new A.SupplementalFont() { Script = "Guru", Typeface = "Raavi" };
            A.SupplementalFont supplementalFont44 = new A.SupplementalFont() { Script = "Cans", Typeface = "Euphemia" };
            A.SupplementalFont supplementalFont45 = new A.SupplementalFont() { Script = "Cher", Typeface = "Plantagenet Cherokee" };
            A.SupplementalFont supplementalFont46 = new A.SupplementalFont() { Script = "Yiii", Typeface = "Microsoft Yi Baiti" };
            A.SupplementalFont supplementalFont47 = new A.SupplementalFont() { Script = "Tibt", Typeface = "Microsoft Himalaya" };
            A.SupplementalFont supplementalFont48 = new A.SupplementalFont() { Script = "Thaa", Typeface = "MV Boli" };
            A.SupplementalFont supplementalFont49 = new A.SupplementalFont() { Script = "Deva", Typeface = "Mangal" };
            A.SupplementalFont supplementalFont50 = new A.SupplementalFont() { Script = "Telu", Typeface = "Gautami" };
            A.SupplementalFont supplementalFont51 = new A.SupplementalFont() { Script = "Taml", Typeface = "Latha" };
            A.SupplementalFont supplementalFont52 = new A.SupplementalFont() { Script = "Syrc", Typeface = "Estrangelo Edessa" };
            A.SupplementalFont supplementalFont53 = new A.SupplementalFont() { Script = "Orya", Typeface = "Kalinga" };
            A.SupplementalFont supplementalFont54 = new A.SupplementalFont() { Script = "Mlym", Typeface = "Kartika" };
            A.SupplementalFont supplementalFont55 = new A.SupplementalFont() { Script = "Laoo", Typeface = "DokChampa" };
            A.SupplementalFont supplementalFont56 = new A.SupplementalFont() { Script = "Sinh", Typeface = "Iskoola Pota" };
            A.SupplementalFont supplementalFont57 = new A.SupplementalFont() { Script = "Mong", Typeface = "Mongolian Baiti" };
            A.SupplementalFont supplementalFont58 = new A.SupplementalFont() { Script = "Viet", Typeface = "Arial" };
            A.SupplementalFont supplementalFont59 = new A.SupplementalFont() { Script = "Uigh", Typeface = "Microsoft Uighur" };
            A.SupplementalFont supplementalFont60 = new A.SupplementalFont() { Script = "Geor", Typeface = "Sylfaen" };

            minorFont1.Append(latinFont2);
            minorFont1.Append(eastAsianFont2);
            minorFont1.Append(complexScriptFont2);
            minorFont1.Append(supplementalFont31);
            minorFont1.Append(supplementalFont32);
            minorFont1.Append(supplementalFont33);
            minorFont1.Append(supplementalFont34);
            minorFont1.Append(supplementalFont35);
            minorFont1.Append(supplementalFont36);
            minorFont1.Append(supplementalFont37);
            minorFont1.Append(supplementalFont38);
            minorFont1.Append(supplementalFont39);
            minorFont1.Append(supplementalFont40);
            minorFont1.Append(supplementalFont41);
            minorFont1.Append(supplementalFont42);
            minorFont1.Append(supplementalFont43);
            minorFont1.Append(supplementalFont44);
            minorFont1.Append(supplementalFont45);
            minorFont1.Append(supplementalFont46);
            minorFont1.Append(supplementalFont47);
            minorFont1.Append(supplementalFont48);
            minorFont1.Append(supplementalFont49);
            minorFont1.Append(supplementalFont50);
            minorFont1.Append(supplementalFont51);
            minorFont1.Append(supplementalFont52);
            minorFont1.Append(supplementalFont53);
            minorFont1.Append(supplementalFont54);
            minorFont1.Append(supplementalFont55);
            minorFont1.Append(supplementalFont56);
            minorFont1.Append(supplementalFont57);
            minorFont1.Append(supplementalFont58);
            minorFont1.Append(supplementalFont59);
            minorFont1.Append(supplementalFont60);

            fontScheme1.Append(majorFont1);
            fontScheme1.Append(minorFont1);

            A.FormatScheme formatScheme1 = new A.FormatScheme() { Name = "Стандартная" };

            A.FillStyleList fillStyleList1 = new A.FillStyleList();

            A.SolidFill solidFill1 = new A.SolidFill();
            A.SchemeColor schemeColor1 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill1.Append(schemeColor1);

            A.GradientFill gradientFill1 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList1 = new A.GradientStopList();

            A.GradientStop gradientStop1 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor2 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.LuminanceModulation luminanceModulation1 = new A.LuminanceModulation() { Val = 110000 };
            A.SaturationModulation saturationModulation1 = new A.SaturationModulation() { Val = 105000 };
            A.Tint tint1 = new A.Tint() { Val = 67000 };

            schemeColor2.Append(luminanceModulation1);
            schemeColor2.Append(saturationModulation1);
            schemeColor2.Append(tint1);

            gradientStop1.Append(schemeColor2);

            A.GradientStop gradientStop2 = new A.GradientStop() { Position = 50000 };

            A.SchemeColor schemeColor3 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.LuminanceModulation luminanceModulation2 = new A.LuminanceModulation() { Val = 105000 };
            A.SaturationModulation saturationModulation2 = new A.SaturationModulation() { Val = 103000 };
            A.Tint tint2 = new A.Tint() { Val = 73000 };

            schemeColor3.Append(luminanceModulation2);
            schemeColor3.Append(saturationModulation2);
            schemeColor3.Append(tint2);

            gradientStop2.Append(schemeColor3);

            A.GradientStop gradientStop3 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor4 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.LuminanceModulation luminanceModulation3 = new A.LuminanceModulation() { Val = 105000 };
            A.SaturationModulation saturationModulation3 = new A.SaturationModulation() { Val = 109000 };
            A.Tint tint3 = new A.Tint() { Val = 81000 };

            schemeColor4.Append(luminanceModulation3);
            schemeColor4.Append(saturationModulation3);
            schemeColor4.Append(tint3);

            gradientStop3.Append(schemeColor4);

            gradientStopList1.Append(gradientStop1);
            gradientStopList1.Append(gradientStop2);
            gradientStopList1.Append(gradientStop3);
            A.LinearGradientFill linearGradientFill1 = new A.LinearGradientFill() { Angle = 5400000, Scaled = false };

            gradientFill1.Append(gradientStopList1);
            gradientFill1.Append(linearGradientFill1);

            A.GradientFill gradientFill2 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList2 = new A.GradientStopList();

            A.GradientStop gradientStop4 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor5 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.SaturationModulation saturationModulation4 = new A.SaturationModulation() { Val = 103000 };
            A.LuminanceModulation luminanceModulation4 = new A.LuminanceModulation() { Val = 102000 };
            A.Tint tint4 = new A.Tint() { Val = 94000 };

            schemeColor5.Append(saturationModulation4);
            schemeColor5.Append(luminanceModulation4);
            schemeColor5.Append(tint4);

            gradientStop4.Append(schemeColor5);

            A.GradientStop gradientStop5 = new A.GradientStop() { Position = 50000 };

            A.SchemeColor schemeColor6 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.SaturationModulation saturationModulation5 = new A.SaturationModulation() { Val = 110000 };
            A.LuminanceModulation luminanceModulation5 = new A.LuminanceModulation() { Val = 100000 };
            A.Shade shade1 = new A.Shade() { Val = 100000 };

            schemeColor6.Append(saturationModulation5);
            schemeColor6.Append(luminanceModulation5);
            schemeColor6.Append(shade1);

            gradientStop5.Append(schemeColor6);

            A.GradientStop gradientStop6 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor7 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.LuminanceModulation luminanceModulation6 = new A.LuminanceModulation() { Val = 99000 };
            A.SaturationModulation saturationModulation6 = new A.SaturationModulation() { Val = 120000 };
            A.Shade shade2 = new A.Shade() { Val = 78000 };

            schemeColor7.Append(luminanceModulation6);
            schemeColor7.Append(saturationModulation6);
            schemeColor7.Append(shade2);

            gradientStop6.Append(schemeColor7);

            gradientStopList2.Append(gradientStop4);
            gradientStopList2.Append(gradientStop5);
            gradientStopList2.Append(gradientStop6);
            A.LinearGradientFill linearGradientFill2 = new A.LinearGradientFill() { Angle = 5400000, Scaled = false };

            gradientFill2.Append(gradientStopList2);
            gradientFill2.Append(linearGradientFill2);

            fillStyleList1.Append(solidFill1);
            fillStyleList1.Append(gradientFill1);
            fillStyleList1.Append(gradientFill2);

            A.LineStyleList lineStyleList1 = new A.LineStyleList();

            A.Outline outline1 = new A.Outline() { Width = 6350, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill2 = new A.SolidFill();
            A.SchemeColor schemeColor8 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill2.Append(schemeColor8);
            A.PresetDash presetDash1 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };
            A.Miter miter1 = new A.Miter() { Limit = 800000 };

            outline1.Append(solidFill2);
            outline1.Append(presetDash1);
            outline1.Append(miter1);

            A.Outline outline2 = new A.Outline() { Width = 12700, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill3 = new A.SolidFill();
            A.SchemeColor schemeColor9 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill3.Append(schemeColor9);
            A.PresetDash presetDash2 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };
            A.Miter miter2 = new A.Miter() { Limit = 800000 };

            outline2.Append(solidFill3);
            outline2.Append(presetDash2);
            outline2.Append(miter2);

            A.Outline outline3 = new A.Outline() { Width = 19050, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill4 = new A.SolidFill();
            A.SchemeColor schemeColor10 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill4.Append(schemeColor10);
            A.PresetDash presetDash3 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };
            A.Miter miter3 = new A.Miter() { Limit = 800000 };

            outline3.Append(solidFill4);
            outline3.Append(presetDash3);
            outline3.Append(miter3);

            lineStyleList1.Append(outline1);
            lineStyleList1.Append(outline2);
            lineStyleList1.Append(outline3);

            A.EffectStyleList effectStyleList1 = new A.EffectStyleList();

            A.EffectStyle effectStyle1 = new A.EffectStyle();
            A.EffectList effectList1 = new A.EffectList();

            effectStyle1.Append(effectList1);

            A.EffectStyle effectStyle2 = new A.EffectStyle();
            A.EffectList effectList2 = new A.EffectList();

            effectStyle2.Append(effectList2);

            A.EffectStyle effectStyle3 = new A.EffectStyle();

            A.EffectList effectList3 = new A.EffectList();

            A.OuterShadow outerShadow1 = new A.OuterShadow() { BlurRadius = 57150L, Distance = 19050L, Direction = 5400000, Alignment = A.RectangleAlignmentValues.Center, RotateWithShape = false };

            A.RgbColorModelHex rgbColorModelHex11 = new A.RgbColorModelHex() { Val = "000000" };
            A.Alpha alpha1 = new A.Alpha() { Val = 63000 };

            rgbColorModelHex11.Append(alpha1);

            outerShadow1.Append(rgbColorModelHex11);

            effectList3.Append(outerShadow1);

            effectStyle3.Append(effectList3);

            effectStyleList1.Append(effectStyle1);
            effectStyleList1.Append(effectStyle2);
            effectStyleList1.Append(effectStyle3);

            A.BackgroundFillStyleList backgroundFillStyleList1 = new A.BackgroundFillStyleList();

            A.SolidFill solidFill5 = new A.SolidFill();
            A.SchemeColor schemeColor11 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill5.Append(schemeColor11);

            A.SolidFill solidFill6 = new A.SolidFill();

            A.SchemeColor schemeColor12 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint5 = new A.Tint() { Val = 95000 };
            A.SaturationModulation saturationModulation7 = new A.SaturationModulation() { Val = 170000 };

            schemeColor12.Append(tint5);
            schemeColor12.Append(saturationModulation7);

            solidFill6.Append(schemeColor12);

            A.GradientFill gradientFill3 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList3 = new A.GradientStopList();

            A.GradientStop gradientStop7 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor13 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint6 = new A.Tint() { Val = 93000 };
            A.SaturationModulation saturationModulation8 = new A.SaturationModulation() { Val = 150000 };
            A.Shade shade3 = new A.Shade() { Val = 98000 };
            A.LuminanceModulation luminanceModulation7 = new A.LuminanceModulation() { Val = 102000 };

            schemeColor13.Append(tint6);
            schemeColor13.Append(saturationModulation8);
            schemeColor13.Append(shade3);
            schemeColor13.Append(luminanceModulation7);

            gradientStop7.Append(schemeColor13);

            A.GradientStop gradientStop8 = new A.GradientStop() { Position = 50000 };

            A.SchemeColor schemeColor14 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint7 = new A.Tint() { Val = 98000 };
            A.SaturationModulation saturationModulation9 = new A.SaturationModulation() { Val = 130000 };
            A.Shade shade4 = new A.Shade() { Val = 90000 };
            A.LuminanceModulation luminanceModulation8 = new A.LuminanceModulation() { Val = 103000 };

            schemeColor14.Append(tint7);
            schemeColor14.Append(saturationModulation9);
            schemeColor14.Append(shade4);
            schemeColor14.Append(luminanceModulation8);

            gradientStop8.Append(schemeColor14);

            A.GradientStop gradientStop9 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor15 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade5 = new A.Shade() { Val = 63000 };
            A.SaturationModulation saturationModulation10 = new A.SaturationModulation() { Val = 120000 };

            schemeColor15.Append(shade5);
            schemeColor15.Append(saturationModulation10);

            gradientStop9.Append(schemeColor15);

            gradientStopList3.Append(gradientStop7);
            gradientStopList3.Append(gradientStop8);
            gradientStopList3.Append(gradientStop9);
            A.LinearGradientFill linearGradientFill3 = new A.LinearGradientFill() { Angle = 5400000, Scaled = false };

            gradientFill3.Append(gradientStopList3);
            gradientFill3.Append(linearGradientFill3);

            backgroundFillStyleList1.Append(solidFill5);
            backgroundFillStyleList1.Append(solidFill6);
            backgroundFillStyleList1.Append(gradientFill3);

            formatScheme1.Append(fillStyleList1);
            formatScheme1.Append(lineStyleList1);
            formatScheme1.Append(effectStyleList1);
            formatScheme1.Append(backgroundFillStyleList1);

            themeElements1.Append(colorScheme1);
            themeElements1.Append(fontScheme1);
            themeElements1.Append(formatScheme1);
            A.ObjectDefaults objectDefaults1 = new A.ObjectDefaults();
            A.ExtraColorSchemeList extraColorSchemeList1 = new A.ExtraColorSchemeList();

            A.OfficeStyleSheetExtensionList officeStyleSheetExtensionList1 = new A.OfficeStyleSheetExtensionList();

            A.OfficeStyleSheetExtension officeStyleSheetExtension1 = new A.OfficeStyleSheetExtension() { Uri = "{05A4C25C-085E-4340-85A3-A5531E510DB2}" };

            Thm15.ThemeFamily themeFamily1 = new Thm15.ThemeFamily() { Name = "Office Theme", Id = "{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}", Vid = "{4A3C46E8-61CC-4603-A589-7422A47A8E4A}" };
            themeFamily1.AddNamespaceDeclaration("thm15", "http://schemas.microsoft.com/office/thememl/2012/main");

            officeStyleSheetExtension1.Append(themeFamily1);

            officeStyleSheetExtensionList1.Append(officeStyleSheetExtension1);

            theme1.Append(themeElements1);
            theme1.Append(objectDefaults1);
            theme1.Append(extraColorSchemeList1);
            theme1.Append(officeStyleSheetExtensionList1);

            themePart1.Theme = theme1;
        }

        // Generates content of fontTablePart1.
        private void GenerateFontTablePart1Content(FontTablePart fontTablePart1)
        {
            Fonts fonts1 = new Fonts() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "w14 w15 w16se" } };
            fonts1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            fonts1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            fonts1.AddNamespaceDeclaration("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
            fonts1.AddNamespaceDeclaration("w14", "http://schemas.microsoft.com/office/word/2010/wordml");
            fonts1.AddNamespaceDeclaration("w15", "http://schemas.microsoft.com/office/word/2012/wordml");
            fonts1.AddNamespaceDeclaration("w16se", "http://schemas.microsoft.com/office/word/2015/wordml/symex");

            Font font1 = new Font() { Name = "Times New Roman" };
            Panose1Number panose1Number1 = new Panose1Number() { Val = "02020603050405020304" };
            FontCharSet fontCharSet1 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily1 = new FontFamily() { Val = FontFamilyValues.Roman };
            Pitch pitch1 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature1 = new FontSignature() { UnicodeSignature0 = "E0002EFF", UnicodeSignature1 = "C000785B", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font1.Append(panose1Number1);
            font1.Append(fontCharSet1);
            font1.Append(fontFamily1);
            font1.Append(pitch1);
            font1.Append(fontSignature1);

            Font font2 = new Font() { Name = "Segoe UI" };
            Panose1Number panose1Number2 = new Panose1Number() { Val = "020B0502040204020203" };
            FontCharSet fontCharSet2 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily2 = new FontFamily() { Val = FontFamilyValues.Swiss };
            Pitch pitch2 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature2 = new FontSignature() { UnicodeSignature0 = "E4002EFF", UnicodeSignature1 = "C000E47F", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font2.Append(panose1Number2);
            font2.Append(fontCharSet2);
            font2.Append(fontFamily2);
            font2.Append(pitch2);
            font2.Append(fontSignature2);

            Font font3 = new Font() { Name = "Calibri Light" };
            Panose1Number panose1Number3 = new Panose1Number() { Val = "020F0302020204030204" };
            FontCharSet fontCharSet3 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily3 = new FontFamily() { Val = FontFamilyValues.Swiss };
            Pitch pitch3 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature3 = new FontSignature() { UnicodeSignature0 = "E4002EFF", UnicodeSignature1 = "C000247B", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font3.Append(panose1Number3);
            font3.Append(fontCharSet3);
            font3.Append(fontFamily3);
            font3.Append(pitch3);
            font3.Append(fontSignature3);

            Font font4 = new Font() { Name = "Calibri" };
            Panose1Number panose1Number4 = new Panose1Number() { Val = "020F0502020204030204" };
            FontCharSet fontCharSet4 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily4 = new FontFamily() { Val = FontFamilyValues.Swiss };
            Pitch pitch4 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature4 = new FontSignature() { UnicodeSignature0 = "E4002EFF", UnicodeSignature1 = "C000247B", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font4.Append(panose1Number4);
            font4.Append(fontCharSet4);
            font4.Append(fontFamily4);
            font4.Append(pitch4);
            font4.Append(fontSignature4);

            fonts1.Append(font1);
            fonts1.Append(font2);
            fonts1.Append(font3);
            fonts1.Append(font4);

            fontTablePart1.Fonts = fonts1;
        }

        // Generates content of webSettingsPart1.
        private void GenerateWebSettingsPart1Content(WebSettingsPart webSettingsPart1)
        {
            WebSettings webSettings1 = new WebSettings() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "w14 w15 w16se" } };
            webSettings1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            webSettings1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            webSettings1.AddNamespaceDeclaration("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main");
            webSettings1.AddNamespaceDeclaration("w14", "http://schemas.microsoft.com/office/word/2010/wordml");
            webSettings1.AddNamespaceDeclaration("w15", "http://schemas.microsoft.com/office/word/2012/wordml");
            webSettings1.AddNamespaceDeclaration("w16se", "http://schemas.microsoft.com/office/word/2015/wordml/symex");
            OptimizeForBrowser optimizeForBrowser1 = new OptimizeForBrowser();
            RelyOnVML relyOnVML1 = new RelyOnVML();
            AllowPNG allowPNG1 = new AllowPNG();

            webSettings1.Append(optimizeForBrowser1);
            webSettings1.Append(relyOnVML1);
            webSettings1.Append(allowPNG1);

            webSettingsPart1.WebSettings = webSettings1;
        }

        private void SetPackageProperties(OpenXmlPackage document)
        {
            document.PackageProperties.Creator = "Zentor";
            document.PackageProperties.Title = "Белорусский национальный технический университет";
            document.PackageProperties.Subject = "";
            document.PackageProperties.Keywords = "";
            document.PackageProperties.Description = "";
            document.PackageProperties.Revision = "6";
            document.PackageProperties.Created = System.Xml.XmlConvert.ToDateTime("2020-12-07T17:10:00Z", System.Xml.XmlDateTimeSerializationMode.RoundtripKind);
            document.PackageProperties.Modified = System.Xml.XmlConvert.ToDateTime("2020-12-08T09:40:00Z", System.Xml.XmlDateTimeSerializationMode.RoundtripKind);
            document.PackageProperties.LastModifiedBy = "Pavel Boltromyuk";
        }


    }
}
