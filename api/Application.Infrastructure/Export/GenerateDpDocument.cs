using DocumentFormat.OpenXml.Packaging;
using Ap = DocumentFormat.OpenXml.ExtendedProperties;
using Vt = DocumentFormat.OpenXml.VariantTypes;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Wordprocessing;
using A = DocumentFormat.OpenXml.Drawing;
using Ds = DocumentFormat.OpenXml.CustomXmlDataProperties;
using M = DocumentFormat.OpenXml.Math;
using Ovml = DocumentFormat.OpenXml.Vml.Office;
using V = DocumentFormat.OpenXml.Vml;
using W14 = DocumentFormat.OpenXml.Office2010.Word;
using W15 = DocumentFormat.OpenXml.Office2013.Word;
using Op = DocumentFormat.OpenXml.CustomProperties;
using LMPlatform.Models.DP;
using System.Globalization;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace Application.Infrastructure.Export
{
    public class GenerateDpDocument
    {
        private AssignedDiplomProject awork;
        private DiplomProject work;
        private CultureInfo cultureInfo;

        public GenerateDpDocument(AssignedDiplomProject awork, CultureInfo cultureInfo)
        {
            this.awork = awork;
            this.cultureInfo = cultureInfo;
        }

        public GenerateDpDocument(DiplomProject work, CultureInfo cultureInfo)
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

            ThemePart themePart1 = mainDocumentPart1.AddNewPart<ThemePart>("rId8");
            GenerateThemePart1Content(themePart1);

            CustomXmlPart customXmlPart1 = mainDocumentPart1.AddNewPart<CustomXmlPart>("application/xml", "rId3");
            GenerateCustomXmlPart1Content(customXmlPart1);

            CustomXmlPropertiesPart customXmlPropertiesPart1 = customXmlPart1.AddNewPart<CustomXmlPropertiesPart>("rId1");
            GenerateCustomXmlPropertiesPart1Content(customXmlPropertiesPart1);

            FontTablePart fontTablePart1 = mainDocumentPart1.AddNewPart<FontTablePart>("rId7");
            GenerateFontTablePart1Content(fontTablePart1);

            CustomXmlPart customXmlPart2 = mainDocumentPart1.AddNewPart<CustomXmlPart>("application/xml", "rId2");
            GenerateCustomXmlPart2Content(customXmlPart2);

            CustomXmlPropertiesPart customXmlPropertiesPart2 = customXmlPart2.AddNewPart<CustomXmlPropertiesPart>("rId1");
            GenerateCustomXmlPropertiesPart2Content(customXmlPropertiesPart2);

            CustomXmlPart customXmlPart3 = mainDocumentPart1.AddNewPart<CustomXmlPart>("application/xml", "rId1");
            GenerateCustomXmlPart3Content(customXmlPart3);

            CustomXmlPropertiesPart customXmlPropertiesPart3 = customXmlPart3.AddNewPart<CustomXmlPropertiesPart>("rId1");
            GenerateCustomXmlPropertiesPart3Content(customXmlPropertiesPart3);

            WebSettingsPart webSettingsPart1 = mainDocumentPart1.AddNewPart<WebSettingsPart>("rId6");
            GenerateWebSettingsPart1Content(webSettingsPart1);

            DocumentSettingsPart documentSettingsPart1 = mainDocumentPart1.AddNewPart<DocumentSettingsPart>("rId5");
            GenerateDocumentSettingsPart1Content(documentSettingsPart1);

            StyleDefinitionsPart styleDefinitionsPart1 = mainDocumentPart1.AddNewPart<StyleDefinitionsPart>("rId4");
            GenerateStyleDefinitionsPart1Content(styleDefinitionsPart1);

            CustomFilePropertiesPart customFilePropertiesPart1 = document.AddNewPart<CustomFilePropertiesPart>("rId4");
            GenerateCustomFilePropertiesPart1Content(customFilePropertiesPart1);

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
            totalTime1.Text = "38";
            Ap.Pages pages1 = new Ap.Pages();
            pages1.Text = "2";
            Ap.Words words1 = new Ap.Words();
            words1.Text = "415";
            Ap.Characters characters1 = new Ap.Characters();
            characters1.Text = "2370";
            Ap.Application application1 = new Ap.Application();
            application1.Text = "Microsoft Office Word";
            Ap.DocumentSecurity documentSecurity1 = new Ap.DocumentSecurity();
            documentSecurity1.Text = "0";
            Ap.Lines lines1 = new Ap.Lines();
            lines1.Text = "19";
            Ap.Paragraphs paragraphs1 = new Ap.Paragraphs();
            paragraphs1.Text = "5";
            Ap.ScaleCrop scaleCrop1 = new Ap.ScaleCrop();
            scaleCrop1.Text = "false";

            Ap.HeadingPairs headingPairs1 = new Ap.HeadingPairs();

            Vt.VTVector vTVector1 = new Vt.VTVector() { BaseType = Vt.VectorBaseValues.Variant, Size = (UInt32Value)2U };

            Vt.Variant variant1 = new Vt.Variant();
            Vt.VTLPSTR vTLPSTR1 = new Vt.VTLPSTR();
            vTLPSTR1.Text = "Название";

            variant1.Append(vTLPSTR1);

            Vt.Variant variant2 = new Vt.Variant();
            Vt.VTInt32 vTInt321 = new Vt.VTInt32();
            vTInt321.Text = "1";

            variant2.Append(vTInt321);

            vTVector1.Append(variant1);
            vTVector1.Append(variant2);

            headingPairs1.Append(vTVector1);

            Ap.TitlesOfParts titlesOfParts1 = new Ap.TitlesOfParts();

            Vt.VTVector vTVector2 = new Vt.VTVector() { BaseType = Vt.VectorBaseValues.Lpstr, Size = (UInt32Value)1U };
            Vt.VTLPSTR vTLPSTR2 = new Vt.VTLPSTR();
            vTLPSTR2.Text = "";

            vTVector2.Append(vTLPSTR2);

            titlesOfParts1.Append(vTVector2);
            Ap.Company company1 = new Ap.Company();
            company1.Text = "";
            Ap.LinksUpToDate linksUpToDate1 = new Ap.LinksUpToDate();
            linksUpToDate1.Text = "false";
            Ap.CharactersWithSpaces charactersWithSpaces1 = new Ap.CharactersWithSpaces();
            charactersWithSpaces1.Text = "2780";
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
            string student;
            if (awork is null)
            {
                dateStart = work.DateStart.HasValue ? work.DateStart.Value.ToString("dd'.'MM'.'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                dateEnd = work.DateEnd != null && work.DateEnd.HasValue ? work.DateEnd.Value.ToString("dd'.'MM'.'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                lecturer = string.Format("{0}.{1}. {2}", work.Lecturer.FirstName[0], work.Lecturer.MiddleName[0], work.Lecturer.LastName);
                student = "";
            }
            else
            {
                dateStart = awork.DiplomProject.DateStart.HasValue ? awork.DiplomProject.DateStart.Value.ToString("dd'.'MM'.'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                dateEnd = awork.DiplomProject.DateEnd != null && awork.DiplomProject.DateEnd.HasValue ? awork.DiplomProject.DateEnd.Value.ToString("dd'.'MM'.'yyyy'г.'", cultureInfo.DateTimeFormat) : string.Empty;
                lecturer = string.Format("{0}.{1}. {2}", awork.DiplomProject.Lecturer.FirstName[0], awork.DiplomProject.Lecturer.MiddleName[0], awork.DiplomProject.Lecturer.LastName);
                student = string.Format("{0}.{1}. {2}", awork.Student.FirstName[0], awork.Student.MiddleName[0], awork.Student.LastName);
            }

            Body body1 = new Body();

            Paragraph paragraph1 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties1 = new ParagraphProperties();
            Justification justification1 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties1 = new ParagraphMarkRunProperties();
            Caps caps1 = new Caps();
            FontSize fontSize1 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript1 = new FontSizeComplexScript() { Val = "28" };
            Languages languages1 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties1.Append(caps1);
            paragraphMarkRunProperties1.Append(fontSize1);
            paragraphMarkRunProperties1.Append(fontSizeComplexScript1);
            paragraphMarkRunProperties1.Append(languages1);

            paragraphProperties1.Append(justification1);
            paragraphProperties1.Append(paragraphMarkRunProperties1);

            Run run1 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties1 = new RunProperties();
            Caps caps2 = new Caps();
            FontSize fontSize2 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript2 = new FontSizeComplexScript() { Val = "28" };
            Languages languages2 = new Languages() { Val = "ru-RU" };

            runProperties1.Append(caps2);
            runProperties1.Append(fontSize2);
            runProperties1.Append(fontSizeComplexScript2);
            runProperties1.Append(languages2);
            Text text1 = new Text();
            text1.Text = awork is null ? work.Univer : awork.DiplomProject.Univer;
            text1.Text = text1.Text ?? "";

            run1.Append(runProperties1);
            run1.Append(text1);

            paragraph1.Append(paragraphProperties1);
            paragraph1.Append(run1);

            Paragraph paragraph2 = new Paragraph() { RsidParagraphMarkRevision = "005F4C57", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "005F4C57", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties2 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines1 = new SpacingBetweenLines() { Before = "60" };
            Justification justification2 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties2 = new ParagraphMarkRunProperties();
            FontSize fontSize3 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript3 = new FontSizeComplexScript() { Val = "28" };
            Languages languages3 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties2.Append(fontSize3);
            paragraphMarkRunProperties2.Append(fontSizeComplexScript3);
            paragraphMarkRunProperties2.Append(languages3);

            paragraphProperties2.Append(spacingBetweenLines1);
            paragraphProperties2.Append(justification2);
            paragraphProperties2.Append(paragraphMarkRunProperties2);

            Run run2 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties2 = new RunProperties();
            FontSize fontSize4 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript4 = new FontSizeComplexScript() { Val = "28" };
            Languages languages4 = new Languages() { Val = "ru-RU" };

            runProperties2.Append(fontSize4);
            runProperties2.Append(fontSizeComplexScript4);
            runProperties2.Append(languages4);
            Text text2 = new Text();
            text2.Text = awork is null ? work.Faculty : awork.DiplomProject.Faculty;
            text2.Text = text2.Text ?? "";

            run2.Append(runProperties2);
            run2.Append(text2);

            paragraph2.Append(paragraphProperties2);
            paragraph2.Append(run2);

            Paragraph paragraph3 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties3 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines2 = new SpacingBetweenLines() { Before = "60" };
            Justification justification3 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties3 = new ParagraphMarkRunProperties();
            Bold bold2 = new Bold();
            Languages languages6 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties3.Append(bold2);
            paragraphMarkRunProperties3.Append(languages6);

            paragraphProperties3.Append(spacingBetweenLines2);
            paragraphProperties3.Append(justification3);
            paragraphProperties3.Append(paragraphMarkRunProperties3);

            paragraph3.Append(paragraphProperties3);

            Table table1 = new Table();

            TableProperties tableProperties1 = new TableProperties();
            TablePositionProperties tablePositionProperties1 = new TablePositionProperties() { LeftFromText = 180, RightFromText = 180, VerticalAnchor = VerticalAnchorValues.Text, HorizontalAnchor = HorizontalAnchorValues.Margin, TablePositionXAlignment = HorizontalAlignmentValues.Right, TablePositionY = 158 };
            TableWidth tableWidth1 = new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto };

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
            TableLayout tableLayout1 = new TableLayout() { Type = TableLayoutValues.Fixed };
            TableLook tableLook1 = new TableLook() { Val = "04A0" };

            tableProperties1.Append(tablePositionProperties1);
            tableProperties1.Append(tableWidth1);
            tableProperties1.Append(tableBorders1);
            tableProperties1.Append(tableLayout1);
            tableProperties1.Append(tableLook1);

            TableGrid tableGrid1 = new TableGrid();
            GridColumn gridColumn1 = new GridColumn() { Width = "10" };
            GridColumn gridColumn2 = new GridColumn() { Width = "240" };
            GridColumn gridColumn3 = new GridColumn() { Width = "142" };
            GridColumn gridColumn4 = new GridColumn() { Width = "514" };
            GridColumn gridColumn5 = new GridColumn() { Width = "250" };
            GridColumn gridColumn6 = new GridColumn() { Width = "606" };
            GridColumn gridColumn7 = new GridColumn() { Width = "346" };
            GridColumn gridColumn8 = new GridColumn() { Width = "391" };
            GridColumn gridColumn9 = new GridColumn() { Width = "303" };
            GridColumn gridColumn10 = new GridColumn() { Width = "55" };
            GridColumn gridColumn11 = new GridColumn() { Width = "1134" };
            GridColumn gridColumn12 = new GridColumn() { Width = "795" };

            tableGrid1.Append(gridColumn1);
            tableGrid1.Append(gridColumn2);
            tableGrid1.Append(gridColumn3);
            tableGrid1.Append(gridColumn4);
            tableGrid1.Append(gridColumn5);
            tableGrid1.Append(gridColumn6);
            tableGrid1.Append(gridColumn7);
            tableGrid1.Append(gridColumn8);
            tableGrid1.Append(gridColumn9);
            tableGrid1.Append(gridColumn10);
            tableGrid1.Append(gridColumn11);
            tableGrid1.Append(gridColumn12);

            TableRow tableRow1 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties1 = new TableRowProperties();
            GridBefore gridBefore1 = new GridBefore() { Val = 1 };
            WidthBeforeTableRow widthBeforeTableRow1 = new WidthBeforeTableRow() { Width = "10", Type = TableWidthUnitValues.Dxa };

            tableRowProperties1.Append(gridBefore1);
            tableRowProperties1.Append(widthBeforeTableRow1);

            TableCell tableCell1 = new TableCell();

            TableCellProperties tableCellProperties1 = new TableCellProperties();
            TableCellWidth tableCellWidth1 = new TableCellWidth() { Width = "1752", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan1 = new GridSpan() { Val = 5 };

            TableCellBorders tableCellBorders1 = new TableCellBorders();
            TopBorder topBorder2 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder2 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder2 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder2 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders1.Append(topBorder2);
            tableCellBorders1.Append(leftBorder2);
            tableCellBorders1.Append(bottomBorder2);
            tableCellBorders1.Append(rightBorder2);

            tableCellProperties1.Append(tableCellWidth1);
            tableCellProperties1.Append(gridSpan1);
            tableCellProperties1.Append(tableCellBorders1);

            Paragraph paragraph4 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties4 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties4 = new ParagraphMarkRunProperties();
            Bold bold3 = new Bold();
            Languages languages7 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties4.Append(bold3);
            paragraphMarkRunProperties4.Append(languages7);

            paragraphProperties4.Append(paragraphMarkRunProperties4);

            Run run4 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties4 = new RunProperties();
            FontSize fontSize5 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript5 = new FontSizeComplexScript() { Val = "24" };
            Languages languages8 = new Languages() { Val = "ru-RU" };

            runProperties4.Append(fontSize5);
            runProperties4.Append(fontSizeComplexScript5);
            runProperties4.Append(languages8);
            Text text4 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text4.Text = "  ";

            run4.Append(runProperties4);
            run4.Append(text4);
            ProofError proofError1 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run5 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties5 = new RunProperties();
            FontSize fontSize6 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript6 = new FontSizeComplexScript() { Val = "24" };

            runProperties5.Append(fontSize6);
            runProperties5.Append(fontSizeComplexScript6);
            Text text5 = new Text();
            text5.Text = "Утверждаю";

            run5.Append(runProperties5);
            run5.Append(text5);
            ProofError proofError2 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph4.Append(paragraphProperties4);
            paragraph4.Append(run4);
            paragraph4.Append(proofError1);
            paragraph4.Append(run5);
            paragraph4.Append(proofError2);

            tableCell1.Append(tableCellProperties1);
            tableCell1.Append(paragraph4);

            TableCell tableCell2 = new TableCell();

            TableCellProperties tableCellProperties2 = new TableCellProperties();
            TableCellWidth tableCellWidth2 = new TableCellWidth() { Width = "3024", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan2 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders2 = new TableCellBorders();
            TopBorder topBorder3 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder3 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder3 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder3 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders2.Append(topBorder3);
            tableCellBorders2.Append(leftBorder3);
            tableCellBorders2.Append(bottomBorder3);
            tableCellBorders2.Append(rightBorder3);

            tableCellProperties2.Append(tableCellWidth2);
            tableCellProperties2.Append(gridSpan2);
            tableCellProperties2.Append(tableCellBorders2);

            Paragraph paragraph5 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties5 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties5 = new ParagraphMarkRunProperties();
            Bold bold4 = new Bold();
            Languages languages9 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties5.Append(bold4);
            paragraphMarkRunProperties5.Append(languages9);

            paragraphProperties5.Append(paragraphMarkRunProperties5);

            paragraph5.Append(paragraphProperties5);

            tableCell2.Append(tableCellProperties2);
            tableCell2.Append(paragraph5);

            tableRow1.Append(tableRowProperties1);
            tableRow1.Append(tableCell1);
            tableRow1.Append(tableCell2);

            TableRow tableRow2 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell3 = new TableCell();

            TableCellProperties tableCellProperties3 = new TableCellProperties();
            TableCellWidth tableCellWidth3 = new TableCellWidth() { Width = "2802", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan3 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders3 = new TableCellBorders();
            TopBorder topBorder4 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder4 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder4 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder4 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders3.Append(topBorder4);
            tableCellBorders3.Append(leftBorder4);
            tableCellBorders3.Append(bottomBorder4);
            tableCellBorders3.Append(rightBorder4);

            tableCellProperties3.Append(tableCellWidth3);
            tableCellProperties3.Append(gridSpan3);
            tableCellProperties3.Append(tableCellBorders3);

            Paragraph paragraph6 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties6 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties6 = new ParagraphMarkRunProperties();
            Bold bold5 = new Bold();
            Languages languages10 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties6.Append(bold5);
            paragraphMarkRunProperties6.Append(languages10);

            paragraphProperties6.Append(paragraphMarkRunProperties6);

            Run run6 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties6 = new RunProperties();
            FontSize fontSize7 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript7 = new FontSizeComplexScript() { Val = "24" };
            Languages languages11 = new Languages() { Val = "ru-RU" };

            runProperties6.Append(fontSize7);
            runProperties6.Append(fontSizeComplexScript7);
            runProperties6.Append(languages11);
            Text text6 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text6.Text = "  ";

            run6.Append(runProperties6);
            run6.Append(text6);
            ProofError proofError3 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run7 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties7 = new RunProperties();
            FontSize fontSize8 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript8 = new FontSizeComplexScript() { Val = "24" };

            runProperties7.Append(fontSize8);
            runProperties7.Append(fontSizeComplexScript8);
            Text text7 = new Text();
            text7.Text = "Заведующий";

            run7.Append(runProperties7);
            run7.Append(text7);
            ProofError proofError4 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run8 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties8 = new RunProperties();
            FontSize fontSize9 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript9 = new FontSizeComplexScript() { Val = "24" };

            runProperties8.Append(fontSize9);
            runProperties8.Append(fontSizeComplexScript9);
            Text text8 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text8.Text = " ";

            run8.Append(runProperties8);
            run8.Append(text8);
            ProofError proofError5 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run9 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties9 = new RunProperties();
            FontSize fontSize10 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript10 = new FontSizeComplexScript() { Val = "24" };

            runProperties9.Append(fontSize10);
            runProperties9.Append(fontSizeComplexScript10);
            Text text9 = new Text();
            text9.Text = "кафедрой";

            run9.Append(runProperties9);
            run9.Append(text9);
            ProofError proofError6 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph6.Append(paragraphProperties6);
            paragraph6.Append(run6);
            paragraph6.Append(proofError3);
            paragraph6.Append(run7);
            paragraph6.Append(proofError4);
            paragraph6.Append(run8);
            paragraph6.Append(proofError5);
            paragraph6.Append(run9);
            paragraph6.Append(proofError6);

            tableCell3.Append(tableCellProperties3);
            tableCell3.Append(paragraph6);

            TableCell tableCell4 = new TableCell();

            TableCellProperties tableCellProperties4 = new TableCellProperties();
            TableCellWidth tableCellWidth4 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan4 = new GridSpan() { Val = 3 };

            TableCellBorders tableCellBorders4 = new TableCellBorders();
            TopBorder topBorder5 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder5 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder5 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder5 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders4.Append(topBorder5);
            tableCellBorders4.Append(leftBorder5);
            tableCellBorders4.Append(bottomBorder5);
            tableCellBorders4.Append(rightBorder5);

            tableCellProperties4.Append(tableCellWidth4);
            tableCellProperties4.Append(gridSpan4);
            tableCellProperties4.Append(tableCellBorders4);

            Paragraph paragraph7 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties7 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties7 = new ParagraphMarkRunProperties();
            Bold bold6 = new Bold();
            Languages languages12 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties7.Append(bold6);
            paragraphMarkRunProperties7.Append(languages12);

            paragraphProperties7.Append(paragraphMarkRunProperties7);

            paragraph7.Append(paragraphProperties7);

            tableCell4.Append(tableCellProperties4);
            tableCell4.Append(paragraph7);

            tableRow2.Append(tableCell3);
            tableRow2.Append(tableCell4);

            TableRow tableRow3 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties2 = new TableRowProperties();
            GridBefore gridBefore2 = new GridBefore() { Val = 1 };
            WidthBeforeTableRow widthBeforeTableRow2 = new WidthBeforeTableRow() { Width = "10", Type = TableWidthUnitValues.Dxa };

            tableRowProperties2.Append(gridBefore2);
            tableRowProperties2.Append(widthBeforeTableRow2);

            TableCell tableCell5 = new TableCell();

            TableCellProperties tableCellProperties5 = new TableCellProperties();
            TableCellWidth tableCellWidth5 = new TableCellWidth() { Width = "240", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders5 = new TableCellBorders();
            TopBorder topBorder6 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder6 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder6 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder6 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders5.Append(topBorder6);
            tableCellBorders5.Append(leftBorder6);
            tableCellBorders5.Append(bottomBorder6);
            tableCellBorders5.Append(rightBorder6);

            tableCellProperties5.Append(tableCellWidth5);
            tableCellProperties5.Append(tableCellBorders5);

            Paragraph paragraph8 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties8 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines3 = new SpacingBetweenLines() { Before = "60" };
            Justification justification4 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties8 = new ParagraphMarkRunProperties();
            Bold bold7 = new Bold();
            Languages languages13 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties8.Append(bold7);
            paragraphMarkRunProperties8.Append(languages13);

            paragraphProperties8.Append(spacingBetweenLines3);
            paragraphProperties8.Append(justification4);
            paragraphProperties8.Append(paragraphMarkRunProperties8);

            paragraph8.Append(paragraphProperties8);

            tableCell5.Append(tableCellProperties5);
            tableCell5.Append(paragraph8);

            TableCell tableCell6 = new TableCell();

            TableCellProperties tableCellProperties6 = new TableCellProperties();
            TableCellWidth tableCellWidth6 = new TableCellWidth() { Width = "1858", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan5 = new GridSpan() { Val = 5 };

            TableCellBorders tableCellBorders6 = new TableCellBorders();
            TopBorder topBorder7 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder7 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder7 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder7 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders6.Append(topBorder7);
            tableCellBorders6.Append(leftBorder7);
            tableCellBorders6.Append(bottomBorder7);
            tableCellBorders6.Append(rightBorder7);

            tableCellProperties6.Append(tableCellWidth6);
            tableCellProperties6.Append(gridSpan5);
            tableCellProperties6.Append(tableCellBorders6);

            Paragraph paragraph9 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties9 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines4 = new SpacingBetweenLines() { Before = "60" };
            Justification justification5 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties9 = new ParagraphMarkRunProperties();
            Bold bold8 = new Bold();
            Languages languages14 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties9.Append(bold8);
            paragraphMarkRunProperties9.Append(languages14);

            paragraphProperties9.Append(spacingBetweenLines4);
            paragraphProperties9.Append(justification5);
            paragraphProperties9.Append(paragraphMarkRunProperties9);

            paragraph9.Append(paragraphProperties9);

            tableCell6.Append(tableCellProperties6);
            tableCell6.Append(paragraph9);

            TableCell tableCell7 = new TableCell();

            TableCellProperties tableCellProperties7 = new TableCellProperties();
            TableCellWidth tableCellWidth7 = new TableCellWidth() { Width = "391", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders7 = new TableCellBorders();
            TopBorder topBorder8 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder8 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder8 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder8 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders7.Append(topBorder8);
            tableCellBorders7.Append(leftBorder8);
            tableCellBorders7.Append(bottomBorder8);
            tableCellBorders7.Append(rightBorder8);

            tableCellProperties7.Append(tableCellWidth7);
            tableCellProperties7.Append(tableCellBorders7);

            Paragraph paragraph10 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties10 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines5 = new SpacingBetweenLines() { Before = "60" };
            Justification justification6 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties10 = new ParagraphMarkRunProperties();
            Bold bold9 = new Bold();
            Languages languages15 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties10.Append(bold9);
            paragraphMarkRunProperties10.Append(languages15);

            paragraphProperties10.Append(spacingBetweenLines5);
            paragraphProperties10.Append(justification6);
            paragraphProperties10.Append(paragraphMarkRunProperties10);

            paragraph10.Append(paragraphProperties10);

            tableCell7.Append(tableCellProperties7);
            tableCell7.Append(paragraph10);

            TableCell tableCell8 = new TableCell();

            TableCellProperties tableCellProperties8 = new TableCellProperties();
            TableCellWidth tableCellWidth8 = new TableCellWidth() { Width = "2287", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan6 = new GridSpan() { Val = 4 };

            TableCellBorders tableCellBorders8 = new TableCellBorders();
            TopBorder topBorder9 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder9 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder9 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder9 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders8.Append(topBorder9);
            tableCellBorders8.Append(leftBorder9);
            tableCellBorders8.Append(bottomBorder9);
            tableCellBorders8.Append(rightBorder9);

            tableCellProperties8.Append(tableCellWidth8);
            tableCellProperties8.Append(gridSpan6);
            tableCellProperties8.Append(tableCellBorders8);

            Paragraph paragraph11 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties11 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines6 = new SpacingBetweenLines() { Before = "60" };
            Justification justification7 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties11 = new ParagraphMarkRunProperties();
            FontSize fontSize11 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript11 = new FontSizeComplexScript() { Val = "24" };
            Languages languages16 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties11.Append(fontSize11);
            paragraphMarkRunProperties11.Append(fontSizeComplexScript11);
            paragraphMarkRunProperties11.Append(languages16);

            paragraphProperties11.Append(spacingBetweenLines6);
            paragraphProperties11.Append(justification7);
            paragraphProperties11.Append(paragraphMarkRunProperties11);

            Run run10 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties10 = new RunProperties();
            FontSize fontSize12 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript12 = new FontSizeComplexScript() { Val = "24" };
            Languages languages17 = new Languages() { Val = "ru-RU" };

            runProperties10.Append(fontSize12);
            runProperties10.Append(fontSizeComplexScript12);
            runProperties10.Append(languages17);
            Text text10 = new Text();
            text10.Text = awork is null ? work.HeadCathedra : awork.DiplomProject.HeadCathedra;
            text10.Text = text10.Text ?? "";

            run10.Append(runProperties10);
            run10.Append(text10);

            paragraph11.Append(paragraphProperties11);
            paragraph11.Append(run10);

            tableCell8.Append(tableCellProperties8);
            tableCell8.Append(paragraph11);

            tableRow3.Append(tableRowProperties2);
            tableRow3.Append(tableCell5);
            tableRow3.Append(tableCell6);
            tableRow3.Append(tableCell7);
            tableRow3.Append(tableCell8);

            TableRow tableRow4 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties3 = new TableRowProperties();
            GridBefore gridBefore3 = new GridBefore() { Val = 1 };
            WidthBeforeTableRow widthBeforeTableRow3 = new WidthBeforeTableRow() { Width = "10", Type = TableWidthUnitValues.Dxa };
            TableRowHeight tableRowHeight1 = new TableRowHeight() { Val = (UInt32Value)20U };

            tableRowProperties3.Append(gridBefore3);
            tableRowProperties3.Append(widthBeforeTableRow3);
            tableRowProperties3.Append(tableRowHeight1);

            TableCell tableCell9 = new TableCell();

            TableCellProperties tableCellProperties9 = new TableCellProperties();
            TableCellWidth tableCellWidth9 = new TableCellWidth() { Width = "2098", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan7 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders9 = new TableCellBorders();
            TopBorder topBorder10 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder10 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder10 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder10 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders9.Append(topBorder10);
            tableCellBorders9.Append(leftBorder10);
            tableCellBorders9.Append(bottomBorder10);
            tableCellBorders9.Append(rightBorder10);

            TableCellMargin tableCellMargin1 = new TableCellMargin();
            LeftMargin leftMargin1 = new LeftMargin() { Width = "57", Type = TableWidthUnitValues.Dxa };
            RightMargin rightMargin1 = new RightMargin() { Width = "57", Type = TableWidthUnitValues.Dxa };

            tableCellMargin1.Append(leftMargin1);
            tableCellMargin1.Append(rightMargin1);

            tableCellProperties9.Append(tableCellWidth9);
            tableCellProperties9.Append(gridSpan7);
            tableCellProperties9.Append(tableCellBorders9);
            tableCellProperties9.Append(tableCellMargin1);

            Paragraph paragraph12 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties12 = new ParagraphProperties();
            Justification justification8 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties12 = new ParagraphMarkRunProperties();
            FontSize fontSize13 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript13 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties12.Append(fontSize13);
            paragraphMarkRunProperties12.Append(fontSizeComplexScript13);

            paragraphProperties12.Append(justification8);
            paragraphProperties12.Append(paragraphMarkRunProperties12);

            Run run11 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties11 = new RunProperties();
            FontSize fontSize14 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript14 = new FontSizeComplexScript() { Val = "16" };

            runProperties11.Append(fontSize14);
            runProperties11.Append(fontSizeComplexScript14);
            Text text11 = new Text();
            text11.Text = "(";

            run11.Append(runProperties11);
            run11.Append(text11);
            ProofError proofError7 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run12 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties12 = new RunProperties();
            FontSize fontSize15 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript15 = new FontSizeComplexScript() { Val = "16" };

            runProperties12.Append(fontSize15);
            runProperties12.Append(fontSizeComplexScript15);
            Text text12 = new Text();
            text12.Text = "подпись";

            run12.Append(runProperties12);
            run12.Append(text12);
            ProofError proofError8 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run13 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties13 = new RunProperties();
            FontSize fontSize16 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript16 = new FontSizeComplexScript() { Val = "16" };

            runProperties13.Append(fontSize16);
            runProperties13.Append(fontSizeComplexScript16);
            Text text13 = new Text();
            text13.Text = ")";

            run13.Append(runProperties13);
            run13.Append(text13);

            paragraph12.Append(paragraphProperties12);
            paragraph12.Append(run11);
            paragraph12.Append(proofError7);
            paragraph12.Append(run12);
            paragraph12.Append(proofError8);
            paragraph12.Append(run13);

            tableCell9.Append(tableCellProperties9);
            tableCell9.Append(paragraph12);

            TableCell tableCell10 = new TableCell();

            TableCellProperties tableCellProperties10 = new TableCellProperties();
            TableCellWidth tableCellWidth10 = new TableCellWidth() { Width = "391", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders10 = new TableCellBorders();
            TopBorder topBorder11 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder11 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder11 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder11 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders10.Append(topBorder11);
            tableCellBorders10.Append(leftBorder11);
            tableCellBorders10.Append(bottomBorder11);
            tableCellBorders10.Append(rightBorder11);

            tableCellProperties10.Append(tableCellWidth10);
            tableCellProperties10.Append(tableCellBorders10);

            Paragraph paragraph13 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties13 = new ParagraphProperties();
            Justification justification9 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties13 = new ParagraphMarkRunProperties();
            FontSize fontSize17 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript17 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties13.Append(fontSize17);
            paragraphMarkRunProperties13.Append(fontSizeComplexScript17);

            paragraphProperties13.Append(justification9);
            paragraphProperties13.Append(paragraphMarkRunProperties13);

            paragraph13.Append(paragraphProperties13);

            tableCell10.Append(tableCellProperties10);
            tableCell10.Append(paragraph13);

            TableCell tableCell11 = new TableCell();

            TableCellProperties tableCellProperties11 = new TableCellProperties();
            TableCellWidth tableCellWidth11 = new TableCellWidth() { Width = "2287", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan8 = new GridSpan() { Val = 4 };

            TableCellBorders tableCellBorders11 = new TableCellBorders();
            TopBorder topBorder12 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder12 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder12 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder12 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders11.Append(topBorder12);
            tableCellBorders11.Append(leftBorder12);
            tableCellBorders11.Append(bottomBorder12);
            tableCellBorders11.Append(rightBorder12);

            tableCellProperties11.Append(tableCellWidth11);
            tableCellProperties11.Append(gridSpan8);
            tableCellProperties11.Append(tableCellBorders11);

            Paragraph paragraph14 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties14 = new ParagraphProperties();
            Justification justification10 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties14 = new ParagraphMarkRunProperties();
            FontSize fontSize18 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript18 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties14.Append(fontSize18);
            paragraphMarkRunProperties14.Append(fontSizeComplexScript18);

            paragraphProperties14.Append(justification10);
            paragraphProperties14.Append(paragraphMarkRunProperties14);

            Run run14 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties14 = new RunProperties();
            FontSize fontSize19 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript19 = new FontSizeComplexScript() { Val = "16" };

            runProperties14.Append(fontSize19);
            runProperties14.Append(fontSizeComplexScript19);
            Text text14 = new Text();
            text14.Text = "(";

            run14.Append(runProperties14);
            run14.Append(text14);
            ProofError proofError9 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run15 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties15 = new RunProperties();
            FontSize fontSize20 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript20 = new FontSizeComplexScript() { Val = "16" };

            runProperties15.Append(fontSize20);
            runProperties15.Append(fontSizeComplexScript20);
            Text text15 = new Text();
            text15.Text = "фамилия";

            run15.Append(runProperties15);
            run15.Append(text15);
            ProofError proofError10 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run16 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties16 = new RunProperties();
            FontSize fontSize21 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript21 = new FontSizeComplexScript() { Val = "16" };
            Languages languages18 = new Languages() { Val = "ru-RU" };

            runProperties16.Append(fontSize21);
            runProperties16.Append(fontSizeComplexScript21);
            runProperties16.Append(languages18);
            Text text16 = new Text();
            text16.Text = ", инициалы";

            run16.Append(runProperties16);
            run16.Append(text16);

            Run run17 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties17 = new RunProperties();
            FontSize fontSize22 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript22 = new FontSizeComplexScript() { Val = "16" };

            runProperties17.Append(fontSize22);
            runProperties17.Append(fontSizeComplexScript22);
            Text text17 = new Text();
            text17.Text = ")";

            run17.Append(runProperties17);
            run17.Append(text17);

            paragraph14.Append(paragraphProperties14);
            paragraph14.Append(run14);
            paragraph14.Append(proofError9);
            paragraph14.Append(run15);
            paragraph14.Append(proofError10);
            paragraph14.Append(run16);
            paragraph14.Append(run17);

            tableCell11.Append(tableCellProperties11);
            tableCell11.Append(paragraph14);

            tableRow4.Append(tableRowProperties3);
            tableRow4.Append(tableCell9);
            tableRow4.Append(tableCell10);
            tableRow4.Append(tableCell11);

            TableRow tableRow5 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties4 = new TableRowProperties();
            GridBefore gridBefore4 = new GridBefore() { Val = 1 };
            WidthBeforeTableRow widthBeforeTableRow4 = new WidthBeforeTableRow() { Width = "10", Type = TableWidthUnitValues.Dxa };

            tableRowProperties4.Append(gridBefore4);
            tableRowProperties4.Append(widthBeforeTableRow4);

            TableCell tableCell12 = new TableCell();

            TableCellProperties tableCellProperties12 = new TableCellProperties();
            TableCellWidth tableCellWidth12 = new TableCellWidth() { Width = "382", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan9 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders12 = new TableCellBorders();
            TopBorder topBorder13 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder13 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder13 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder13 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders12.Append(topBorder13);
            tableCellBorders12.Append(leftBorder13);
            tableCellBorders12.Append(bottomBorder13);
            tableCellBorders12.Append(rightBorder13);

            tableCellProperties12.Append(tableCellWidth12);
            tableCellProperties12.Append(gridSpan9);
            tableCellProperties12.Append(tableCellBorders12);

            Paragraph paragraph15 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties15 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines7 = new SpacingBetweenLines() { Before = "60" };
            Justification justification11 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties15 = new ParagraphMarkRunProperties();
            Bold bold10 = new Bold();
            FontSize fontSize23 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript23 = new FontSizeComplexScript() { Val = "24" };
            Languages languages19 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties15.Append(bold10);
            paragraphMarkRunProperties15.Append(fontSize23);
            paragraphMarkRunProperties15.Append(fontSizeComplexScript23);
            paragraphMarkRunProperties15.Append(languages19);

            paragraphProperties15.Append(spacingBetweenLines7);
            paragraphProperties15.Append(justification11);
            paragraphProperties15.Append(paragraphMarkRunProperties15);

            Run run18 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties18 = new RunProperties();
            FontSize fontSize24 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript24 = new FontSizeComplexScript() { Val = "24" };

            runProperties18.Append(fontSize24);
            runProperties18.Append(fontSizeComplexScript24);
            Text text18 = new Text();
            text18.Text = "«";

            run18.Append(runProperties18);
            run18.Append(text18);

            paragraph15.Append(paragraphProperties15);
            paragraph15.Append(run18);

            tableCell12.Append(tableCellProperties12);
            tableCell12.Append(paragraph15);

            TableCell tableCell13 = new TableCell();

            TableCellProperties tableCellProperties13 = new TableCellProperties();
            TableCellWidth tableCellWidth13 = new TableCellWidth() { Width = "514", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders13 = new TableCellBorders();
            TopBorder topBorder14 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder14 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder14 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder14 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders13.Append(topBorder14);
            tableCellBorders13.Append(leftBorder14);
            tableCellBorders13.Append(bottomBorder14);
            tableCellBorders13.Append(rightBorder14);

            tableCellProperties13.Append(tableCellWidth13);
            tableCellProperties13.Append(tableCellBorders13);

            Paragraph paragraph16 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties16 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines8 = new SpacingBetweenLines() { Before = "60" };
            Justification justification12 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties16 = new ParagraphMarkRunProperties();
            Bold bold11 = new Bold();
            Languages languages20 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties16.Append(bold11);
            paragraphMarkRunProperties16.Append(languages20);

            paragraphProperties16.Append(spacingBetweenLines8);
            paragraphProperties16.Append(justification12);
            paragraphProperties16.Append(paragraphMarkRunProperties16);

            paragraph16.Append(paragraphProperties16);

            tableCell13.Append(tableCellProperties13);
            tableCell13.Append(paragraph16);

            TableCell tableCell14 = new TableCell();

            TableCellProperties tableCellProperties14 = new TableCellProperties();
            TableCellWidth tableCellWidth14 = new TableCellWidth() { Width = "250", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders14 = new TableCellBorders();
            TopBorder topBorder15 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder15 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder15 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder15 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders14.Append(topBorder15);
            tableCellBorders14.Append(leftBorder15);
            tableCellBorders14.Append(bottomBorder15);
            tableCellBorders14.Append(rightBorder15);

            tableCellProperties14.Append(tableCellWidth14);
            tableCellProperties14.Append(tableCellBorders14);

            Paragraph paragraph17 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties17 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines9 = new SpacingBetweenLines() { Before = "60" };
            Justification justification13 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties17 = new ParagraphMarkRunProperties();
            Bold bold12 = new Bold();
            FontSize fontSize25 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript25 = new FontSizeComplexScript() { Val = "24" };
            Languages languages21 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties17.Append(bold12);
            paragraphMarkRunProperties17.Append(fontSize25);
            paragraphMarkRunProperties17.Append(fontSizeComplexScript25);
            paragraphMarkRunProperties17.Append(languages21);

            paragraphProperties17.Append(spacingBetweenLines9);
            paragraphProperties17.Append(justification13);
            paragraphProperties17.Append(paragraphMarkRunProperties17);

            Run run19 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties19 = new RunProperties();
            FontSize fontSize26 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript26 = new FontSizeComplexScript() { Val = "24" };

            runProperties19.Append(fontSize26);
            runProperties19.Append(fontSizeComplexScript26);
            Text text19 = new Text();
            text19.Text = "»";

            run19.Append(runProperties19);
            run19.Append(text19);

            paragraph17.Append(paragraphProperties17);
            paragraph17.Append(run19);

            tableCell14.Append(tableCellProperties14);
            tableCell14.Append(paragraph17);

            TableCell tableCell15 = new TableCell();

            TableCellProperties tableCellProperties15 = new TableCellProperties();
            TableCellWidth tableCellWidth15 = new TableCellWidth() { Width = "1701", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan10 = new GridSpan() { Val = 5 };

            TableCellBorders tableCellBorders15 = new TableCellBorders();
            TopBorder topBorder16 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder16 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder16 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder16 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders15.Append(topBorder16);
            tableCellBorders15.Append(leftBorder16);
            tableCellBorders15.Append(bottomBorder16);
            tableCellBorders15.Append(rightBorder16);

            tableCellProperties15.Append(tableCellWidth15);
            tableCellProperties15.Append(gridSpan10);
            tableCellProperties15.Append(tableCellBorders15);

            Paragraph paragraph18 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties18 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines10 = new SpacingBetweenLines() { Before = "60" };
            Justification justification14 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties18 = new ParagraphMarkRunProperties();
            Bold bold13 = new Bold();
            Languages languages22 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties18.Append(bold13);
            paragraphMarkRunProperties18.Append(languages22);

            paragraphProperties18.Append(spacingBetweenLines10);
            paragraphProperties18.Append(justification14);
            paragraphProperties18.Append(paragraphMarkRunProperties18);

            paragraph18.Append(paragraphProperties18);

            tableCell15.Append(tableCellProperties15);
            tableCell15.Append(paragraph18);

            TableCell tableCell16 = new TableCell();

            TableCellProperties tableCellProperties16 = new TableCellProperties();
            TableCellWidth tableCellWidth16 = new TableCellWidth() { Width = "1134", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders16 = new TableCellBorders();
            TopBorder topBorder17 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder17 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder17 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder17 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders16.Append(topBorder17);
            tableCellBorders16.Append(leftBorder17);
            tableCellBorders16.Append(bottomBorder17);
            tableCellBorders16.Append(rightBorder17);

            tableCellProperties16.Append(tableCellWidth16);
            tableCellProperties16.Append(tableCellBorders16);

            Paragraph paragraph19 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties19 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines11 = new SpacingBetweenLines() { Before = "60" };

            ParagraphMarkRunProperties paragraphMarkRunProperties19 = new ParagraphMarkRunProperties();
            FontSize fontSize27 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript27 = new FontSizeComplexScript() { Val = "24" };
            Languages languages23 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties19.Append(fontSize27);
            paragraphMarkRunProperties19.Append(fontSizeComplexScript27);
            paragraphMarkRunProperties19.Append(languages23);

            paragraphProperties19.Append(spacingBetweenLines11);
            paragraphProperties19.Append(paragraphMarkRunProperties19);

            Run run20 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties20 = new RunProperties();
            FontSize fontSize28 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript28 = new FontSizeComplexScript() { Val = "24" };
            Languages languages24 = new Languages() { Val = "ru-RU" };

            runProperties20.Append(fontSize28);
            runProperties20.Append(fontSizeComplexScript28);
            runProperties20.Append(languages24);
            Text text20 = new Text();
            if (awork is null)
            {
                if (work.DateStart != null)
                {
                    text20.Text = work.DateStart.Value.Year.ToString();
                }
            }
            else
            {
                text20.Text = awork.DiplomProject.DateStart.Value.Year.ToString();
            }
            text20.Text = text20.Text ?? "";

            run20.Append(runProperties20);
            run20.Append(text20);

            Run run22 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties22 = new RunProperties();
            FontSize fontSize30 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript30 = new FontSizeComplexScript() { Val = "24" };
            Languages languages26 = new Languages() { Val = "ru-RU" };

            runProperties22.Append(fontSize30);
            runProperties22.Append(fontSizeComplexScript30);
            runProperties22.Append(languages26);
            Text text22 = new Text();
            text22.Text = "г.";

            run22.Append(runProperties22);
            run22.Append(text22);

            paragraph19.Append(paragraphProperties19);
            paragraph19.Append(run20);
            paragraph19.Append(run22);

            tableCell16.Append(tableCellProperties16);
            tableCell16.Append(paragraph19);

            TableCell tableCell17 = new TableCell();

            TableCellProperties tableCellProperties17 = new TableCellProperties();
            TableCellWidth tableCellWidth17 = new TableCellWidth() { Width = "795", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders17 = new TableCellBorders();
            TopBorder topBorder18 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder18 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder18 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder18 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders17.Append(topBorder18);
            tableCellBorders17.Append(leftBorder18);
            tableCellBorders17.Append(bottomBorder18);
            tableCellBorders17.Append(rightBorder18);

            tableCellProperties17.Append(tableCellWidth17);
            tableCellProperties17.Append(tableCellBorders17);

            Paragraph paragraph20 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties20 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines12 = new SpacingBetweenLines() { Before = "60" };
            Justification justification15 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties20 = new ParagraphMarkRunProperties();
            Bold bold14 = new Bold();
            Languages languages27 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties20.Append(bold14);
            paragraphMarkRunProperties20.Append(languages27);

            paragraphProperties20.Append(spacingBetweenLines12);
            paragraphProperties20.Append(justification15);
            paragraphProperties20.Append(paragraphMarkRunProperties20);

            paragraph20.Append(paragraphProperties20);

            tableCell17.Append(tableCellProperties17);
            tableCell17.Append(paragraph20);

            tableRow5.Append(tableRowProperties4);
            tableRow5.Append(tableCell12);
            tableRow5.Append(tableCell13);
            tableRow5.Append(tableCell14);
            tableRow5.Append(tableCell15);
            tableRow5.Append(tableCell16);
            tableRow5.Append(tableCell17);

            table1.Append(tableProperties1);
            table1.Append(tableGrid1);
            table1.Append(tableRow1);
            table1.Append(tableRow2);
            table1.Append(tableRow3);
            table1.Append(tableRow4);
            table1.Append(tableRow5);

            Paragraph paragraph21 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties21 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines13 = new SpacingBetweenLines() { Before = "60" };
            Justification justification16 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties21 = new ParagraphMarkRunProperties();
            Bold bold15 = new Bold();
            Languages languages28 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties21.Append(bold15);
            paragraphMarkRunProperties21.Append(languages28);

            paragraphProperties21.Append(spacingBetweenLines13);
            paragraphProperties21.Append(justification16);
            paragraphProperties21.Append(paragraphMarkRunProperties21);

            paragraph21.Append(paragraphProperties21);

            Paragraph paragraph22 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties22 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines14 = new SpacingBetweenLines() { Before = "60" };
            Justification justification17 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties22 = new ParagraphMarkRunProperties();
            Bold bold16 = new Bold();
            Languages languages29 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties22.Append(bold16);
            paragraphMarkRunProperties22.Append(languages29);

            paragraphProperties22.Append(spacingBetweenLines14);
            paragraphProperties22.Append(justification17);
            paragraphProperties22.Append(paragraphMarkRunProperties22);

            paragraph22.Append(paragraphProperties22);

            Paragraph paragraph23 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties23 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines15 = new SpacingBetweenLines() { Before = "60" };
            Justification justification18 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties23 = new ParagraphMarkRunProperties();
            Bold bold17 = new Bold();
            Languages languages30 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties23.Append(bold17);
            paragraphMarkRunProperties23.Append(languages30);

            paragraphProperties23.Append(spacingBetweenLines15);
            paragraphProperties23.Append(justification18);
            paragraphProperties23.Append(paragraphMarkRunProperties23);

            paragraph23.Append(paragraphProperties23);

            Paragraph paragraph24 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties24 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines16 = new SpacingBetweenLines() { Before = "60" };
            Justification justification19 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties24 = new ParagraphMarkRunProperties();
            Bold bold18 = new Bold();
            Languages languages31 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties24.Append(bold18);
            paragraphMarkRunProperties24.Append(languages31);

            paragraphProperties24.Append(spacingBetweenLines16);
            paragraphProperties24.Append(justification19);
            paragraphProperties24.Append(paragraphMarkRunProperties24);

            paragraph24.Append(paragraphProperties24);

            Paragraph paragraph25 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties25 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines17 = new SpacingBetweenLines() { Before = "60" };
            Justification justification20 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties25 = new ParagraphMarkRunProperties();
            Bold bold19 = new Bold();
            Languages languages32 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties25.Append(bold19);
            paragraphMarkRunProperties25.Append(languages32);

            paragraphProperties25.Append(spacingBetweenLines17);
            paragraphProperties25.Append(justification20);
            paragraphProperties25.Append(paragraphMarkRunProperties25);

            paragraph25.Append(paragraphProperties25);

            Paragraph paragraph26 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties26 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines18 = new SpacingBetweenLines() { Before = "60" };
            Justification justification21 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties26 = new ParagraphMarkRunProperties();
            Bold bold20 = new Bold();
            Languages languages33 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties26.Append(bold20);
            paragraphMarkRunProperties26.Append(languages33);

            paragraphProperties26.Append(spacingBetweenLines18);
            paragraphProperties26.Append(justification21);
            paragraphProperties26.Append(paragraphMarkRunProperties26);

            paragraph26.Append(paragraphProperties26);

            Paragraph paragraph27 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties27 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines19 = new SpacingBetweenLines() { Before = "60" };
            Justification justification22 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties27 = new ParagraphMarkRunProperties();
            Bold bold21 = new Bold();
            Languages languages34 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties27.Append(bold21);
            paragraphMarkRunProperties27.Append(languages34);

            paragraphProperties27.Append(spacingBetweenLines19);
            paragraphProperties27.Append(justification22);
            paragraphProperties27.Append(paragraphMarkRunProperties27);

            paragraph27.Append(paragraphProperties27);

            Paragraph paragraph28 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties28 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines20 = new SpacingBetweenLines() { Before = "240" };
            Justification justification23 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties28 = new ParagraphMarkRunProperties();
            Bold bold22 = new Bold();
            FontSize fontSize31 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript31 = new FontSizeComplexScript() { Val = "24" };
            Languages languages35 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties28.Append(bold22);
            paragraphMarkRunProperties28.Append(fontSize31);
            paragraphMarkRunProperties28.Append(fontSizeComplexScript31);
            paragraphMarkRunProperties28.Append(languages35);

            paragraphProperties28.Append(spacingBetweenLines20);
            paragraphProperties28.Append(justification23);
            paragraphProperties28.Append(paragraphMarkRunProperties28);

            Run run23 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties23 = new RunProperties();
            Bold bold23 = new Bold();
            FontSize fontSize32 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript32 = new FontSizeComplexScript() { Val = "24" };
            Languages languages36 = new Languages() { Val = "ru-RU" };

            runProperties23.Append(bold23);
            runProperties23.Append(fontSize32);
            runProperties23.Append(fontSizeComplexScript32);
            runProperties23.Append(languages36);
            Text text23 = new Text();
            text23.Text = "Задание на дипломный проект";

            run23.Append(runProperties23);
            run23.Append(text23);

            paragraph28.Append(paragraphProperties28);
            paragraph28.Append(run23);

            Paragraph paragraph29 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties29 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines21 = new SpacingBetweenLines() { Before = "240" };
            Justification justification24 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties29 = new ParagraphMarkRunProperties();
            Bold bold24 = new Bold();
            Languages languages37 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties29.Append(bold24);
            paragraphMarkRunProperties29.Append(languages37);

            paragraphProperties29.Append(spacingBetweenLines21);
            paragraphProperties29.Append(justification24);
            paragraphProperties29.Append(paragraphMarkRunProperties29);

            paragraph29.Append(paragraphProperties29);

            Table table2 = new Table();

            TableProperties tableProperties2 = new TableProperties();
            TableWidth tableWidth2 = new TableWidth() { Width = "10900", Type = TableWidthUnitValues.Dxa };

            TableBorders tableBorders2 = new TableBorders();
            TopBorder topBorder19 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder19 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder19 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder19 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder2 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder2 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders2.Append(topBorder19);
            tableBorders2.Append(leftBorder19);
            tableBorders2.Append(bottomBorder19);
            tableBorders2.Append(rightBorder19);
            tableBorders2.Append(insideHorizontalBorder2);
            tableBorders2.Append(insideVerticalBorder2);
            TableLook tableLook2 = new TableLook() { Val = "04A0" };

            tableProperties2.Append(tableWidth2);
            tableProperties2.Append(tableBorders2);
            tableProperties2.Append(tableLook2);

            TableGrid tableGrid2 = new TableGrid();
            GridColumn gridColumn13 = new GridColumn() { Width = "2188" };
            GridColumn gridColumn14 = new GridColumn() { Width = "8712" };

            tableGrid2.Append(gridColumn13);
            tableGrid2.Append(gridColumn14);

            TableRow tableRow6 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003578D5" };

            TableRowProperties tableRowProperties5 = new TableRowProperties();
            TableRowHeight tableRowHeight2 = new TableRowHeight() { Val = (UInt32Value)380U };

            tableRowProperties5.Append(tableRowHeight2);

            TableCell tableCell18 = new TableCell();

            TableCellProperties tableCellProperties18 = new TableCellProperties();
            TableCellWidth tableCellWidth18 = new TableCellWidth() { Width = "2188", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders18 = new TableCellBorders();
            TopBorder topBorder20 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder20 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder20 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder20 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders18.Append(topBorder20);
            tableCellBorders18.Append(leftBorder20);
            tableCellBorders18.Append(bottomBorder20);
            tableCellBorders18.Append(rightBorder20);
            TableCellVerticalAlignment tableCellVerticalAlignment1 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties18.Append(tableCellWidth18);
            tableCellProperties18.Append(tableCellBorders18);
            tableCellProperties18.Append(tableCellVerticalAlignment1);

            Paragraph paragraph30 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties30 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties30 = new ParagraphMarkRunProperties();
            Bold bold25 = new Bold();
            FontSize fontSize33 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript33 = new FontSizeComplexScript() { Val = "24" };
            Languages languages38 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties30.Append(bold25);
            paragraphMarkRunProperties30.Append(fontSize33);
            paragraphMarkRunProperties30.Append(fontSizeComplexScript33);
            paragraphMarkRunProperties30.Append(languages38);

            paragraphProperties30.Append(paragraphMarkRunProperties30);

            Run run24 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties24 = new RunProperties();
            FontSize fontSize34 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript34 = new FontSizeComplexScript() { Val = "24" };
            Languages languages39 = new Languages() { Val = "ru-RU" };

            runProperties24.Append(fontSize34);
            runProperties24.Append(fontSizeComplexScript34);
            runProperties24.Append(languages39);
            Text text24 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text24.Text = "Обучающемуся ";

            run24.Append(runProperties24);
            run24.Append(text24);

            paragraph30.Append(paragraphProperties30);
            paragraph30.Append(run24);

            tableCell18.Append(tableCellProperties18);
            tableCell18.Append(paragraph30);

            TableCell tableCell19 = new TableCell();

            TableCellProperties tableCellProperties19 = new TableCellProperties();
            TableCellWidth tableCellWidth19 = new TableCellWidth() { Width = "8711", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders19 = new TableCellBorders();
            TopBorder topBorder21 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder21 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder21 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder21 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders19.Append(topBorder21);
            tableCellBorders19.Append(leftBorder21);
            tableCellBorders19.Append(bottomBorder21);
            tableCellBorders19.Append(rightBorder21);

            tableCellProperties19.Append(tableCellWidth19);
            tableCellProperties19.Append(tableCellBorders19);

            Paragraph paragraph31 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003578D5" };

            ParagraphProperties paragraphProperties31 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties31 = new ParagraphMarkRunProperties();
            Bold bold26 = new Bold();
            FontSize fontSize35 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript35 = new FontSizeComplexScript() { Val = "24" };
            Languages languages40 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties31.Append(bold26);
            paragraphMarkRunProperties31.Append(fontSize35);
            paragraphMarkRunProperties31.Append(fontSizeComplexScript35);
            paragraphMarkRunProperties31.Append(languages40);

            paragraphProperties31.Append(paragraphMarkRunProperties31);
            ProofError proofError11 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run25 = new Run();

            RunProperties runProperties25 = new RunProperties();
            Bold bold27 = new Bold();
            FontSize fontSize36 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript36 = new FontSizeComplexScript() { Val = "24" };
            Languages languages41 = new Languages() { Val = "ru-RU" };

            runProperties25.Append(bold27);
            runProperties25.Append(fontSize36);
            runProperties25.Append(fontSizeComplexScript36);
            runProperties25.Append(languages41);
            Text text25 = new Text();
            text25.Text = awork is null ? "" : string.Format("{0} {1} {2}", awork.Student.LastName, awork.Student.FirstName, awork.Student.MiddleName);

            run25.Append(runProperties25);
            run25.Append(text25);
            ProofError proofError12 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph31.Append(paragraphProperties31);
            paragraph31.Append(proofError11);
            paragraph31.Append(run25);
            paragraph31.Append(proofError12);

            tableCell19.Append(tableCellProperties19);
            tableCell19.Append(paragraph31);

            tableRow6.Append(tableRowProperties5);
            tableRow6.Append(tableCell18);
            tableRow6.Append(tableCell19);

            TableRow tableRow7 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003578D5" };

            TableRowProperties tableRowProperties6 = new TableRowProperties();
            TableRowHeight tableRowHeight3 = new TableRowHeight() { Val = (UInt32Value)181U };

            tableRowProperties6.Append(tableRowHeight3);

            TableCell tableCell20 = new TableCell();

            TableCellProperties tableCellProperties20 = new TableCellProperties();
            TableCellWidth tableCellWidth20 = new TableCellWidth() { Width = "10900", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan11 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders20 = new TableCellBorders();
            TopBorder topBorder22 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder22 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder22 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder22 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders20.Append(topBorder22);
            tableCellBorders20.Append(leftBorder22);
            tableCellBorders20.Append(bottomBorder22);
            tableCellBorders20.Append(rightBorder22);

            tableCellProperties20.Append(tableCellWidth20);
            tableCellProperties20.Append(gridSpan11);
            tableCellProperties20.Append(tableCellBorders20);

            Paragraph paragraph32 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties32 = new ParagraphProperties();
            Indentation indentation1 = new Indentation() { Start = "4962" };

            ParagraphMarkRunProperties paragraphMarkRunProperties32 = new ParagraphMarkRunProperties();
            Bold bold29 = new Bold();
            FontSize fontSize38 = new FontSize() { Val = "28" };
            Languages languages43 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties32.Append(bold29);
            paragraphMarkRunProperties32.Append(fontSize38);
            paragraphMarkRunProperties32.Append(languages43);

            paragraphProperties32.Append(indentation1);
            paragraphProperties32.Append(paragraphMarkRunProperties32);

            Run run27 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties27 = new RunProperties();
            FontSize fontSize39 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript38 = new FontSizeComplexScript() { Val = "16" };
            Languages languages44 = new Languages() { Val = "ru-RU" };

            runProperties27.Append(fontSize39);
            runProperties27.Append(fontSizeComplexScript38);
            runProperties27.Append(languages44);
            Text text27 = new Text();
            text27.Text = "(фамилия, инициалы)";

            run27.Append(runProperties27);
            run27.Append(text27);

            paragraph32.Append(paragraphProperties32);
            paragraph32.Append(run27);

            tableCell20.Append(tableCellProperties20);
            tableCell20.Append(paragraph32);

            tableRow7.Append(tableRowProperties6);
            tableRow7.Append(tableCell20);

            table2.Append(tableProperties2);
            table2.Append(tableGrid2);
            table2.Append(tableRow6);
            table2.Append(tableRow7);

            Paragraph paragraph33 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties33 = new ParagraphProperties();
            SpacingBetweenLines spacingBetweenLines22 = new SpacingBetweenLines() { Before = "240" };
            Justification justification25 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties33 = new ParagraphMarkRunProperties();
            Bold bold30 = new Bold();
            Languages languages45 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties33.Append(bold30);
            paragraphMarkRunProperties33.Append(languages45);

            paragraphProperties33.Append(spacingBetweenLines22);
            paragraphProperties33.Append(justification25);
            paragraphProperties33.Append(paragraphMarkRunProperties33);

            paragraph33.Append(paragraphProperties33);

            Table table3 = new Table();

            TableProperties tableProperties3 = new TableProperties();
            TableWidth tableWidth3 = new TableWidth() { Width = "5001", Type = TableWidthUnitValues.Pct };
            TableLook tableLook3 = new TableLook() { Val = "01E0" };

            tableProperties3.Append(tableWidth3);
            tableProperties3.Append(tableLook3);

            TableGrid tableGrid3 = new TableGrid();
            GridColumn gridColumn15 = new GridColumn() { Width = "2889" };
            GridColumn gridColumn16 = new GridColumn() { Width = "620" };
            GridColumn gridColumn17 = new GridColumn() { Width = "2154" };
            GridColumn gridColumn18 = new GridColumn() { Width = "2719" };
            GridColumn gridColumn19 = new GridColumn() { Width = "1086" };
            GridColumn gridColumn20 = new GridColumn() { Width = "490" };
            GridColumn gridColumn21 = new GridColumn() { Width = "782" };
            GridColumn gridColumn22 = new GridColumn() { Width = "230" };
            GridColumn gridColumn23 = new GridColumn() { Width = "24" };

            tableGrid3.Append(gridColumn15);
            tableGrid3.Append(gridColumn16);
            tableGrid3.Append(gridColumn17);
            tableGrid3.Append(gridColumn18);
            tableGrid3.Append(gridColumn19);
            tableGrid3.Append(gridColumn20);
            tableGrid3.Append(gridColumn21);
            tableGrid3.Append(gridColumn22);
            tableGrid3.Append(gridColumn23);

            TableRow tableRow8 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties7 = new TableRowProperties();
            TableRowHeight tableRowHeight4 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties7.Append(tableRowHeight4);

            TableCell tableCell21 = new TableCell();

            TableCellProperties tableCellProperties21 = new TableCellProperties();
            TableCellWidth tableCellWidth21 = new TableCellWidth() { Width = "1595", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan12 = new GridSpan() { Val = 2 };
            Shading shading1 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment2 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties21.Append(tableCellWidth21);
            tableCellProperties21.Append(gridSpan12);
            tableCellProperties21.Append(shading1);
            tableCellProperties21.Append(tableCellVerticalAlignment2);

            Paragraph paragraph34 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties34 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties34 = new ParagraphMarkRunProperties();
            FontSize fontSize40 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript39 = new FontSizeComplexScript() { Val = "24" };
            Languages languages46 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties34.Append(fontSize40);
            paragraphMarkRunProperties34.Append(fontSizeComplexScript39);
            paragraphMarkRunProperties34.Append(languages46);

            paragraphProperties34.Append(paragraphMarkRunProperties34);

            Run run28 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties28 = new RunProperties();
            FontSize fontSize41 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript40 = new FontSizeComplexScript() { Val = "24" };
            Languages languages47 = new Languages() { Val = "ru-RU" };

            runProperties28.Append(fontSize41);
            runProperties28.Append(fontSizeComplexScript40);
            runProperties28.Append(languages47);
            Text text28 = new Text();
            text28.Text = "1. Тема дипломного проекта";

            run28.Append(runProperties28);
            run28.Append(text28);

            paragraph34.Append(paragraphProperties34);
            paragraph34.Append(run28);

            tableCell21.Append(tableCellProperties21);
            tableCell21.Append(paragraph34);

            TableCell tableCell22 = new TableCell();

            TableCellProperties tableCellProperties22 = new TableCellProperties();
            TableCellWidth tableCellWidth22 = new TableCellWidth() { Width = "3405", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan13 = new GridSpan() { Val = 7 };

            TableCellBorders tableCellBorders21 = new TableCellBorders();
            BottomBorder bottomBorder23 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders21.Append(bottomBorder23);
            Shading shading2 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment3 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties22.Append(tableCellWidth22);
            tableCellProperties22.Append(gridSpan13);
            tableCellProperties22.Append(tableCellBorders21);
            tableCellProperties22.Append(shading2);
            tableCellProperties22.Append(tableCellVerticalAlignment3);

            Paragraph paragraph35 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003578D5" };

            ParagraphProperties paragraphProperties35 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties35 = new ParagraphMarkRunProperties();
            FontSize fontSize42 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript41 = new FontSizeComplexScript() { Val = "24" };
            Languages languages48 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties35.Append(fontSize42);
            paragraphMarkRunProperties35.Append(fontSizeComplexScript41);
            paragraphMarkRunProperties35.Append(languages48);

            paragraphProperties35.Append(paragraphMarkRunProperties35);
            ProofError proofError13 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run29 = new Run();

            RunProperties runProperties29 = new RunProperties();
            FontSize fontSize43 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript42 = new FontSizeComplexScript() { Val = "24" };
            Languages languages49 = new Languages() { Val = "ru-RU" };

            runProperties29.Append(fontSize43);
            runProperties29.Append(fontSizeComplexScript42);
            runProperties29.Append(languages49);
            Text text29 = new Text();
            text29.Text = awork is null ? work.Theme : awork.DiplomProject.Theme;

            run29.Append(runProperties29);
            run29.Append(text29);
            ProofError proofError14 = new ProofError() { Type = ProofingErrorValues.SpellEnd };
            ProofError proofError15 = new ProofError() { Type = ProofingErrorValues.SpellStart };
            ProofError proofError16 = new ProofError() { Type = ProofingErrorValues.SpellEnd };
            ProofError proofError17 = new ProofError() { Type = ProofingErrorValues.SpellStart };
            ProofError proofError18 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph35.Append(paragraphProperties35);
            paragraph35.Append(proofError13);
            paragraph35.Append(run29);
            paragraph35.Append(proofError14);
            paragraph35.Append(proofError15);
            paragraph35.Append(proofError16);
            paragraph35.Append(proofError17);
            paragraph35.Append(proofError18);

            tableCell22.Append(tableCellProperties22);
            tableCell22.Append(paragraph35);

            tableRow8.Append(tableRowProperties7);
            tableRow8.Append(tableCell21);
            tableRow8.Append(tableCell22);

            TableRow tableRow9 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties8 = new TableRowProperties();
            TableRowHeight tableRowHeight5 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties8.Append(tableRowHeight5);

            TableCell tableCell23 = new TableCell();

            TableCellProperties tableCellProperties23 = new TableCellProperties();
            TableCellWidth tableCellWidth23 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan14 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders22 = new TableCellBorders();
            BottomBorder bottomBorder24 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders22.Append(bottomBorder24);
            Shading shading3 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment4 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties23.Append(tableCellWidth23);
            tableCellProperties23.Append(gridSpan14);
            tableCellProperties23.Append(tableCellBorders22);
            tableCellProperties23.Append(shading3);
            tableCellProperties23.Append(tableCellVerticalAlignment4);

            Paragraph paragraph36 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties36 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties36 = new ParagraphMarkRunProperties();
            FontSize fontSize49 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript48 = new FontSizeComplexScript() { Val = "24" };
            Languages languages55 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties36.Append(fontSize49);
            paragraphMarkRunProperties36.Append(fontSizeComplexScript48);
            paragraphMarkRunProperties36.Append(languages55);

            paragraphProperties36.Append(paragraphMarkRunProperties36);

            paragraph36.Append(paragraphProperties36);

            tableCell23.Append(tableCellProperties23);
            tableCell23.Append(paragraph36);

            tableRow9.Append(tableRowProperties8);
            tableRow9.Append(tableCell23);

            TableRow tableRow10 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties9 = new TableRowProperties();
            TableRowHeight tableRowHeight6 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties9.Append(tableRowHeight6);

            TableCell tableCell24 = new TableCell();

            TableCellProperties tableCellProperties24 = new TableCellProperties();
            TableCellWidth tableCellWidth24 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan15 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders23 = new TableCellBorders();
            TopBorder topBorder23 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder25 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders23.Append(topBorder23);
            tableCellBorders23.Append(bottomBorder25);
            Shading shading4 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment5 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties24.Append(tableCellWidth24);
            tableCellProperties24.Append(gridSpan15);
            tableCellProperties24.Append(tableCellBorders23);
            tableCellProperties24.Append(shading4);
            tableCellProperties24.Append(tableCellVerticalAlignment5);

            Paragraph paragraph37 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties37 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties37 = new ParagraphMarkRunProperties();
            FontSize fontSize50 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript49 = new FontSizeComplexScript() { Val = "24" };
            Languages languages56 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties37.Append(fontSize50);
            paragraphMarkRunProperties37.Append(fontSizeComplexScript49);
            paragraphMarkRunProperties37.Append(languages56);

            paragraphProperties37.Append(paragraphMarkRunProperties37);

            paragraph37.Append(paragraphProperties37);

            tableCell24.Append(tableCellProperties24);
            tableCell24.Append(paragraph37);

            tableRow10.Append(tableRowProperties9);
            tableRow10.Append(tableCell24);

            TableRow tableRow11 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties10 = new TableRowProperties();
            GridAfter gridAfter1 = new GridAfter() { Val = 1 };
            WidthAfterTableRow widthAfterTableRow1 = new WidthAfterTableRow() { Width = "10", Type = TableWidthUnitValues.Pct };
            TableRowHeight tableRowHeight7 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties10.Append(gridAfter1);
            tableRowProperties10.Append(widthAfterTableRow1);
            tableRowProperties10.Append(tableRowHeight7);

            TableCell tableCell25 = new TableCell();

            TableCellProperties tableCellProperties25 = new TableCellProperties();
            TableCellWidth tableCellWidth25 = new TableCellWidth() { Width = "3812", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan16 = new GridSpan() { Val = 4 };
            Shading shading5 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment6 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties25.Append(tableCellWidth25);
            tableCellProperties25.Append(gridSpan16);
            tableCellProperties25.Append(shading5);
            tableCellProperties25.Append(tableCellVerticalAlignment6);

            Paragraph paragraph38 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "00F16160", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties38 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties38 = new ParagraphMarkRunProperties();
            FontSize fontSize51 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript50 = new FontSizeComplexScript() { Val = "24" };
            Languages languages57 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties38.Append(fontSize51);
            paragraphMarkRunProperties38.Append(fontSizeComplexScript50);
            paragraphMarkRunProperties38.Append(languages57);

            paragraphProperties38.Append(paragraphMarkRunProperties38);

            Run run35 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties35 = new RunProperties();
            FontSize fontSize52 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript51 = new FontSizeComplexScript() { Val = "24" };
            Languages languages58 = new Languages() { Val = "ru-RU" };

            runProperties35.Append(fontSize52);
            runProperties35.Append(fontSizeComplexScript51);
            runProperties35.Append(languages58);
            Text text35 = new Text();
            text35.Text = "Утверждена приказом руководителя учреждения высшего образования   от";

            run35.Append(runProperties35);
            run35.Append(text35);

            paragraph38.Append(paragraphProperties38);
            paragraph38.Append(run35);

            tableCell25.Append(tableCellProperties25);
            tableCell25.Append(paragraph38);

            TableCell tableCell26 = new TableCell();

            TableCellProperties tableCellProperties26 = new TableCellProperties();
            TableCellWidth tableCellWidth26 = new TableCellWidth() { Width = "494", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders24 = new TableCellBorders();
            BottomBorder bottomBorder26 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders24.Append(bottomBorder26);
            Shading shading6 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment7 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties26.Append(tableCellWidth26);
            tableCellProperties26.Append(tableCellBorders24);
            tableCellProperties26.Append(shading6);
            tableCellProperties26.Append(tableCellVerticalAlignment7);

            Paragraph paragraph39 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "00044FF8", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties39 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties39 = new ParagraphMarkRunProperties();
            FontSize fontSize53 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript52 = new FontSizeComplexScript() { Val = "24" };
            Languages languages59 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties39.Append(fontSize53);
            paragraphMarkRunProperties39.Append(fontSizeComplexScript52);
            paragraphMarkRunProperties39.Append(languages59);

            paragraphProperties39.Append(paragraphMarkRunProperties39);


            Run run351 = new Run();

            RunProperties runProperties351 = new RunProperties();
            FontSize fontSize531 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript521 = new FontSizeComplexScript() { Val = "24" };

            var date = awork is null ? work.DecreeDate : awork.DiplomProject.DecreeDate;
            runProperties351.Append(fontSize531);
            runProperties351.Append(fontSizeComplexScript521);
            Text text351 = new Text();
            text351.Text = date != null ? date.Value.ToString("dd.MM.yyyy") : "";

            run351.Append(runProperties351);
            run351.Append(text351);

            paragraph39.Append(paragraphProperties39);
            paragraph39.Append(run351);

            tableCell26.Append(tableCellProperties26);
            tableCell26.Append(paragraph39);

            TableCell tableCell27 = new TableCell();

            TableCellProperties tableCellProperties27 = new TableCellProperties();
            TableCellWidth tableCellWidth27 = new TableCellWidth() { Width = "222", Type = TableWidthUnitValues.Pct };
            Shading shading7 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment8 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties27.Append(tableCellWidth27);
            tableCellProperties27.Append(shading7);
            tableCellProperties27.Append(tableCellVerticalAlignment8);

            Paragraph paragraph40 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties40 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties40 = new ParagraphMarkRunProperties();
            FontSize fontSize54 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript53 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties40.Append(fontSize54);
            paragraphMarkRunProperties40.Append(fontSizeComplexScript53);

            paragraphProperties40.Append(paragraphMarkRunProperties40);

            Run run36 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties36 = new RunProperties();
            FontSize fontSize55 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript54 = new FontSizeComplexScript() { Val = "24" };

            runProperties36.Append(fontSize55);
            runProperties36.Append(fontSizeComplexScript54);
            Text text36 = new Text();
            text36.Text = "№";

            run36.Append(runProperties36);
            run36.Append(text36);

            paragraph40.Append(paragraphProperties40);
            paragraph40.Append(run36);

            tableCell27.Append(tableCellProperties27);
            tableCell27.Append(paragraph40);

            TableCell tableCell28 = new TableCell();

            TableCellProperties tableCellProperties28 = new TableCellProperties();
            TableCellWidth tableCellWidth28 = new TableCellWidth() { Width = "461", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan17 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders25 = new TableCellBorders();
            BottomBorder bottomBorder27 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders25.Append(bottomBorder27);
            Shading shading8 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment9 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties28.Append(tableCellWidth28);
            tableCellProperties28.Append(gridSpan17);
            tableCellProperties28.Append(tableCellBorders25);
            tableCellProperties28.Append(shading8);
            tableCellProperties28.Append(tableCellVerticalAlignment9);
            Paragraph paragraph41 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "00044FF8", RsidRunAdditionDefault = "003A20E4" };

            Paragraph paragraph421 = new Paragraph() { RsidParagraphMarkRevision = "00EB2411", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "00044FF8", RsidRunAdditionDefault = "00EB2411" };

            ParagraphProperties paragraphProperties421 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties421 = new ParagraphMarkRunProperties();
            FontSize fontSize561 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript551 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties421.Append(fontSize561);
            paragraphMarkRunProperties421.Append(fontSizeComplexScript551);

            paragraphProperties421.Append(paragraphMarkRunProperties421);

            Run run371 = new Run() { RsidRunProperties = "00EB2411" };

            RunProperties runProperties371 = new RunProperties();
            FontSize fontSize571 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript561 = new FontSizeComplexScript() { Val = "24" };

            string number = awork is null ? work.DecreeNumber : awork.DiplomProject.DecreeNumber;
            runProperties371.Append(fontSize571);
            runProperties371.Append(fontSizeComplexScript561);
            Text text371 = new Text();
            text371.Text = number != null ? number : "";

            run371.Append(runProperties371);
            run371.Append(text371);

            paragraph421.Append(paragraphProperties421);
            paragraph421.Append(run371);


            tableCell28.Append(tableCellProperties28);
            tableCell28.Append(paragraph421);

            tableRow11.Append(tableRowProperties10);
            tableRow11.Append(tableCell25);
            tableRow11.Append(tableCell26);
            tableRow11.Append(tableCell27);
            tableRow11.Append(tableCell28);

            TableRow tableRow12 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties11 = new TableRowProperties();
            TableRowHeight tableRowHeight8 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties11.Append(tableRowHeight8);

            TableCell tableCell29 = new TableCell();

            TableCellProperties tableCellProperties29 = new TableCellProperties();
            TableCellWidth tableCellWidth29 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan18 = new GridSpan() { Val = 9 };
            Shading shading9 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment10 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties29.Append(tableCellWidth29);
            tableCellProperties29.Append(gridSpan18);
            tableCellProperties29.Append(shading9);
            tableCellProperties29.Append(tableCellVerticalAlignment10);

            Paragraph paragraph42 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties41 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties41 = new ParagraphMarkRunProperties();
            FontSize fontSize56 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript55 = new FontSizeComplexScript() { Val = "24" };
            Languages languages60 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties41.Append(fontSize56);
            paragraphMarkRunProperties41.Append(fontSizeComplexScript55);
            paragraphMarkRunProperties41.Append(languages60);

            paragraphProperties41.Append(paragraphMarkRunProperties41);

            Run run37 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties37 = new RunProperties();
            FontSize fontSize57 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript56 = new FontSizeComplexScript() { Val = "24" };
            Languages languages61 = new Languages() { Val = "ru-RU" };

            runProperties37.Append(fontSize57);
            runProperties37.Append(fontSizeComplexScript56);
            runProperties37.Append(languages61);
            Text text37 = new Text();
            text37.Text = "2. Исходные данные к дипломному проекту:";

            run37.Append(runProperties37);
            run37.Append(text37);

            paragraph42.Append(paragraphProperties41);
            paragraph42.Append(run37);

            tableCell29.Append(tableCellProperties29);
            tableCell29.Append(paragraph42);

            tableRow12.Append(tableRowProperties11);
            tableRow12.Append(tableCell29);

            TableRow tableRow13 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties12 = new TableRowProperties();
            TableRowHeight tableRowHeight9 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties12.Append(tableRowHeight9);

            TableCell tableCell30 = new TableCell();

            TableCellProperties tableCellProperties30 = new TableCellProperties();
            TableCellWidth tableCellWidth30 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan19 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders26 = new TableCellBorders();
            BottomBorder bottomBorder28 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders26.Append(bottomBorder28);
            Shading shading10 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment11 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties30.Append(tableCellWidth30);
            tableCellProperties30.Append(gridSpan19);
            tableCellProperties30.Append(tableCellBorders26);
            tableCellProperties30.Append(shading10);
            tableCellProperties30.Append(tableCellVerticalAlignment11);

            Paragraph paragraph43 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties42 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties42 = new ParagraphMarkRunProperties();
            FontSize fontSize58 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript57 = new FontSizeComplexScript() { Val = "24" };
            Languages languages62 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties42.Append(fontSize58);
            paragraphMarkRunProperties42.Append(fontSizeComplexScript57);
            paragraphMarkRunProperties42.Append(languages62);

            paragraphProperties42.Append(paragraphMarkRunProperties42);

            // Split
            var inputData = awork is null ? work.InputData?.Split('\n') : awork.DiplomProject.InputData?.Split('\n');
            int i = 0;

            Run run38 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties38 = new RunProperties();
            FontSize fontSize59 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript58 = new FontSizeComplexScript() { Val = "24" };
            Languages languages63 = new Languages() { Val = "ru-RU" };

            runProperties38.Append(fontSize59);
            runProperties38.Append(fontSizeComplexScript58);
            runProperties38.Append(languages63);
            Text text38 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text38.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run38.Append(runProperties38);
            run38.Append(text38);
            ProofError proofError19 = new ProofError() { Type = ProofingErrorValues.SpellStart };
            ProofError proofError20 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph43.Append(paragraphProperties42);
            paragraph43.Append(run38);
            paragraph43.Append(proofError19);
            paragraph43.Append(proofError20);

            tableCell30.Append(tableCellProperties30);
            tableCell30.Append(paragraph43);

            tableRow13.Append(tableRowProperties12);
            tableRow13.Append(tableCell30);

            TableRow tableRow14 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties13 = new TableRowProperties();
            TableRowHeight tableRowHeight10 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties13.Append(tableRowHeight10);

            TableCell tableCell31 = new TableCell();

            TableCellProperties tableCellProperties31 = new TableCellProperties();
            TableCellWidth tableCellWidth31 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan20 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders27 = new TableCellBorders();
            TopBorder topBorder24 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder29 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders27.Append(topBorder24);
            tableCellBorders27.Append(bottomBorder29);
            Shading shading11 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment12 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties31.Append(tableCellWidth31);
            tableCellProperties31.Append(gridSpan20);
            tableCellProperties31.Append(tableCellBorders27);
            tableCellProperties31.Append(shading11);
            tableCellProperties31.Append(tableCellVerticalAlignment12);

            Paragraph paragraph44 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties43 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties43 = new ParagraphMarkRunProperties();
            FontSize fontSize62 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript61 = new FontSizeComplexScript() { Val = "24" };
            Languages languages66 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties43.Append(fontSize62);
            paragraphMarkRunProperties43.Append(fontSizeComplexScript61);
            paragraphMarkRunProperties43.Append(languages66);

            paragraphProperties43.Append(paragraphMarkRunProperties43);

            Run run41 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties41 = new RunProperties();
            FontSize fontSize63 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript62 = new FontSizeComplexScript() { Val = "24" };
            Languages languages67 = new Languages() { Val = "ru-RU" };

            runProperties41.Append(fontSize63);
            runProperties41.Append(fontSizeComplexScript62);
            runProperties41.Append(languages67);
            Text text41 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text41.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run41.Append(runProperties41);
            run41.Append(text41);
            ProofError proofError21 = new ProofError() { Type = ProofingErrorValues.SpellStart };
            ProofError proofError22 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph44.Append(paragraphProperties43);
            paragraph44.Append(run41);
            paragraph44.Append(proofError21);
            paragraph44.Append(proofError22);

            tableCell31.Append(tableCellProperties31);
            tableCell31.Append(paragraph44);

            tableRow14.Append(tableRowProperties13);
            tableRow14.Append(tableCell31);

            TableRow tableRow15 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties14 = new TableRowProperties();
            TableRowHeight tableRowHeight11 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties14.Append(tableRowHeight11);

            TableCell tableCell32 = new TableCell();

            TableCellProperties tableCellProperties32 = new TableCellProperties();
            TableCellWidth tableCellWidth32 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan21 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders28 = new TableCellBorders();
            TopBorder topBorder25 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder30 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders28.Append(topBorder25);
            tableCellBorders28.Append(bottomBorder30);
            Shading shading12 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment13 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties32.Append(tableCellWidth32);
            tableCellProperties32.Append(gridSpan21);
            tableCellProperties32.Append(tableCellBorders28);
            tableCellProperties32.Append(shading12);
            tableCellProperties32.Append(tableCellVerticalAlignment13);

            Paragraph paragraph45 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties44 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties44 = new ParagraphMarkRunProperties();
            FontSize fontSize66 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript65 = new FontSizeComplexScript() { Val = "24" };
            Languages languages70 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties44.Append(fontSize66);
            paragraphMarkRunProperties44.Append(fontSizeComplexScript65);
            paragraphMarkRunProperties44.Append(languages70);

            paragraphProperties44.Append(paragraphMarkRunProperties44);

            Run run44 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties44 = new RunProperties();
            FontSize fontSize67 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript66 = new FontSizeComplexScript() { Val = "24" };
            Languages languages71 = new Languages() { Val = "ru-RU" };

            runProperties44.Append(fontSize67);
            runProperties44.Append(fontSizeComplexScript66);
            runProperties44.Append(languages71);
            Text text44 = new Text();
            text44.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run44.Append(runProperties44);
            run44.Append(text44);

            paragraph45.Append(paragraphProperties44);
            paragraph45.Append(run44);

            tableCell32.Append(tableCellProperties32);
            tableCell32.Append(paragraph45);

            tableRow15.Append(tableRowProperties14);
            tableRow15.Append(tableCell32);

            TableRow tableRow16 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties15 = new TableRowProperties();
            TableRowHeight tableRowHeight12 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties15.Append(tableRowHeight12);

            TableCell tableCell33 = new TableCell();

            TableCellProperties tableCellProperties33 = new TableCellProperties();
            TableCellWidth tableCellWidth33 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan22 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders29 = new TableCellBorders();
            TopBorder topBorder26 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder31 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders29.Append(topBorder26);
            tableCellBorders29.Append(bottomBorder31);
            Shading shading13 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment14 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties33.Append(tableCellWidth33);
            tableCellProperties33.Append(gridSpan22);
            tableCellProperties33.Append(tableCellBorders29);
            tableCellProperties33.Append(shading13);
            tableCellProperties33.Append(tableCellVerticalAlignment14);

            Paragraph paragraph46 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties45 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties45 = new ParagraphMarkRunProperties();
            FontSize fontSize68 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript67 = new FontSizeComplexScript() { Val = "24" };
            Languages languages72 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties45.Append(fontSize68);
            paragraphMarkRunProperties45.Append(fontSizeComplexScript67);
            paragraphMarkRunProperties45.Append(languages72);

            paragraphProperties45.Append(paragraphMarkRunProperties45);

            Run run45 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties45 = new RunProperties();
            FontSize fontSize69 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript68 = new FontSizeComplexScript() { Val = "24" };
            Languages languages73 = new Languages() { Val = "ru-RU" };

            runProperties45.Append(fontSize69);
            runProperties45.Append(fontSizeComplexScript68);
            runProperties45.Append(languages73);
            Text text45 = new Text();
            text45.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run45.Append(runProperties45);
            run45.Append(text45);

            paragraph46.Append(paragraphProperties45);
            paragraph46.Append(run45);

            tableCell33.Append(tableCellProperties33);
            tableCell33.Append(paragraph46);

            tableRow16.Append(tableRowProperties15);
            tableRow16.Append(tableCell33);

            TableRow tableRow17 = new TableRow() { RsidTableRowMarkRevision = "005F4C57", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions1 = new TablePropertyExceptions();

            TableBorders tableBorders3 = new TableBorders();
            TopBorder topBorder27 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder23 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder32 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder23 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder3 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder3 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders3.Append(topBorder27);
            tableBorders3.Append(leftBorder23);
            tableBorders3.Append(bottomBorder32);
            tableBorders3.Append(rightBorder23);
            tableBorders3.Append(insideHorizontalBorder3);
            tableBorders3.Append(insideVerticalBorder3);

            tablePropertyExceptions1.Append(tableBorders3);

            TableRowProperties tableRowProperties16 = new TableRowProperties();
            TableRowHeight tableRowHeight13 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties16.Append(tableRowHeight13);

            TableCell tableCell34 = new TableCell();

            TableCellProperties tableCellProperties34 = new TableCellProperties();
            TableCellWidth tableCellWidth34 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan23 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders30 = new TableCellBorders();
            TopBorder topBorder28 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder24 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder33 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder24 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders30.Append(topBorder28);
            tableCellBorders30.Append(leftBorder24);
            tableCellBorders30.Append(bottomBorder33);
            tableCellBorders30.Append(rightBorder24);
            Shading shading14 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment15 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties34.Append(tableCellWidth34);
            tableCellProperties34.Append(gridSpan23);
            tableCellProperties34.Append(tableCellBorders30);
            tableCellProperties34.Append(shading14);
            tableCellProperties34.Append(tableCellVerticalAlignment15);

            Paragraph paragraph47 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties46 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties46 = new ParagraphMarkRunProperties();
            FontSize fontSize70 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript69 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties46.Append(fontSize70);
            paragraphMarkRunProperties46.Append(fontSizeComplexScript69);

            paragraphProperties46.Append(paragraphMarkRunProperties46);
            ProofError proofError23 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run46 = new Run();

            RunProperties runProperties46 = new RunProperties();
            FontSize fontSize71 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript70 = new FontSizeComplexScript() { Val = "24" };

            runProperties46.Append(fontSize71);
            runProperties46.Append(fontSizeComplexScript70);
            Text text46 = new Text();
            text46.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run46.Append(runProperties46);
            run46.Append(text46);
            ProofError proofError24 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph47.Append(paragraphProperties46);
            paragraph47.Append(proofError23);
            paragraph47.Append(run46);
            paragraph47.Append(proofError24);

            tableCell34.Append(tableCellProperties34);
            tableCell34.Append(paragraph47);

            tableRow17.Append(tablePropertyExceptions1);
            tableRow17.Append(tableRowProperties16);
            tableRow17.Append(tableCell34);

            TableRow tableRow18 = new TableRow() { RsidTableRowMarkRevision = "005F4C57", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions2 = new TablePropertyExceptions();

            TableBorders tableBorders4 = new TableBorders();
            TopBorder topBorder29 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder25 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder34 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder25 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder4 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder4 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders4.Append(topBorder29);
            tableBorders4.Append(leftBorder25);
            tableBorders4.Append(bottomBorder34);
            tableBorders4.Append(rightBorder25);
            tableBorders4.Append(insideHorizontalBorder4);
            tableBorders4.Append(insideVerticalBorder4);

            tablePropertyExceptions2.Append(tableBorders4);

            TableRowProperties tableRowProperties17 = new TableRowProperties();
            TableRowHeight tableRowHeight14 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties17.Append(tableRowHeight14);

            TableCell tableCell35 = new TableCell();

            TableCellProperties tableCellProperties35 = new TableCellProperties();
            TableCellWidth tableCellWidth35 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan24 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders31 = new TableCellBorders();
            TopBorder topBorder30 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder26 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder35 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder26 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders31.Append(topBorder30);
            tableCellBorders31.Append(leftBorder26);
            tableCellBorders31.Append(bottomBorder35);
            tableCellBorders31.Append(rightBorder26);
            Shading shading15 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment16 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties35.Append(tableCellWidth35);
            tableCellProperties35.Append(gridSpan24);
            tableCellProperties35.Append(tableCellBorders31);
            tableCellProperties35.Append(shading15);
            tableCellProperties35.Append(tableCellVerticalAlignment16);

            Paragraph paragraph48 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "00C4661E", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties47 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties47 = new ParagraphMarkRunProperties();
            FontSize fontSize72 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript71 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties47.Append(fontSize72);
            paragraphMarkRunProperties47.Append(fontSizeComplexScript71);

            paragraphProperties47.Append(paragraphMarkRunProperties47);
            ProofError proofError25 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run47 = new Run();

            RunProperties runProperties47 = new RunProperties();
            FontSize fontSize73 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript72 = new FontSizeComplexScript() { Val = "24" };

            runProperties47.Append(fontSize73);
            runProperties47.Append(fontSizeComplexScript72);
            Text text47 = new Text();
            text47.Text = inputData != null && inputData.Length > i ? inputData[i++] : "";

            run47.Append(runProperties47);
            run47.Append(text47);
            ProofError proofError26 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph48.Append(paragraphProperties47);
            paragraph48.Append(proofError25);
            paragraph48.Append(run47);
            paragraph48.Append(proofError26);

            tableCell35.Append(tableCellProperties35);
            tableCell35.Append(paragraph48);

            tableRow18.Append(tablePropertyExceptions2);
            tableRow18.Append(tableRowProperties17);
            tableRow18.Append(tableCell35);

            TableRow tableRow19 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties18 = new TableRowProperties();
            TableRowHeight tableRowHeight15 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties18.Append(tableRowHeight15);

            TableCell tableCell36 = new TableCell();

            TableCellProperties tableCellProperties36 = new TableCellProperties();
            TableCellWidth tableCellWidth36 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan25 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders32 = new TableCellBorders();
            TopBorder topBorder31 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders32.Append(topBorder31);
            Shading shading16 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment17 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties36.Append(tableCellWidth36);
            tableCellProperties36.Append(gridSpan25);
            tableCellProperties36.Append(tableCellBorders32);
            tableCellProperties36.Append(shading16);
            tableCellProperties36.Append(tableCellVerticalAlignment17);

            Paragraph paragraph49 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties48 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties48 = new ParagraphMarkRunProperties();
            FontSize fontSize74 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript73 = new FontSizeComplexScript() { Val = "24" };
            Languages languages74 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties48.Append(fontSize74);
            paragraphMarkRunProperties48.Append(fontSizeComplexScript73);
            paragraphMarkRunProperties48.Append(languages74);

            paragraphProperties48.Append(paragraphMarkRunProperties48);

            Run run48 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties48 = new RunProperties();
            FontSize fontSize75 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript74 = new FontSizeComplexScript() { Val = "24" };
            Languages languages75 = new Languages() { Val = "ru-RU" };

            runProperties48.Append(fontSize75);
            runProperties48.Append(fontSizeComplexScript74);
            runProperties48.Append(languages75);
            Text text48 = new Text();
            text48.Text = "3. Перечень подлежащих разработке вопросов или краткое содержание расчетно-пояснительной записки:";

            run48.Append(runProperties48);
            run48.Append(text48);

            paragraph49.Append(paragraphProperties48);
            paragraph49.Append(run48);

            tableCell36.Append(tableCellProperties36);
            tableCell36.Append(paragraph49);

            tableRow19.Append(tableRowProperties18);
            tableRow19.Append(tableCell36);

            TableRow tableRow20 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties19 = new TableRowProperties();
            TableRowHeight tableRowHeight16 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties19.Append(tableRowHeight16);

            TableCell tableCell37 = new TableCell();

            TableCellProperties tableCellProperties37 = new TableCellProperties();
            TableCellWidth tableCellWidth37 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan26 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders33 = new TableCellBorders();
            BottomBorder bottomBorder36 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders33.Append(bottomBorder36);
            Shading shading17 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment18 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties37.Append(tableCellWidth37);
            tableCellProperties37.Append(gridSpan26);
            tableCellProperties37.Append(tableCellBorders33);
            tableCellProperties37.Append(shading17);
            tableCellProperties37.Append(tableCellVerticalAlignment18);

            Table table4 = new Table();

            TableProperties tableProperties4 = new TableProperties();
            TableWidth tableWidth4 = new TableWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            TableLook tableLook4 = new TableLook() { Val = "01E0" };

            tableProperties4.Append(tableWidth4);
            tableProperties4.Append(tableLook4);

            TableGrid tableGrid4 = new TableGrid();
            GridColumn gridColumn24 = new GridColumn() { Width = "10778" };

            tableGrid4.Append(gridColumn24);

            TableRow tableRow21 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties20 = new TableRowProperties();
            TableRowHeight tableRowHeight17 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties20.Append(tableRowHeight17);

            TableCell tableCell38 = new TableCell();

            TableCellProperties tableCellProperties38 = new TableCellProperties();
            TableCellWidth tableCellWidth38 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders34 = new TableCellBorders();
            TopBorder topBorder32 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder27 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder37 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder27 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders34.Append(topBorder32);
            tableCellBorders34.Append(leftBorder27);
            tableCellBorders34.Append(bottomBorder37);
            tableCellBorders34.Append(rightBorder27);
            TableCellVerticalAlignment tableCellVerticalAlignment19 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark1 = new HideMark();

            tableCellProperties38.Append(tableCellWidth38);
            tableCellProperties38.Append(tableCellBorders34);
            tableCellProperties38.Append(tableCellVerticalAlignment19);
            tableCellProperties38.Append(hideMark1);

            Paragraph paragraph50 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties49 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties49 = new ParagraphMarkRunProperties();
            FontSize fontSize76 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript75 = new FontSizeComplexScript() { Val = "24" };
            Languages languages76 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties49.Append(fontSize76);
            paragraphMarkRunProperties49.Append(fontSizeComplexScript75);
            paragraphMarkRunProperties49.Append(languages76);

            paragraphProperties49.Append(paragraphMarkRunProperties49);

            // Split
            var rzpContent = awork is null ? work.RpzContent?.Split('\n') : awork.DiplomProject.RpzContent?.Split('\n');
            i = 0;

            Run run49 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties49 = new RunProperties();
            FontSize fontSize77 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript76 = new FontSizeComplexScript() { Val = "24" };
            Languages languages77 = new Languages() { Val = "ru-RU" };

            runProperties49.Append(fontSize77);
            runProperties49.Append(fontSizeComplexScript76);
            runProperties49.Append(languages77);
            Text text49 = new Text();
            text49.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run49.Append(runProperties49);
            run49.Append(text49);

            paragraph50.Append(paragraphProperties49);
            paragraph50.Append(run49);

            tableCell38.Append(tableCellProperties38);
            tableCell38.Append(paragraph50);

            tableRow21.Append(tableRowProperties20);
            tableRow21.Append(tableCell38);

            TableRow tableRow22 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties21 = new TableRowProperties();
            TableRowHeight tableRowHeight18 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties21.Append(tableRowHeight18);

            TableCell tableCell39 = new TableCell();

            TableCellProperties tableCellProperties39 = new TableCellProperties();
            TableCellWidth tableCellWidth39 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders35 = new TableCellBorders();
            TopBorder topBorder33 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder28 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder38 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder28 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders35.Append(topBorder33);
            tableCellBorders35.Append(leftBorder28);
            tableCellBorders35.Append(bottomBorder38);
            tableCellBorders35.Append(rightBorder28);
            TableCellVerticalAlignment tableCellVerticalAlignment20 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark2 = new HideMark();

            tableCellProperties39.Append(tableCellWidth39);
            tableCellProperties39.Append(tableCellBorders35);
            tableCellProperties39.Append(tableCellVerticalAlignment20);
            tableCellProperties39.Append(hideMark2);

            Paragraph paragraph51 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties50 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties50 = new ParagraphMarkRunProperties();
            FontSize fontSize78 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript77 = new FontSizeComplexScript() { Val = "24" };
            Languages languages78 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties50.Append(fontSize78);
            paragraphMarkRunProperties50.Append(fontSizeComplexScript77);
            paragraphMarkRunProperties50.Append(languages78);

            paragraphProperties50.Append(paragraphMarkRunProperties50);

            Run run50 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties50 = new RunProperties();
            FontSize fontSize79 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript78 = new FontSizeComplexScript() { Val = "24" };
            Languages languages79 = new Languages() { Val = "ru-RU" };

            runProperties50.Append(fontSize79);
            runProperties50.Append(fontSizeComplexScript78);
            runProperties50.Append(languages79);
            Text text50 = new Text();
            text50.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run50.Append(runProperties50);
            run50.Append(text50);

            paragraph51.Append(paragraphProperties50);
            paragraph51.Append(run50);

            tableCell39.Append(tableCellProperties39);
            tableCell39.Append(paragraph51);

            tableRow22.Append(tableRowProperties21);
            tableRow22.Append(tableCell39);

            TableRow tableRow23 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties22 = new TableRowProperties();
            TableRowHeight tableRowHeight19 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties22.Append(tableRowHeight19);

            TableCell tableCell40 = new TableCell();

            TableCellProperties tableCellProperties40 = new TableCellProperties();
            TableCellWidth tableCellWidth40 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders36 = new TableCellBorders();
            TopBorder topBorder34 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder29 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder39 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder29 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders36.Append(topBorder34);
            tableCellBorders36.Append(leftBorder29);
            tableCellBorders36.Append(bottomBorder39);
            tableCellBorders36.Append(rightBorder29);
            TableCellVerticalAlignment tableCellVerticalAlignment21 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark3 = new HideMark();

            tableCellProperties40.Append(tableCellWidth40);
            tableCellProperties40.Append(tableCellBorders36);
            tableCellProperties40.Append(tableCellVerticalAlignment21);
            tableCellProperties40.Append(hideMark3);

            Paragraph paragraph52 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties51 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties51 = new ParagraphMarkRunProperties();
            FontSize fontSize80 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript79 = new FontSizeComplexScript() { Val = "24" };
            Languages languages80 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties51.Append(fontSize80);
            paragraphMarkRunProperties51.Append(fontSizeComplexScript79);
            paragraphMarkRunProperties51.Append(languages80);

            paragraphProperties51.Append(paragraphMarkRunProperties51);

            Run run51 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties51 = new RunProperties();
            FontSize fontSize81 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript80 = new FontSizeComplexScript() { Val = "24" };
            Languages languages81 = new Languages() { Val = "ru-RU" };

            runProperties51.Append(fontSize81);
            runProperties51.Append(fontSizeComplexScript80);
            runProperties51.Append(languages81);
            Text text51 = new Text();
            text51.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run51.Append(runProperties51);
            run51.Append(text51);

            paragraph52.Append(paragraphProperties51);
            paragraph52.Append(run51);

            tableCell40.Append(tableCellProperties40);
            tableCell40.Append(paragraph52);

            tableRow23.Append(tableRowProperties22);
            tableRow23.Append(tableCell40);

            TableRow tableRow24 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties23 = new TableRowProperties();
            TableRowHeight tableRowHeight20 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties23.Append(tableRowHeight20);

            TableCell tableCell41 = new TableCell();

            TableCellProperties tableCellProperties41 = new TableCellProperties();
            TableCellWidth tableCellWidth41 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders37 = new TableCellBorders();
            TopBorder topBorder35 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder30 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder40 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder30 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders37.Append(topBorder35);
            tableCellBorders37.Append(leftBorder30);
            tableCellBorders37.Append(bottomBorder40);
            tableCellBorders37.Append(rightBorder30);
            TableCellVerticalAlignment tableCellVerticalAlignment22 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark4 = new HideMark();

            tableCellProperties41.Append(tableCellWidth41);
            tableCellProperties41.Append(tableCellBorders37);
            tableCellProperties41.Append(tableCellVerticalAlignment22);
            tableCellProperties41.Append(hideMark4);

            Paragraph paragraph53 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties52 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties52 = new ParagraphMarkRunProperties();
            FontSize fontSize82 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript81 = new FontSizeComplexScript() { Val = "24" };
            Languages languages82 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties52.Append(fontSize82);
            paragraphMarkRunProperties52.Append(fontSizeComplexScript81);
            paragraphMarkRunProperties52.Append(languages82);

            paragraphProperties52.Append(paragraphMarkRunProperties52);

            Run run52 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties52 = new RunProperties();
            FontSize fontSize83 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript82 = new FontSizeComplexScript() { Val = "24" };
            Languages languages83 = new Languages() { Val = "ru-RU" };

            runProperties52.Append(fontSize83);
            runProperties52.Append(fontSizeComplexScript82);
            runProperties52.Append(languages83);
            Text text52 = new Text();
            text52.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run52.Append(runProperties52);
            run52.Append(text52);

            paragraph53.Append(paragraphProperties52);
            paragraph53.Append(run52);

            tableCell41.Append(tableCellProperties41);
            tableCell41.Append(paragraph53);

            tableRow24.Append(tableRowProperties23);
            tableRow24.Append(tableCell41);

            TableRow tableRow25 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties24 = new TableRowProperties();
            TableRowHeight tableRowHeight21 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties24.Append(tableRowHeight21);

            TableCell tableCell42 = new TableCell();

            TableCellProperties tableCellProperties42 = new TableCellProperties();
            TableCellWidth tableCellWidth42 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders38 = new TableCellBorders();
            TopBorder topBorder36 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder31 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder41 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder31 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders38.Append(topBorder36);
            tableCellBorders38.Append(leftBorder31);
            tableCellBorders38.Append(bottomBorder41);
            tableCellBorders38.Append(rightBorder31);
            TableCellVerticalAlignment tableCellVerticalAlignment23 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark5 = new HideMark();

            tableCellProperties42.Append(tableCellWidth42);
            tableCellProperties42.Append(tableCellBorders38);
            tableCellProperties42.Append(tableCellVerticalAlignment23);
            tableCellProperties42.Append(hideMark5);

            Paragraph paragraph54 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties53 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties53 = new ParagraphMarkRunProperties();
            FontSize fontSize84 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript83 = new FontSizeComplexScript() { Val = "24" };
            Languages languages84 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties53.Append(fontSize84);
            paragraphMarkRunProperties53.Append(fontSizeComplexScript83);
            paragraphMarkRunProperties53.Append(languages84);

            paragraphProperties53.Append(paragraphMarkRunProperties53);

            Run run53 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties53 = new RunProperties();
            FontSize fontSize85 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript84 = new FontSizeComplexScript() { Val = "24" };
            Languages languages85 = new Languages() { Val = "ru-RU" };

            runProperties53.Append(fontSize85);
            runProperties53.Append(fontSizeComplexScript84);
            runProperties53.Append(languages85);
            Text text53 = new Text();
            text53.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run53.Append(runProperties53);
            run53.Append(text53);

            paragraph54.Append(paragraphProperties53);
            paragraph54.Append(run53);

            tableCell42.Append(tableCellProperties42);
            tableCell42.Append(paragraph54);

            tableRow25.Append(tableRowProperties24);
            tableRow25.Append(tableCell42);

            TableRow tableRow26 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties25 = new TableRowProperties();
            TableRowHeight tableRowHeight22 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties25.Append(tableRowHeight22);

            TableCell tableCell43 = new TableCell();

            TableCellProperties tableCellProperties43 = new TableCellProperties();
            TableCellWidth tableCellWidth43 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders39 = new TableCellBorders();
            TopBorder topBorder37 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder32 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder42 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder32 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders39.Append(topBorder37);
            tableCellBorders39.Append(leftBorder32);
            tableCellBorders39.Append(bottomBorder42);
            tableCellBorders39.Append(rightBorder32);
            TableCellVerticalAlignment tableCellVerticalAlignment24 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark6 = new HideMark();

            tableCellProperties43.Append(tableCellWidth43);
            tableCellProperties43.Append(tableCellBorders39);
            tableCellProperties43.Append(tableCellVerticalAlignment24);
            tableCellProperties43.Append(hideMark6);

            Paragraph paragraph55 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties54 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties54 = new ParagraphMarkRunProperties();
            FontSize fontSize86 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript85 = new FontSizeComplexScript() { Val = "24" };
            Languages languages86 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties54.Append(fontSize86);
            paragraphMarkRunProperties54.Append(fontSizeComplexScript85);
            paragraphMarkRunProperties54.Append(languages86);

            paragraphProperties54.Append(paragraphMarkRunProperties54);

            Run run54 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties54 = new RunProperties();
            FontSize fontSize87 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript86 = new FontSizeComplexScript() { Val = "24" };
            Languages languages87 = new Languages() { Val = "ru-RU" };

            runProperties54.Append(fontSize87);
            runProperties54.Append(fontSizeComplexScript86);
            runProperties54.Append(languages87);
            Text text54 = new Text();
            text54.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run54.Append(runProperties54);
            run54.Append(text54);

            paragraph55.Append(paragraphProperties54);
            paragraph55.Append(run54);

            tableCell43.Append(tableCellProperties43);
            tableCell43.Append(paragraph55);

            tableRow26.Append(tableRowProperties25);
            tableRow26.Append(tableCell43);

            TableRow tableRow27 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties26 = new TableRowProperties();
            TableRowHeight tableRowHeight23 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties26.Append(tableRowHeight23);

            TableCell tableCell44 = new TableCell();

            TableCellProperties tableCellProperties44 = new TableCellProperties();
            TableCellWidth tableCellWidth44 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders40 = new TableCellBorders();
            TopBorder topBorder38 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder33 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder43 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder33 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders40.Append(topBorder38);
            tableCellBorders40.Append(leftBorder33);
            tableCellBorders40.Append(bottomBorder43);
            tableCellBorders40.Append(rightBorder33);
            TableCellVerticalAlignment tableCellVerticalAlignment25 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark7 = new HideMark();

            tableCellProperties44.Append(tableCellWidth44);
            tableCellProperties44.Append(tableCellBorders40);
            tableCellProperties44.Append(tableCellVerticalAlignment25);
            tableCellProperties44.Append(hideMark7);

            Paragraph paragraph56 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties55 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties55 = new ParagraphMarkRunProperties();
            FontSize fontSize88 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript87 = new FontSizeComplexScript() { Val = "24" };
            Languages languages88 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties55.Append(fontSize88);
            paragraphMarkRunProperties55.Append(fontSizeComplexScript87);
            paragraphMarkRunProperties55.Append(languages88);

            paragraphProperties55.Append(paragraphMarkRunProperties55);

            Run run55 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties55 = new RunProperties();
            FontSize fontSize89 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript88 = new FontSizeComplexScript() { Val = "24" };
            Languages languages89 = new Languages() { Val = "ru-RU" };

            runProperties55.Append(fontSize89);
            runProperties55.Append(fontSizeComplexScript88);
            runProperties55.Append(languages89);
            Text text55 = new Text();
            text55.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run55.Append(runProperties55);
            run55.Append(text55);

            paragraph56.Append(paragraphProperties55);
            paragraph56.Append(run55);

            tableCell44.Append(tableCellProperties44);
            tableCell44.Append(paragraph56);

            tableRow27.Append(tableRowProperties26);
            tableRow27.Append(tableCell44);

            TableRow tableRow28 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties27 = new TableRowProperties();
            TableRowHeight tableRowHeight24 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties27.Append(tableRowHeight24);

            TableCell tableCell45 = new TableCell();

            TableCellProperties tableCellProperties45 = new TableCellProperties();
            TableCellWidth tableCellWidth45 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders41 = new TableCellBorders();
            TopBorder topBorder39 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder34 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder44 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder34 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders41.Append(topBorder39);
            tableCellBorders41.Append(leftBorder34);
            tableCellBorders41.Append(bottomBorder44);
            tableCellBorders41.Append(rightBorder34);
            TableCellVerticalAlignment tableCellVerticalAlignment26 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark8 = new HideMark();

            tableCellProperties45.Append(tableCellWidth45);
            tableCellProperties45.Append(tableCellBorders41);
            tableCellProperties45.Append(tableCellVerticalAlignment26);
            tableCellProperties45.Append(hideMark8);

            Paragraph paragraph57 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties56 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties56 = new ParagraphMarkRunProperties();
            FontSize fontSize90 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript89 = new FontSizeComplexScript() { Val = "24" };
            Languages languages90 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties56.Append(fontSize90);
            paragraphMarkRunProperties56.Append(fontSizeComplexScript89);
            paragraphMarkRunProperties56.Append(languages90);

            paragraphProperties56.Append(paragraphMarkRunProperties56);

            Run run56 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties56 = new RunProperties();
            FontSize fontSize91 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript90 = new FontSizeComplexScript() { Val = "24" };
            Languages languages91 = new Languages() { Val = "ru-RU" };

            runProperties56.Append(fontSize91);
            runProperties56.Append(fontSizeComplexScript90);
            runProperties56.Append(languages91);
            Text text56 = new Text();
            text56.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run56.Append(runProperties56);
            run56.Append(text56);

            paragraph57.Append(paragraphProperties56);
            paragraph57.Append(run56);

            tableCell45.Append(tableCellProperties45);
            tableCell45.Append(paragraph57);

            tableRow28.Append(tableRowProperties27);
            tableRow28.Append(tableCell45);

            TableRow tableRow29 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties28 = new TableRowProperties();
            TableRowHeight tableRowHeight25 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties28.Append(tableRowHeight25);

            TableCell tableCell46 = new TableCell();

            TableCellProperties tableCellProperties46 = new TableCellProperties();
            TableCellWidth tableCellWidth46 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders42 = new TableCellBorders();
            TopBorder topBorder40 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder35 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder45 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder35 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders42.Append(topBorder40);
            tableCellBorders42.Append(leftBorder35);
            tableCellBorders42.Append(bottomBorder45);
            tableCellBorders42.Append(rightBorder35);
            TableCellVerticalAlignment tableCellVerticalAlignment27 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark9 = new HideMark();

            tableCellProperties46.Append(tableCellWidth46);
            tableCellProperties46.Append(tableCellBorders42);
            tableCellProperties46.Append(tableCellVerticalAlignment27);
            tableCellProperties46.Append(hideMark9);

            Paragraph paragraph58 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties57 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties57 = new ParagraphMarkRunProperties();
            FontSize fontSize92 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript91 = new FontSizeComplexScript() { Val = "24" };
            Languages languages92 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties57.Append(fontSize92);
            paragraphMarkRunProperties57.Append(fontSizeComplexScript91);
            paragraphMarkRunProperties57.Append(languages92);

            paragraphProperties57.Append(paragraphMarkRunProperties57);

            Run run57 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties57 = new RunProperties();
            FontSize fontSize93 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript92 = new FontSizeComplexScript() { Val = "24" };
            Languages languages93 = new Languages() { Val = "ru-RU" };

            runProperties57.Append(fontSize93);
            runProperties57.Append(fontSizeComplexScript92);
            runProperties57.Append(languages93);
            Text text57 = new Text();
            text57.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run57.Append(runProperties57);
            run57.Append(text57);

            paragraph58.Append(paragraphProperties57);
            paragraph58.Append(run57);

            tableCell46.Append(tableCellProperties46);
            tableCell46.Append(paragraph58);

            tableRow29.Append(tableRowProperties28);
            tableRow29.Append(tableCell46);

            TableRow tableRow30 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties29 = new TableRowProperties();
            TableRowHeight tableRowHeight26 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties29.Append(tableRowHeight26);

            TableCell tableCell47 = new TableCell();

            TableCellProperties tableCellProperties47 = new TableCellProperties();
            TableCellWidth tableCellWidth47 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders43 = new TableCellBorders();
            TopBorder topBorder41 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder36 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder46 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder36 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders43.Append(topBorder41);
            tableCellBorders43.Append(leftBorder36);
            tableCellBorders43.Append(bottomBorder46);
            tableCellBorders43.Append(rightBorder36);
            TableCellVerticalAlignment tableCellVerticalAlignment28 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark10 = new HideMark();

            tableCellProperties47.Append(tableCellWidth47);
            tableCellProperties47.Append(tableCellBorders43);
            tableCellProperties47.Append(tableCellVerticalAlignment28);
            tableCellProperties47.Append(hideMark10);

            Paragraph paragraph59 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties58 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties58 = new ParagraphMarkRunProperties();
            FontSize fontSize94 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript93 = new FontSizeComplexScript() { Val = "24" };
            Languages languages94 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties58.Append(fontSize94);
            paragraphMarkRunProperties58.Append(fontSizeComplexScript93);
            paragraphMarkRunProperties58.Append(languages94);

            paragraphProperties58.Append(paragraphMarkRunProperties58);

            Run run58 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties58 = new RunProperties();
            FontSize fontSize95 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript94 = new FontSizeComplexScript() { Val = "24" };
            Languages languages95 = new Languages() { Val = "ru-RU" };

            runProperties58.Append(fontSize95);
            runProperties58.Append(fontSizeComplexScript94);
            runProperties58.Append(languages95);
            Text text58 = new Text();
            text58.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run58.Append(runProperties58);
            run58.Append(text58);

            paragraph59.Append(paragraphProperties58);
            paragraph59.Append(run58);

            tableCell47.Append(tableCellProperties47);
            tableCell47.Append(paragraph59);

            tableRow30.Append(tableRowProperties29);
            tableRow30.Append(tableCell47);

            TableRow tableRow31 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties30 = new TableRowProperties();
            TableRowHeight tableRowHeight27 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties30.Append(tableRowHeight27);

            TableCell tableCell48 = new TableCell();

            TableCellProperties tableCellProperties48 = new TableCellProperties();
            TableCellWidth tableCellWidth48 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders44 = new TableCellBorders();
            TopBorder topBorder42 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder37 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder47 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder37 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders44.Append(topBorder42);
            tableCellBorders44.Append(leftBorder37);
            tableCellBorders44.Append(bottomBorder47);
            tableCellBorders44.Append(rightBorder37);
            TableCellVerticalAlignment tableCellVerticalAlignment29 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark11 = new HideMark();

            tableCellProperties48.Append(tableCellWidth48);
            tableCellProperties48.Append(tableCellBorders44);
            tableCellProperties48.Append(tableCellVerticalAlignment29);
            tableCellProperties48.Append(hideMark11);

            Paragraph paragraph60 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties59 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties59 = new ParagraphMarkRunProperties();
            FontSize fontSize96 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript95 = new FontSizeComplexScript() { Val = "24" };
            Languages languages96 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties59.Append(fontSize96);
            paragraphMarkRunProperties59.Append(fontSizeComplexScript95);
            paragraphMarkRunProperties59.Append(languages96);

            paragraphProperties59.Append(paragraphMarkRunProperties59);

            Run run59 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties59 = new RunProperties();
            FontSize fontSize97 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript96 = new FontSizeComplexScript() { Val = "24" };
            Languages languages97 = new Languages() { Val = "ru-RU" };

            runProperties59.Append(fontSize97);
            runProperties59.Append(fontSizeComplexScript96);
            runProperties59.Append(languages97);
            Text text59 = new Text();
            text59.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run59.Append(runProperties59);
            run59.Append(text59);

            paragraph60.Append(paragraphProperties59);
            paragraph60.Append(run59);

            tableCell48.Append(tableCellProperties48);
            tableCell48.Append(paragraph60);

            tableRow31.Append(tableRowProperties30);
            tableRow31.Append(tableCell48);

            TableRow tableRow32 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties31 = new TableRowProperties();
            TableRowHeight tableRowHeight28 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties31.Append(tableRowHeight28);

            TableCell tableCell49 = new TableCell();

            TableCellProperties tableCellProperties49 = new TableCellProperties();
            TableCellWidth tableCellWidth49 = new TableCellWidth() { Width = "4803", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders45 = new TableCellBorders();
            TopBorder topBorder43 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder38 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder48 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder38 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders45.Append(topBorder43);
            tableCellBorders45.Append(leftBorder38);
            tableCellBorders45.Append(bottomBorder48);
            tableCellBorders45.Append(rightBorder38);
            TableCellVerticalAlignment tableCellVerticalAlignment30 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark12 = new HideMark();

            tableCellProperties49.Append(tableCellWidth49);
            tableCellProperties49.Append(tableCellBorders45);
            tableCellProperties49.Append(tableCellVerticalAlignment30);
            tableCellProperties49.Append(hideMark12);

            Paragraph paragraph61 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties60 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties60 = new ParagraphMarkRunProperties();
            FontSize fontSize98 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript97 = new FontSizeComplexScript() { Val = "24" };
            Languages languages98 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties60.Append(fontSize98);
            paragraphMarkRunProperties60.Append(fontSizeComplexScript97);
            paragraphMarkRunProperties60.Append(languages98);

            paragraphProperties60.Append(paragraphMarkRunProperties60);

            Run run60 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties60 = new RunProperties();
            FontSize fontSize99 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript98 = new FontSizeComplexScript() { Val = "24" };
            Languages languages99 = new Languages() { Val = "ru-RU" };

            runProperties60.Append(fontSize99);
            runProperties60.Append(fontSizeComplexScript98);
            runProperties60.Append(languages99);
            Text text60 = new Text();
            text60.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run60.Append(runProperties60);
            run60.Append(text60);
            BookmarkStart bookmarkStart1 = new BookmarkStart() { Name = "_GoBack", Id = "0" };
            BookmarkEnd bookmarkEnd1 = new BookmarkEnd() { Id = "0" };

            paragraph61.Append(paragraphProperties60);
            paragraph61.Append(run60);
            paragraph61.Append(bookmarkStart1);
            paragraph61.Append(bookmarkEnd1);

            tableCell49.Append(tableCellProperties49);
            tableCell49.Append(paragraph61);

            tableRow32.Append(tableRowProperties31);
            tableRow32.Append(tableCell49);

            table4.Append(tableProperties4);
            table4.Append(tableGrid4);
            table4.Append(tableRow21);
            table4.Append(tableRow22);
            table4.Append(tableRow23);
            table4.Append(tableRow24);
            table4.Append(tableRow25);
            table4.Append(tableRow26);
            table4.Append(tableRow27);
            table4.Append(tableRow28);
            table4.Append(tableRow29);
            table4.Append(tableRow30);
            table4.Append(tableRow31);
            table4.Append(tableRow32);

            Paragraph paragraph62 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties61 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties61 = new ParagraphMarkRunProperties();
            FontSize fontSize100 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript99 = new FontSizeComplexScript() { Val = "24" };
            Languages languages100 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties61.Append(fontSize100);
            paragraphMarkRunProperties61.Append(fontSizeComplexScript99);
            paragraphMarkRunProperties61.Append(languages100);

            paragraphProperties61.Append(paragraphMarkRunProperties61);

            paragraph62.Append(paragraphProperties61);

            tableCell37.Append(tableCellProperties37);
            tableCell37.Append(table4);
            tableCell37.Append(paragraph62);

            tableRow20.Append(tableRowProperties19);
            tableRow20.Append(tableCell37);

            TableRow tableRow33 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties32 = new TableRowProperties();
            TableRowHeight tableRowHeight29 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties32.Append(tableRowHeight29);

            TableCell tableCell50 = new TableCell();

            TableCellProperties tableCellProperties50 = new TableCellProperties();
            TableCellWidth tableCellWidth50 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan27 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders46 = new TableCellBorders();
            BottomBorder bottomBorder49 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders46.Append(bottomBorder49);
            Shading shading18 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment31 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties50.Append(tableCellWidth50);
            tableCellProperties50.Append(gridSpan27);
            tableCellProperties50.Append(tableCellBorders46);
            tableCellProperties50.Append(shading18);
            tableCellProperties50.Append(tableCellVerticalAlignment31);

            Paragraph paragraph63 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties62 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties62 = new ParagraphMarkRunProperties();
            FontSize fontSize101 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript100 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties62.Append(fontSize101);
            paragraphMarkRunProperties62.Append(fontSizeComplexScript100);

            paragraphProperties62.Append(paragraphMarkRunProperties62);

            Run run61 = new Run();

            RunProperties runProperties61 = new RunProperties();
            FontSize fontSize102 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript101 = new FontSizeComplexScript() { Val = "24" };

            runProperties61.Append(fontSize102);
            runProperties61.Append(fontSizeComplexScript101);
            Text text61 = new Text();
            text61.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run61.Append(runProperties61);
            run61.Append(text61);

            paragraph63.Append(paragraphProperties62);
            paragraph63.Append(run61);

            tableCell50.Append(tableCellProperties50);
            tableCell50.Append(paragraph63);

            tableRow33.Append(tableRowProperties32);
            tableRow33.Append(tableCell50);

            TableRow tableRow34 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties33 = new TableRowProperties();
            TableRowHeight tableRowHeight30 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties33.Append(tableRowHeight30);

            TableCell tableCell51 = new TableCell();

            TableCellProperties tableCellProperties51 = new TableCellProperties();
            TableCellWidth tableCellWidth51 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan28 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders47 = new TableCellBorders();
            TopBorder topBorder44 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder50 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders47.Append(topBorder44);
            tableCellBorders47.Append(bottomBorder50);
            Shading shading19 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment32 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties51.Append(tableCellWidth51);
            tableCellProperties51.Append(gridSpan28);
            tableCellProperties51.Append(tableCellBorders47);
            tableCellProperties51.Append(shading19);
            tableCellProperties51.Append(tableCellVerticalAlignment32);

            Paragraph paragraph64 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties63 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties63 = new ParagraphMarkRunProperties();
            FontSize fontSize103 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript102 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties63.Append(fontSize103);
            paragraphMarkRunProperties63.Append(fontSizeComplexScript102);

            paragraphProperties63.Append(paragraphMarkRunProperties63);
            ProofError proofError27 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run62 = new Run();

            RunProperties runProperties62 = new RunProperties();
            FontSize fontSize104 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript103 = new FontSizeComplexScript() { Val = "24" };

            runProperties62.Append(fontSize104);
            runProperties62.Append(fontSizeComplexScript103);
            Text text62 = new Text();
            text62.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run62.Append(runProperties62);
            run62.Append(text62);
            ProofError proofError28 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph64.Append(paragraphProperties63);
            paragraph64.Append(proofError27);
            paragraph64.Append(run62);
            paragraph64.Append(proofError28);

            tableCell51.Append(tableCellProperties51);
            tableCell51.Append(paragraph64);

            tableRow34.Append(tableRowProperties33);
            tableRow34.Append(tableCell51);

            TableRow tableRow35 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions3 = new TablePropertyExceptions();

            TableBorders tableBorders5 = new TableBorders();
            TopBorder topBorder45 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder39 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder51 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder39 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder5 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder5 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders5.Append(topBorder45);
            tableBorders5.Append(leftBorder39);
            tableBorders5.Append(bottomBorder51);
            tableBorders5.Append(rightBorder39);
            tableBorders5.Append(insideHorizontalBorder5);
            tableBorders5.Append(insideVerticalBorder5);

            tablePropertyExceptions3.Append(tableBorders5);

            TableRowProperties tableRowProperties34 = new TableRowProperties();
            TableRowHeight tableRowHeight31 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties34.Append(tableRowHeight31);

            TableCell tableCell52 = new TableCell();

            TableCellProperties tableCellProperties52 = new TableCellProperties();
            TableCellWidth tableCellWidth52 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan29 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders48 = new TableCellBorders();
            TopBorder topBorder46 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder40 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder52 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder40 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders48.Append(topBorder46);
            tableCellBorders48.Append(leftBorder40);
            tableCellBorders48.Append(bottomBorder52);
            tableCellBorders48.Append(rightBorder40);
            Shading shading20 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment33 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties52.Append(tableCellWidth52);
            tableCellProperties52.Append(gridSpan29);
            tableCellProperties52.Append(tableCellBorders48);
            tableCellProperties52.Append(shading20);
            tableCellProperties52.Append(tableCellVerticalAlignment33);

            Paragraph paragraph65 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties64 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties64 = new ParagraphMarkRunProperties();
            FontSize fontSize105 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript104 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties64.Append(fontSize105);
            paragraphMarkRunProperties64.Append(fontSizeComplexScript104);

            paragraphProperties64.Append(paragraphMarkRunProperties64);
            ProofError proofError29 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run63 = new Run();

            RunProperties runProperties63 = new RunProperties();
            FontSize fontSize106 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript105 = new FontSizeComplexScript() { Val = "24" };

            runProperties63.Append(fontSize106);
            runProperties63.Append(fontSizeComplexScript105);
            Text text63 = new Text();
            text63.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run63.Append(runProperties63);
            run63.Append(text63);
            ProofError proofError30 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph65.Append(paragraphProperties64);
            paragraph65.Append(proofError29);
            paragraph65.Append(run63);
            paragraph65.Append(proofError30);

            tableCell52.Append(tableCellProperties52);
            tableCell52.Append(paragraph65);

            tableRow35.Append(tablePropertyExceptions3);
            tableRow35.Append(tableRowProperties34);
            tableRow35.Append(tableCell52);

            TableRow tableRow36 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions4 = new TablePropertyExceptions();

            TableBorders tableBorders6 = new TableBorders();
            TopBorder topBorder47 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder41 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder53 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder41 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder6 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder6 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders6.Append(topBorder47);
            tableBorders6.Append(leftBorder41);
            tableBorders6.Append(bottomBorder53);
            tableBorders6.Append(rightBorder41);
            tableBorders6.Append(insideHorizontalBorder6);
            tableBorders6.Append(insideVerticalBorder6);

            tablePropertyExceptions4.Append(tableBorders6);

            TableRowProperties tableRowProperties35 = new TableRowProperties();
            TableRowHeight tableRowHeight32 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties35.Append(tableRowHeight32);

            TableCell tableCell53 = new TableCell();

            TableCellProperties tableCellProperties53 = new TableCellProperties();
            TableCellWidth tableCellWidth53 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan30 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders49 = new TableCellBorders();
            TopBorder topBorder48 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder42 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder54 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder42 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders49.Append(topBorder48);
            tableCellBorders49.Append(leftBorder42);
            tableCellBorders49.Append(bottomBorder54);
            tableCellBorders49.Append(rightBorder42);
            Shading shading21 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment34 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties53.Append(tableCellWidth53);
            tableCellProperties53.Append(gridSpan30);
            tableCellProperties53.Append(tableCellBorders49);
            tableCellProperties53.Append(shading21);
            tableCellProperties53.Append(tableCellVerticalAlignment34);

            Paragraph paragraph66 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties65 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties65 = new ParagraphMarkRunProperties();
            FontSize fontSize107 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript106 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties65.Append(fontSize107);
            paragraphMarkRunProperties65.Append(fontSizeComplexScript106);

            paragraphProperties65.Append(paragraphMarkRunProperties65);
            ProofError proofError31 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run64 = new Run();

            RunProperties runProperties64 = new RunProperties();
            FontSize fontSize108 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript107 = new FontSizeComplexScript() { Val = "24" };

            runProperties64.Append(fontSize108);
            runProperties64.Append(fontSizeComplexScript107);
            LastRenderedPageBreak lastRenderedPageBreak1 = new LastRenderedPageBreak();
            Text text64 = new Text();
            text64.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run64.Append(runProperties64);
            run64.Append(lastRenderedPageBreak1);
            run64.Append(text64);
            ProofError proofError32 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph66.Append(paragraphProperties65);
            paragraph66.Append(proofError31);
            paragraph66.Append(run64);
            paragraph66.Append(proofError32);

            tableCell53.Append(tableCellProperties53);
            tableCell53.Append(paragraph66);

            tableRow36.Append(tablePropertyExceptions4);
            tableRow36.Append(tableRowProperties35);
            tableRow36.Append(tableCell53);

            TableRow tableRow37 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties36 = new TableRowProperties();
            TableRowHeight tableRowHeight33 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties36.Append(tableRowHeight33);

            TableCell tableCell54 = new TableCell();

            TableCellProperties tableCellProperties54 = new TableCellProperties();
            TableCellWidth tableCellWidth54 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan31 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders50 = new TableCellBorders();
            TopBorder topBorder49 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder55 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders50.Append(topBorder49);
            tableCellBorders50.Append(bottomBorder55);
            Shading shading22 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment35 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties54.Append(tableCellWidth54);
            tableCellProperties54.Append(gridSpan31);
            tableCellProperties54.Append(tableCellBorders50);
            tableCellProperties54.Append(shading22);
            tableCellProperties54.Append(tableCellVerticalAlignment35);

            Paragraph paragraph67 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties66 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties66 = new ParagraphMarkRunProperties();
            FontSize fontSize109 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript108 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties66.Append(fontSize109);
            paragraphMarkRunProperties66.Append(fontSizeComplexScript108);

            paragraphProperties66.Append(paragraphMarkRunProperties66);
            ProofError proofError33 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run65 = new Run();

            RunProperties runProperties65 = new RunProperties();
            FontSize fontSize110 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript109 = new FontSizeComplexScript() { Val = "24" };

            runProperties65.Append(fontSize110);
            runProperties65.Append(fontSizeComplexScript109);
            Text text65 = new Text();
            text65.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run65.Append(runProperties65);
            run65.Append(text65);
            ProofError proofError34 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph67.Append(paragraphProperties66);
            paragraph67.Append(proofError33);
            paragraph67.Append(run65);
            paragraph67.Append(proofError34);

            tableCell54.Append(tableCellProperties54);
            tableCell54.Append(paragraph67);

            tableRow37.Append(tableRowProperties36);
            tableRow37.Append(tableCell54);

            TableRow tableRow38 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions5 = new TablePropertyExceptions();

            TableBorders tableBorders7 = new TableBorders();
            TopBorder topBorder50 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder43 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder56 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder43 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder7 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder7 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders7.Append(topBorder50);
            tableBorders7.Append(leftBorder43);
            tableBorders7.Append(bottomBorder56);
            tableBorders7.Append(rightBorder43);
            tableBorders7.Append(insideHorizontalBorder7);
            tableBorders7.Append(insideVerticalBorder7);

            tablePropertyExceptions5.Append(tableBorders7);

            TableRowProperties tableRowProperties37 = new TableRowProperties();
            TableRowHeight tableRowHeight34 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties37.Append(tableRowHeight34);

            TableCell tableCell55 = new TableCell();

            TableCellProperties tableCellProperties55 = new TableCellProperties();
            TableCellWidth tableCellWidth55 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan32 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders51 = new TableCellBorders();
            TopBorder topBorder51 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder44 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder57 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder44 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders51.Append(topBorder51);
            tableCellBorders51.Append(leftBorder44);
            tableCellBorders51.Append(bottomBorder57);
            tableCellBorders51.Append(rightBorder44);
            Shading shading23 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment36 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties55.Append(tableCellWidth55);
            tableCellProperties55.Append(gridSpan32);
            tableCellProperties55.Append(tableCellBorders51);
            tableCellProperties55.Append(shading23);
            tableCellProperties55.Append(tableCellVerticalAlignment36);

            Paragraph paragraph68 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties67 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties67 = new ParagraphMarkRunProperties();
            FontSize fontSize111 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript110 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties67.Append(fontSize111);
            paragraphMarkRunProperties67.Append(fontSizeComplexScript110);

            paragraphProperties67.Append(paragraphMarkRunProperties67);
            ProofError proofError35 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run66 = new Run();

            RunProperties runProperties66 = new RunProperties();
            FontSize fontSize112 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript111 = new FontSizeComplexScript() { Val = "24" };

            runProperties66.Append(fontSize112);
            runProperties66.Append(fontSizeComplexScript111);
            Text text66 = new Text();
            text66.Text = rzpContent != null && rzpContent.Length > i ? rzpContent[i++] : "";

            run66.Append(runProperties66);
            run66.Append(text66);
            ProofError proofError36 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph68.Append(paragraphProperties67);
            paragraph68.Append(proofError35);
            paragraph68.Append(run66);
            paragraph68.Append(proofError36);

            tableCell55.Append(tableCellProperties55);
            tableCell55.Append(paragraph68);

            tableRow38.Append(tablePropertyExceptions5);
            tableRow38.Append(tableRowProperties37);
            tableRow38.Append(tableCell55);

            TableRow tableRow39 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties38 = new TableRowProperties();
            TableRowHeight tableRowHeight35 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties38.Append(tableRowHeight35);

            TableCell tableCell56 = new TableCell();

            TableCellProperties tableCellProperties56 = new TableCellProperties();
            TableCellWidth tableCellWidth56 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan33 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders52 = new TableCellBorders();
            TopBorder topBorder52 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders52.Append(topBorder52);
            Shading shading24 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment37 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties56.Append(tableCellWidth56);
            tableCellProperties56.Append(gridSpan33);
            tableCellProperties56.Append(tableCellBorders52);
            tableCellProperties56.Append(shading24);
            tableCellProperties56.Append(tableCellVerticalAlignment37);

            Paragraph paragraph69 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties68 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties68 = new ParagraphMarkRunProperties();
            FontSize fontSize113 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript112 = new FontSizeComplexScript() { Val = "24" };
            Languages languages101 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties68.Append(fontSize113);
            paragraphMarkRunProperties68.Append(fontSizeComplexScript112);
            paragraphMarkRunProperties68.Append(languages101);

            paragraphProperties68.Append(paragraphMarkRunProperties68);

            Run run67 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties67 = new RunProperties();
            FontSize fontSize114 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript113 = new FontSizeComplexScript() { Val = "24" };
            Languages languages102 = new Languages() { Val = "ru-RU" };

            runProperties67.Append(fontSize114);
            runProperties67.Append(fontSizeComplexScript113);
            runProperties67.Append(languages102);
            Text text67 = new Text();
            text67.Text = "4. Перечень графического материала (с точным указанием обязательных чертежей и графиков)";

            run67.Append(runProperties67);
            run67.Append(text67);

            paragraph69.Append(paragraphProperties68);
            paragraph69.Append(run67);

            tableCell56.Append(tableCellProperties56);
            tableCell56.Append(paragraph69);

            tableRow39.Append(tableRowProperties38);
            tableRow39.Append(tableCell56);

            TableRow tableRow40 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions6 = new TablePropertyExceptions();

            TableBorders tableBorders8 = new TableBorders();
            TopBorder topBorder53 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder45 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder58 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder45 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder8 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder8 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders8.Append(topBorder53);
            tableBorders8.Append(leftBorder45);
            tableBorders8.Append(bottomBorder58);
            tableBorders8.Append(rightBorder45);
            tableBorders8.Append(insideHorizontalBorder8);
            tableBorders8.Append(insideVerticalBorder8);

            tablePropertyExceptions6.Append(tableBorders8);

            TableRowProperties tableRowProperties39 = new TableRowProperties();
            TableRowHeight tableRowHeight36 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties39.Append(tableRowHeight36);

            TableCell tableCell57 = new TableCell();

            TableCellProperties tableCellProperties57 = new TableCellProperties();
            TableCellWidth tableCellWidth57 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan34 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders53 = new TableCellBorders();
            TopBorder topBorder54 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder46 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder59 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder46 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders53.Append(topBorder54);
            tableCellBorders53.Append(leftBorder46);
            tableCellBorders53.Append(bottomBorder59);
            tableCellBorders53.Append(rightBorder46);
            Shading shading25 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment38 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties57.Append(tableCellWidth57);
            tableCellProperties57.Append(gridSpan34);
            tableCellProperties57.Append(tableCellBorders53);
            tableCellProperties57.Append(shading25);
            tableCellProperties57.Append(tableCellVerticalAlignment38);

            Table table5 = new Table();

            TableProperties tableProperties5 = new TableProperties();
            TableWidth tableWidth5 = new TableWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableBorders tableBorders9 = new TableBorders();
            TopBorder topBorder55 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder47 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder60 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder47 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder9 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder9 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders9.Append(topBorder55);
            tableBorders9.Append(leftBorder47);
            tableBorders9.Append(bottomBorder60);
            tableBorders9.Append(rightBorder47);
            tableBorders9.Append(insideHorizontalBorder9);
            tableBorders9.Append(insideVerticalBorder9);
            TableLook tableLook5 = new TableLook() { Val = "01E0" };

            tableProperties5.Append(tableWidth5);
            tableProperties5.Append(tableBorders9);
            tableProperties5.Append(tableLook5);

            TableGrid tableGrid5 = new TableGrid();
            GridColumn gridColumn25 = new GridColumn() { Width = "10778" };

            tableGrid5.Append(gridColumn25);

            TableRow tableRow41 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties40 = new TableRowProperties();
            TableRowHeight tableRowHeight37 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties40.Append(tableRowHeight37);

            TableCell tableCell58 = new TableCell();

            TableCellProperties tableCellProperties58 = new TableCellProperties();
            TableCellWidth tableCellWidth58 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders54 = new TableCellBorders();
            TopBorder topBorder56 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder48 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder61 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder48 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders54.Append(topBorder56);
            tableCellBorders54.Append(leftBorder48);
            tableCellBorders54.Append(bottomBorder61);
            tableCellBorders54.Append(rightBorder48);
            TableCellVerticalAlignment tableCellVerticalAlignment39 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark13 = new HideMark();

            tableCellProperties58.Append(tableCellWidth58);
            tableCellProperties58.Append(tableCellBorders54);
            tableCellProperties58.Append(tableCellVerticalAlignment39);
            tableCellProperties58.Append(hideMark13);

            Paragraph paragraph70 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties69 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties69 = new ParagraphMarkRunProperties();
            FontSize fontSize115 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript114 = new FontSizeComplexScript() { Val = "24" };
            Languages languages103 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties69.Append(fontSize115);
            paragraphMarkRunProperties69.Append(fontSizeComplexScript114);
            paragraphMarkRunProperties69.Append(languages103);

            paragraphProperties69.Append(paragraphMarkRunProperties69);

            // Split
            var drawMaterials = awork is null ? work.DrawMaterials?.Split('\n') : awork.DiplomProject.DrawMaterials?.Split('\n');
            i = 0;

            Run run68 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties68 = new RunProperties();
            FontSize fontSize116 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript115 = new FontSizeComplexScript() { Val = "24" };
            Languages languages104 = new Languages() { Val = "ru-RU" };

            runProperties68.Append(fontSize116);
            runProperties68.Append(fontSizeComplexScript115);
            runProperties68.Append(languages104);
            Text text68 = new Text();
            text68.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run68.Append(runProperties68);
            run68.Append(text68);

            paragraph70.Append(paragraphProperties69);
            paragraph70.Append(run68);

            tableCell58.Append(tableCellProperties58);
            tableCell58.Append(paragraph70);

            tableRow41.Append(tableRowProperties40);
            tableRow41.Append(tableCell58);

            TableRow tableRow42 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties41 = new TableRowProperties();
            TableRowHeight tableRowHeight38 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties41.Append(tableRowHeight38);

            TableCell tableCell59 = new TableCell();

            TableCellProperties tableCellProperties59 = new TableCellProperties();
            TableCellWidth tableCellWidth59 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders55 = new TableCellBorders();
            TopBorder topBorder57 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder49 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder62 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder49 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders55.Append(topBorder57);
            tableCellBorders55.Append(leftBorder49);
            tableCellBorders55.Append(bottomBorder62);
            tableCellBorders55.Append(rightBorder49);
            TableCellVerticalAlignment tableCellVerticalAlignment40 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark14 = new HideMark();

            tableCellProperties59.Append(tableCellWidth59);
            tableCellProperties59.Append(tableCellBorders55);
            tableCellProperties59.Append(tableCellVerticalAlignment40);
            tableCellProperties59.Append(hideMark14);

            Paragraph paragraph71 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties70 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties70 = new ParagraphMarkRunProperties();
            FontSize fontSize117 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript116 = new FontSizeComplexScript() { Val = "24" };
            Languages languages105 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties70.Append(fontSize117);
            paragraphMarkRunProperties70.Append(fontSizeComplexScript116);
            paragraphMarkRunProperties70.Append(languages105);

            paragraphProperties70.Append(paragraphMarkRunProperties70);

            Run run69 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties69 = new RunProperties();
            FontSize fontSize118 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript117 = new FontSizeComplexScript() { Val = "24" };
            Languages languages106 = new Languages() { Val = "ru-RU" };

            runProperties69.Append(fontSize118);
            runProperties69.Append(fontSizeComplexScript117);
            runProperties69.Append(languages106);
            Text text69 = new Text();
            text69.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run69.Append(runProperties69);
            run69.Append(text69);

            paragraph71.Append(paragraphProperties70);
            paragraph71.Append(run69);

            tableCell59.Append(tableCellProperties59);
            tableCell59.Append(paragraph71);

            tableRow42.Append(tableRowProperties41);
            tableRow42.Append(tableCell59);

            TableRow tableRow43 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties42 = new TableRowProperties();
            TableRowHeight tableRowHeight39 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties42.Append(tableRowHeight39);

            TableCell tableCell60 = new TableCell();

            TableCellProperties tableCellProperties60 = new TableCellProperties();
            TableCellWidth tableCellWidth60 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders56 = new TableCellBorders();
            TopBorder topBorder58 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder50 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder63 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder50 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders56.Append(topBorder58);
            tableCellBorders56.Append(leftBorder50);
            tableCellBorders56.Append(bottomBorder63);
            tableCellBorders56.Append(rightBorder50);
            TableCellVerticalAlignment tableCellVerticalAlignment41 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark15 = new HideMark();

            tableCellProperties60.Append(tableCellWidth60);
            tableCellProperties60.Append(tableCellBorders56);
            tableCellProperties60.Append(tableCellVerticalAlignment41);
            tableCellProperties60.Append(hideMark15);

            Paragraph paragraph72 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties71 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties71 = new ParagraphMarkRunProperties();
            FontSize fontSize119 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript118 = new FontSizeComplexScript() { Val = "24" };
            Languages languages107 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties71.Append(fontSize119);
            paragraphMarkRunProperties71.Append(fontSizeComplexScript118);
            paragraphMarkRunProperties71.Append(languages107);

            paragraphProperties71.Append(paragraphMarkRunProperties71);

            Run run70 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties70 = new RunProperties();
            FontSize fontSize120 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript119 = new FontSizeComplexScript() { Val = "24" };
            Languages languages108 = new Languages() { Val = "ru-RU" };

            runProperties70.Append(fontSize120);
            runProperties70.Append(fontSizeComplexScript119);
            runProperties70.Append(languages108);
            Text text70 = new Text();
            text70.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run70.Append(runProperties70);
            run70.Append(text70);

            paragraph72.Append(paragraphProperties71);
            paragraph72.Append(run70);

            tableCell60.Append(tableCellProperties60);
            tableCell60.Append(paragraph72);

            tableRow43.Append(tableRowProperties42);
            tableRow43.Append(tableCell60);

            TableRow tableRow44 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties43 = new TableRowProperties();
            TableRowHeight tableRowHeight40 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties43.Append(tableRowHeight40);

            TableCell tableCell61 = new TableCell();

            TableCellProperties tableCellProperties61 = new TableCellProperties();
            TableCellWidth tableCellWidth61 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders57 = new TableCellBorders();
            TopBorder topBorder59 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder51 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder64 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder51 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders57.Append(topBorder59);
            tableCellBorders57.Append(leftBorder51);
            tableCellBorders57.Append(bottomBorder64);
            tableCellBorders57.Append(rightBorder51);
            TableCellVerticalAlignment tableCellVerticalAlignment42 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark16 = new HideMark();

            tableCellProperties61.Append(tableCellWidth61);
            tableCellProperties61.Append(tableCellBorders57);
            tableCellProperties61.Append(tableCellVerticalAlignment42);
            tableCellProperties61.Append(hideMark16);

            Paragraph paragraph73 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties72 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties72 = new ParagraphMarkRunProperties();
            FontSize fontSize121 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript120 = new FontSizeComplexScript() { Val = "24" };
            Languages languages109 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties72.Append(fontSize121);
            paragraphMarkRunProperties72.Append(fontSizeComplexScript120);
            paragraphMarkRunProperties72.Append(languages109);

            paragraphProperties72.Append(paragraphMarkRunProperties72);

            Run run71 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties71 = new RunProperties();
            FontSize fontSize122 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript121 = new FontSizeComplexScript() { Val = "24" };
            Languages languages110 = new Languages() { Val = "ru-RU" };

            runProperties71.Append(fontSize122);
            runProperties71.Append(fontSizeComplexScript121);
            runProperties71.Append(languages110);
            Text text71 = new Text();
            text71.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run71.Append(runProperties71);
            run71.Append(text71);

            paragraph73.Append(paragraphProperties72);
            paragraph73.Append(run71);

            tableCell61.Append(tableCellProperties61);
            tableCell61.Append(paragraph73);

            tableRow44.Append(tableRowProperties43);
            tableRow44.Append(tableCell61);

            TableRow tableRow45 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "006E4804" };

            TableRowProperties tableRowProperties44 = new TableRowProperties();
            TableRowHeight tableRowHeight41 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties44.Append(tableRowHeight41);

            TableCell tableCell62 = new TableCell();

            TableCellProperties tableCellProperties62 = new TableCellProperties();
            TableCellWidth tableCellWidth62 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };

            TableCellBorders tableCellBorders58 = new TableCellBorders();
            TopBorder topBorder60 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder52 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder65 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder52 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders58.Append(topBorder60);
            tableCellBorders58.Append(leftBorder52);
            tableCellBorders58.Append(bottomBorder65);
            tableCellBorders58.Append(rightBorder52);
            TableCellVerticalAlignment tableCellVerticalAlignment43 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };
            HideMark hideMark17 = new HideMark();

            tableCellProperties62.Append(tableCellWidth62);
            tableCellProperties62.Append(tableCellBorders58);
            tableCellProperties62.Append(tableCellVerticalAlignment43);
            tableCellProperties62.Append(hideMark17);

            Paragraph paragraph74 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "006E4804", RsidRunAdditionDefault = "006E4804" };

            ParagraphProperties paragraphProperties73 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties73 = new ParagraphMarkRunProperties();
            FontSize fontSize123 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript122 = new FontSizeComplexScript() { Val = "24" };
            Languages languages111 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties73.Append(fontSize123);
            paragraphMarkRunProperties73.Append(fontSizeComplexScript122);
            paragraphMarkRunProperties73.Append(languages111);

            paragraphProperties73.Append(paragraphMarkRunProperties73);

            Run run72 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties72 = new RunProperties();
            FontSize fontSize124 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript123 = new FontSizeComplexScript() { Val = "24" };
            Languages languages112 = new Languages() { Val = "ru-RU" };

            runProperties72.Append(fontSize124);
            runProperties72.Append(fontSizeComplexScript123);
            runProperties72.Append(languages112);
            Text text72 = new Text();
            text72.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run72.Append(runProperties72);
            run72.Append(text72);

            paragraph74.Append(paragraphProperties73);
            paragraph74.Append(run72);

            tableCell62.Append(tableCellProperties62);
            tableCell62.Append(paragraph74);

            tableRow45.Append(tableRowProperties44);
            tableRow45.Append(tableCell62);

            table5.Append(tableProperties5);
            table5.Append(tableGrid5);
            table5.Append(tableRow41);
            table5.Append(tableRow42);
            table5.Append(tableRow43);
            table5.Append(tableRow44);
            table5.Append(tableRow45);

            Paragraph paragraph75 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties74 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties74 = new ParagraphMarkRunProperties();
            FontSize fontSize125 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript124 = new FontSizeComplexScript() { Val = "24" };
            Languages languages113 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties74.Append(fontSize125);
            paragraphMarkRunProperties74.Append(fontSizeComplexScript124);
            paragraphMarkRunProperties74.Append(languages113);

            paragraphProperties74.Append(paragraphMarkRunProperties74);

            paragraph75.Append(paragraphProperties74);

            tableCell57.Append(tableCellProperties57);
            tableCell57.Append(table5);
            tableCell57.Append(paragraph75);

            tableRow40.Append(tablePropertyExceptions6);
            tableRow40.Append(tableRowProperties39);
            tableRow40.Append(tableCell57);

            TableRow tableRow46 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions7 = new TablePropertyExceptions();

            TableBorders tableBorders10 = new TableBorders();
            TopBorder topBorder61 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder53 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder66 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder53 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder10 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder10 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders10.Append(topBorder61);
            tableBorders10.Append(leftBorder53);
            tableBorders10.Append(bottomBorder66);
            tableBorders10.Append(rightBorder53);
            tableBorders10.Append(insideHorizontalBorder10);
            tableBorders10.Append(insideVerticalBorder10);

            tablePropertyExceptions7.Append(tableBorders10);

            TableRowProperties tableRowProperties45 = new TableRowProperties();
            TableRowHeight tableRowHeight42 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties45.Append(tableRowHeight42);

            TableCell tableCell63 = new TableCell();

            TableCellProperties tableCellProperties63 = new TableCellProperties();
            TableCellWidth tableCellWidth63 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan35 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders59 = new TableCellBorders();
            TopBorder topBorder62 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder54 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder67 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder54 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders59.Append(topBorder62);
            tableCellBorders59.Append(leftBorder54);
            tableCellBorders59.Append(bottomBorder67);
            tableCellBorders59.Append(rightBorder54);
            Shading shading26 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment44 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties63.Append(tableCellWidth63);
            tableCellProperties63.Append(gridSpan35);
            tableCellProperties63.Append(tableCellBorders59);
            tableCellProperties63.Append(shading26);
            tableCellProperties63.Append(tableCellVerticalAlignment44);

            Paragraph paragraph76 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties75 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties75 = new ParagraphMarkRunProperties();
            FontSize fontSize126 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript125 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties75.Append(fontSize126);
            paragraphMarkRunProperties75.Append(fontSizeComplexScript125);

            paragraphProperties75.Append(paragraphMarkRunProperties75);
            ProofError proofError37 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run73 = new Run();

            RunProperties runProperties73 = new RunProperties();
            FontSize fontSize127 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript126 = new FontSizeComplexScript() { Val = "24" };

            runProperties73.Append(fontSize127);
            runProperties73.Append(fontSizeComplexScript126);
            Text text73 = new Text();
            text73.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run73.Append(runProperties73);
            run73.Append(text73);
            ProofError proofError38 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph76.Append(paragraphProperties75);
            paragraph76.Append(proofError37);
            paragraph76.Append(run73);
            paragraph76.Append(proofError38);

            tableCell63.Append(tableCellProperties63);
            tableCell63.Append(paragraph76);

            tableRow46.Append(tablePropertyExceptions7);
            tableRow46.Append(tableRowProperties45);
            tableRow46.Append(tableCell63);

            TableRow tableRow47 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions8 = new TablePropertyExceptions();

            TableBorders tableBorders11 = new TableBorders();
            TopBorder topBorder63 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder55 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder68 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder55 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder11 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder11 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders11.Append(topBorder63);
            tableBorders11.Append(leftBorder55);
            tableBorders11.Append(bottomBorder68);
            tableBorders11.Append(rightBorder55);
            tableBorders11.Append(insideHorizontalBorder11);
            tableBorders11.Append(insideVerticalBorder11);

            tablePropertyExceptions8.Append(tableBorders11);

            TableRowProperties tableRowProperties46 = new TableRowProperties();
            TableRowHeight tableRowHeight43 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties46.Append(tableRowHeight43);

            TableCell tableCell64 = new TableCell();

            TableCellProperties tableCellProperties64 = new TableCellProperties();
            TableCellWidth tableCellWidth64 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan36 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders60 = new TableCellBorders();
            TopBorder topBorder64 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder56 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder69 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder56 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders60.Append(topBorder64);
            tableCellBorders60.Append(leftBorder56);
            tableCellBorders60.Append(bottomBorder69);
            tableCellBorders60.Append(rightBorder56);
            Shading shading27 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment45 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties64.Append(tableCellWidth64);
            tableCellProperties64.Append(gridSpan36);
            tableCellProperties64.Append(tableCellBorders60);
            tableCellProperties64.Append(shading27);
            tableCellProperties64.Append(tableCellVerticalAlignment45);

            Paragraph paragraph77 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties76 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties76 = new ParagraphMarkRunProperties();
            FontSize fontSize128 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript127 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties76.Append(fontSize128);
            paragraphMarkRunProperties76.Append(fontSizeComplexScript127);

            paragraphProperties76.Append(paragraphMarkRunProperties76);
            ProofError proofError39 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run74 = new Run();

            RunProperties runProperties74 = new RunProperties();
            FontSize fontSize129 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript128 = new FontSizeComplexScript() { Val = "24" };

            runProperties74.Append(fontSize129);
            runProperties74.Append(fontSizeComplexScript128);
            Text text74 = new Text();
            text74.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run74.Append(runProperties74);
            run74.Append(text74);
            ProofError proofError40 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph77.Append(paragraphProperties76);
            paragraph77.Append(proofError39);
            paragraph77.Append(run74);
            paragraph77.Append(proofError40);

            tableCell64.Append(tableCellProperties64);
            tableCell64.Append(paragraph77);

            tableRow47.Append(tablePropertyExceptions8);
            tableRow47.Append(tableRowProperties46);
            tableRow47.Append(tableCell64);

            TableRow tableRow48 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions9 = new TablePropertyExceptions();

            TableBorders tableBorders12 = new TableBorders();
            TopBorder topBorder65 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder57 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder70 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder57 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder12 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder12 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders12.Append(topBorder65);
            tableBorders12.Append(leftBorder57);
            tableBorders12.Append(bottomBorder70);
            tableBorders12.Append(rightBorder57);
            tableBorders12.Append(insideHorizontalBorder12);
            tableBorders12.Append(insideVerticalBorder12);

            tablePropertyExceptions9.Append(tableBorders12);

            TableRowProperties tableRowProperties47 = new TableRowProperties();
            TableRowHeight tableRowHeight44 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties47.Append(tableRowHeight44);

            TableCell tableCell65 = new TableCell();

            TableCellProperties tableCellProperties65 = new TableCellProperties();
            TableCellWidth tableCellWidth65 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan37 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders61 = new TableCellBorders();
            TopBorder topBorder66 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder58 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder71 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder58 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders61.Append(topBorder66);
            tableCellBorders61.Append(leftBorder58);
            tableCellBorders61.Append(bottomBorder71);
            tableCellBorders61.Append(rightBorder58);
            Shading shading28 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment46 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties65.Append(tableCellWidth65);
            tableCellProperties65.Append(gridSpan37);
            tableCellProperties65.Append(tableCellBorders61);
            tableCellProperties65.Append(shading28);
            tableCellProperties65.Append(tableCellVerticalAlignment46);

            Paragraph paragraph78 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties77 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties77 = new ParagraphMarkRunProperties();
            FontSize fontSize130 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript129 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties77.Append(fontSize130);
            paragraphMarkRunProperties77.Append(fontSizeComplexScript129);

            paragraphProperties77.Append(paragraphMarkRunProperties77);
            ProofError proofError41 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run75 = new Run();

            RunProperties runProperties75 = new RunProperties();
            FontSize fontSize131 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript130 = new FontSizeComplexScript() { Val = "24" };

            runProperties75.Append(fontSize131);
            runProperties75.Append(fontSizeComplexScript130);
            Text text75 = new Text();
            text75.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run75.Append(runProperties75);
            run75.Append(text75);
            ProofError proofError42 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph78.Append(paragraphProperties77);
            paragraph78.Append(proofError41);
            paragraph78.Append(run75);
            paragraph78.Append(proofError42);

            tableCell65.Append(tableCellProperties65);
            tableCell65.Append(paragraph78);

            tableRow48.Append(tablePropertyExceptions9);
            tableRow48.Append(tableRowProperties47);
            tableRow48.Append(tableCell65);

            TableRow tableRow49 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions10 = new TablePropertyExceptions();

            TableBorders tableBorders13 = new TableBorders();
            TopBorder topBorder67 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder59 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder72 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder59 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder13 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder13 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders13.Append(topBorder67);
            tableBorders13.Append(leftBorder59);
            tableBorders13.Append(bottomBorder72);
            tableBorders13.Append(rightBorder59);
            tableBorders13.Append(insideHorizontalBorder13);
            tableBorders13.Append(insideVerticalBorder13);

            tablePropertyExceptions10.Append(tableBorders13);

            TableRowProperties tableRowProperties48 = new TableRowProperties();
            TableRowHeight tableRowHeight45 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties48.Append(tableRowHeight45);

            TableCell tableCell66 = new TableCell();

            TableCellProperties tableCellProperties66 = new TableCellProperties();
            TableCellWidth tableCellWidth66 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan38 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders62 = new TableCellBorders();
            TopBorder topBorder68 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder60 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder73 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder60 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders62.Append(topBorder68);
            tableCellBorders62.Append(leftBorder60);
            tableCellBorders62.Append(bottomBorder73);
            tableCellBorders62.Append(rightBorder60);
            Shading shading29 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment47 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties66.Append(tableCellWidth66);
            tableCellProperties66.Append(gridSpan38);
            tableCellProperties66.Append(tableCellBorders62);
            tableCellProperties66.Append(shading29);
            tableCellProperties66.Append(tableCellVerticalAlignment47);

            Paragraph paragraph79 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties78 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties78 = new ParagraphMarkRunProperties();
            FontSize fontSize132 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript131 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties78.Append(fontSize132);
            paragraphMarkRunProperties78.Append(fontSizeComplexScript131);

            paragraphProperties78.Append(paragraphMarkRunProperties78);
            ProofError proofError43 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run76 = new Run();

            RunProperties runProperties76 = new RunProperties();
            FontSize fontSize133 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript132 = new FontSizeComplexScript() { Val = "24" };

            runProperties76.Append(fontSize133);
            runProperties76.Append(fontSizeComplexScript132);
            Text text76 = new Text();
            text76.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run76.Append(runProperties76);
            run76.Append(text76);
            ProofError proofError44 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph79.Append(paragraphProperties78);
            paragraph79.Append(proofError43);
            paragraph79.Append(run76);
            paragraph79.Append(proofError44);

            tableCell66.Append(tableCellProperties66);
            tableCell66.Append(paragraph79);

            tableRow49.Append(tablePropertyExceptions10);
            tableRow49.Append(tableRowProperties48);
            tableRow49.Append(tableCell66);

            TableRow tableRow50 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions11 = new TablePropertyExceptions();

            TableBorders tableBorders14 = new TableBorders();
            TopBorder topBorder69 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder61 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder74 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder61 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder14 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder14 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders14.Append(topBorder69);
            tableBorders14.Append(leftBorder61);
            tableBorders14.Append(bottomBorder74);
            tableBorders14.Append(rightBorder61);
            tableBorders14.Append(insideHorizontalBorder14);
            tableBorders14.Append(insideVerticalBorder14);

            tablePropertyExceptions11.Append(tableBorders14);

            TableRowProperties tableRowProperties49 = new TableRowProperties();
            TableRowHeight tableRowHeight46 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties49.Append(tableRowHeight46);

            TableCell tableCell67 = new TableCell();

            TableCellProperties tableCellProperties67 = new TableCellProperties();
            TableCellWidth tableCellWidth67 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan39 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders63 = new TableCellBorders();
            TopBorder topBorder70 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder62 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder75 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder62 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders63.Append(topBorder70);
            tableCellBorders63.Append(leftBorder62);
            tableCellBorders63.Append(bottomBorder75);
            tableCellBorders63.Append(rightBorder62);
            Shading shading30 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment48 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties67.Append(tableCellWidth67);
            tableCellProperties67.Append(gridSpan39);
            tableCellProperties67.Append(tableCellBorders63);
            tableCellProperties67.Append(shading30);
            tableCellProperties67.Append(tableCellVerticalAlignment48);

            Paragraph paragraph80 = new Paragraph() { RsidParagraphMarkRevision = "00D70749", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00D70749" };

            ParagraphProperties paragraphProperties79 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties79 = new ParagraphMarkRunProperties();
            FontSize fontSize134 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript133 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties79.Append(fontSize134);
            paragraphMarkRunProperties79.Append(fontSizeComplexScript133);

            paragraphProperties79.Append(paragraphMarkRunProperties79);

            Run run77 = new Run();

            RunProperties runProperties77 = new RunProperties();
            FontSize fontSize135 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript134 = new FontSizeComplexScript() { Val = "24" };

            runProperties77.Append(fontSize135);
            runProperties77.Append(fontSizeComplexScript134);
            Text text77 = new Text();
            text77.Text = drawMaterials != null && drawMaterials.Length > i ? drawMaterials[i++] : "";

            run77.Append(runProperties77);
            run77.Append(text77);

            paragraph80.Append(paragraphProperties79);
            paragraph80.Append(run77);

            tableCell67.Append(tableCellProperties67);
            tableCell67.Append(paragraph80);

            tableRow50.Append(tablePropertyExceptions11);
            tableRow50.Append(tableRowProperties49);
            tableRow50.Append(tableCell67);

            TableRow tableRow51 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties50 = new TableRowProperties();
            TableRowHeight tableRowHeight47 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties50.Append(tableRowHeight47);

            TableCell tableCell68 = new TableCell();

            TableCellProperties tableCellProperties68 = new TableCellProperties();
            TableCellWidth tableCellWidth68 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan40 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders64 = new TableCellBorders();
            TopBorder topBorder71 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders64.Append(topBorder71);
            Shading shading31 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment49 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties68.Append(tableCellWidth68);
            tableCellProperties68.Append(gridSpan40);
            tableCellProperties68.Append(tableCellBorders64);
            tableCellProperties68.Append(shading31);
            tableCellProperties68.Append(tableCellVerticalAlignment49);

            Paragraph paragraph81 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties80 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties80 = new ParagraphMarkRunProperties();
            FontSize fontSize136 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript135 = new FontSizeComplexScript() { Val = "24" };
            Languages languages114 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties80.Append(fontSize136);
            paragraphMarkRunProperties80.Append(fontSizeComplexScript135);
            paragraphMarkRunProperties80.Append(languages114);

            paragraphProperties80.Append(paragraphMarkRunProperties80);

            Run run78 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties78 = new RunProperties();
            FontSize fontSize137 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript136 = new FontSizeComplexScript() { Val = "24" };
            Languages languages115 = new Languages() { Val = "ru-RU" };

            runProperties78.Append(fontSize137);
            runProperties78.Append(fontSizeComplexScript136);
            runProperties78.Append(languages115);
            Text text78 = new Text();
            text78.Text = "5. Консультанты по дипломному проекту с указанием относящихся к ним разделов:";

            run78.Append(runProperties78);
            run78.Append(text78);

            paragraph81.Append(paragraphProperties80);
            paragraph81.Append(run78);

            tableCell68.Append(tableCellProperties68);
            tableCell68.Append(paragraph81);

            tableRow51.Append(tableRowProperties50);
            tableRow51.Append(tableCell68);

            TableRow tableRow52 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions12 = new TablePropertyExceptions();

            TableBorders tableBorders15 = new TableBorders();
            TopBorder topBorder72 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder63 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder76 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder63 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder15 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder15 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders15.Append(topBorder72);
            tableBorders15.Append(leftBorder63);
            tableBorders15.Append(bottomBorder76);
            tableBorders15.Append(rightBorder63);
            tableBorders15.Append(insideHorizontalBorder15);
            tableBorders15.Append(insideVerticalBorder15);

            tablePropertyExceptions12.Append(tableBorders15);

            TableRowProperties tableRowProperties51 = new TableRowProperties();
            TableRowHeight tableRowHeight48 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties51.Append(tableRowHeight48);

            TableCell tableCell69 = new TableCell();

            TableCellProperties tableCellProperties69 = new TableCellProperties();
            TableCellWidth tableCellWidth69 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan41 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders65 = new TableCellBorders();
            TopBorder topBorder73 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder64 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder77 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder64 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders65.Append(topBorder73);
            tableCellBorders65.Append(leftBorder64);
            tableCellBorders65.Append(bottomBorder77);
            tableCellBorders65.Append(rightBorder64);
            Shading shading32 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment50 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties69.Append(tableCellWidth69);
            tableCellProperties69.Append(gridSpan41);
            tableCellProperties69.Append(tableCellBorders65);
            tableCellProperties69.Append(shading32);
            tableCellProperties69.Append(tableCellVerticalAlignment50);

            Paragraph paragraph82 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties81 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties81 = new ParagraphMarkRunProperties();
            FontSize fontSize138 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript137 = new FontSizeComplexScript() { Val = "24" };
            Languages languages116 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties81.Append(fontSize138);
            paragraphMarkRunProperties81.Append(fontSizeComplexScript137);
            paragraphMarkRunProperties81.Append(languages116);

            paragraphProperties81.Append(paragraphMarkRunProperties81);

            Run run79 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties79 = new RunProperties();
            FontSize fontSize139 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript138 = new FontSizeComplexScript() { Val = "24" };
            Languages languages117 = new Languages() { Val = "ru-RU" };

            runProperties79.Append(fontSize139);
            runProperties79.Append(fontSizeComplexScript138);
            runProperties79.Append(languages117);
            Text text79 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text79.Text = "по компьютерному проектированию – ";

            run79.Append(runProperties79);
            run79.Append(text79);

            Run run80 = new Run() { RsidRunProperties = "003578D5", RsidRunAddition = "003277F5" };

            RunProperties runProperties80 = new RunProperties();
            FontSize fontSize140 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript139 = new FontSizeComplexScript() { Val = "24" };
            Languages languages118 = new Languages() { Val = "ru-RU" };

            runProperties80.Append(fontSize140);
            runProperties80.Append(fontSizeComplexScript139);
            runProperties80.Append(languages118);
            Text text80 = new Text();
            text80.Text = awork is null ? work.ComputerConsultant : awork.DiplomProject.ComputerConsultant;

            run80.Append(runProperties80);
            run80.Append(text80);

            paragraph82.Append(paragraphProperties81);
            paragraph82.Append(run79);
            paragraph82.Append(run80);

            tableCell69.Append(tableCellProperties69);
            tableCell69.Append(paragraph82);

            tableRow52.Append(tablePropertyExceptions12);
            tableRow52.Append(tableRowProperties51);
            tableRow52.Append(tableCell69);

            TableRow tableRow53 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions13 = new TablePropertyExceptions();

            TableBorders tableBorders16 = new TableBorders();
            TopBorder topBorder74 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder65 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder78 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder65 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder16 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder16 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders16.Append(topBorder74);
            tableBorders16.Append(leftBorder65);
            tableBorders16.Append(bottomBorder78);
            tableBorders16.Append(rightBorder65);
            tableBorders16.Append(insideHorizontalBorder16);
            tableBorders16.Append(insideVerticalBorder16);

            tablePropertyExceptions13.Append(tableBorders16);

            TableRowProperties tableRowProperties52 = new TableRowProperties();
            TableRowHeight tableRowHeight49 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties52.Append(tableRowHeight49);

            TableCell tableCell70 = new TableCell();

            TableCellProperties tableCellProperties70 = new TableCellProperties();
            TableCellWidth tableCellWidth70 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan42 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders66 = new TableCellBorders();
            TopBorder topBorder75 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder66 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder79 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder66 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders66.Append(topBorder75);
            tableCellBorders66.Append(leftBorder66);
            tableCellBorders66.Append(bottomBorder79);
            tableCellBorders66.Append(rightBorder66);
            Shading shading33 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment51 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties70.Append(tableCellWidth70);
            tableCellProperties70.Append(gridSpan42);
            tableCellProperties70.Append(tableCellBorders66);
            tableCellProperties70.Append(shading33);
            tableCellProperties70.Append(tableCellVerticalAlignment51);

            Paragraph paragraph83 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties82 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties82 = new ParagraphMarkRunProperties();
            FontSize fontSize141 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript140 = new FontSizeComplexScript() { Val = "24" };
            Languages languages119 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties82.Append(fontSize141);
            paragraphMarkRunProperties82.Append(fontSizeComplexScript140);
            paragraphMarkRunProperties82.Append(languages119);

            paragraphProperties82.Append(paragraphMarkRunProperties82);

            Run run81 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties81 = new RunProperties();
            FontSize fontSize142 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript141 = new FontSizeComplexScript() { Val = "24" };
            Languages languages120 = new Languages() { Val = "ru-RU" };

            runProperties81.Append(fontSize142);
            runProperties81.Append(fontSizeComplexScript141);
            runProperties81.Append(languages120);
            Text text81 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text81.Text = "по охране труда – ";

            run81.Append(runProperties81);
            run81.Append(text81);
            ProofError proofError45 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run82 = new Run() { RsidRunProperties = "003578D5", RsidRunAddition = "00044FF8" };

            RunProperties runProperties82 = new RunProperties();
            FontSize fontSize143 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript142 = new FontSizeComplexScript() { Val = "24" };
            Languages languages121 = new Languages() { Val = "ru-RU" };

            runProperties82.Append(fontSize143);
            runProperties82.Append(fontSizeComplexScript142);
            runProperties82.Append(languages121);
            Text text82 = new Text();
            text82.Text = awork is null ? work.HealthAndSafetyConsultant : awork.DiplomProject.HealthAndSafetyConsultant;

            run82.Append(runProperties82);
            run82.Append(text82);
            ProofError proofError46 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph83.Append(paragraphProperties82);
            paragraph83.Append(run81);
            paragraph83.Append(proofError45);
            paragraph83.Append(run82);
            paragraph83.Append(proofError46);

            tableCell70.Append(tableCellProperties70);
            tableCell70.Append(paragraph83);

            tableRow53.Append(tablePropertyExceptions13);
            tableRow53.Append(tableRowProperties52);
            tableRow53.Append(tableCell70);

            TableRow tableRow54 = new TableRow() { RsidTableRowMarkRevision = "005B5306", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions14 = new TablePropertyExceptions();

            TableBorders tableBorders17 = new TableBorders();
            TopBorder topBorder76 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder67 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder80 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder67 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder17 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder17 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders17.Append(topBorder76);
            tableBorders17.Append(leftBorder67);
            tableBorders17.Append(bottomBorder80);
            tableBorders17.Append(rightBorder67);
            tableBorders17.Append(insideHorizontalBorder17);
            tableBorders17.Append(insideVerticalBorder17);

            tablePropertyExceptions14.Append(tableBorders17);

            TableRowProperties tableRowProperties53 = new TableRowProperties();
            TableRowHeight tableRowHeight50 = new TableRowHeight() { Val = (UInt32Value)352U };

            tableRowProperties53.Append(tableRowHeight50);

            TableCell tableCell71 = new TableCell();

            TableCellProperties tableCellProperties71 = new TableCellProperties();
            TableCellWidth tableCellWidth71 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan43 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders67 = new TableCellBorders();
            TopBorder topBorder77 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder68 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder81 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder68 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders67.Append(topBorder77);
            tableCellBorders67.Append(leftBorder68);
            tableCellBorders67.Append(bottomBorder81);
            tableCellBorders67.Append(rightBorder68);
            Shading shading34 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment52 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties71.Append(tableCellWidth71);
            tableCellProperties71.Append(gridSpan43);
            tableCellProperties71.Append(tableCellBorders67);
            tableCellProperties71.Append(shading34);
            tableCellProperties71.Append(tableCellVerticalAlignment52);

            Paragraph paragraph84 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties83 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties83 = new ParagraphMarkRunProperties();
            FontSize fontSize145 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript144 = new FontSizeComplexScript() { Val = "24" };
            Languages languages123 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties83.Append(fontSize145);
            paragraphMarkRunProperties83.Append(fontSizeComplexScript144);
            paragraphMarkRunProperties83.Append(languages123);

            paragraphProperties83.Append(paragraphMarkRunProperties83);

            Run run84 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties84 = new RunProperties();
            FontSize fontSize146 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript145 = new FontSizeComplexScript() { Val = "24" };
            Languages languages124 = new Languages() { Val = "ru-RU" };

            runProperties84.Append(fontSize146);
            runProperties84.Append(fontSizeComplexScript145);
            runProperties84.Append(languages124);
            Text text84 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text84.Text = "по вопросам экономики – ";

            run84.Append(runProperties84);
            run84.Append(text84);
            ProofError proofError47 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run85 = new Run() { RsidRunProperties = "003578D5", RsidRunAddition = "00044FF8" };

            RunProperties runProperties85 = new RunProperties();
            FontSize fontSize147 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript146 = new FontSizeComplexScript() { Val = "24" };
            Languages languages125 = new Languages() { Val = "ru-RU" };

            runProperties85.Append(fontSize147);
            runProperties85.Append(fontSizeComplexScript146);
            runProperties85.Append(languages125);
            Text text85 = new Text();
            text85.Text = awork is null ? work.EconimicsConsultant : awork.DiplomProject.EconimicsConsultant;

            run85.Append(runProperties85);
            run85.Append(text85);
            ProofError proofError48 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph84.Append(paragraphProperties83);
            paragraph84.Append(run84);
            paragraph84.Append(proofError47);
            paragraph84.Append(run85);
            paragraph84.Append(proofError48);

            tableCell71.Append(tableCellProperties71);
            tableCell71.Append(paragraph84);

            tableRow54.Append(tablePropertyExceptions14);
            tableRow54.Append(tableRowProperties53);
            tableRow54.Append(tableCell71);

            TableRow tableRow55 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions15 = new TablePropertyExceptions();

            TableBorders tableBorders18 = new TableBorders();
            TopBorder topBorder78 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder69 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder82 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder69 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder18 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder18 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders18.Append(topBorder78);
            tableBorders18.Append(leftBorder69);
            tableBorders18.Append(bottomBorder82);
            tableBorders18.Append(rightBorder69);
            tableBorders18.Append(insideHorizontalBorder18);
            tableBorders18.Append(insideVerticalBorder18);

            tablePropertyExceptions15.Append(tableBorders18);

            TableRowProperties tableRowProperties54 = new TableRowProperties();
            TableRowHeight tableRowHeight51 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties54.Append(tableRowHeight51);

            TableCell tableCell72 = new TableCell();

            TableCellProperties tableCellProperties72 = new TableCellProperties();
            TableCellWidth tableCellWidth72 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan44 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders68 = new TableCellBorders();
            TopBorder topBorder79 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder70 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder83 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder70 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders68.Append(topBorder79);
            tableCellBorders68.Append(leftBorder70);
            tableCellBorders68.Append(bottomBorder83);
            tableCellBorders68.Append(rightBorder70);
            Shading shading35 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment53 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties72.Append(tableCellWidth72);
            tableCellProperties72.Append(gridSpan44);
            tableCellProperties72.Append(tableCellBorders68);
            tableCellProperties72.Append(shading35);
            tableCellProperties72.Append(tableCellVerticalAlignment53);

            Paragraph paragraph85 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00044FF8", RsidParagraphProperties = "00044FF8", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties84 = new ParagraphProperties();

            Tabs tabs1 = new Tabs();
            TabStop tabStop1 = new TabStop() { Val = TabStopValues.Number, Position = 0 };

            tabs1.Append(tabStop1);
            Justification justification26 = new Justification() { Val = JustificationValues.Both };

            ParagraphMarkRunProperties paragraphMarkRunProperties84 = new ParagraphMarkRunProperties();
            FontSize fontSize149 = new FontSize() { Val = "28" };
            FontSizeComplexScript fontSizeComplexScript148 = new FontSizeComplexScript() { Val = "28" };

            paragraphMarkRunProperties84.Append(fontSize149);
            paragraphMarkRunProperties84.Append(fontSizeComplexScript148);

            paragraphProperties84.Append(tabs1);
            paragraphProperties84.Append(justification26);
            paragraphProperties84.Append(paragraphMarkRunProperties84);
            ProofError proofError49 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run87 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties87 = new RunProperties();
            FontSize fontSize150 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript149 = new FontSizeComplexScript() { Val = "24" };

            runProperties87.Append(fontSize150);
            runProperties87.Append(fontSizeComplexScript149);
            Text text87 = new Text();
            text87.Text = "нормоконтроль";

            run87.Append(runProperties87);
            run87.Append(text87);
            ProofError proofError50 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run88 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties88 = new RunProperties();
            FontSize fontSize151 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript150 = new FontSizeComplexScript() { Val = "24" };

            runProperties88.Append(fontSize151);
            runProperties88.Append(fontSizeComplexScript150);
            Text text88 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text88.Text = " – ";

            run88.Append(runProperties88);
            run88.Append(text88);

            Run run89 = new Run() { RsidRunProperties = "003578D5", RsidRunAddition = "00044FF8" };

            RunProperties runProperties89 = new RunProperties();
            FontSize fontSize152 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript151 = new FontSizeComplexScript() { Val = "24" };
            Languages languages127 = new Languages() { Val = "ru-RU" };

            runProperties89.Append(fontSize152);
            runProperties89.Append(fontSizeComplexScript151);
            runProperties89.Append(languages127);
            Text text89 = new Text();
            text89.Text = awork is null ? work.NormocontrolConsultant : awork.DiplomProject.NormocontrolConsultant;

            run89.Append(runProperties89);
            run89.Append(text89);

            paragraph85.Append(paragraphProperties84);
            paragraph85.Append(proofError49);
            paragraph85.Append(run87);
            paragraph85.Append(proofError50);
            paragraph85.Append(run88);
            paragraph85.Append(run89);

            Paragraph paragraph86 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties85 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties85 = new ParagraphMarkRunProperties();
            FontSize fontSize153 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript152 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties85.Append(fontSize153);
            paragraphMarkRunProperties85.Append(fontSizeComplexScript152);

            paragraphProperties85.Append(paragraphMarkRunProperties85);

            paragraph86.Append(paragraphProperties85);

            tableCell72.Append(tableCellProperties72);
            tableCell72.Append(paragraph85);
            tableCell72.Append(paragraph86);

            tableRow55.Append(tablePropertyExceptions15);
            tableRow55.Append(tableRowProperties54);
            tableRow55.Append(tableCell72);

            TableRow tableRow56 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions16 = new TablePropertyExceptions();

            TableBorders tableBorders19 = new TableBorders();
            TopBorder topBorder80 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder71 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder84 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder71 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder19 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder19 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders19.Append(topBorder80);
            tableBorders19.Append(leftBorder71);
            tableBorders19.Append(bottomBorder84);
            tableBorders19.Append(rightBorder71);
            tableBorders19.Append(insideHorizontalBorder19);
            tableBorders19.Append(insideVerticalBorder19);

            tablePropertyExceptions16.Append(tableBorders19);

            TableRowProperties tableRowProperties55 = new TableRowProperties();
            TableRowHeight tableRowHeight52 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties55.Append(tableRowHeight52);

            TableCell tableCell73 = new TableCell();

            TableCellProperties tableCellProperties73 = new TableCellProperties();
            TableCellWidth tableCellWidth73 = new TableCellWidth() { Width = "5000", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan45 = new GridSpan() { Val = 9 };

            TableCellBorders tableCellBorders69 = new TableCellBorders();
            TopBorder topBorder81 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder72 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder85 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder72 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders69.Append(topBorder81);
            tableCellBorders69.Append(leftBorder72);
            tableCellBorders69.Append(bottomBorder85);
            tableCellBorders69.Append(rightBorder72);
            Shading shading36 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment54 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties73.Append(tableCellWidth73);
            tableCellProperties73.Append(gridSpan45);
            tableCellProperties73.Append(tableCellBorders69);
            tableCellProperties73.Append(shading36);
            tableCellProperties73.Append(tableCellVerticalAlignment54);

            Paragraph paragraph87 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties86 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties86 = new ParagraphMarkRunProperties();
            FontSize fontSize154 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript153 = new FontSizeComplexScript() { Val = "24" };
            Languages languages128 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties86.Append(fontSize154);
            paragraphMarkRunProperties86.Append(fontSizeComplexScript153);
            paragraphMarkRunProperties86.Append(languages128);

            paragraphProperties86.Append(paragraphMarkRunProperties86);

            Run run90 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties90 = new RunProperties();
            FontSize fontSize155 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript154 = new FontSizeComplexScript() { Val = "24" };
            Languages languages129 = new Languages() { Val = "ru-RU" };

            runProperties90.Append(fontSize155);
            runProperties90.Append(fontSizeComplexScript154);
            runProperties90.Append(languages129);
            Text text90 = new Text();
            text90.Text = "6. Примерный календарный график выполнения дипломного проекта:";

            run90.Append(runProperties90);
            run90.Append(text90);

            paragraph87.Append(paragraphProperties86);
            paragraph87.Append(run90);

            Paragraph paragraph88 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties87 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties87 = new ParagraphMarkRunProperties();
            FontSize fontSize156 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript155 = new FontSizeComplexScript() { Val = "24" };
            Languages languages130 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties87.Append(fontSize156);
            paragraphMarkRunProperties87.Append(fontSizeComplexScript155);
            paragraphMarkRunProperties87.Append(languages130);

            paragraphProperties87.Append(paragraphMarkRunProperties87);

            paragraph88.Append(paragraphProperties87);

            Table table6 = new Table();

            TableProperties tableProperties6 = new TableProperties();
            TableWidth tableWidth6 = new TableWidth() { Width = "10768", Type = TableWidthUnitValues.Dxa };

            TableBorders tableBorders20 = new TableBorders();
            TopBorder topBorder82 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder73 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder86 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder73 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder20 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder20 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders20.Append(topBorder82);
            tableBorders20.Append(leftBorder73);
            tableBorders20.Append(bottomBorder86);
            tableBorders20.Append(rightBorder73);
            tableBorders20.Append(insideHorizontalBorder20);
            tableBorders20.Append(insideVerticalBorder20);
            TableLook tableLook6 = new TableLook() { Val = "04A0" };

            tableProperties6.Append(tableWidth6);
            tableProperties6.Append(tableBorders20);
            tableProperties6.Append(tableLook6);

            TableGrid tableGrid6 = new TableGrid();
            GridColumn gridColumn26 = new GridColumn() { Width = "3823" };
            GridColumn gridColumn27 = new GridColumn() { Width = "1984" };
            GridColumn gridColumn28 = new GridColumn() { Width = "2268" };
            GridColumn gridColumn29 = new GridColumn() { Width = "2693" };

            tableGrid6.Append(gridColumn26);
            tableGrid6.Append(gridColumn27);
            tableGrid6.Append(gridColumn28);
            tableGrid6.Append(gridColumn29);

            TableRow tableRow57 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell74 = new TableCell();

            TableCellProperties tableCellProperties74 = new TableCellProperties();
            TableCellWidth tableCellWidth74 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties74.Append(tableCellWidth74);

            Paragraph paragraph89 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties88 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties88 = new ParagraphMarkRunProperties();
            FontSize fontSize157 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript156 = new FontSizeComplexScript() { Val = "24" };
            Languages languages131 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties88.Append(fontSize157);
            paragraphMarkRunProperties88.Append(fontSizeComplexScript156);
            paragraphMarkRunProperties88.Append(languages131);

            paragraphProperties88.Append(paragraphMarkRunProperties88);

            Run run91 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties91 = new RunProperties();
            FontSize fontSize158 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript157 = new FontSizeComplexScript() { Val = "24" };
            Languages languages132 = new Languages() { Val = "ru-RU" };

            runProperties91.Append(fontSize158);
            runProperties91.Append(fontSizeComplexScript157);
            runProperties91.Append(languages132);
            Text text91 = new Text();
            text91.Text = "Наименование этапов выполнения дипломного проекта, содержание расчетно-пояснительной записки, графического материала";

            run91.Append(runProperties91);
            run91.Append(text91);

            paragraph89.Append(paragraphProperties88);
            paragraph89.Append(run91);

            tableCell74.Append(tableCellProperties74);
            tableCell74.Append(paragraph89);

            TableCell tableCell75 = new TableCell();

            TableCellProperties tableCellProperties75 = new TableCellProperties();
            TableCellWidth tableCellWidth75 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties75.Append(tableCellWidth75);

            Paragraph paragraph90 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties89 = new ParagraphProperties();
            Justification justification27 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties89 = new ParagraphMarkRunProperties();
            FontSize fontSize159 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript158 = new FontSizeComplexScript() { Val = "24" };
            Languages languages133 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties89.Append(fontSize159);
            paragraphMarkRunProperties89.Append(fontSizeComplexScript158);
            paragraphMarkRunProperties89.Append(languages133);

            paragraphProperties89.Append(justification27);
            paragraphProperties89.Append(paragraphMarkRunProperties89);
            ProofError proofError51 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run92 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties92 = new RunProperties();
            FontSize fontSize160 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript159 = new FontSizeComplexScript() { Val = "24" };

            runProperties92.Append(fontSize160);
            runProperties92.Append(fontSizeComplexScript159);
            Text text92 = new Text();
            text92.Text = "Объем";

            run92.Append(runProperties92);
            run92.Append(text92);
            ProofError proofError52 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run93 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties93 = new RunProperties();
            FontSize fontSize161 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript160 = new FontSizeComplexScript() { Val = "24" };

            runProperties93.Append(fontSize161);
            runProperties93.Append(fontSizeComplexScript160);
            Text text93 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text93.Text = " ";

            run93.Append(runProperties93);
            run93.Append(text93);

            paragraph90.Append(paragraphProperties89);
            paragraph90.Append(proofError51);
            paragraph90.Append(run92);
            paragraph90.Append(proofError52);
            paragraph90.Append(run93);

            Paragraph paragraph91 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties90 = new ParagraphProperties();
            Justification justification28 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties90 = new ParagraphMarkRunProperties();
            FontSize fontSize162 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript161 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties90.Append(fontSize162);
            paragraphMarkRunProperties90.Append(fontSizeComplexScript161);

            paragraphProperties90.Append(justification28);
            paragraphProperties90.Append(paragraphMarkRunProperties90);
            ProofError proofError53 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run94 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties94 = new RunProperties();
            FontSize fontSize163 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript162 = new FontSizeComplexScript() { Val = "24" };

            runProperties94.Append(fontSize163);
            runProperties94.Append(fontSizeComplexScript162);
            Text text94 = new Text();
            text94.Text = "работы";

            run94.Append(runProperties94);
            run94.Append(text94);
            ProofError proofError54 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run95 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties95 = new RunProperties();
            FontSize fontSize164 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript163 = new FontSizeComplexScript() { Val = "24" };

            runProperties95.Append(fontSize164);
            runProperties95.Append(fontSizeComplexScript163);
            Text text95 = new Text();
            text95.Text = ",";

            run95.Append(runProperties95);
            run95.Append(text95);

            paragraph91.Append(paragraphProperties90);
            paragraph91.Append(proofError53);
            paragraph91.Append(run94);
            paragraph91.Append(proofError54);
            paragraph91.Append(run95);

            Paragraph paragraph92 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties91 = new ParagraphProperties();
            Justification justification29 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties91 = new ParagraphMarkRunProperties();
            FontSize fontSize165 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript164 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties91.Append(fontSize165);
            paragraphMarkRunProperties91.Append(fontSizeComplexScript164);

            paragraphProperties91.Append(justification29);
            paragraphProperties91.Append(paragraphMarkRunProperties91);

            Run run96 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties96 = new RunProperties();
            FontSize fontSize166 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript165 = new FontSizeComplexScript() { Val = "24" };

            runProperties96.Append(fontSize166);
            runProperties96.Append(fontSizeComplexScript165);
            Text text96 = new Text();
            text96.Text = "%";

            run96.Append(runProperties96);
            run96.Append(text96);

            paragraph92.Append(paragraphProperties91);
            paragraph92.Append(run96);

            tableCell75.Append(tableCellProperties75);
            tableCell75.Append(paragraph90);
            tableCell75.Append(paragraph91);
            tableCell75.Append(paragraph92);

            TableCell tableCell76 = new TableCell();

            TableCellProperties tableCellProperties76 = new TableCellProperties();
            TableCellWidth tableCellWidth76 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties76.Append(tableCellWidth76);

            Paragraph paragraph93 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties92 = new ParagraphProperties();
            Justification justification30 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties92 = new ParagraphMarkRunProperties();
            FontSize fontSize167 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript166 = new FontSizeComplexScript() { Val = "24" };
            Languages languages134 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties92.Append(fontSize167);
            paragraphMarkRunProperties92.Append(fontSizeComplexScript166);
            paragraphMarkRunProperties92.Append(languages134);

            paragraphProperties92.Append(justification30);
            paragraphProperties92.Append(paragraphMarkRunProperties92);
            ProofError proofError55 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run97 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties97 = new RunProperties();
            FontSize fontSize168 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript167 = new FontSizeComplexScript() { Val = "24" };

            runProperties97.Append(fontSize168);
            runProperties97.Append(fontSizeComplexScript167);
            Text text97 = new Text();
            text97.Text = "Сроки";

            run97.Append(runProperties97);
            run97.Append(text97);
            ProofError proofError56 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph93.Append(paragraphProperties92);
            paragraph93.Append(proofError55);
            paragraph93.Append(run97);
            paragraph93.Append(proofError56);

            Paragraph paragraph94 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties93 = new ParagraphProperties();
            Justification justification31 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties93 = new ParagraphMarkRunProperties();
            FontSize fontSize169 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript168 = new FontSizeComplexScript() { Val = "24" };
            Languages languages135 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties93.Append(fontSize169);
            paragraphMarkRunProperties93.Append(fontSizeComplexScript168);
            paragraphMarkRunProperties93.Append(languages135);

            paragraphProperties93.Append(justification31);
            paragraphProperties93.Append(paragraphMarkRunProperties93);

            Run run98 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties98 = new RunProperties();
            FontSize fontSize170 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript169 = new FontSizeComplexScript() { Val = "24" };

            runProperties98.Append(fontSize170);
            runProperties98.Append(fontSizeComplexScript169);
            Text text98 = new Text();
            text98.Text = "(";

            run98.Append(runProperties98);
            run98.Append(text98);
            ProofError proofError57 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run99 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties99 = new RunProperties();
            FontSize fontSize171 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript170 = new FontSizeComplexScript() { Val = "24" };

            runProperties99.Append(fontSize171);
            runProperties99.Append(fontSizeComplexScript170);
            Text text99 = new Text();
            text99.Text = "дата";

            run99.Append(runProperties99);
            run99.Append(text99);
            ProofError proofError58 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run100 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties100 = new RunProperties();
            FontSize fontSize172 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript171 = new FontSizeComplexScript() { Val = "24" };

            runProperties100.Append(fontSize172);
            runProperties100.Append(fontSizeComplexScript171);
            Text text100 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text100.Text = ") ";

            run100.Append(runProperties100);
            run100.Append(text100);

            paragraph94.Append(paragraphProperties93);
            paragraph94.Append(run98);
            paragraph94.Append(proofError57);
            paragraph94.Append(run99);
            paragraph94.Append(proofError58);
            paragraph94.Append(run100);

            Paragraph paragraph95 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties94 = new ParagraphProperties();
            Justification justification32 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties94 = new ParagraphMarkRunProperties();
            FontSize fontSize173 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript172 = new FontSizeComplexScript() { Val = "24" };
            Languages languages136 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties94.Append(fontSize173);
            paragraphMarkRunProperties94.Append(fontSizeComplexScript172);
            paragraphMarkRunProperties94.Append(languages136);

            paragraphProperties94.Append(justification32);
            paragraphProperties94.Append(paragraphMarkRunProperties94);
            ProofError proofError59 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run101 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties101 = new RunProperties();
            FontSize fontSize174 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript173 = new FontSizeComplexScript() { Val = "24" };

            runProperties101.Append(fontSize174);
            runProperties101.Append(fontSizeComplexScript173);
            Text text101 = new Text();
            text101.Text = "выполнения";

            run101.Append(runProperties101);
            run101.Append(text101);
            ProofError proofError60 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run102 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties102 = new RunProperties();
            FontSize fontSize175 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript174 = new FontSizeComplexScript() { Val = "24" };

            runProperties102.Append(fontSize175);
            runProperties102.Append(fontSizeComplexScript174);
            Text text102 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text102.Text = " ";

            run102.Append(runProperties102);
            run102.Append(text102);

            paragraph95.Append(paragraphProperties94);
            paragraph95.Append(proofError59);
            paragraph95.Append(run101);
            paragraph95.Append(proofError60);
            paragraph95.Append(run102);

            Paragraph paragraph96 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties95 = new ParagraphProperties();
            Justification justification33 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties95 = new ParagraphMarkRunProperties();
            FontSize fontSize176 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript175 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties95.Append(fontSize176);
            paragraphMarkRunProperties95.Append(fontSizeComplexScript175);

            paragraphProperties95.Append(justification33);
            paragraphProperties95.Append(paragraphMarkRunProperties95);
            ProofError proofError61 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run103 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties103 = new RunProperties();
            FontSize fontSize177 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript176 = new FontSizeComplexScript() { Val = "24" };

            runProperties103.Append(fontSize177);
            runProperties103.Append(fontSizeComplexScript176);
            Text text103 = new Text();
            text103.Text = "этапа";

            run103.Append(runProperties103);
            run103.Append(text103);
            ProofError proofError62 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph96.Append(paragraphProperties95);
            paragraph96.Append(proofError61);
            paragraph96.Append(run103);
            paragraph96.Append(proofError62);

            tableCell76.Append(tableCellProperties76);
            tableCell76.Append(paragraph93);
            tableCell76.Append(paragraph94);
            tableCell76.Append(paragraph95);
            tableCell76.Append(paragraph96);

            TableCell tableCell77 = new TableCell();

            TableCellProperties tableCellProperties77 = new TableCellProperties();
            TableCellWidth tableCellWidth77 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties77.Append(tableCellWidth77);

            Paragraph paragraph97 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties96 = new ParagraphProperties();
            Justification justification34 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties96 = new ParagraphMarkRunProperties();
            FontSize fontSize178 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript177 = new FontSizeComplexScript() { Val = "24" };
            Languages languages137 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties96.Append(fontSize178);
            paragraphMarkRunProperties96.Append(fontSizeComplexScript177);
            paragraphMarkRunProperties96.Append(languages137);

            paragraphProperties96.Append(justification34);
            paragraphProperties96.Append(paragraphMarkRunProperties96);

            Run run104 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties104 = new RunProperties();
            FontSize fontSize179 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript178 = new FontSizeComplexScript() { Val = "24" };
            Languages languages138 = new Languages() { Val = "ru-RU" };

            runProperties104.Append(fontSize179);
            runProperties104.Append(fontSizeComplexScript178);
            runProperties104.Append(languages138);
            Text text104 = new Text();
            text104.Text = "Примечание";

            run104.Append(runProperties104);
            run104.Append(text104);

            paragraph97.Append(paragraphProperties96);
            paragraph97.Append(run104);

            Paragraph paragraph98 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties97 = new ParagraphProperties();
            Justification justification35 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties97 = new ParagraphMarkRunProperties();
            FontSize fontSize180 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript179 = new FontSizeComplexScript() { Val = "24" };
            Languages languages139 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties97.Append(fontSize180);
            paragraphMarkRunProperties97.Append(fontSizeComplexScript179);
            paragraphMarkRunProperties97.Append(languages139);

            paragraphProperties97.Append(justification35);
            paragraphProperties97.Append(paragraphMarkRunProperties97);
            ProofError proofError63 = new ProofError() { Type = ProofingErrorValues.GrammarStart };

            Run run105 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties105 = new RunProperties();
            FontSize fontSize181 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript180 = new FontSizeComplexScript() { Val = "24" };
            Languages languages140 = new Languages() { Val = "ru-RU" };

            runProperties105.Append(fontSize181);
            runProperties105.Append(fontSizeComplexScript180);
            runProperties105.Append(languages140);
            Text text105 = new Text();
            text105.Text = "( в";

            run105.Append(runProperties105);
            run105.Append(text105);
            ProofError proofError64 = new ProofError() { Type = ProofingErrorValues.GrammarEnd };

            Run run106 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties106 = new RunProperties();
            FontSize fontSize182 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript181 = new FontSizeComplexScript() { Val = "24" };
            Languages languages141 = new Languages() { Val = "ru-RU" };

            runProperties106.Append(fontSize182);
            runProperties106.Append(fontSizeComplexScript181);
            runProperties106.Append(languages141);
            Text text106 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text106.Text = " ";

            run106.Append(runProperties106);
            run106.Append(text106);
            ProofError proofError65 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run107 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties107 = new RunProperties();
            FontSize fontSize183 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript182 = new FontSizeComplexScript() { Val = "24" };
            Languages languages142 = new Languages() { Val = "ru-RU" };

            runProperties107.Append(fontSize183);
            runProperties107.Append(fontSizeComplexScript182);
            runProperties107.Append(languages142);
            Text text107 = new Text();
            text107.Text = "т.ч";

            run107.Append(runProperties107);
            run107.Append(text107);
            ProofError proofError66 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run108 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties108 = new RunProperties();
            FontSize fontSize184 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript183 = new FontSizeComplexScript() { Val = "24" };
            Languages languages143 = new Languages() { Val = "ru-RU" };

            runProperties108.Append(fontSize184);
            runProperties108.Append(fontSizeComplexScript183);
            runProperties108.Append(languages143);
            Text text108 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text108.Text = ". отметка руководителя, консультанта ";

            run108.Append(runProperties108);
            run108.Append(text108);

            paragraph98.Append(paragraphProperties97);
            paragraph98.Append(proofError63);
            paragraph98.Append(run105);
            paragraph98.Append(proofError64);
            paragraph98.Append(run106);
            paragraph98.Append(proofError65);
            paragraph98.Append(run107);
            paragraph98.Append(proofError66);
            paragraph98.Append(run108);

            Paragraph paragraph99 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties98 = new ParagraphProperties();
            Justification justification36 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties98 = new ParagraphMarkRunProperties();
            FontSize fontSize185 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript184 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties98.Append(fontSize185);
            paragraphMarkRunProperties98.Append(fontSizeComplexScript184);

            paragraphProperties98.Append(justification36);
            paragraphProperties98.Append(paragraphMarkRunProperties98);

            Run run109 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties109 = new RunProperties();
            FontSize fontSize186 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript185 = new FontSizeComplexScript() { Val = "24" };

            runProperties109.Append(fontSize186);
            runProperties109.Append(fontSizeComplexScript185);
            Text text109 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text109.Text = "о ";

            run109.Append(runProperties109);
            run109.Append(text109);
            ProofError proofError67 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run110 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties110 = new RunProperties();
            FontSize fontSize187 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript186 = new FontSizeComplexScript() { Val = "24" };

            runProperties110.Append(fontSize187);
            runProperties110.Append(fontSizeComplexScript186);
            Text text110 = new Text();
            text110.Text = "выполнении";

            run110.Append(runProperties110);
            run110.Append(text110);
            ProofError proofError68 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run111 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties111 = new RunProperties();
            FontSize fontSize188 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript187 = new FontSizeComplexScript() { Val = "24" };

            runProperties111.Append(fontSize188);
            runProperties111.Append(fontSizeComplexScript187);
            Text text111 = new Text();
            text111.Text = ")";

            run111.Append(runProperties111);
            run111.Append(text111);

            paragraph99.Append(paragraphProperties98);
            paragraph99.Append(run109);
            paragraph99.Append(proofError67);
            paragraph99.Append(run110);
            paragraph99.Append(proofError68);
            paragraph99.Append(run111);

            tableCell77.Append(tableCellProperties77);
            tableCell77.Append(paragraph97);
            tableCell77.Append(paragraph98);
            tableCell77.Append(paragraph99);

            tableRow57.Append(tableCell74);
            tableRow57.Append(tableCell75);
            tableRow57.Append(tableCell76);
            tableRow57.Append(tableCell77);

            TableRow tableRow58 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell78 = new TableCell();

            TableCellProperties tableCellProperties78 = new TableCellProperties();
            TableCellWidth tableCellWidth78 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties78.Append(tableCellWidth78);

            Paragraph paragraph100 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties99 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties99 = new ParagraphMarkRunProperties();
            FontSize fontSize189 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript188 = new FontSizeComplexScript() { Val = "24" };
            Languages languages144 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties99.Append(fontSize189);
            paragraphMarkRunProperties99.Append(fontSizeComplexScript188);
            paragraphMarkRunProperties99.Append(languages144);

            paragraphProperties99.Append(paragraphMarkRunProperties99);

            // get percentages
            var pgs = awork?.Student.Group.Secretary != null ?
                awork.Student.Group.Secretary.DiplomPercentagesGraphs.ToList() : new List<DiplomPercentagesGraph>();
            int index = 0;

            Run run112 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties112 = new RunProperties();
            FontSize fontSize190 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript189 = new FontSizeComplexScript() { Val = "24" };
            Languages languages145 = new Languages() { Val = "ru-RU" };

            runProperties112.Append(fontSize190);
            runProperties112.Append(fontSizeComplexScript189);
            runProperties112.Append(languages145);
            Text text112 = new Text();
            text112.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run112.Append(runProperties112);
            run112.Append(text112);

            paragraph100.Append(paragraphProperties99);
            paragraph100.Append(run112);

            tableCell78.Append(tableCellProperties78);
            tableCell78.Append(paragraph100);

            TableCell tableCell79 = new TableCell();

            TableCellProperties tableCellProperties79 = new TableCellProperties();
            TableCellWidth tableCellWidth79 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties79.Append(tableCellWidth79);

            Paragraph paragraph101 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties100 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties100 = new ParagraphMarkRunProperties();
            FontSize fontSize191 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript190 = new FontSizeComplexScript() { Val = "24" };
            Languages languages146 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties100.Append(fontSize191);
            paragraphMarkRunProperties100.Append(fontSizeComplexScript190);
            paragraphMarkRunProperties100.Append(languages146);

            paragraphProperties100.Append(paragraphMarkRunProperties100);

            Run run113 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties113 = new RunProperties();
            FontSize fontSize192 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript191 = new FontSizeComplexScript() { Val = "24" };
            Languages languages147 = new Languages() { Val = "ru-RU" };

            runProperties113.Append(fontSize192);
            runProperties113.Append(fontSizeComplexScript191);
            runProperties113.Append(languages147);
            Text text113 = new Text();
            text113.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() + "%" : "";

            run113.Append(runProperties113);
            run113.Append(text113);

            paragraph101.Append(paragraphProperties100);
            paragraph101.Append(run113);

            tableCell79.Append(tableCellProperties79);
            tableCell79.Append(paragraph101);

            TableCell tableCell80 = new TableCell();

            TableCellProperties tableCellProperties80 = new TableCellProperties();
            TableCellWidth tableCellWidth80 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties80.Append(tableCellWidth80);

            Paragraph paragraph102 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties101 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties101 = new ParagraphMarkRunProperties();
            FontSize fontSize195 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript194 = new FontSizeComplexScript() { Val = "24" };
            Languages languages150 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties101.Append(fontSize195);
            paragraphMarkRunProperties101.Append(fontSizeComplexScript194);
            paragraphMarkRunProperties101.Append(languages150);

            paragraphProperties101.Append(paragraphMarkRunProperties101);

            Run run116 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties116 = new RunProperties();
            FontSize fontSize196 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript195 = new FontSizeComplexScript() { Val = "24" };
            Languages languages151 = new Languages() { Val = "ru-RU" };

            runProperties116.Append(fontSize196);
            runProperties116.Append(fontSizeComplexScript195);
            runProperties116.Append(languages151);
            Text text116 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text116.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run116.Append(runProperties116);
            run116.Append(text116);

            paragraph102.Append(paragraphProperties101);
            paragraph102.Append(run116);

            tableCell80.Append(tableCellProperties80);
            tableCell80.Append(paragraph102);

            TableCell tableCell81 = new TableCell();

            TableCellProperties tableCellProperties81 = new TableCellProperties();
            TableCellWidth tableCellWidth81 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties81.Append(tableCellWidth81);

            Paragraph paragraph103 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties102 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties102 = new ParagraphMarkRunProperties();
            FontSize fontSize200 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript199 = new FontSizeComplexScript() { Val = "24" };
            Languages languages155 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties102.Append(fontSize200);
            paragraphMarkRunProperties102.Append(fontSizeComplexScript199);
            paragraphMarkRunProperties102.Append(languages155);

            paragraphProperties102.Append(paragraphMarkRunProperties102);

            paragraph103.Append(paragraphProperties102);

            tableCell81.Append(tableCellProperties81);
            tableCell81.Append(paragraph103);

            tableRow58.Append(tableCell78);
            tableRow58.Append(tableCell79);
            tableRow58.Append(tableCell80);
            tableRow58.Append(tableCell81);

            TableRow tableRow59 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell82 = new TableCell();

            TableCellProperties tableCellProperties82 = new TableCellProperties();
            TableCellWidth tableCellWidth82 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties82.Append(tableCellWidth82);

            Paragraph paragraph104 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties103 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties103 = new ParagraphMarkRunProperties();
            FontSize fontSize201 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript200 = new FontSizeComplexScript() { Val = "24" };
            Languages languages156 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties103.Append(fontSize201);
            paragraphMarkRunProperties103.Append(fontSizeComplexScript200);
            paragraphMarkRunProperties103.Append(languages156);

            paragraphProperties103.Append(paragraphMarkRunProperties103);

            Run run120 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties120 = new RunProperties();
            FontSize fontSize202 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript201 = new FontSizeComplexScript() { Val = "24" };
            Languages languages157 = new Languages() { Val = "ru-RU" };

            runProperties120.Append(fontSize202);
            runProperties120.Append(fontSizeComplexScript201);
            runProperties120.Append(languages157);
            Text text120 = new Text();
            text120.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run120.Append(runProperties120);
            run120.Append(text120);

            paragraph104.Append(paragraphProperties103);
            paragraph104.Append(run120);

            tableCell82.Append(tableCellProperties82);
            tableCell82.Append(paragraph104);

            TableCell tableCell83 = new TableCell();

            TableCellProperties tableCellProperties83 = new TableCellProperties();
            TableCellWidth tableCellWidth83 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties83.Append(tableCellWidth83);

            Paragraph paragraph105 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties104 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties104 = new ParagraphMarkRunProperties();
            FontSize fontSize203 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript202 = new FontSizeComplexScript() { Val = "24" };
            Languages languages158 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties104.Append(fontSize203);
            paragraphMarkRunProperties104.Append(fontSizeComplexScript202);
            paragraphMarkRunProperties104.Append(languages158);

            paragraphProperties104.Append(paragraphMarkRunProperties104);

            Run run121 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties121 = new RunProperties();
            FontSize fontSize204 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript203 = new FontSizeComplexScript() { Val = "24" };
            Languages languages159 = new Languages() { Val = "ru-RU" };

            runProperties121.Append(fontSize204);
            runProperties121.Append(fontSizeComplexScript203);
            runProperties121.Append(languages159);
            Text text121 = new Text();
            text121.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() + "%" : "";

            run121.Append(runProperties121);
            run121.Append(text121);

            paragraph105.Append(paragraphProperties104);
            paragraph105.Append(run121);

            tableCell83.Append(tableCellProperties83);
            tableCell83.Append(paragraph105);

            TableCell tableCell84 = new TableCell();

            TableCellProperties tableCellProperties84 = new TableCellProperties();
            TableCellWidth tableCellWidth84 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties84.Append(tableCellWidth84);

            Paragraph paragraph106 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties105 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties105 = new ParagraphMarkRunProperties();
            FontSize fontSize206 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript205 = new FontSizeComplexScript() { Val = "24" };
            Languages languages161 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties105.Append(fontSize206);
            paragraphMarkRunProperties105.Append(fontSizeComplexScript205);
            paragraphMarkRunProperties105.Append(languages161);

            paragraphProperties105.Append(paragraphMarkRunProperties105);

            Run run123 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties123 = new RunProperties();
            FontSize fontSize207 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript206 = new FontSizeComplexScript() { Val = "24" };
            Languages languages162 = new Languages() { Val = "ru-RU" };

            runProperties123.Append(fontSize207);
            runProperties123.Append(fontSizeComplexScript206);
            runProperties123.Append(languages162);
            Text text123 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text123.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run123.Append(runProperties123);
            run123.Append(text123);

            paragraph106.Append(paragraphProperties105);
            paragraph106.Append(run123);

            tableCell84.Append(tableCellProperties84);
            tableCell84.Append(paragraph106);

            TableCell tableCell85 = new TableCell();

            TableCellProperties tableCellProperties85 = new TableCellProperties();
            TableCellWidth tableCellWidth85 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties85.Append(tableCellWidth85);

            Paragraph paragraph107 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties106 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties106 = new ParagraphMarkRunProperties();
            FontSize fontSize212 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript211 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties106.Append(fontSize212);
            paragraphMarkRunProperties106.Append(fontSizeComplexScript211);

            paragraphProperties106.Append(paragraphMarkRunProperties106);

            paragraph107.Append(paragraphProperties106);

            tableCell85.Append(tableCellProperties85);
            tableCell85.Append(paragraph107);

            tableRow59.Append(tableCell82);
            tableRow59.Append(tableCell83);
            tableRow59.Append(tableCell84);
            tableRow59.Append(tableCell85);

            TableRow tableRow60 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell86 = new TableCell();

            TableCellProperties tableCellProperties86 = new TableCellProperties();
            TableCellWidth tableCellWidth86 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties86.Append(tableCellWidth86);

            Paragraph paragraph108 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties107 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties107 = new ParagraphMarkRunProperties();
            FontSize fontSize213 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript212 = new FontSizeComplexScript() { Val = "24" };
            Languages languages167 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties107.Append(fontSize213);
            paragraphMarkRunProperties107.Append(fontSizeComplexScript212);
            paragraphMarkRunProperties107.Append(languages167);

            paragraphProperties107.Append(paragraphMarkRunProperties107);

            Run run128 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties128 = new RunProperties();
            FontSize fontSize214 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript213 = new FontSizeComplexScript() { Val = "24" };
            Languages languages168 = new Languages() { Val = "ru-RU" };

            runProperties128.Append(fontSize214);
            runProperties128.Append(fontSizeComplexScript213);
            runProperties128.Append(languages168);
            Text text128 = new Text();
            text128.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run128.Append(runProperties128);
            run128.Append(text128);

            paragraph108.Append(paragraphProperties107);
            paragraph108.Append(run128);

            tableCell86.Append(tableCellProperties86);
            tableCell86.Append(paragraph108);

            TableCell tableCell87 = new TableCell();

            TableCellProperties tableCellProperties87 = new TableCellProperties();
            TableCellWidth tableCellWidth87 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties87.Append(tableCellWidth87);

            Paragraph paragraph109 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties108 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties108 = new ParagraphMarkRunProperties();
            FontSize fontSize215 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript214 = new FontSizeComplexScript() { Val = "24" };
            Languages languages169 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties108.Append(fontSize215);
            paragraphMarkRunProperties108.Append(fontSizeComplexScript214);
            paragraphMarkRunProperties108.Append(languages169);

            paragraphProperties108.Append(paragraphMarkRunProperties108);

            Run run129 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties129 = new RunProperties();
            FontSize fontSize216 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript215 = new FontSizeComplexScript() { Val = "24" };
            Languages languages170 = new Languages() { Val = "ru-RU" };

            runProperties129.Append(fontSize216);
            runProperties129.Append(fontSizeComplexScript215);
            runProperties129.Append(languages170);
            Text text129 = new Text();
            text129.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() + "%" : "";

            run129.Append(runProperties129);
            run129.Append(text129);

            paragraph109.Append(paragraphProperties108);
            paragraph109.Append(run129);

            tableCell87.Append(tableCellProperties87);
            tableCell87.Append(paragraph109);

            TableCell tableCell88 = new TableCell();

            TableCellProperties tableCellProperties88 = new TableCellProperties();
            TableCellWidth tableCellWidth88 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties88.Append(tableCellWidth88);

            Paragraph paragraph110 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties109 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties109 = new ParagraphMarkRunProperties();
            FontSize fontSize219 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript218 = new FontSizeComplexScript() { Val = "24" };
            Languages languages173 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties109.Append(fontSize219);
            paragraphMarkRunProperties109.Append(fontSizeComplexScript218);
            paragraphMarkRunProperties109.Append(languages173);

            paragraphProperties109.Append(paragraphMarkRunProperties109);

            Run run132 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties132 = new RunProperties();
            FontSize fontSize220 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript219 = new FontSizeComplexScript() { Val = "24" };
            Languages languages174 = new Languages() { Val = "ru-RU" };

            runProperties132.Append(fontSize220);
            runProperties132.Append(fontSizeComplexScript219);
            runProperties132.Append(languages174);
            Text text132 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text132.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run132.Append(runProperties132);
            run132.Append(text132);

            paragraph110.Append(paragraphProperties109);
            paragraph110.Append(run132);

            tableCell88.Append(tableCellProperties88);
            tableCell88.Append(paragraph110);

            TableCell tableCell89 = new TableCell();

            TableCellProperties tableCellProperties89 = new TableCellProperties();
            TableCellWidth tableCellWidth89 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties89.Append(tableCellWidth89);

            Paragraph paragraph111 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties110 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties110 = new ParagraphMarkRunProperties();
            FontSize fontSize225 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript224 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties110.Append(fontSize225);
            paragraphMarkRunProperties110.Append(fontSizeComplexScript224);

            paragraphProperties110.Append(paragraphMarkRunProperties110);

            paragraph111.Append(paragraphProperties110);

            tableCell89.Append(tableCellProperties89);
            tableCell89.Append(paragraph111);

            tableRow60.Append(tableCell86);
            tableRow60.Append(tableCell87);
            tableRow60.Append(tableCell88);
            tableRow60.Append(tableCell89);

            TableRow tableRow61 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell90 = new TableCell();

            TableCellProperties tableCellProperties90 = new TableCellProperties();
            TableCellWidth tableCellWidth90 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties90.Append(tableCellWidth90);

            Paragraph paragraph112 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties111 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties111 = new ParagraphMarkRunProperties();
            FontSize fontSize226 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript225 = new FontSizeComplexScript() { Val = "24" };
            Languages languages179 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties111.Append(fontSize226);
            paragraphMarkRunProperties111.Append(fontSizeComplexScript225);
            paragraphMarkRunProperties111.Append(languages179);

            paragraphProperties111.Append(paragraphMarkRunProperties111);

            Run run137 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties137 = new RunProperties();
            FontSize fontSize227 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript226 = new FontSizeComplexScript() { Val = "24" };
            Languages languages180 = new Languages() { Val = "ru-RU" };

            runProperties137.Append(fontSize227);
            runProperties137.Append(fontSizeComplexScript226);
            runProperties137.Append(languages180);
            Text text137 = new Text();
            text137.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run137.Append(runProperties137);
            run137.Append(text137);

            paragraph112.Append(paragraphProperties111);
            paragraph112.Append(run137);

            tableCell90.Append(tableCellProperties90);
            tableCell90.Append(paragraph112);

            TableCell tableCell91 = new TableCell();

            TableCellProperties tableCellProperties91 = new TableCellProperties();
            TableCellWidth tableCellWidth91 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties91.Append(tableCellWidth91);

            Paragraph paragraph113 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003578D5", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties112 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties112 = new ParagraphMarkRunProperties();
            FontSize fontSize228 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript227 = new FontSizeComplexScript() { Val = "24" };
            Languages languages181 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties112.Append(fontSize228);
            paragraphMarkRunProperties112.Append(fontSizeComplexScript227);
            paragraphMarkRunProperties112.Append(languages181);

            paragraphProperties112.Append(paragraphMarkRunProperties112);

            Run run138 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties138 = new RunProperties();
            FontSize fontSize229 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript228 = new FontSizeComplexScript() { Val = "24" };
            Languages languages182 = new Languages() { Val = "ru-RU" };

            runProperties138.Append(fontSize229);
            runProperties138.Append(fontSizeComplexScript228);
            runProperties138.Append(languages182);
            Text text138 = new Text();
            text138.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() + "%" : "";

            run138.Append(runProperties138);
            run138.Append(text138);

            paragraph113.Append(paragraphProperties112);
            paragraph113.Append(run138);

            tableCell91.Append(tableCellProperties91);
            tableCell91.Append(paragraph113);

            TableCell tableCell92 = new TableCell();

            TableCellProperties tableCellProperties92 = new TableCellProperties();
            TableCellWidth tableCellWidth92 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties92.Append(tableCellWidth92);

            Paragraph paragraph114 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties113 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties113 = new ParagraphMarkRunProperties();
            FontSize fontSize232 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript231 = new FontSizeComplexScript() { Val = "24" };
            Languages languages185 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties113.Append(fontSize232);
            paragraphMarkRunProperties113.Append(fontSizeComplexScript231);
            paragraphMarkRunProperties113.Append(languages185);

            paragraphProperties113.Append(paragraphMarkRunProperties113);

            Run run141 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties141 = new RunProperties();
            FontSize fontSize233 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript232 = new FontSizeComplexScript() { Val = "24" };
            Languages languages186 = new Languages() { Val = "ru-RU" };

            runProperties141.Append(fontSize233);
            runProperties141.Append(fontSizeComplexScript232);
            runProperties141.Append(languages186);
            Text text141 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text141.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run141.Append(runProperties141);
            run141.Append(text141);

            paragraph114.Append(paragraphProperties113);
            paragraph114.Append(run141);

            tableCell92.Append(tableCellProperties92);
            tableCell92.Append(paragraph114);

            TableCell tableCell93 = new TableCell();

            TableCellProperties tableCellProperties93 = new TableCellProperties();
            TableCellWidth tableCellWidth93 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties93.Append(tableCellWidth93);

            Paragraph paragraph115 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties114 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties114 = new ParagraphMarkRunProperties();
            FontSize fontSize237 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript236 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties114.Append(fontSize237);
            paragraphMarkRunProperties114.Append(fontSizeComplexScript236);

            paragraphProperties114.Append(paragraphMarkRunProperties114);

            paragraph115.Append(paragraphProperties114);

            tableCell93.Append(tableCellProperties93);
            tableCell93.Append(paragraph115);

            tableRow61.Append(tableCell90);
            tableRow61.Append(tableCell91);
            tableRow61.Append(tableCell92);
            tableRow61.Append(tableCell93);

            TableRow tableRow62 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell94 = new TableCell();

            TableCellProperties tableCellProperties94 = new TableCellProperties();
            TableCellWidth tableCellWidth94 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties94.Append(tableCellWidth94);

            Paragraph paragraph116 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties115 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties115 = new ParagraphMarkRunProperties();
            FontSize fontSize238 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript237 = new FontSizeComplexScript() { Val = "24" };
            Languages languages190 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties115.Append(fontSize238);
            paragraphMarkRunProperties115.Append(fontSizeComplexScript237);
            paragraphMarkRunProperties115.Append(languages190);

            paragraphProperties115.Append(paragraphMarkRunProperties115);

            Run run145 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties145 = new RunProperties();
            FontSize fontSize239 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript238 = new FontSizeComplexScript() { Val = "24" };
            Languages languages191 = new Languages() { Val = "ru-RU" };

            runProperties145.Append(fontSize239);
            runProperties145.Append(fontSizeComplexScript238);
            runProperties145.Append(languages191);
            Text text145 = new Text();
            text145.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run145.Append(runProperties145);
            run145.Append(text145);

            paragraph116.Append(paragraphProperties115);
            paragraph116.Append(run145);

            tableCell94.Append(tableCellProperties94);
            tableCell94.Append(paragraph116);

            TableCell tableCell95 = new TableCell();

            TableCellProperties tableCellProperties95 = new TableCellProperties();
            TableCellWidth tableCellWidth95 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties95.Append(tableCellWidth95);

            Paragraph paragraph117 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "003578D5" };

            ParagraphProperties paragraphProperties116 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties116 = new ParagraphMarkRunProperties();
            FontSize fontSize240 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript239 = new FontSizeComplexScript() { Val = "24" };
            Languages languages192 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties116.Append(fontSize240);
            paragraphMarkRunProperties116.Append(fontSizeComplexScript239);
            paragraphMarkRunProperties116.Append(languages192);

            paragraphProperties116.Append(paragraphMarkRunProperties116);

            Run run146 = new Run();

            RunProperties runProperties146 = new RunProperties();
            FontSize fontSize241 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript240 = new FontSizeComplexScript() { Val = "24" };
            Languages languages193 = new Languages() { Val = "ru-RU" };

            runProperties146.Append(fontSize241);
            runProperties146.Append(fontSizeComplexScript240);
            runProperties146.Append(languages193);
            Text text146 = new Text();
            text146.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() : "";

            run146.Append(runProperties146);
            run146.Append(text146);

            paragraph117.Append(paragraphProperties116);
            paragraph117.Append(run146);

            tableCell95.Append(tableCellProperties95);
            tableCell95.Append(paragraph117);

            TableCell tableCell96 = new TableCell();

            TableCellProperties tableCellProperties96 = new TableCellProperties();
            TableCellWidth tableCellWidth96 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties96.Append(tableCellWidth96);

            Paragraph paragraph118 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties117 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties117 = new ParagraphMarkRunProperties();
            FontSize fontSize243 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript242 = new FontSizeComplexScript() { Val = "24" };
            Languages languages195 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties117.Append(fontSize243);
            paragraphMarkRunProperties117.Append(fontSizeComplexScript242);
            paragraphMarkRunProperties117.Append(languages195);

            paragraphProperties117.Append(paragraphMarkRunProperties117);

            Run run148 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties148 = new RunProperties();
            FontSize fontSize244 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript243 = new FontSizeComplexScript() { Val = "24" };
            Languages languages196 = new Languages() { Val = "ru-RU" };

            runProperties148.Append(fontSize244);
            runProperties148.Append(fontSizeComplexScript243);
            runProperties148.Append(languages196);
            Text text148 = new Text();
            text148.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run148.Append(runProperties148);
            run148.Append(text148);

            paragraph118.Append(paragraphProperties117);
            paragraph118.Append(run148);

            tableCell96.Append(tableCellProperties96);
            tableCell96.Append(paragraph118);

            TableCell tableCell97 = new TableCell();

            TableCellProperties tableCellProperties97 = new TableCellProperties();
            TableCellWidth tableCellWidth97 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties97.Append(tableCellWidth97);

            Paragraph paragraph119 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties118 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties118 = new ParagraphMarkRunProperties();
            FontSize fontSize246 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript245 = new FontSizeComplexScript() { Val = "24" };
            Languages languages198 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties118.Append(fontSize246);
            paragraphMarkRunProperties118.Append(fontSizeComplexScript245);
            paragraphMarkRunProperties118.Append(languages198);

            paragraphProperties118.Append(paragraphMarkRunProperties118);

            paragraph119.Append(paragraphProperties118);

            tableCell97.Append(tableCellProperties97);
            tableCell97.Append(paragraph119);

            tableRow62.Append(tableCell94);
            tableRow62.Append(tableCell95);
            tableRow62.Append(tableCell96);
            tableRow62.Append(tableCell97);

            TableRow tableRow63 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell98 = new TableCell();

            TableCellProperties tableCellProperties98 = new TableCellProperties();
            TableCellWidth tableCellWidth98 = new TableCellWidth() { Width = "3823", Type = TableWidthUnitValues.Dxa };

            tableCellProperties98.Append(tableCellWidth98);

            Paragraph paragraph120 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties119 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties119 = new ParagraphMarkRunProperties();
            FontSize fontSize247 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript246 = new FontSizeComplexScript() { Val = "24" };
            Languages languages199 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties119.Append(fontSize247);
            paragraphMarkRunProperties119.Append(fontSizeComplexScript246);
            paragraphMarkRunProperties119.Append(languages199);

            paragraphProperties119.Append(paragraphMarkRunProperties119);

            Run run150 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties150 = new RunProperties();
            FontSize fontSize248 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript247 = new FontSizeComplexScript() { Val = "24" };
            Languages languages200 = new Languages() { Val = "ru-RU" };

            runProperties150.Append(fontSize248);
            runProperties150.Append(fontSizeComplexScript247);
            runProperties150.Append(languages200);
            Text text150 = new Text();
            text150.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Name : "";

            run150.Append(runProperties150);
            run150.Append(text150);

            paragraph120.Append(paragraphProperties119);
            paragraph120.Append(run150);

            tableCell98.Append(tableCellProperties98);
            tableCell98.Append(paragraph120);

            TableCell tableCell99 = new TableCell();

            TableCellProperties tableCellProperties99 = new TableCellProperties();
            TableCellWidth tableCellWidth99 = new TableCellWidth() { Width = "1984", Type = TableWidthUnitValues.Dxa };

            tableCellProperties99.Append(tableCellWidth99);

            Paragraph paragraph121 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "00C4661E", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties120 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties120 = new ParagraphMarkRunProperties();
            FontSize fontSize249 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript248 = new FontSizeComplexScript() { Val = "24" };
            Languages languages201 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties120.Append(fontSize249);
            paragraphMarkRunProperties120.Append(fontSizeComplexScript248);
            paragraphMarkRunProperties120.Append(languages201);

            paragraphProperties120.Append(paragraphMarkRunProperties120);

            Run run151 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties151 = new RunProperties();
            FontSize fontSize250 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript249 = new FontSizeComplexScript() { Val = "24" };
            Languages languages202 = new Languages() { Val = "ru-RU" };

            runProperties151.Append(fontSize250);
            runProperties151.Append(fontSizeComplexScript249);
            runProperties151.Append(languages202);
            Text text151 = new Text();
            text151.Text = pgs.Count != 0 && index < pgs.Count ? pgs[index].Percentage.ToString() : "";

            run151.Append(runProperties151);
            run151.Append(text151);

            paragraph121.Append(paragraphProperties120);
            paragraph121.Append(run151);

            tableCell99.Append(tableCellProperties99);
            tableCell99.Append(paragraph121);

            TableCell tableCell100 = new TableCell();

            TableCellProperties tableCellProperties100 = new TableCellProperties();
            TableCellWidth tableCellWidth100 = new TableCellWidth() { Width = "2268", Type = TableWidthUnitValues.Dxa };

            tableCellProperties100.Append(tableCellWidth100);

            Paragraph paragraph122 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties121 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties121 = new ParagraphMarkRunProperties();
            FontSize fontSize252 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript251 = new FontSizeComplexScript() { Val = "24" };
            Languages languages204 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties121.Append(fontSize252);
            paragraphMarkRunProperties121.Append(fontSizeComplexScript251);
            paragraphMarkRunProperties121.Append(languages204);

            paragraphProperties121.Append(paragraphMarkRunProperties121);

            Run run153 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties153 = new RunProperties();
            FontSize fontSize253 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript252 = new FontSizeComplexScript() { Val = "24" };
            Languages languages205 = new Languages() { Val = "ru-RU" };

            runProperties153.Append(fontSize253);
            runProperties153.Append(fontSizeComplexScript252);
            runProperties153.Append(languages205);
            Text text153 = new Text();
            text153.Text = pgs.Count != 0 && index < pgs.Count ? "до " + pgs[index++].Date.ToString("dd.MM.yyyy") : "";

            run153.Append(runProperties153);
            run153.Append(text153);

            paragraph122.Append(paragraphProperties121);
            paragraph122.Append(run153);

            tableCell100.Append(tableCellProperties100);
            tableCell100.Append(paragraph122);

            TableCell tableCell101 = new TableCell();

            TableCellProperties tableCellProperties101 = new TableCellProperties();
            TableCellWidth tableCellWidth101 = new TableCellWidth() { Width = "2693", Type = TableWidthUnitValues.Dxa };

            tableCellProperties101.Append(tableCellWidth101);

            Paragraph paragraph123 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "00E918CA", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "00E918CA" };

            ParagraphProperties paragraphProperties122 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties122 = new ParagraphMarkRunProperties();
            FontSize fontSize257 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript256 = new FontSizeComplexScript() { Val = "24" };
            Languages languages209 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties122.Append(fontSize257);
            paragraphMarkRunProperties122.Append(fontSizeComplexScript256);
            paragraphMarkRunProperties122.Append(languages209);

            paragraphProperties122.Append(paragraphMarkRunProperties122);

            paragraph123.Append(paragraphProperties122);

            tableCell101.Append(tableCellProperties101);
            tableCell101.Append(paragraph123);

            tableRow63.Append(tableCell98);
            tableRow63.Append(tableCell99);
            tableRow63.Append(tableCell100);
            tableRow63.Append(tableCell101);

            table6.Append(tableProperties6);
            table6.Append(tableGrid6);
            table6.Append(tableRow57);
            table6.Append(tableRow58);
            table6.Append(tableRow59);
            table6.Append(tableRow60);
            table6.Append(tableRow61);
            table6.Append(tableRow62);
            table6.Append(tableRow63);

            Paragraph paragraph124 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties123 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties123 = new ParagraphMarkRunProperties();
            FontSize fontSize258 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript257 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties123.Append(fontSize258);
            paragraphMarkRunProperties123.Append(fontSizeComplexScript257);

            paragraphProperties123.Append(paragraphMarkRunProperties123);

            paragraph124.Append(paragraphProperties123);

            tableCell73.Append(tableCellProperties73);
            tableCell73.Append(paragraph87);
            tableCell73.Append(paragraph88);
            tableCell73.Append(table6);
            tableCell73.Append(paragraph124);

            tableRow56.Append(tablePropertyExceptions16);
            tableRow56.Append(tableRowProperties55);
            tableRow56.Append(tableCell73);

            TableRow tableRow64 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TableRowProperties tableRowProperties56 = new TableRowProperties();
            TableRowHeight tableRowHeight53 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties56.Append(tableRowHeight53);

            TableCell tableCell102 = new TableCell();

            TableCellProperties tableCellProperties102 = new TableCellProperties();
            TableCellWidth tableCellWidth102 = new TableCellWidth() { Width = "1313", Type = TableWidthUnitValues.Pct };
            Shading shading37 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment55 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties102.Append(tableCellWidth102);
            tableCellProperties102.Append(shading37);
            tableCellProperties102.Append(tableCellVerticalAlignment55);

            Paragraph paragraph125 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties124 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties124 = new ParagraphMarkRunProperties();
            FontSize fontSize259 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript258 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties124.Append(fontSize259);
            paragraphMarkRunProperties124.Append(fontSizeComplexScript258);

            paragraphProperties124.Append(paragraphMarkRunProperties124);

            Run run157 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties157 = new RunProperties();
            FontSize fontSize260 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript259 = new FontSizeComplexScript() { Val = "24" };

            runProperties157.Append(fontSize260);
            runProperties157.Append(fontSizeComplexScript259);
            Text text157 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text157.Text = "7. ";

            run157.Append(runProperties157);
            run157.Append(text157);
            ProofError proofError69 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run158 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties158 = new RunProperties();
            FontSize fontSize261 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript260 = new FontSizeComplexScript() { Val = "24" };

            runProperties158.Append(fontSize261);
            runProperties158.Append(fontSizeComplexScript260);
            Text text158 = new Text();
            text158.Text = "Дата";

            run158.Append(runProperties158);
            run158.Append(text158);
            ProofError proofError70 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run159 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties159 = new RunProperties();
            FontSize fontSize262 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript261 = new FontSizeComplexScript() { Val = "24" };

            runProperties159.Append(fontSize262);
            runProperties159.Append(fontSizeComplexScript261);
            Text text159 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text159.Text = " ";

            run159.Append(runProperties159);
            run159.Append(text159);
            ProofError proofError71 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run160 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties160 = new RunProperties();
            FontSize fontSize263 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript262 = new FontSizeComplexScript() { Val = "24" };

            runProperties160.Append(fontSize263);
            runProperties160.Append(fontSizeComplexScript262);
            Text text160 = new Text();
            text160.Text = "выдачи";

            run160.Append(runProperties160);
            run160.Append(text160);
            ProofError proofError72 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run161 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties161 = new RunProperties();
            FontSize fontSize264 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript263 = new FontSizeComplexScript() { Val = "24" };

            runProperties161.Append(fontSize264);
            runProperties161.Append(fontSizeComplexScript263);
            Text text161 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text161.Text = " ";

            run161.Append(runProperties161);
            run161.Append(text161);
            ProofError proofError73 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run162 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties162 = new RunProperties();
            FontSize fontSize265 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript264 = new FontSizeComplexScript() { Val = "24" };

            runProperties162.Append(fontSize265);
            runProperties162.Append(fontSizeComplexScript264);
            Text text162 = new Text();
            text162.Text = "задания";

            run162.Append(runProperties162);
            run162.Append(text162);
            ProofError proofError74 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph125.Append(paragraphProperties124);
            paragraph125.Append(run157);
            paragraph125.Append(proofError69);
            paragraph125.Append(run158);
            paragraph125.Append(proofError70);
            paragraph125.Append(run159);
            paragraph125.Append(proofError71);
            paragraph125.Append(run160);
            paragraph125.Append(proofError72);
            paragraph125.Append(run161);
            paragraph125.Append(proofError73);
            paragraph125.Append(run162);
            paragraph125.Append(proofError74);

            tableCell102.Append(tableCellProperties102);
            tableCell102.Append(paragraph125);

            TableCell tableCell103 = new TableCell();

            TableCellProperties tableCellProperties103 = new TableCellProperties();
            TableCellWidth tableCellWidth103 = new TableCellWidth() { Width = "3571", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan46 = new GridSpan() { Val = 6 };

            TableCellBorders tableCellBorders70 = new TableCellBorders();
            BottomBorder bottomBorder87 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders70.Append(bottomBorder87);
            Shading shading38 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment56 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties103.Append(tableCellWidth103);
            tableCellProperties103.Append(gridSpan46);
            tableCellProperties103.Append(tableCellBorders70);
            tableCellProperties103.Append(shading38);
            tableCellProperties103.Append(tableCellVerticalAlignment56);

            Paragraph paragraph126 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "00C4661E" };

            ParagraphProperties paragraphProperties125 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties125 = new ParagraphMarkRunProperties();
            FontSize fontSize266 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript265 = new FontSizeComplexScript() { Val = "24" };
            Languages languages210 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties125.Append(fontSize266);
            paragraphMarkRunProperties125.Append(fontSizeComplexScript265);
            paragraphMarkRunProperties125.Append(languages210);

            paragraphProperties125.Append(paragraphMarkRunProperties125);

            Run run163 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties163 = new RunProperties();
            FontSize fontSize267 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript266 = new FontSizeComplexScript() { Val = "24" };
            Languages languages211 = new Languages() { Val = "ru-RU" };

            runProperties163.Append(fontSize267);
            runProperties163.Append(fontSizeComplexScript266);
            runProperties163.Append(languages211);
            Text text163 = new Text();
            text163.Text = dateStart ?? "";

            run163.Append(runProperties163);
            run163.Append(text163);

            paragraph126.Append(paragraphProperties125);
            paragraph126.Append(run163);

            tableCell103.Append(tableCellProperties103);
            tableCell103.Append(paragraph126);

            TableCell tableCell104 = new TableCell();

            TableCellProperties tableCellProperties104 = new TableCellProperties();
            TableCellWidth tableCellWidth104 = new TableCellWidth() { Width = "117", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan47 = new GridSpan() { Val = 2 };
            Shading shading39 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment57 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties104.Append(tableCellWidth104);
            tableCellProperties104.Append(gridSpan47);
            tableCellProperties104.Append(shading39);
            tableCellProperties104.Append(tableCellVerticalAlignment57);

            Paragraph paragraph127 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties126 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties126 = new ParagraphMarkRunProperties();
            FontSize fontSize273 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript272 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties126.Append(fontSize273);
            paragraphMarkRunProperties126.Append(fontSizeComplexScript272);

            paragraphProperties126.Append(paragraphMarkRunProperties126);

            paragraph127.Append(paragraphProperties126);

            tableCell104.Append(tableCellProperties104);
            tableCell104.Append(paragraph127);

            tableRow64.Append(tableRowProperties56);
            tableRow64.Append(tableCell102);
            tableRow64.Append(tableCell103);
            tableRow64.Append(tableCell104);

            TableRow tableRow65 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "00F16160" };

            TablePropertyExceptions tablePropertyExceptions17 = new TablePropertyExceptions();

            TableBorders tableBorders21 = new TableBorders();
            TopBorder topBorder83 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder74 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder88 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder74 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder21 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder21 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders21.Append(topBorder83);
            tableBorders21.Append(leftBorder74);
            tableBorders21.Append(bottomBorder88);
            tableBorders21.Append(rightBorder74);
            tableBorders21.Append(insideHorizontalBorder21);
            tableBorders21.Append(insideVerticalBorder21);

            tablePropertyExceptions17.Append(tableBorders21);

            TableRowProperties tableRowProperties57 = new TableRowProperties();
            TableRowHeight tableRowHeight54 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties57.Append(tableRowHeight54);

            TableCell tableCell105 = new TableCell();

            TableCellProperties tableCellProperties105 = new TableCellProperties();
            TableCellWidth tableCellWidth105 = new TableCellWidth() { Width = "2575", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan48 = new GridSpan() { Val = 3 };

            TableCellBorders tableCellBorders71 = new TableCellBorders();
            TopBorder topBorder84 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder75 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder89 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder75 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders71.Append(topBorder84);
            tableCellBorders71.Append(leftBorder75);
            tableCellBorders71.Append(bottomBorder89);
            tableCellBorders71.Append(rightBorder75);
            Shading shading40 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment58 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties105.Append(tableCellWidth105);
            tableCellProperties105.Append(gridSpan48);
            tableCellProperties105.Append(tableCellBorders71);
            tableCellProperties105.Append(shading40);
            tableCellProperties105.Append(tableCellVerticalAlignment58);

            Paragraph paragraph128 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties127 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties127 = new ParagraphMarkRunProperties();
            FontSize fontSize274 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript273 = new FontSizeComplexScript() { Val = "24" };
            Languages languages217 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties127.Append(fontSize274);
            paragraphMarkRunProperties127.Append(fontSizeComplexScript273);
            paragraphMarkRunProperties127.Append(languages217);

            paragraphProperties127.Append(paragraphMarkRunProperties127);

            Run run169 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties169 = new RunProperties();
            FontSize fontSize275 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript274 = new FontSizeComplexScript() { Val = "24" };
            Languages languages218 = new Languages() { Val = "ru-RU" };

            runProperties169.Append(fontSize275);
            runProperties169.Append(fontSizeComplexScript274);
            runProperties169.Append(languages218);
            Text text169 = new Text();
            text169.Text = "8. Срок сдачи законченного дипломного проекта";

            run169.Append(runProperties169);
            run169.Append(text169);

            paragraph128.Append(paragraphProperties127);
            paragraph128.Append(run169);

            tableCell105.Append(tableCellProperties105);
            tableCell105.Append(paragraph128);

            TableCell tableCell106 = new TableCell();

            TableCellProperties tableCellProperties106 = new TableCellProperties();
            TableCellWidth tableCellWidth106 = new TableCellWidth() { Width = "2309", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan49 = new GridSpan() { Val = 4 };

            TableCellBorders tableCellBorders72 = new TableCellBorders();
            TopBorder topBorder85 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder76 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder90 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder76 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders72.Append(topBorder85);
            tableCellBorders72.Append(leftBorder76);
            tableCellBorders72.Append(bottomBorder90);
            tableCellBorders72.Append(rightBorder76);
            Shading shading41 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment59 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties106.Append(tableCellWidth106);
            tableCellProperties106.Append(gridSpan49);
            tableCellProperties106.Append(tableCellBorders72);
            tableCellProperties106.Append(shading41);
            tableCellProperties106.Append(tableCellVerticalAlignment59);

            Paragraph paragraph129 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "006007E7", RsidRunAdditionDefault = "006007E7" };

            ParagraphProperties paragraphProperties128 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties128 = new ParagraphMarkRunProperties();
            FontSize fontSize276 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript275 = new FontSizeComplexScript() { Val = "24" };
            Languages languages219 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties128.Append(fontSize276);
            paragraphMarkRunProperties128.Append(fontSizeComplexScript275);
            paragraphMarkRunProperties128.Append(languages219);

            paragraphProperties128.Append(paragraphMarkRunProperties128);

            Run run170 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties170 = new RunProperties();
            FontSize fontSize277 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript276 = new FontSizeComplexScript() { Val = "24" };
            Languages languages220 = new Languages() { Val = "ru-RU" };

            runProperties170.Append(fontSize277);
            runProperties170.Append(fontSizeComplexScript276);
            runProperties170.Append(languages220);
            Text text170 = new Text();
            text170.Text = dateEnd ?? "";

            run170.Append(runProperties170);
            run170.Append(text170);

            paragraph129.Append(paragraphProperties128);
            paragraph129.Append(run170);

            tableCell106.Append(tableCellProperties106);
            tableCell106.Append(paragraph129);

            TableCell tableCell107 = new TableCell();

            TableCellProperties tableCellProperties107 = new TableCellProperties();
            TableCellWidth tableCellWidth107 = new TableCellWidth() { Width = "117", Type = TableWidthUnitValues.Pct };
            GridSpan gridSpan50 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders73 = new TableCellBorders();
            TopBorder topBorder86 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder77 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder91 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder77 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders73.Append(topBorder86);
            tableCellBorders73.Append(leftBorder77);
            tableCellBorders73.Append(bottomBorder91);
            tableCellBorders73.Append(rightBorder77);
            Shading shading42 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment60 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties107.Append(tableCellWidth107);
            tableCellProperties107.Append(gridSpan50);
            tableCellProperties107.Append(tableCellBorders73);
            tableCellProperties107.Append(shading42);
            tableCellProperties107.Append(tableCellVerticalAlignment60);

            Paragraph paragraph130 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties129 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties129 = new ParagraphMarkRunProperties();
            FontSize fontSize280 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript279 = new FontSizeComplexScript() { Val = "24" };
            Languages languages223 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties129.Append(fontSize280);
            paragraphMarkRunProperties129.Append(fontSizeComplexScript279);
            paragraphMarkRunProperties129.Append(languages223);

            paragraphProperties129.Append(paragraphMarkRunProperties129);

            paragraph130.Append(paragraphProperties129);

            tableCell107.Append(tableCellProperties107);
            tableCell107.Append(paragraph130);

            tableRow65.Append(tablePropertyExceptions17);
            tableRow65.Append(tableRowProperties57);
            tableRow65.Append(tableCell105);
            tableRow65.Append(tableCell106);
            tableRow65.Append(tableCell107);

            table3.Append(tableProperties3);
            table3.Append(tableGrid3);
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
            table3.Append(tableRow33);
            table3.Append(tableRow34);
            table3.Append(tableRow35);
            table3.Append(tableRow36);
            table3.Append(tableRow37);
            table3.Append(tableRow38);
            table3.Append(tableRow39);
            table3.Append(tableRow40);
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
            table3.Append(tableRow64);
            table3.Append(tableRow65);

            Paragraph paragraph131 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties130 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties130 = new ParagraphMarkRunProperties();
            FontSize fontSize281 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript280 = new FontSizeComplexScript() { Val = "24" };
            Languages languages224 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties130.Append(fontSize281);
            paragraphMarkRunProperties130.Append(fontSizeComplexScript280);
            paragraphMarkRunProperties130.Append(languages224);

            paragraphProperties130.Append(paragraphMarkRunProperties130);

            paragraph131.Append(paragraphProperties130);

            Table table7 = new Table();

            TableProperties tableProperties7 = new TableProperties();
            TableWidth tableWidth7 = new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto };
            TableLook tableLook7 = new TableLook() { Val = "01E0" };

            tableProperties7.Append(tableWidth7);
            tableProperties7.Append(tableLook7);

            TableGrid tableGrid7 = new TableGrid();
            GridColumn gridColumn30 = new GridColumn() { Width = "1951" };
            GridColumn gridColumn31 = new GridColumn() { Width = "2552" };
            GridColumn gridColumn32 = new GridColumn() { Width = "1005" };
            GridColumn gridColumn33 = new GridColumn() { Width = "3060" };

            tableGrid7.Append(gridColumn30);
            tableGrid7.Append(gridColumn31);
            tableGrid7.Append(gridColumn32);
            tableGrid7.Append(gridColumn33);

            TableRow tableRow66 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell108 = new TableCell();

            TableCellProperties tableCellProperties108 = new TableCellProperties();
            TableCellWidth tableCellWidth108 = new TableCellWidth() { Width = "1951", Type = TableWidthUnitValues.Dxa };
            Shading shading43 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties108.Append(tableCellWidth108);
            tableCellProperties108.Append(shading43);

            Paragraph paragraph132 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties131 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties131 = new ParagraphMarkRunProperties();
            FontSize fontSize282 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript281 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties131.Append(fontSize282);
            paragraphMarkRunProperties131.Append(fontSizeComplexScript281);

            paragraphProperties131.Append(paragraphMarkRunProperties131);
            ProofError proofError75 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run173 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties173 = new RunProperties();
            FontSize fontSize283 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript282 = new FontSizeComplexScript() { Val = "24" };

            runProperties173.Append(fontSize283);
            runProperties173.Append(fontSizeComplexScript282);
            Text text173 = new Text();
            text173.Text = "Руководитель";

            run173.Append(runProperties173);
            run173.Append(text173);
            ProofError proofError76 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph132.Append(paragraphProperties131);
            paragraph132.Append(proofError75);
            paragraph132.Append(run173);
            paragraph132.Append(proofError76);

            tableCell108.Append(tableCellProperties108);
            tableCell108.Append(paragraph132);

            TableCell tableCell109 = new TableCell();

            TableCellProperties tableCellProperties109 = new TableCellProperties();
            TableCellWidth tableCellWidth109 = new TableCellWidth() { Width = "2552", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders74 = new TableCellBorders();
            BottomBorder bottomBorder92 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders74.Append(bottomBorder92);
            Shading shading44 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties109.Append(tableCellWidth109);
            tableCellProperties109.Append(tableCellBorders74);
            tableCellProperties109.Append(shading44);

            Paragraph paragraph133 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties132 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties132 = new ParagraphMarkRunProperties();
            Bold bold31 = new Bold();
            FontSize fontSize284 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript283 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties132.Append(bold31);
            paragraphMarkRunProperties132.Append(fontSize284);
            paragraphMarkRunProperties132.Append(fontSizeComplexScript283);

            paragraphProperties132.Append(paragraphMarkRunProperties132);

            paragraph133.Append(paragraphProperties132);

            tableCell109.Append(tableCellProperties109);
            tableCell109.Append(paragraph133);

            TableCell tableCell110 = new TableCell();

            TableCellProperties tableCellProperties110 = new TableCellProperties();
            TableCellWidth tableCellWidth110 = new TableCellWidth() { Width = "1005", Type = TableWidthUnitValues.Dxa };
            Shading shading45 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties110.Append(tableCellWidth110);
            tableCellProperties110.Append(shading45);

            Paragraph paragraph134 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties133 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties133 = new ParagraphMarkRunProperties();
            Bold bold32 = new Bold();
            FontSize fontSize285 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript284 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties133.Append(bold32);
            paragraphMarkRunProperties133.Append(fontSize285);
            paragraphMarkRunProperties133.Append(fontSizeComplexScript284);

            paragraphProperties133.Append(paragraphMarkRunProperties133);

            paragraph134.Append(paragraphProperties133);

            tableCell110.Append(tableCellProperties110);
            tableCell110.Append(paragraph134);

            TableCell tableCell111 = new TableCell();

            TableCellProperties tableCellProperties111 = new TableCellProperties();
            TableCellWidth tableCellWidth111 = new TableCellWidth() { Width = "3060", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders75 = new TableCellBorders();
            BottomBorder bottomBorder93 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders75.Append(bottomBorder93);
            Shading shading46 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties111.Append(tableCellWidth111);
            tableCellProperties111.Append(tableCellBorders75);
            tableCellProperties111.Append(shading46);

            Paragraph paragraph135 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003578D5" };

            ParagraphProperties paragraphProperties134 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties134 = new ParagraphMarkRunProperties();
            FontSize fontSize286 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript285 = new FontSizeComplexScript() { Val = "24" };
            Languages languages225 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties134.Append(fontSize286);
            paragraphMarkRunProperties134.Append(fontSizeComplexScript285);
            paragraphMarkRunProperties134.Append(languages225);

            paragraphProperties134.Append(paragraphMarkRunProperties134);

            Run run174 = new Run();

            RunProperties runProperties174 = new RunProperties();
            FontSize fontSize287 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript286 = new FontSizeComplexScript() { Val = "24" };
            Languages languages226 = new Languages() { Val = "ru-RU" };

            runProperties174.Append(fontSize287);
            runProperties174.Append(fontSizeComplexScript286);
            runProperties174.Append(languages226);
            Text text174 = new Text();
            text174.Text = lecturer;

            run174.Append(runProperties174);
            run174.Append(text174);

            paragraph135.Append(paragraphProperties134);
            paragraph135.Append(run174);

            tableCell111.Append(tableCellProperties111);
            tableCell111.Append(paragraph135);

            tableRow66.Append(tableCell108);
            tableRow66.Append(tableCell109);
            tableRow66.Append(tableCell110);
            tableRow66.Append(tableCell111);

            TableRow tableRow67 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003A20E4", RsidTableRowProperties = "003A20E4" };

            TableCell tableCell112 = new TableCell();

            TableCellProperties tableCellProperties112 = new TableCellProperties();
            TableCellWidth tableCellWidth112 = new TableCellWidth() { Width = "1951", Type = TableWidthUnitValues.Dxa };
            Shading shading47 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties112.Append(tableCellWidth112);
            tableCellProperties112.Append(shading47);
            Paragraph paragraph136 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            tableCell112.Append(tableCellProperties112);
            tableCell112.Append(paragraph136);

            TableCell tableCell113 = new TableCell();

            TableCellProperties tableCellProperties113 = new TableCellProperties();
            TableCellWidth tableCellWidth113 = new TableCellWidth() { Width = "2552", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders76 = new TableCellBorders();
            TopBorder topBorder87 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders76.Append(topBorder87);
            Shading shading48 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties113.Append(tableCellWidth113);
            tableCellProperties113.Append(tableCellBorders76);
            tableCellProperties113.Append(shading48);

            Paragraph paragraph137 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties135 = new ParagraphProperties();
            Justification justification37 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties135 = new ParagraphMarkRunProperties();
            FontSize fontSize288 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript287 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties135.Append(fontSize288);
            paragraphMarkRunProperties135.Append(fontSizeComplexScript287);

            paragraphProperties135.Append(justification37);
            paragraphProperties135.Append(paragraphMarkRunProperties135);

            Run run175 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties175 = new RunProperties();
            FontSize fontSize289 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript288 = new FontSizeComplexScript() { Val = "16" };

            runProperties175.Append(fontSize289);
            runProperties175.Append(fontSizeComplexScript288);
            Text text175 = new Text();
            text175.Text = "(";

            run175.Append(runProperties175);
            run175.Append(text175);
            ProofError proofError77 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run176 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties176 = new RunProperties();
            FontSize fontSize290 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript289 = new FontSizeComplexScript() { Val = "16" };

            runProperties176.Append(fontSize290);
            runProperties176.Append(fontSizeComplexScript289);
            Text text176 = new Text();
            text176.Text = "подпись";

            run176.Append(runProperties176);
            run176.Append(text176);
            ProofError proofError78 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run177 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties177 = new RunProperties();
            FontSize fontSize291 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript290 = new FontSizeComplexScript() { Val = "16" };

            runProperties177.Append(fontSize291);
            runProperties177.Append(fontSizeComplexScript290);
            Text text177 = new Text();
            text177.Text = ")";

            run177.Append(runProperties177);
            run177.Append(text177);

            paragraph137.Append(paragraphProperties135);
            paragraph137.Append(run175);
            paragraph137.Append(proofError77);
            paragraph137.Append(run176);
            paragraph137.Append(proofError78);
            paragraph137.Append(run177);

            tableCell113.Append(tableCellProperties113);
            tableCell113.Append(paragraph137);

            TableCell tableCell114 = new TableCell();

            TableCellProperties tableCellProperties114 = new TableCellProperties();
            TableCellWidth tableCellWidth114 = new TableCellWidth() { Width = "1005", Type = TableWidthUnitValues.Dxa };
            Shading shading49 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties114.Append(tableCellWidth114);
            tableCellProperties114.Append(shading49);

            Paragraph paragraph138 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties136 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties136 = new ParagraphMarkRunProperties();
            Bold bold33 = new Bold();
            FontSize fontSize292 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript291 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties136.Append(bold33);
            paragraphMarkRunProperties136.Append(fontSize292);
            paragraphMarkRunProperties136.Append(fontSizeComplexScript291);

            paragraphProperties136.Append(paragraphMarkRunProperties136);

            paragraph138.Append(paragraphProperties136);

            tableCell114.Append(tableCellProperties114);
            tableCell114.Append(paragraph138);

            TableCell tableCell115 = new TableCell();

            TableCellProperties tableCellProperties115 = new TableCellProperties();
            TableCellWidth tableCellWidth115 = new TableCellWidth() { Width = "3060", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders77 = new TableCellBorders();
            TopBorder topBorder88 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableCellBorders77.Append(topBorder88);
            Shading shading50 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties115.Append(tableCellWidth115);
            tableCellProperties115.Append(tableCellBorders77);
            tableCellProperties115.Append(shading50);

            Paragraph paragraph139 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties137 = new ParagraphProperties();
            Justification justification38 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties137 = new ParagraphMarkRunProperties();
            FontSize fontSize293 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript292 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties137.Append(fontSize293);
            paragraphMarkRunProperties137.Append(fontSizeComplexScript292);

            paragraphProperties137.Append(justification38);
            paragraphProperties137.Append(paragraphMarkRunProperties137);

            Run run178 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties178 = new RunProperties();
            FontSize fontSize294 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript293 = new FontSizeComplexScript() { Val = "16" };

            runProperties178.Append(fontSize294);
            runProperties178.Append(fontSizeComplexScript293);
            Text text178 = new Text();
            text178.Text = "(";

            run178.Append(runProperties178);
            run178.Append(text178);
            ProofError proofError79 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run179 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties179 = new RunProperties();
            FontSize fontSize295 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript294 = new FontSizeComplexScript() { Val = "16" };

            runProperties179.Append(fontSize295);
            runProperties179.Append(fontSizeComplexScript294);
            Text text179 = new Text();
            text179.Text = "инициалы";

            run179.Append(runProperties179);
            run179.Append(text179);
            ProofError proofError80 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run180 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties180 = new RunProperties();
            FontSize fontSize296 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript295 = new FontSizeComplexScript() { Val = "16" };

            runProperties180.Append(fontSize296);
            runProperties180.Append(fontSizeComplexScript295);
            Text text180 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text180.Text = ", ";

            run180.Append(runProperties180);
            run180.Append(text180);
            ProofError proofError81 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run181 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties181 = new RunProperties();
            FontSize fontSize297 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript296 = new FontSizeComplexScript() { Val = "16" };

            runProperties181.Append(fontSize297);
            runProperties181.Append(fontSizeComplexScript296);
            Text text181 = new Text();
            text181.Text = "фамилия";

            run181.Append(runProperties181);
            run181.Append(text181);
            ProofError proofError82 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run182 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties182 = new RunProperties();
            FontSize fontSize298 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript297 = new FontSizeComplexScript() { Val = "16" };

            runProperties182.Append(fontSize298);
            runProperties182.Append(fontSizeComplexScript297);
            Text text182 = new Text();
            text182.Text = ")";

            run182.Append(runProperties182);
            run182.Append(text182);

            paragraph139.Append(paragraphProperties137);
            paragraph139.Append(run178);
            paragraph139.Append(proofError79);
            paragraph139.Append(run179);
            paragraph139.Append(proofError80);
            paragraph139.Append(run180);
            paragraph139.Append(proofError81);
            paragraph139.Append(run181);
            paragraph139.Append(proofError82);
            paragraph139.Append(run182);

            tableCell115.Append(tableCellProperties115);
            tableCell115.Append(paragraph139);

            tableRow67.Append(tableCell112);
            tableRow67.Append(tableCell113);
            tableRow67.Append(tableCell114);
            tableRow67.Append(tableCell115);

            table7.Append(tableProperties7);
            table7.Append(tableGrid7);
            table7.Append(tableRow66);
            table7.Append(tableRow67);
            Paragraph paragraph140 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            Table table8 = new Table();

            TableProperties tableProperties8 = new TableProperties();
            TableWidth tableWidth8 = new TableWidth() { Width = "0", Type = TableWidthUnitValues.Auto };

            TableBorders tableBorders22 = new TableBorders();
            TopBorder topBorder89 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder78 = new LeftBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder94 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder78 = new RightBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideHorizontalBorder insideHorizontalBorder22 = new InsideHorizontalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            InsideVerticalBorder insideVerticalBorder22 = new InsideVerticalBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };

            tableBorders22.Append(topBorder89);
            tableBorders22.Append(leftBorder78);
            tableBorders22.Append(bottomBorder94);
            tableBorders22.Append(rightBorder78);
            tableBorders22.Append(insideHorizontalBorder22);
            tableBorders22.Append(insideVerticalBorder22);
            TableLook tableLook8 = new TableLook() { Val = "01E0" };

            tableProperties8.Append(tableWidth8);
            tableProperties8.Append(tableBorders22);
            tableProperties8.Append(tableLook8);

            TableGrid tableGrid8 = new TableGrid();
            GridColumn gridColumn34 = new GridColumn() { Width = "1242" };
            GridColumn gridColumn35 = new GridColumn() { Width = "1418" };
            GridColumn gridColumn36 = new GridColumn() { Width = "1843" };
            GridColumn gridColumn37 = new GridColumn() { Width = "283" };
            GridColumn gridColumn38 = new GridColumn() { Width = "722" };
            GridColumn gridColumn39 = new GridColumn() { Width = "3060" };

            tableGrid8.Append(gridColumn34);
            tableGrid8.Append(gridColumn35);
            tableGrid8.Append(gridColumn36);
            tableGrid8.Append(gridColumn37);
            tableGrid8.Append(gridColumn38);
            tableGrid8.Append(gridColumn39);

            TableRow tableRow68 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties58 = new TableRowProperties();
            TableRowHeight tableRowHeight55 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties58.Append(tableRowHeight55);

            TableCell tableCell116 = new TableCell();

            TableCellProperties tableCellProperties116 = new TableCellProperties();
            TableCellWidth tableCellWidth116 = new TableCellWidth() { Width = "2660", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan51 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders78 = new TableCellBorders();
            TopBorder topBorder90 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder79 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder95 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder79 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders78.Append(topBorder90);
            tableCellBorders78.Append(leftBorder79);
            tableCellBorders78.Append(bottomBorder95);
            tableCellBorders78.Append(rightBorder79);
            Shading shading51 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment61 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties116.Append(tableCellWidth116);
            tableCellProperties116.Append(gridSpan51);
            tableCellProperties116.Append(tableCellBorders78);
            tableCellProperties116.Append(shading51);
            tableCellProperties116.Append(tableCellVerticalAlignment61);

            Paragraph paragraph141 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties138 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties138 = new ParagraphMarkRunProperties();
            FontSize fontSize299 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript298 = new FontSizeComplexScript() { Val = "24" };
            Languages languages227 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties138.Append(fontSize299);
            paragraphMarkRunProperties138.Append(fontSizeComplexScript298);
            paragraphMarkRunProperties138.Append(languages227);

            paragraphProperties138.Append(paragraphMarkRunProperties138);

            Run run183 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties183 = new RunProperties();
            FontSize fontSize300 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript299 = new FontSizeComplexScript() { Val = "24" };
            Languages languages228 = new Languages() { Val = "ru-RU" };

            runProperties183.Append(fontSize300);
            runProperties183.Append(fontSizeComplexScript299);
            runProperties183.Append(languages228);
            Text text183 = new Text();
            text183.Text = "Подпись обучающегося";

            run183.Append(runProperties183);
            run183.Append(text183);

            paragraph141.Append(paragraphProperties138);
            paragraph141.Append(run183);

            tableCell116.Append(tableCellProperties116);
            tableCell116.Append(paragraph141);

            TableCell tableCell117 = new TableCell();

            TableCellProperties tableCellProperties117 = new TableCellProperties();
            TableCellWidth tableCellWidth117 = new TableCellWidth() { Width = "2126", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan52 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders79 = new TableCellBorders();
            TopBorder topBorder91 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder80 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder96 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder80 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders79.Append(topBorder91);
            tableCellBorders79.Append(leftBorder80);
            tableCellBorders79.Append(bottomBorder96);
            tableCellBorders79.Append(rightBorder80);
            Shading shading52 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment62 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties117.Append(tableCellWidth117);
            tableCellProperties117.Append(gridSpan52);
            tableCellProperties117.Append(tableCellBorders79);
            tableCellProperties117.Append(shading52);
            tableCellProperties117.Append(tableCellVerticalAlignment62);

            Paragraph paragraph142 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties139 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties139 = new ParagraphMarkRunProperties();
            FontSize fontSize301 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript300 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties139.Append(fontSize301);
            paragraphMarkRunProperties139.Append(fontSizeComplexScript300);

            paragraphProperties139.Append(paragraphMarkRunProperties139);

            paragraph142.Append(paragraphProperties139);

            tableCell117.Append(tableCellProperties117);
            tableCell117.Append(paragraph142);

            TableCell tableCell118 = new TableCell();

            TableCellProperties tableCellProperties118 = new TableCellProperties();
            TableCellWidth tableCellWidth118 = new TableCellWidth() { Width = "722", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders80 = new TableCellBorders();
            TopBorder topBorder92 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder81 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder97 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder81 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders80.Append(topBorder92);
            tableCellBorders80.Append(leftBorder81);
            tableCellBorders80.Append(bottomBorder97);
            tableCellBorders80.Append(rightBorder81);
            Shading shading53 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment63 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties118.Append(tableCellWidth118);
            tableCellProperties118.Append(tableCellBorders80);
            tableCellProperties118.Append(shading53);
            tableCellProperties118.Append(tableCellVerticalAlignment63);

            Paragraph paragraph143 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties140 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties140 = new ParagraphMarkRunProperties();
            FontSize fontSize302 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript301 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties140.Append(fontSize302);
            paragraphMarkRunProperties140.Append(fontSizeComplexScript301);

            paragraphProperties140.Append(paragraphMarkRunProperties140);

            paragraph143.Append(paragraphProperties140);

            tableCell118.Append(tableCellProperties118);
            tableCell118.Append(paragraph143);

            TableCell tableCell119 = new TableCell();

            TableCellProperties tableCellProperties119 = new TableCellProperties();
            TableCellWidth tableCellWidth119 = new TableCellWidth() { Width = "3060", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders81 = new TableCellBorders();
            TopBorder topBorder93 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder82 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder98 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder82 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders81.Append(topBorder93);
            tableCellBorders81.Append(leftBorder82);
            tableCellBorders81.Append(bottomBorder98);
            tableCellBorders81.Append(rightBorder82);
            Shading shading54 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment64 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties119.Append(tableCellWidth119);
            tableCellProperties119.Append(tableCellBorders81);
            tableCellProperties119.Append(shading54);
            tableCellProperties119.Append(tableCellVerticalAlignment64);

            Paragraph paragraph144 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003578D5" };

            ParagraphProperties paragraphProperties141 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties141 = new ParagraphMarkRunProperties();
            FontSize fontSize303 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript302 = new FontSizeComplexScript() { Val = "24" };
            Languages languages229 = new Languages() { Val = "ru-RU" };

            paragraphMarkRunProperties141.Append(fontSize303);
            paragraphMarkRunProperties141.Append(fontSizeComplexScript302);
            paragraphMarkRunProperties141.Append(languages229);

            paragraphProperties141.Append(paragraphMarkRunProperties141);

            Run run184 = new Run();

            RunProperties runProperties184 = new RunProperties();
            FontSize fontSize304 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript303 = new FontSizeComplexScript() { Val = "24" };
            Languages languages230 = new Languages() { Val = "ru-RU" };

            runProperties184.Append(fontSize304);
            runProperties184.Append(fontSizeComplexScript303);
            runProperties184.Append(languages230);
            Text text184 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text184.Text = student;

            run184.Append(runProperties184);
            run184.Append(text184);
            ProofError proofError83 = new ProofError() { Type = ProofingErrorValues.SpellStart };
            ProofError proofError84 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph144.Append(paragraphProperties141);
            paragraph144.Append(run184);
            paragraph144.Append(proofError83);
            paragraph144.Append(proofError84);

            tableCell119.Append(tableCellProperties119);
            tableCell119.Append(paragraph144);

            tableRow68.Append(tableRowProperties58);
            tableRow68.Append(tableCell116);
            tableRow68.Append(tableCell117);
            tableRow68.Append(tableCell118);
            tableRow68.Append(tableCell119);

            TableRow tableRow69 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003578D5", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties59 = new TableRowProperties();
            TableRowHeight tableRowHeight56 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties59.Append(tableRowHeight56);

            TableCell tableCell120 = new TableCell();

            TableCellProperties tableCellProperties120 = new TableCellProperties();
            TableCellWidth tableCellWidth120 = new TableCellWidth() { Width = "2660", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan53 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders82 = new TableCellBorders();
            TopBorder topBorder94 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder83 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder99 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder83 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders82.Append(topBorder94);
            tableCellBorders82.Append(leftBorder83);
            tableCellBorders82.Append(bottomBorder99);
            tableCellBorders82.Append(rightBorder83);
            Shading shading55 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment65 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties120.Append(tableCellWidth120);
            tableCellProperties120.Append(gridSpan53);
            tableCellProperties120.Append(tableCellBorders82);
            tableCellProperties120.Append(shading55);
            tableCellProperties120.Append(tableCellVerticalAlignment65);
            Paragraph paragraph145 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            tableCell120.Append(tableCellProperties120);
            tableCell120.Append(paragraph145);

            TableCell tableCell121 = new TableCell();

            TableCellProperties tableCellProperties121 = new TableCellProperties();
            TableCellWidth tableCellWidth121 = new TableCellWidth() { Width = "2126", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan54 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders83 = new TableCellBorders();
            TopBorder topBorder95 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder84 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder100 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder84 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders83.Append(topBorder95);
            tableCellBorders83.Append(leftBorder84);
            tableCellBorders83.Append(bottomBorder100);
            tableCellBorders83.Append(rightBorder84);
            Shading shading56 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties121.Append(tableCellWidth121);
            tableCellProperties121.Append(gridSpan54);
            tableCellProperties121.Append(tableCellBorders83);
            tableCellProperties121.Append(shading56);

            Paragraph paragraph146 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties142 = new ParagraphProperties();
            Justification justification39 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties142 = new ParagraphMarkRunProperties();
            FontSize fontSize306 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript305 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties142.Append(fontSize306);
            paragraphMarkRunProperties142.Append(fontSizeComplexScript305);

            paragraphProperties142.Append(justification39);
            paragraphProperties142.Append(paragraphMarkRunProperties142);

            Run run186 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties186 = new RunProperties();
            FontSize fontSize307 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript306 = new FontSizeComplexScript() { Val = "16" };

            runProperties186.Append(fontSize307);
            runProperties186.Append(fontSizeComplexScript306);
            Text text186 = new Text();
            text186.Text = "(";

            run186.Append(runProperties186);
            run186.Append(text186);
            ProofError proofError85 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run187 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties187 = new RunProperties();
            FontSize fontSize308 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript307 = new FontSizeComplexScript() { Val = "16" };

            runProperties187.Append(fontSize308);
            runProperties187.Append(fontSizeComplexScript307);
            Text text187 = new Text();
            text187.Text = "подпись";

            run187.Append(runProperties187);
            run187.Append(text187);
            ProofError proofError86 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run188 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties188 = new RunProperties();
            FontSize fontSize309 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript308 = new FontSizeComplexScript() { Val = "16" };

            runProperties188.Append(fontSize309);
            runProperties188.Append(fontSizeComplexScript308);
            Text text188 = new Text();
            text188.Text = ")";

            run188.Append(runProperties188);
            run188.Append(text188);

            paragraph146.Append(paragraphProperties142);
            paragraph146.Append(run186);
            paragraph146.Append(proofError85);
            paragraph146.Append(run187);
            paragraph146.Append(proofError86);
            paragraph146.Append(run188);

            tableCell121.Append(tableCellProperties121);
            tableCell121.Append(paragraph146);

            TableCell tableCell122 = new TableCell();

            TableCellProperties tableCellProperties122 = new TableCellProperties();
            TableCellWidth tableCellWidth122 = new TableCellWidth() { Width = "722", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders84 = new TableCellBorders();
            TopBorder topBorder96 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder85 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder101 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder85 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders84.Append(topBorder96);
            tableCellBorders84.Append(leftBorder85);
            tableCellBorders84.Append(bottomBorder101);
            tableCellBorders84.Append(rightBorder85);
            Shading shading57 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties122.Append(tableCellWidth122);
            tableCellProperties122.Append(tableCellBorders84);
            tableCellProperties122.Append(shading57);

            Paragraph paragraph147 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties143 = new ParagraphProperties();
            Justification justification40 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties143 = new ParagraphMarkRunProperties();
            FontSize fontSize310 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript309 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties143.Append(fontSize310);
            paragraphMarkRunProperties143.Append(fontSizeComplexScript309);

            paragraphProperties143.Append(justification40);
            paragraphProperties143.Append(paragraphMarkRunProperties143);

            paragraph147.Append(paragraphProperties143);

            tableCell122.Append(tableCellProperties122);
            tableCell122.Append(paragraph147);

            TableCell tableCell123 = new TableCell();

            TableCellProperties tableCellProperties123 = new TableCellProperties();
            TableCellWidth tableCellWidth123 = new TableCellWidth() { Width = "3060", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders85 = new TableCellBorders();
            TopBorder topBorder97 = new TopBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            LeftBorder leftBorder86 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder102 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder86 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders85.Append(topBorder97);
            tableCellBorders85.Append(leftBorder86);
            tableCellBorders85.Append(bottomBorder102);
            tableCellBorders85.Append(rightBorder86);
            Shading shading58 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };

            tableCellProperties123.Append(tableCellWidth123);
            tableCellProperties123.Append(tableCellBorders85);
            tableCellProperties123.Append(shading58);

            Paragraph paragraph148 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties144 = new ParagraphProperties();
            Justification justification41 = new Justification() { Val = JustificationValues.Center };

            ParagraphMarkRunProperties paragraphMarkRunProperties144 = new ParagraphMarkRunProperties();
            FontSize fontSize311 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript310 = new FontSizeComplexScript() { Val = "16" };

            paragraphMarkRunProperties144.Append(fontSize311);
            paragraphMarkRunProperties144.Append(fontSizeComplexScript310);

            paragraphProperties144.Append(justification41);
            paragraphProperties144.Append(paragraphMarkRunProperties144);

            Run run189 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties189 = new RunProperties();
            FontSize fontSize312 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript311 = new FontSizeComplexScript() { Val = "16" };

            runProperties189.Append(fontSize312);
            runProperties189.Append(fontSizeComplexScript311);
            Text text189 = new Text();
            text189.Text = "(";

            run189.Append(runProperties189);
            run189.Append(text189);
            ProofError proofError87 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run190 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties190 = new RunProperties();
            FontSize fontSize313 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript312 = new FontSizeComplexScript() { Val = "16" };

            runProperties190.Append(fontSize313);
            runProperties190.Append(fontSizeComplexScript312);
            Text text190 = new Text();
            text190.Text = "инициалы";

            run190.Append(runProperties190);
            run190.Append(text190);
            ProofError proofError88 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run191 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties191 = new RunProperties();
            FontSize fontSize314 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript313 = new FontSizeComplexScript() { Val = "16" };

            runProperties191.Append(fontSize314);
            runProperties191.Append(fontSizeComplexScript313);
            Text text191 = new Text() { Space = SpaceProcessingModeValues.Preserve };
            text191.Text = ", ";

            run191.Append(runProperties191);
            run191.Append(text191);
            ProofError proofError89 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run192 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties192 = new RunProperties();
            FontSize fontSize315 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript314 = new FontSizeComplexScript() { Val = "16" };

            runProperties192.Append(fontSize315);
            runProperties192.Append(fontSizeComplexScript314);
            Text text192 = new Text();
            text192.Text = "фамилия";

            run192.Append(runProperties192);
            run192.Append(text192);
            ProofError proofError90 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            Run run193 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties193 = new RunProperties();
            FontSize fontSize316 = new FontSize() { Val = "16" };
            FontSizeComplexScript fontSizeComplexScript315 = new FontSizeComplexScript() { Val = "16" };

            runProperties193.Append(fontSize316);
            runProperties193.Append(fontSizeComplexScript315);
            Text text193 = new Text();
            text193.Text = ")";

            run193.Append(runProperties193);
            run193.Append(text193);

            paragraph148.Append(paragraphProperties144);
            paragraph148.Append(run189);
            paragraph148.Append(proofError87);
            paragraph148.Append(run190);
            paragraph148.Append(proofError88);
            paragraph148.Append(run191);
            paragraph148.Append(proofError89);
            paragraph148.Append(run192);
            paragraph148.Append(proofError90);
            paragraph148.Append(run193);

            tableCell123.Append(tableCellProperties123);
            tableCell123.Append(paragraph148);

            tableRow69.Append(tableRowProperties59);
            tableRow69.Append(tableCell120);
            tableRow69.Append(tableCell121);
            tableRow69.Append(tableCell122);
            tableRow69.Append(tableCell123);

            TableRow tableRow70 = new TableRow() { RsidTableRowMarkRevision = "003578D5", RsidTableRowAddition = "003A20E4", RsidTableRowProperties = "003A20E4" };

            TableRowProperties tableRowProperties60 = new TableRowProperties();
            TableRowHeight tableRowHeight57 = new TableRowHeight() { Val = (UInt32Value)351U };

            tableRowProperties60.Append(tableRowHeight57);

            TableCell tableCell124 = new TableCell();

            TableCellProperties tableCellProperties124 = new TableCellProperties();
            TableCellWidth tableCellWidth124 = new TableCellWidth() { Width = "1242", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders86 = new TableCellBorders();
            TopBorder topBorder98 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder87 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder103 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder87 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders86.Append(topBorder98);
            tableCellBorders86.Append(leftBorder87);
            tableCellBorders86.Append(bottomBorder103);
            tableCellBorders86.Append(rightBorder87);
            Shading shading59 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment66 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties124.Append(tableCellWidth124);
            tableCellProperties124.Append(tableCellBorders86);
            tableCellProperties124.Append(shading59);
            tableCellProperties124.Append(tableCellVerticalAlignment66);

            Paragraph paragraph149 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties145 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties145 = new ParagraphMarkRunProperties();
            FontSize fontSize317 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript316 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties145.Append(fontSize317);
            paragraphMarkRunProperties145.Append(fontSizeComplexScript316);

            paragraphProperties145.Append(paragraphMarkRunProperties145);
            ProofError proofError91 = new ProofError() { Type = ProofingErrorValues.SpellStart };

            Run run194 = new Run() { RsidRunProperties = "003578D5" };

            RunProperties runProperties194 = new RunProperties();
            FontSize fontSize318 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript317 = new FontSizeComplexScript() { Val = "24" };

            runProperties194.Append(fontSize318);
            runProperties194.Append(fontSizeComplexScript317);
            Text text194 = new Text();
            text194.Text = "Дата";

            run194.Append(runProperties194);
            run194.Append(text194);
            ProofError proofError92 = new ProofError() { Type = ProofingErrorValues.SpellEnd };

            paragraph149.Append(paragraphProperties145);
            paragraph149.Append(proofError91);
            paragraph149.Append(run194);
            paragraph149.Append(proofError92);

            tableCell124.Append(tableCellProperties124);
            tableCell124.Append(paragraph149);

            TableCell tableCell125 = new TableCell();

            TableCellProperties tableCellProperties125 = new TableCellProperties();
            TableCellWidth tableCellWidth125 = new TableCellWidth() { Width = "3261", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan55 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders87 = new TableCellBorders();
            TopBorder topBorder99 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder88 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder104 = new BottomBorder() { Val = BorderValues.Single, Color = "auto", Size = (UInt32Value)4U, Space = (UInt32Value)0U };
            RightBorder rightBorder88 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders87.Append(topBorder99);
            tableCellBorders87.Append(leftBorder88);
            tableCellBorders87.Append(bottomBorder104);
            tableCellBorders87.Append(rightBorder88);
            Shading shading60 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment67 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties125.Append(tableCellWidth125);
            tableCellProperties125.Append(gridSpan55);
            tableCellProperties125.Append(tableCellBorders87);
            tableCellProperties125.Append(shading60);
            tableCellProperties125.Append(tableCellVerticalAlignment67);

            Paragraph paragraph150 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties146 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties146 = new ParagraphMarkRunProperties();
            FontSize fontSize319 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript318 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties146.Append(fontSize319);
            paragraphMarkRunProperties146.Append(fontSizeComplexScript318);

            paragraphProperties146.Append(paragraphMarkRunProperties146);

            paragraph150.Append(paragraphProperties146);

            tableCell125.Append(tableCellProperties125);
            tableCell125.Append(paragraph150);

            TableCell tableCell126 = new TableCell();

            TableCellProperties tableCellProperties126 = new TableCellProperties();
            TableCellWidth tableCellWidth126 = new TableCellWidth() { Width = "1005", Type = TableWidthUnitValues.Dxa };
            GridSpan gridSpan56 = new GridSpan() { Val = 2 };

            TableCellBorders tableCellBorders88 = new TableCellBorders();
            TopBorder topBorder100 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder89 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder105 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder89 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders88.Append(topBorder100);
            tableCellBorders88.Append(leftBorder89);
            tableCellBorders88.Append(bottomBorder105);
            tableCellBorders88.Append(rightBorder89);
            Shading shading61 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment68 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties126.Append(tableCellWidth126);
            tableCellProperties126.Append(gridSpan56);
            tableCellProperties126.Append(tableCellBorders88);
            tableCellProperties126.Append(shading61);
            tableCellProperties126.Append(tableCellVerticalAlignment68);

            Paragraph paragraph151 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties147 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties147 = new ParagraphMarkRunProperties();
            FontSize fontSize320 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript319 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties147.Append(fontSize320);
            paragraphMarkRunProperties147.Append(fontSizeComplexScript319);

            paragraphProperties147.Append(paragraphMarkRunProperties147);

            paragraph151.Append(paragraphProperties147);

            tableCell126.Append(tableCellProperties126);
            tableCell126.Append(paragraph151);

            TableCell tableCell127 = new TableCell();

            TableCellProperties tableCellProperties127 = new TableCellProperties();
            TableCellWidth tableCellWidth127 = new TableCellWidth() { Width = "3060", Type = TableWidthUnitValues.Dxa };

            TableCellBorders tableCellBorders89 = new TableCellBorders();
            TopBorder topBorder101 = new TopBorder() { Val = BorderValues.Nil };
            LeftBorder leftBorder90 = new LeftBorder() { Val = BorderValues.Nil };
            BottomBorder bottomBorder106 = new BottomBorder() { Val = BorderValues.Nil };
            RightBorder rightBorder90 = new RightBorder() { Val = BorderValues.Nil };

            tableCellBorders89.Append(topBorder101);
            tableCellBorders89.Append(leftBorder90);
            tableCellBorders89.Append(bottomBorder106);
            tableCellBorders89.Append(rightBorder90);
            Shading shading62 = new Shading() { Val = ShadingPatternValues.Clear, Color = "auto", Fill = "auto" };
            TableCellVerticalAlignment tableCellVerticalAlignment69 = new TableCellVerticalAlignment() { Val = TableVerticalAlignmentValues.Bottom };

            tableCellProperties127.Append(tableCellWidth127);
            tableCellProperties127.Append(tableCellBorders89);
            tableCellProperties127.Append(shading62);
            tableCellProperties127.Append(tableCellVerticalAlignment69);

            Paragraph paragraph152 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "003A20E4", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "003A20E4" };

            ParagraphProperties paragraphProperties148 = new ParagraphProperties();

            ParagraphMarkRunProperties paragraphMarkRunProperties148 = new ParagraphMarkRunProperties();
            FontSize fontSize321 = new FontSize() { Val = "24" };
            FontSizeComplexScript fontSizeComplexScript320 = new FontSizeComplexScript() { Val = "24" };

            paragraphMarkRunProperties148.Append(fontSize321);
            paragraphMarkRunProperties148.Append(fontSizeComplexScript320);

            paragraphProperties148.Append(paragraphMarkRunProperties148);

            paragraph152.Append(paragraphProperties148);

            tableCell127.Append(tableCellProperties127);
            tableCell127.Append(paragraph152);

            tableRow70.Append(tableRowProperties60);
            tableRow70.Append(tableCell124);
            tableRow70.Append(tableCell125);
            tableRow70.Append(tableCell126);
            tableRow70.Append(tableCell127);

            table8.Append(tableProperties8);
            table8.Append(tableGrid8);
            table8.Append(tableRow68);
            table8.Append(tableRow69);
            table8.Append(tableRow70);

            Paragraph paragraph153 = new Paragraph() { RsidParagraphMarkRevision = "003578D5", RsidParagraphAddition = "0025029E", RsidParagraphProperties = "003A20E4", RsidRunAdditionDefault = "0025029E" };

            ParagraphProperties paragraphProperties149 = new ParagraphProperties();
            Indentation indentation2 = new Indentation() { Start = "-709", End = "-850" };

            paragraphProperties149.Append(indentation2);

            paragraph153.Append(paragraphProperties149);

            SectionProperties sectionProperties1 = new SectionProperties() { RsidRPr = "003578D5", RsidR = "0025029E", RsidSect = "003A20E4" };
            PageSize pageSize1 = new PageSize() { Width = (UInt32Value)11906U, Height = (UInt32Value)16838U };
            PageMargin pageMargin1 = new PageMargin() { Top = 720, Right = (UInt32Value)720U, Bottom = 720, Left = (UInt32Value)720U, Header = (UInt32Value)708U, Footer = (UInt32Value)708U, Gutter = (UInt32Value)0U };
            Columns columns1 = new Columns() { Space = "708" };
            DocGrid docGrid1 = new DocGrid() { LinePitch = 360 };

            sectionProperties1.Append(pageSize1);
            sectionProperties1.Append(pageMargin1);
            sectionProperties1.Append(columns1);
            sectionProperties1.Append(docGrid1);

            body1.Append(paragraph1);
            body1.Append(paragraph2);
            body1.Append(paragraph3);
            body1.Append(table1);
            body1.Append(paragraph21);
            body1.Append(paragraph22);
            body1.Append(paragraph23);
            body1.Append(paragraph24);
            body1.Append(paragraph25);
            body1.Append(paragraph26);
            body1.Append(paragraph27);
            body1.Append(paragraph28);
            body1.Append(paragraph29);
            body1.Append(table2);
            body1.Append(paragraph33);
            body1.Append(table3);
            body1.Append(paragraph131);
            body1.Append(table7);
            body1.Append(paragraph140);
            body1.Append(table8);
            body1.Append(paragraph153);
            body1.Append(sectionProperties1);

            document1.Append(body1);

            mainDocumentPart1.Document = document1;
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
            A.RgbColorModelHex rgbColorModelHex1 = new A.RgbColorModelHex() { Val = "1F497D" };

            dark2Color1.Append(rgbColorModelHex1);

            A.Light2Color light2Color1 = new A.Light2Color();
            A.RgbColorModelHex rgbColorModelHex2 = new A.RgbColorModelHex() { Val = "EEECE1" };

            light2Color1.Append(rgbColorModelHex2);

            A.Accent1Color accent1Color1 = new A.Accent1Color();
            A.RgbColorModelHex rgbColorModelHex3 = new A.RgbColorModelHex() { Val = "4F81BD" };

            accent1Color1.Append(rgbColorModelHex3);

            A.Accent2Color accent2Color1 = new A.Accent2Color();
            A.RgbColorModelHex rgbColorModelHex4 = new A.RgbColorModelHex() { Val = "C0504D" };

            accent2Color1.Append(rgbColorModelHex4);

            A.Accent3Color accent3Color1 = new A.Accent3Color();
            A.RgbColorModelHex rgbColorModelHex5 = new A.RgbColorModelHex() { Val = "9BBB59" };

            accent3Color1.Append(rgbColorModelHex5);

            A.Accent4Color accent4Color1 = new A.Accent4Color();
            A.RgbColorModelHex rgbColorModelHex6 = new A.RgbColorModelHex() { Val = "8064A2" };

            accent4Color1.Append(rgbColorModelHex6);

            A.Accent5Color accent5Color1 = new A.Accent5Color();
            A.RgbColorModelHex rgbColorModelHex7 = new A.RgbColorModelHex() { Val = "4BACC6" };

            accent5Color1.Append(rgbColorModelHex7);

            A.Accent6Color accent6Color1 = new A.Accent6Color();
            A.RgbColorModelHex rgbColorModelHex8 = new A.RgbColorModelHex() { Val = "F79646" };

            accent6Color1.Append(rgbColorModelHex8);

            A.Hyperlink hyperlink1 = new A.Hyperlink();
            A.RgbColorModelHex rgbColorModelHex9 = new A.RgbColorModelHex() { Val = "0000FF" };

            hyperlink1.Append(rgbColorModelHex9);

            A.FollowedHyperlinkColor followedHyperlinkColor1 = new A.FollowedHyperlinkColor();
            A.RgbColorModelHex rgbColorModelHex10 = new A.RgbColorModelHex() { Val = "800080" };

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
            A.LatinFont latinFont1 = new A.LatinFont() { Typeface = "Cambria" };
            A.EastAsianFont eastAsianFont1 = new A.EastAsianFont() { Typeface = "" };
            A.ComplexScriptFont complexScriptFont1 = new A.ComplexScriptFont() { Typeface = "" };
            A.SupplementalFont supplementalFont1 = new A.SupplementalFont() { Script = "Jpan", Typeface = "ＭＳ ゴシック" };
            A.SupplementalFont supplementalFont2 = new A.SupplementalFont() { Script = "Hang", Typeface = "맑은 고딕" };
            A.SupplementalFont supplementalFont3 = new A.SupplementalFont() { Script = "Hans", Typeface = "宋体" };
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
            A.LatinFont latinFont2 = new A.LatinFont() { Typeface = "Calibri" };
            A.EastAsianFont eastAsianFont2 = new A.EastAsianFont() { Typeface = "" };
            A.ComplexScriptFont complexScriptFont2 = new A.ComplexScriptFont() { Typeface = "" };
            A.SupplementalFont supplementalFont31 = new A.SupplementalFont() { Script = "Jpan", Typeface = "ＭＳ 明朝" };
            A.SupplementalFont supplementalFont32 = new A.SupplementalFont() { Script = "Hang", Typeface = "맑은 고딕" };
            A.SupplementalFont supplementalFont33 = new A.SupplementalFont() { Script = "Hans", Typeface = "宋体" };
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
            A.Tint tint1 = new A.Tint() { Val = 50000 };
            A.SaturationModulation saturationModulation1 = new A.SaturationModulation() { Val = 300000 };

            schemeColor2.Append(tint1);
            schemeColor2.Append(saturationModulation1);

            gradientStop1.Append(schemeColor2);

            A.GradientStop gradientStop2 = new A.GradientStop() { Position = 35000 };

            A.SchemeColor schemeColor3 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint2 = new A.Tint() { Val = 37000 };
            A.SaturationModulation saturationModulation2 = new A.SaturationModulation() { Val = 300000 };

            schemeColor3.Append(tint2);
            schemeColor3.Append(saturationModulation2);

            gradientStop2.Append(schemeColor3);

            A.GradientStop gradientStop3 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor4 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint3 = new A.Tint() { Val = 15000 };
            A.SaturationModulation saturationModulation3 = new A.SaturationModulation() { Val = 350000 };

            schemeColor4.Append(tint3);
            schemeColor4.Append(saturationModulation3);

            gradientStop3.Append(schemeColor4);

            gradientStopList1.Append(gradientStop1);
            gradientStopList1.Append(gradientStop2);
            gradientStopList1.Append(gradientStop3);
            A.LinearGradientFill linearGradientFill1 = new A.LinearGradientFill() { Angle = 16200000, Scaled = true };

            gradientFill1.Append(gradientStopList1);
            gradientFill1.Append(linearGradientFill1);

            A.GradientFill gradientFill2 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList2 = new A.GradientStopList();

            A.GradientStop gradientStop4 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor5 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade1 = new A.Shade() { Val = 51000 };
            A.SaturationModulation saturationModulation4 = new A.SaturationModulation() { Val = 130000 };

            schemeColor5.Append(shade1);
            schemeColor5.Append(saturationModulation4);

            gradientStop4.Append(schemeColor5);

            A.GradientStop gradientStop5 = new A.GradientStop() { Position = 80000 };

            A.SchemeColor schemeColor6 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade2 = new A.Shade() { Val = 93000 };
            A.SaturationModulation saturationModulation5 = new A.SaturationModulation() { Val = 130000 };

            schemeColor6.Append(shade2);
            schemeColor6.Append(saturationModulation5);

            gradientStop5.Append(schemeColor6);

            A.GradientStop gradientStop6 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor7 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade3 = new A.Shade() { Val = 94000 };
            A.SaturationModulation saturationModulation6 = new A.SaturationModulation() { Val = 135000 };

            schemeColor7.Append(shade3);
            schemeColor7.Append(saturationModulation6);

            gradientStop6.Append(schemeColor7);

            gradientStopList2.Append(gradientStop4);
            gradientStopList2.Append(gradientStop5);
            gradientStopList2.Append(gradientStop6);
            A.LinearGradientFill linearGradientFill2 = new A.LinearGradientFill() { Angle = 16200000, Scaled = false };

            gradientFill2.Append(gradientStopList2);
            gradientFill2.Append(linearGradientFill2);

            fillStyleList1.Append(solidFill1);
            fillStyleList1.Append(gradientFill1);
            fillStyleList1.Append(gradientFill2);

            A.LineStyleList lineStyleList1 = new A.LineStyleList();

            A.Outline outline1 = new A.Outline() { Width = 9525, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill2 = new A.SolidFill();

            A.SchemeColor schemeColor8 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade4 = new A.Shade() { Val = 95000 };
            A.SaturationModulation saturationModulation7 = new A.SaturationModulation() { Val = 105000 };

            schemeColor8.Append(shade4);
            schemeColor8.Append(saturationModulation7);

            solidFill2.Append(schemeColor8);
            A.PresetDash presetDash1 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };

            outline1.Append(solidFill2);
            outline1.Append(presetDash1);

            A.Outline outline2 = new A.Outline() { Width = 25400, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill3 = new A.SolidFill();
            A.SchemeColor schemeColor9 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill3.Append(schemeColor9);
            A.PresetDash presetDash2 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };

            outline2.Append(solidFill3);
            outline2.Append(presetDash2);

            A.Outline outline3 = new A.Outline() { Width = 38100, CapType = A.LineCapValues.Flat, CompoundLineType = A.CompoundLineValues.Single, Alignment = A.PenAlignmentValues.Center };

            A.SolidFill solidFill4 = new A.SolidFill();
            A.SchemeColor schemeColor10 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill4.Append(schemeColor10);
            A.PresetDash presetDash3 = new A.PresetDash() { Val = A.PresetLineDashValues.Solid };

            outline3.Append(solidFill4);
            outline3.Append(presetDash3);

            lineStyleList1.Append(outline1);
            lineStyleList1.Append(outline2);
            lineStyleList1.Append(outline3);

            A.EffectStyleList effectStyleList1 = new A.EffectStyleList();

            A.EffectStyle effectStyle1 = new A.EffectStyle();

            A.EffectList effectList1 = new A.EffectList();

            A.OuterShadow outerShadow1 = new A.OuterShadow() { BlurRadius = 40000L, Distance = 20000L, Direction = 5400000, RotateWithShape = false };

            A.RgbColorModelHex rgbColorModelHex11 = new A.RgbColorModelHex() { Val = "000000" };
            A.Alpha alpha1 = new A.Alpha() { Val = 38000 };

            rgbColorModelHex11.Append(alpha1);

            outerShadow1.Append(rgbColorModelHex11);

            effectList1.Append(outerShadow1);

            effectStyle1.Append(effectList1);

            A.EffectStyle effectStyle2 = new A.EffectStyle();

            A.EffectList effectList2 = new A.EffectList();

            A.OuterShadow outerShadow2 = new A.OuterShadow() { BlurRadius = 40000L, Distance = 23000L, Direction = 5400000, RotateWithShape = false };

            A.RgbColorModelHex rgbColorModelHex12 = new A.RgbColorModelHex() { Val = "000000" };
            A.Alpha alpha2 = new A.Alpha() { Val = 35000 };

            rgbColorModelHex12.Append(alpha2);

            outerShadow2.Append(rgbColorModelHex12);

            effectList2.Append(outerShadow2);

            effectStyle2.Append(effectList2);

            A.EffectStyle effectStyle3 = new A.EffectStyle();

            A.EffectList effectList3 = new A.EffectList();

            A.OuterShadow outerShadow3 = new A.OuterShadow() { BlurRadius = 40000L, Distance = 23000L, Direction = 5400000, RotateWithShape = false };

            A.RgbColorModelHex rgbColorModelHex13 = new A.RgbColorModelHex() { Val = "000000" };
            A.Alpha alpha3 = new A.Alpha() { Val = 35000 };

            rgbColorModelHex13.Append(alpha3);

            outerShadow3.Append(rgbColorModelHex13);

            effectList3.Append(outerShadow3);

            A.Scene3DType scene3DType1 = new A.Scene3DType();

            A.Camera camera1 = new A.Camera() { Preset = A.PresetCameraValues.OrthographicFront };
            A.Rotation rotation1 = new A.Rotation() { Latitude = 0, Longitude = 0, Revolution = 0 };

            camera1.Append(rotation1);

            A.LightRig lightRig1 = new A.LightRig() { Rig = A.LightRigValues.ThreePoints, Direction = A.LightRigDirectionValues.Top };
            A.Rotation rotation2 = new A.Rotation() { Latitude = 0, Longitude = 0, Revolution = 1200000 };

            lightRig1.Append(rotation2);

            scene3DType1.Append(camera1);
            scene3DType1.Append(lightRig1);

            A.Shape3DType shape3DType1 = new A.Shape3DType();
            A.BevelTop bevelTop1 = new A.BevelTop() { Width = 63500L, Height = 25400L };

            shape3DType1.Append(bevelTop1);

            effectStyle3.Append(effectList3);
            effectStyle3.Append(scene3DType1);
            effectStyle3.Append(shape3DType1);

            effectStyleList1.Append(effectStyle1);
            effectStyleList1.Append(effectStyle2);
            effectStyleList1.Append(effectStyle3);

            A.BackgroundFillStyleList backgroundFillStyleList1 = new A.BackgroundFillStyleList();

            A.SolidFill solidFill5 = new A.SolidFill();
            A.SchemeColor schemeColor11 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };

            solidFill5.Append(schemeColor11);

            A.GradientFill gradientFill3 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList3 = new A.GradientStopList();

            A.GradientStop gradientStop7 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor12 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint4 = new A.Tint() { Val = 40000 };
            A.SaturationModulation saturationModulation8 = new A.SaturationModulation() { Val = 350000 };

            schemeColor12.Append(tint4);
            schemeColor12.Append(saturationModulation8);

            gradientStop7.Append(schemeColor12);

            A.GradientStop gradientStop8 = new A.GradientStop() { Position = 40000 };

            A.SchemeColor schemeColor13 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint5 = new A.Tint() { Val = 45000 };
            A.Shade shade5 = new A.Shade() { Val = 99000 };
            A.SaturationModulation saturationModulation9 = new A.SaturationModulation() { Val = 350000 };

            schemeColor13.Append(tint5);
            schemeColor13.Append(shade5);
            schemeColor13.Append(saturationModulation9);

            gradientStop8.Append(schemeColor13);

            A.GradientStop gradientStop9 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor14 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade6 = new A.Shade() { Val = 20000 };
            A.SaturationModulation saturationModulation10 = new A.SaturationModulation() { Val = 255000 };

            schemeColor14.Append(shade6);
            schemeColor14.Append(saturationModulation10);

            gradientStop9.Append(schemeColor14);

            gradientStopList3.Append(gradientStop7);
            gradientStopList3.Append(gradientStop8);
            gradientStopList3.Append(gradientStop9);

            A.PathGradientFill pathGradientFill1 = new A.PathGradientFill() { Path = A.PathShadeValues.Circle };
            A.FillToRectangle fillToRectangle1 = new A.FillToRectangle() { Left = 50000, Top = -80000, Right = 50000, Bottom = 180000 };

            pathGradientFill1.Append(fillToRectangle1);

            gradientFill3.Append(gradientStopList3);
            gradientFill3.Append(pathGradientFill1);

            A.GradientFill gradientFill4 = new A.GradientFill() { RotateWithShape = true };

            A.GradientStopList gradientStopList4 = new A.GradientStopList();

            A.GradientStop gradientStop10 = new A.GradientStop() { Position = 0 };

            A.SchemeColor schemeColor15 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Tint tint6 = new A.Tint() { Val = 80000 };
            A.SaturationModulation saturationModulation11 = new A.SaturationModulation() { Val = 300000 };

            schemeColor15.Append(tint6);
            schemeColor15.Append(saturationModulation11);

            gradientStop10.Append(schemeColor15);

            A.GradientStop gradientStop11 = new A.GradientStop() { Position = 100000 };

            A.SchemeColor schemeColor16 = new A.SchemeColor() { Val = A.SchemeColorValues.PhColor };
            A.Shade shade7 = new A.Shade() { Val = 30000 };
            A.SaturationModulation saturationModulation12 = new A.SaturationModulation() { Val = 200000 };

            schemeColor16.Append(shade7);
            schemeColor16.Append(saturationModulation12);

            gradientStop11.Append(schemeColor16);

            gradientStopList4.Append(gradientStop10);
            gradientStopList4.Append(gradientStop11);

            A.PathGradientFill pathGradientFill2 = new A.PathGradientFill() { Path = A.PathShadeValues.Circle };
            A.FillToRectangle fillToRectangle2 = new A.FillToRectangle() { Left = 50000, Top = 50000, Right = 50000, Bottom = 50000 };

            pathGradientFill2.Append(fillToRectangle2);

            gradientFill4.Append(gradientStopList4);
            gradientFill4.Append(pathGradientFill2);

            backgroundFillStyleList1.Append(solidFill5);
            backgroundFillStyleList1.Append(gradientFill3);
            backgroundFillStyleList1.Append(gradientFill4);

            formatScheme1.Append(fillStyleList1);
            formatScheme1.Append(lineStyleList1);
            formatScheme1.Append(effectStyleList1);
            formatScheme1.Append(backgroundFillStyleList1);

            themeElements1.Append(colorScheme1);
            themeElements1.Append(fontScheme1);
            themeElements1.Append(formatScheme1);
            A.ObjectDefaults objectDefaults1 = new A.ObjectDefaults();
            A.ExtraColorSchemeList extraColorSchemeList1 = new A.ExtraColorSchemeList();

            theme1.Append(themeElements1);
            theme1.Append(objectDefaults1);
            theme1.Append(extraColorSchemeList1);

            themePart1.Theme = theme1;
        }

        // Generates content of customXmlPart1.
        private void GenerateCustomXmlPart1Content(CustomXmlPart customXmlPart1)
        {
            System.Xml.XmlTextWriter writer = new System.Xml.XmlTextWriter(customXmlPart1.GetStream(System.IO.FileMode.Create), System.Text.Encoding.UTF8);
            writer.WriteRaw("<?mso-contentType?><FormTemplates xmlns=\"http://schemas.microsoft.com/sharepoint/v3/contenttype/forms\"><Display>DocumentLibraryForm</Display><Edit>DocumentLibraryForm</Edit><New>DocumentLibraryForm</New></FormTemplates>");
            writer.Flush();
            writer.Close();
        }

        // Generates content of customXmlPropertiesPart1.
        private void GenerateCustomXmlPropertiesPart1Content(CustomXmlPropertiesPart customXmlPropertiesPart1)
        {
            Ds.DataStoreItem dataStoreItem1 = new Ds.DataStoreItem() { ItemId = "{B5DF9D90-CFE7-40ED-AEAB-6834380FBC99}" };
            dataStoreItem1.AddNamespaceDeclaration("ds", "http://schemas.openxmlformats.org/officeDocument/2006/customXml");

            Ds.SchemaReferences schemaReferences1 = new Ds.SchemaReferences();
            Ds.SchemaReference schemaReference1 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/sharepoint/v3/contenttype/forms" };

            schemaReferences1.Append(schemaReference1);

            dataStoreItem1.Append(schemaReferences1);

            customXmlPropertiesPart1.DataStoreItem = dataStoreItem1;
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

            Font font1 = new Font() { Name = "Calibri" };
            Panose1Number panose1Number1 = new Panose1Number() { Val = "020F0502020204030204" };
            FontCharSet fontCharSet1 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily1 = new FontFamily() { Val = FontFamilyValues.Swiss };
            Pitch pitch1 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature1 = new FontSignature() { UnicodeSignature0 = "E4002EFF", UnicodeSignature1 = "C000247B", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font1.Append(panose1Number1);
            font1.Append(fontCharSet1);
            font1.Append(fontFamily1);
            font1.Append(pitch1);
            font1.Append(fontSignature1);

            Font font2 = new Font() { Name = "Times New Roman" };
            Panose1Number panose1Number2 = new Panose1Number() { Val = "02020603050405020304" };
            FontCharSet fontCharSet2 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily2 = new FontFamily() { Val = FontFamilyValues.Roman };
            Pitch pitch2 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature2 = new FontSignature() { UnicodeSignature0 = "E0002EFF", UnicodeSignature1 = "C000785B", UnicodeSignature2 = "00000009", UnicodeSignature3 = "00000000", CodePageSignature0 = "000001FF", CodePageSignature1 = "00000000" };

            font2.Append(panose1Number2);
            font2.Append(fontCharSet2);
            font2.Append(fontFamily2);
            font2.Append(pitch2);
            font2.Append(fontSignature2);

            Font font3 = new Font() { Name = "Cambria" };
            Panose1Number panose1Number3 = new Panose1Number() { Val = "02040503050406030204" };
            FontCharSet fontCharSet3 = new FontCharSet() { Val = "CC" };
            FontFamily fontFamily3 = new FontFamily() { Val = FontFamilyValues.Roman };
            Pitch pitch3 = new Pitch() { Val = FontPitchValues.Variable };
            FontSignature fontSignature3 = new FontSignature() { UnicodeSignature0 = "E00006FF", UnicodeSignature1 = "420024FF", UnicodeSignature2 = "02000000", UnicodeSignature3 = "00000000", CodePageSignature0 = "0000019F", CodePageSignature1 = "00000000" };

            font3.Append(panose1Number3);
            font3.Append(fontCharSet3);
            font3.Append(fontFamily3);
            font3.Append(pitch3);
            font3.Append(fontSignature3);

            fonts1.Append(font1);
            fonts1.Append(font2);
            fonts1.Append(font3);

            fontTablePart1.Fonts = fonts1;
        }

        // Generates content of customXmlPart2.
        private void GenerateCustomXmlPart2Content(CustomXmlPart customXmlPart2)
        {
            System.Xml.XmlTextWriter writer = new System.Xml.XmlTextWriter(customXmlPart2.GetStream(System.IO.FileMode.Create), System.Text.Encoding.UTF8);
            writer.WriteRaw("<?xml version=\"1.0\" encoding=\"utf-8\"?><p:properties xmlns:p=\"http://schemas.microsoft.com/office/2006/metadata/properties\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:pc=\"http://schemas.microsoft.com/office/infopath/2007/PartnerControls\"><documentManagement/></p:properties>");
            writer.Flush();
            writer.Close();
        }

        // Generates content of customXmlPropertiesPart2.
        private void GenerateCustomXmlPropertiesPart2Content(CustomXmlPropertiesPart customXmlPropertiesPart2)
        {
            Ds.DataStoreItem dataStoreItem2 = new Ds.DataStoreItem() { ItemId = "{97A9207B-5C9A-4368-94A3-25D6517025DC}" };
            dataStoreItem2.AddNamespaceDeclaration("ds", "http://schemas.openxmlformats.org/officeDocument/2006/customXml");

            Ds.SchemaReferences schemaReferences2 = new Ds.SchemaReferences();
            Ds.SchemaReference schemaReference2 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/2006/metadata/properties" };
            Ds.SchemaReference schemaReference3 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/infopath/2007/PartnerControls" };

            schemaReferences2.Append(schemaReference2);
            schemaReferences2.Append(schemaReference3);

            dataStoreItem2.Append(schemaReferences2);

            customXmlPropertiesPart2.DataStoreItem = dataStoreItem2;
        }

        // Generates content of customXmlPart3.
        private void GenerateCustomXmlPart3Content(CustomXmlPart customXmlPart3)
        {
            System.Xml.XmlTextWriter writer = new System.Xml.XmlTextWriter(customXmlPart3.GetStream(System.IO.FileMode.Create), System.Text.Encoding.UTF8);
            writer.WriteRaw("<?xml version=\"1.0\" encoding=\"utf-8\"?><ct:contentTypeSchema ct:_=\"\" ma:_=\"\" ma:contentTypeName=\"Документ\" ma:contentTypeID=\"0x010100714B20FE7CA2F44885D5D702E37D73F4\" ma:contentTypeVersion=\"0\" ma:contentTypeDescription=\"Создание документа.\" ma:contentTypeScope=\"\" ma:versionID=\"8161ded2d9c1a0c220a04b0dd1053be7\" xmlns:ct=\"http://schemas.microsoft.com/office/2006/metadata/contentType\" xmlns:ma=\"http://schemas.microsoft.com/office/2006/metadata/properties/metaAttributes\">\r\n<xsd:schema targetNamespace=\"http://schemas.microsoft.com/office/2006/metadata/properties\" ma:root=\"true\" ma:fieldsID=\"82fabbfca08c602fc194a16e91989008\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\" xmlns:p=\"http://schemas.microsoft.com/office/2006/metadata/properties\">\r\n<xsd:element name=\"properties\">\r\n<xsd:complexType>\r\n<xsd:sequence>\r\n<xsd:element name=\"documentManagement\">\r\n<xsd:complexType>\r\n<xsd:all/>\r\n</xsd:complexType>\r\n</xsd:element>\r\n</xsd:sequence>\r\n</xsd:complexType>\r\n</xsd:element>\r\n</xsd:schema>\r\n<xsd:schema targetNamespace=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" elementFormDefault=\"qualified\" attributeFormDefault=\"unqualified\" blockDefault=\"#all\" xmlns=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:dcterms=\"http://purl.org/dc/terms/\" xmlns:odoc=\"http://schemas.microsoft.com/internal/obd\">\r\n<xsd:import namespace=\"http://purl.org/dc/elements/1.1/\" schemaLocation=\"http://dublincore.org/schemas/xmls/qdc/2003/04/02/dc.xsd\"/>\r\n<xsd:import namespace=\"http://purl.org/dc/terms/\" schemaLocation=\"http://dublincore.org/schemas/xmls/qdc/2003/04/02/dcterms.xsd\"/>\r\n<xsd:element name=\"coreProperties\" type=\"CT_coreProperties\"/>\r\n<xsd:complexType name=\"CT_coreProperties\">\r\n<xsd:all>\r\n<xsd:element ref=\"dc:creator\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element ref=\"dcterms:created\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element ref=\"dc:identifier\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element name=\"contentType\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\" ma:index=\"0\" ma:displayName=\"Тип контента\"/>\r\n<xsd:element ref=\"dc:title\" minOccurs=\"0\" maxOccurs=\"1\" ma:index=\"4\" ma:displayName=\"Название\"/>\r\n<xsd:element ref=\"dc:subject\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element ref=\"dc:description\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element name=\"keywords\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\"/>\r\n<xsd:element ref=\"dc:language\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element name=\"category\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\"/>\r\n<xsd:element name=\"version\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\"/>\r\n<xsd:element name=\"revision\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\">\r\n<xsd:annotation>\r\n<xsd:documentation>\r\n                        This value indicates the number of saves or revisions. The application is responsible for updating this value after each revision.\r\n                    </xsd:documentation>\r\n</xsd:annotation>\r\n</xsd:element>\r\n<xsd:element name=\"lastModifiedBy\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\"/>\r\n<xsd:element ref=\"dcterms:modified\" minOccurs=\"0\" maxOccurs=\"1\"/>\r\n<xsd:element name=\"contentStatus\" minOccurs=\"0\" maxOccurs=\"1\" type=\"xsd:string\"/>\r\n</xsd:all>\r\n</xsd:complexType>\r\n</xsd:schema>\r\n<xs:schema targetNamespace=\"http://schemas.microsoft.com/office/infopath/2007/PartnerControls\" elementFormDefault=\"qualified\" attributeFormDefault=\"unqualified\" xmlns:pc=\"http://schemas.microsoft.com/office/infopath/2007/PartnerControls\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\">\r\n<xs:element name=\"Person\">\r\n<xs:complexType>\r\n<xs:sequence>\r\n<xs:element ref=\"pc:DisplayName\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:AccountId\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:AccountType\" minOccurs=\"0\"></xs:element>\r\n</xs:sequence>\r\n</xs:complexType>\r\n</xs:element>\r\n<xs:element name=\"DisplayName\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"AccountId\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"AccountType\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"BDCAssociatedEntity\">\r\n<xs:complexType>\r\n<xs:sequence>\r\n<xs:element ref=\"pc:BDCEntity\" minOccurs=\"0\" maxOccurs=\"unbounded\"></xs:element>\r\n</xs:sequence>\r\n<xs:attribute ref=\"pc:EntityNamespace\"></xs:attribute>\r\n<xs:attribute ref=\"pc:EntityName\"></xs:attribute>\r\n<xs:attribute ref=\"pc:SystemInstanceName\"></xs:attribute>\r\n<xs:attribute ref=\"pc:AssociationName\"></xs:attribute>\r\n</xs:complexType>\r\n</xs:element>\r\n<xs:attribute name=\"EntityNamespace\" type=\"xs:string\"></xs:attribute>\r\n<xs:attribute name=\"EntityName\" type=\"xs:string\"></xs:attribute>\r\n<xs:attribute name=\"SystemInstanceName\" type=\"xs:string\"></xs:attribute>\r\n<xs:attribute name=\"AssociationName\" type=\"xs:string\"></xs:attribute>\r\n<xs:element name=\"BDCEntity\">\r\n<xs:complexType>\r\n<xs:sequence>\r\n<xs:element ref=\"pc:EntityDisplayName\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityInstanceReference\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityId1\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityId2\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityId3\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityId4\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:EntityId5\" minOccurs=\"0\"></xs:element>\r\n</xs:sequence>\r\n</xs:complexType>\r\n</xs:element>\r\n<xs:element name=\"EntityDisplayName\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityInstanceReference\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityId1\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityId2\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityId3\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityId4\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"EntityId5\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"Terms\">\r\n<xs:complexType>\r\n<xs:sequence>\r\n<xs:element ref=\"pc:TermInfo\" minOccurs=\"0\" maxOccurs=\"unbounded\"></xs:element>\r\n</xs:sequence>\r\n</xs:complexType>\r\n</xs:element>\r\n<xs:element name=\"TermInfo\">\r\n<xs:complexType>\r\n<xs:sequence>\r\n<xs:element ref=\"pc:TermName\" minOccurs=\"0\"></xs:element>\r\n<xs:element ref=\"pc:TermId\" minOccurs=\"0\"></xs:element>\r\n</xs:sequence>\r\n</xs:complexType>\r\n</xs:element>\r\n<xs:element name=\"TermName\" type=\"xs:string\"></xs:element>\r\n<xs:element name=\"TermId\" type=\"xs:string\"></xs:element>\r\n</xs:schema>\r\n</ct:contentTypeSchema>");
            writer.Flush();
            writer.Close();
        }

        // Generates content of customXmlPropertiesPart3.
        private void GenerateCustomXmlPropertiesPart3Content(CustomXmlPropertiesPart customXmlPropertiesPart3)
        {
            Ds.DataStoreItem dataStoreItem3 = new Ds.DataStoreItem() { ItemId = "{08E666E8-C496-4CF1-AB80-640C2E98E5E9}" };
            dataStoreItem3.AddNamespaceDeclaration("ds", "http://schemas.openxmlformats.org/officeDocument/2006/customXml");

            Ds.SchemaReferences schemaReferences3 = new Ds.SchemaReferences();
            Ds.SchemaReference schemaReference4 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/2006/metadata/contentType" };
            Ds.SchemaReference schemaReference5 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/2006/metadata/properties/metaAttributes" };
            Ds.SchemaReference schemaReference6 = new Ds.SchemaReference() { Uri = "http://www.w3.org/2001/XMLSchema" };
            Ds.SchemaReference schemaReference7 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/2006/metadata/properties" };
            Ds.SchemaReference schemaReference8 = new Ds.SchemaReference() { Uri = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties" };
            Ds.SchemaReference schemaReference9 = new Ds.SchemaReference() { Uri = "http://purl.org/dc/elements/1.1/" };
            Ds.SchemaReference schemaReference10 = new Ds.SchemaReference() { Uri = "http://purl.org/dc/terms/" };
            Ds.SchemaReference schemaReference11 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/internal/obd" };
            Ds.SchemaReference schemaReference12 = new Ds.SchemaReference() { Uri = "http://schemas.microsoft.com/office/infopath/2007/PartnerControls" };

            schemaReferences3.Append(schemaReference4);
            schemaReferences3.Append(schemaReference5);
            schemaReferences3.Append(schemaReference6);
            schemaReferences3.Append(schemaReference7);
            schemaReferences3.Append(schemaReference8);
            schemaReferences3.Append(schemaReference9);
            schemaReferences3.Append(schemaReference10);
            schemaReferences3.Append(schemaReference11);
            schemaReferences3.Append(schemaReference12);

            dataStoreItem3.Append(schemaReferences3);

            customXmlPropertiesPart3.DataStoreItem = dataStoreItem3;
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

            Divs divs1 = new Divs();

            Div div1 = new Div() { Id = "692727661" };
            BodyDiv bodyDiv1 = new BodyDiv() { Val = true };
            LeftMarginDiv leftMarginDiv1 = new LeftMarginDiv() { Val = "0" };
            RightMarginDiv rightMarginDiv1 = new RightMarginDiv() { Val = "0" };
            TopMarginDiv topMarginDiv1 = new TopMarginDiv() { Val = "0" };
            BottomMarginDiv bottomMarginDiv1 = new BottomMarginDiv() { Val = "0" };

            DivBorder divBorder1 = new DivBorder();
            TopBorder topBorder102 = new TopBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            LeftBorder leftBorder91 = new LeftBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder107 = new BottomBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            RightBorder rightBorder91 = new RightBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };

            divBorder1.Append(topBorder102);
            divBorder1.Append(leftBorder91);
            divBorder1.Append(bottomBorder107);
            divBorder1.Append(rightBorder91);

            div1.Append(bodyDiv1);
            div1.Append(leftMarginDiv1);
            div1.Append(rightMarginDiv1);
            div1.Append(topMarginDiv1);
            div1.Append(bottomMarginDiv1);
            div1.Append(divBorder1);

            Div div2 = new Div() { Id = "1726296820" };
            BodyDiv bodyDiv2 = new BodyDiv() { Val = true };
            LeftMarginDiv leftMarginDiv2 = new LeftMarginDiv() { Val = "0" };
            RightMarginDiv rightMarginDiv2 = new RightMarginDiv() { Val = "0" };
            TopMarginDiv topMarginDiv2 = new TopMarginDiv() { Val = "0" };
            BottomMarginDiv bottomMarginDiv2 = new BottomMarginDiv() { Val = "0" };

            DivBorder divBorder2 = new DivBorder();
            TopBorder topBorder103 = new TopBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            LeftBorder leftBorder92 = new LeftBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder108 = new BottomBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            RightBorder rightBorder92 = new RightBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };

            divBorder2.Append(topBorder103);
            divBorder2.Append(leftBorder92);
            divBorder2.Append(bottomBorder108);
            divBorder2.Append(rightBorder92);

            div2.Append(bodyDiv2);
            div2.Append(leftMarginDiv2);
            div2.Append(rightMarginDiv2);
            div2.Append(topMarginDiv2);
            div2.Append(bottomMarginDiv2);
            div2.Append(divBorder2);

            Div div3 = new Div() { Id = "1778981052" };
            BodyDiv bodyDiv3 = new BodyDiv() { Val = true };
            LeftMarginDiv leftMarginDiv3 = new LeftMarginDiv() { Val = "0" };
            RightMarginDiv rightMarginDiv3 = new RightMarginDiv() { Val = "0" };
            TopMarginDiv topMarginDiv3 = new TopMarginDiv() { Val = "0" };
            BottomMarginDiv bottomMarginDiv3 = new BottomMarginDiv() { Val = "0" };

            DivBorder divBorder3 = new DivBorder();
            TopBorder topBorder104 = new TopBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            LeftBorder leftBorder93 = new LeftBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder109 = new BottomBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            RightBorder rightBorder93 = new RightBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };

            divBorder3.Append(topBorder104);
            divBorder3.Append(leftBorder93);
            divBorder3.Append(bottomBorder109);
            divBorder3.Append(rightBorder93);

            div3.Append(bodyDiv3);
            div3.Append(leftMarginDiv3);
            div3.Append(rightMarginDiv3);
            div3.Append(topMarginDiv3);
            div3.Append(bottomMarginDiv3);
            div3.Append(divBorder3);

            Div div4 = new Div() { Id = "1800996550" };
            BodyDiv bodyDiv4 = new BodyDiv() { Val = true };
            LeftMarginDiv leftMarginDiv4 = new LeftMarginDiv() { Val = "0" };
            RightMarginDiv rightMarginDiv4 = new RightMarginDiv() { Val = "0" };
            TopMarginDiv topMarginDiv4 = new TopMarginDiv() { Val = "0" };
            BottomMarginDiv bottomMarginDiv4 = new BottomMarginDiv() { Val = "0" };

            DivBorder divBorder4 = new DivBorder();
            TopBorder topBorder105 = new TopBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            LeftBorder leftBorder94 = new LeftBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder110 = new BottomBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            RightBorder rightBorder94 = new RightBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };

            divBorder4.Append(topBorder105);
            divBorder4.Append(leftBorder94);
            divBorder4.Append(bottomBorder110);
            divBorder4.Append(rightBorder94);

            div4.Append(bodyDiv4);
            div4.Append(leftMarginDiv4);
            div4.Append(rightMarginDiv4);
            div4.Append(topMarginDiv4);
            div4.Append(bottomMarginDiv4);
            div4.Append(divBorder4);

            Div div5 = new Div() { Id = "1820031604" };
            BodyDiv bodyDiv5 = new BodyDiv() { Val = true };
            LeftMarginDiv leftMarginDiv5 = new LeftMarginDiv() { Val = "0" };
            RightMarginDiv rightMarginDiv5 = new RightMarginDiv() { Val = "0" };
            TopMarginDiv topMarginDiv5 = new TopMarginDiv() { Val = "0" };
            BottomMarginDiv bottomMarginDiv5 = new BottomMarginDiv() { Val = "0" };

            DivBorder divBorder5 = new DivBorder();
            TopBorder topBorder106 = new TopBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            LeftBorder leftBorder95 = new LeftBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            BottomBorder bottomBorder111 = new BottomBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };
            RightBorder rightBorder95 = new RightBorder() { Val = BorderValues.None, Color = "auto", Size = (UInt32Value)0U, Space = (UInt32Value)0U };

            divBorder5.Append(topBorder106);
            divBorder5.Append(leftBorder95);
            divBorder5.Append(bottomBorder111);
            divBorder5.Append(rightBorder95);

            div5.Append(bodyDiv5);
            div5.Append(leftMarginDiv5);
            div5.Append(rightMarginDiv5);
            div5.Append(topMarginDiv5);
            div5.Append(bottomMarginDiv5);
            div5.Append(divBorder5);

            divs1.Append(div1);
            divs1.Append(div2);
            divs1.Append(div3);
            divs1.Append(div4);
            divs1.Append(div5);
            OptimizeForBrowser optimizeForBrowser1 = new OptimizeForBrowser();
            AllowPNG allowPNG1 = new AllowPNG();

            webSettings1.Append(divs1);
            webSettings1.Append(optimizeForBrowser1);
            webSettings1.Append(allowPNG1);

            webSettingsPart1.WebSettings = webSettings1;
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
            DefaultTabStop defaultTabStop1 = new DefaultTabStop() { Val = 708 };
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
            RsidRoot rsidRoot1 = new RsidRoot() { Val = "003A20E4" };
            Rsid rsid1 = new Rsid() { Val = "00044FF8" };
            Rsid rsid2 = new Rsid() { Val = "0025029E" };
            Rsid rsid3 = new Rsid() { Val = "002604F5" };
            Rsid rsid4 = new Rsid() { Val = "003277F5" };
            Rsid rsid5 = new Rsid() { Val = "003578D5" };
            Rsid rsid6 = new Rsid() { Val = "003A20E4" };
            Rsid rsid7 = new Rsid() { Val = "00463657" };
            Rsid rsid8 = new Rsid() { Val = "005B5306" };
            Rsid rsid9 = new Rsid() { Val = "005F4C57" };
            Rsid rsid10 = new Rsid() { Val = "006007E7" };
            Rsid rsid11 = new Rsid() { Val = "006E4804" };
            Rsid rsid12 = new Rsid() { Val = "009E569B" };
            Rsid rsid13 = new Rsid() { Val = "00B13496" };
            Rsid rsid14 = new Rsid() { Val = "00C4661E" };
            Rsid rsid15 = new Rsid() { Val = "00D70749" };
            Rsid rsid16 = new Rsid() { Val = "00E918CA" };
            Rsid rsid17 = new Rsid() { Val = "00F16160" };

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

            M.MathProperties mathProperties1 = new M.MathProperties();
            M.MathFont mathFont1 = new M.MathFont() { Val = "Cambria Math" };
            M.BreakBinary breakBinary1 = new M.BreakBinary() { Val = M.BreakBinaryOperatorValues.Before };
            M.BreakBinarySubtraction breakBinarySubtraction1 = new M.BreakBinarySubtraction() { Val = M.BreakBinarySubtractionValues.MinusMinus };
            M.SmallFraction smallFraction1 = new M.SmallFraction() { Val = M.BooleanValues.Zero };
            M.DisplayDefaults displayDefaults1 = new M.DisplayDefaults();
            M.LeftMargin leftMargin2 = new M.LeftMargin() { Val = (UInt32Value)0U };
            M.RightMargin rightMargin2 = new M.RightMargin() { Val = (UInt32Value)0U };
            M.DefaultJustification defaultJustification1 = new M.DefaultJustification() { Val = M.JustificationValues.CenterGroup };
            M.WrapIndent wrapIndent1 = new M.WrapIndent() { Val = (UInt32Value)1440U };
            M.IntegralLimitLocation integralLimitLocation1 = new M.IntegralLimitLocation() { Val = M.LimitLocationValues.SubscriptSuperscript };
            M.NaryLimitLocation naryLimitLocation1 = new M.NaryLimitLocation() { Val = M.LimitLocationValues.UnderOver };

            mathProperties1.Append(mathFont1);
            mathProperties1.Append(breakBinary1);
            mathProperties1.Append(breakBinarySubtraction1);
            mathProperties1.Append(smallFraction1);
            mathProperties1.Append(displayDefaults1);
            mathProperties1.Append(leftMargin2);
            mathProperties1.Append(rightMargin2);
            mathProperties1.Append(defaultJustification1);
            mathProperties1.Append(wrapIndent1);
            mathProperties1.Append(integralLimitLocation1);
            mathProperties1.Append(naryLimitLocation1);
            ThemeFontLanguages themeFontLanguages1 = new ThemeFontLanguages() { Val = "ru-RU" };
            ColorSchemeMapping colorSchemeMapping1 = new ColorSchemeMapping() { Background1 = ColorSchemeIndexValues.Light1, Text1 = ColorSchemeIndexValues.Dark1, Background2 = ColorSchemeIndexValues.Light2, Text2 = ColorSchemeIndexValues.Dark2, Accent1 = ColorSchemeIndexValues.Accent1, Accent2 = ColorSchemeIndexValues.Accent2, Accent3 = ColorSchemeIndexValues.Accent3, Accent4 = ColorSchemeIndexValues.Accent4, Accent5 = ColorSchemeIndexValues.Accent5, Accent6 = ColorSchemeIndexValues.Accent6, Hyperlink = ColorSchemeIndexValues.Hyperlink, FollowedHyperlink = ColorSchemeIndexValues.FollowedHyperlink };

            ShapeDefaults shapeDefaults1 = new ShapeDefaults();
            Ovml.ShapeDefaults shapeDefaults2 = new Ovml.ShapeDefaults() { Extension = V.ExtensionHandlingBehaviorValues.Edit, MaxShapeId = 1026 };

            Ovml.ShapeLayout shapeLayout1 = new Ovml.ShapeLayout() { Extension = V.ExtensionHandlingBehaviorValues.Edit };
            Ovml.ShapeIdMap shapeIdMap1 = new Ovml.ShapeIdMap() { Extension = V.ExtensionHandlingBehaviorValues.Edit, Data = "1" };

            shapeLayout1.Append(shapeIdMap1);

            shapeDefaults1.Append(shapeDefaults2);
            shapeDefaults1.Append(shapeLayout1);
            DecimalSymbol decimalSymbol1 = new DecimalSymbol() { Val = "," };
            ListSeparator listSeparator1 = new ListSeparator() { Val = ";" };
            W14.DocumentId documentId1 = new W14.DocumentId() { Val = "4A3950BC" };
            W15.PersistentDocumentId persistentDocumentId1 = new W15.PersistentDocumentId() { Val = "{9801A0C5-8BB4-435D-BE14-65EAEC991134}" };

            settings1.Append(zoom1);
            settings1.Append(proofState1);
            settings1.Append(defaultTabStop1);
            settings1.Append(characterSpacingControl1);
            settings1.Append(compatibility1);
            settings1.Append(rsids1);
            settings1.Append(mathProperties1);
            settings1.Append(themeFontLanguages1);
            settings1.Append(colorSchemeMapping1);
            settings1.Append(shapeDefaults1);
            settings1.Append(decimalSymbol1);
            settings1.Append(listSeparator1);
            settings1.Append(documentId1);
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
            RunFonts runFonts1 = new RunFonts() { AsciiTheme = ThemeFontValues.MinorHighAnsi, HighAnsiTheme = ThemeFontValues.MinorHighAnsi, EastAsiaTheme = ThemeFontValues.MinorHighAnsi, ComplexScriptTheme = ThemeFontValues.MinorBidi };
            FontSize fontSize322 = new FontSize() { Val = "22" };
            FontSizeComplexScript fontSizeComplexScript321 = new FontSizeComplexScript() { Val = "22" };
            Languages languages232 = new Languages() { Val = "ru-RU", EastAsia = "en-US", Bidi = "ar-SA" };

            runPropertiesBaseStyle1.Append(runFonts1);
            runPropertiesBaseStyle1.Append(fontSize322);
            runPropertiesBaseStyle1.Append(fontSizeComplexScript321);
            runPropertiesBaseStyle1.Append(languages232);

            runPropertiesDefault1.Append(runPropertiesBaseStyle1);

            ParagraphPropertiesDefault paragraphPropertiesDefault1 = new ParagraphPropertiesDefault();

            ParagraphPropertiesBaseStyle paragraphPropertiesBaseStyle1 = new ParagraphPropertiesBaseStyle();
            SpacingBetweenLines spacingBetweenLines23 = new SpacingBetweenLines() { After = "200", Line = "276", LineRule = LineSpacingRuleValues.Auto };

            paragraphPropertiesBaseStyle1.Append(spacingBetweenLines23);

            paragraphPropertiesDefault1.Append(paragraphPropertiesBaseStyle1);

            docDefaults1.Append(runPropertiesDefault1);
            docDefaults1.Append(paragraphPropertiesDefault1);

            LatentStyles latentStyles1 = new LatentStyles() { DefaultLockedState = false, DefaultUiPriority = 99, DefaultSemiHidden = false, DefaultUnhideWhenUsed = false, DefaultPrimaryStyle = false, Count = 371 };
            LatentStyleExceptionInfo latentStyleExceptionInfo1 = new LatentStyleExceptionInfo() { Name = "Normal", UiPriority = 0, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo2 = new LatentStyleExceptionInfo() { Name = "heading 1", UiPriority = 9, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo3 = new LatentStyleExceptionInfo() { Name = "heading 2", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo4 = new LatentStyleExceptionInfo() { Name = "heading 3", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo5 = new LatentStyleExceptionInfo() { Name = "heading 4", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo6 = new LatentStyleExceptionInfo() { Name = "heading 5", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo7 = new LatentStyleExceptionInfo() { Name = "heading 6", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo8 = new LatentStyleExceptionInfo() { Name = "heading 7", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo9 = new LatentStyleExceptionInfo() { Name = "heading 8", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo10 = new LatentStyleExceptionInfo() { Name = "heading 9", UiPriority = 9, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo11 = new LatentStyleExceptionInfo() { Name = "index 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo12 = new LatentStyleExceptionInfo() { Name = "index 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo13 = new LatentStyleExceptionInfo() { Name = "index 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo14 = new LatentStyleExceptionInfo() { Name = "index 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo15 = new LatentStyleExceptionInfo() { Name = "index 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo16 = new LatentStyleExceptionInfo() { Name = "index 6", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo17 = new LatentStyleExceptionInfo() { Name = "index 7", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo18 = new LatentStyleExceptionInfo() { Name = "index 8", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo19 = new LatentStyleExceptionInfo() { Name = "index 9", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo20 = new LatentStyleExceptionInfo() { Name = "toc 1", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo21 = new LatentStyleExceptionInfo() { Name = "toc 2", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo22 = new LatentStyleExceptionInfo() { Name = "toc 3", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo23 = new LatentStyleExceptionInfo() { Name = "toc 4", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo24 = new LatentStyleExceptionInfo() { Name = "toc 5", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo25 = new LatentStyleExceptionInfo() { Name = "toc 6", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo26 = new LatentStyleExceptionInfo() { Name = "toc 7", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo27 = new LatentStyleExceptionInfo() { Name = "toc 8", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo28 = new LatentStyleExceptionInfo() { Name = "toc 9", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo29 = new LatentStyleExceptionInfo() { Name = "Normal Indent", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo30 = new LatentStyleExceptionInfo() { Name = "footnote text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo31 = new LatentStyleExceptionInfo() { Name = "annotation text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo32 = new LatentStyleExceptionInfo() { Name = "header", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo33 = new LatentStyleExceptionInfo() { Name = "footer", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo34 = new LatentStyleExceptionInfo() { Name = "index heading", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo35 = new LatentStyleExceptionInfo() { Name = "caption", UiPriority = 35, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo36 = new LatentStyleExceptionInfo() { Name = "table of figures", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo37 = new LatentStyleExceptionInfo() { Name = "envelope address", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo38 = new LatentStyleExceptionInfo() { Name = "envelope return", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo39 = new LatentStyleExceptionInfo() { Name = "footnote reference", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo40 = new LatentStyleExceptionInfo() { Name = "annotation reference", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo41 = new LatentStyleExceptionInfo() { Name = "line number", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo42 = new LatentStyleExceptionInfo() { Name = "page number", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo43 = new LatentStyleExceptionInfo() { Name = "endnote reference", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo44 = new LatentStyleExceptionInfo() { Name = "endnote text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo45 = new LatentStyleExceptionInfo() { Name = "table of authorities", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo46 = new LatentStyleExceptionInfo() { Name = "macro", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo47 = new LatentStyleExceptionInfo() { Name = "toa heading", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo48 = new LatentStyleExceptionInfo() { Name = "List", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo49 = new LatentStyleExceptionInfo() { Name = "List Bullet", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo50 = new LatentStyleExceptionInfo() { Name = "List Number", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo51 = new LatentStyleExceptionInfo() { Name = "List 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo52 = new LatentStyleExceptionInfo() { Name = "List 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo53 = new LatentStyleExceptionInfo() { Name = "List 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo54 = new LatentStyleExceptionInfo() { Name = "List 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo55 = new LatentStyleExceptionInfo() { Name = "List Bullet 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo56 = new LatentStyleExceptionInfo() { Name = "List Bullet 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo57 = new LatentStyleExceptionInfo() { Name = "List Bullet 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo58 = new LatentStyleExceptionInfo() { Name = "List Bullet 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo59 = new LatentStyleExceptionInfo() { Name = "List Number 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo60 = new LatentStyleExceptionInfo() { Name = "List Number 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo61 = new LatentStyleExceptionInfo() { Name = "List Number 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo62 = new LatentStyleExceptionInfo() { Name = "List Number 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo63 = new LatentStyleExceptionInfo() { Name = "Title", UiPriority = 10, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo64 = new LatentStyleExceptionInfo() { Name = "Closing", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo65 = new LatentStyleExceptionInfo() { Name = "Signature", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo66 = new LatentStyleExceptionInfo() { Name = "Default Paragraph Font", UiPriority = 1, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo67 = new LatentStyleExceptionInfo() { Name = "Body Text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo68 = new LatentStyleExceptionInfo() { Name = "Body Text Indent", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo69 = new LatentStyleExceptionInfo() { Name = "List Continue", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo70 = new LatentStyleExceptionInfo() { Name = "List Continue 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo71 = new LatentStyleExceptionInfo() { Name = "List Continue 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo72 = new LatentStyleExceptionInfo() { Name = "List Continue 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo73 = new LatentStyleExceptionInfo() { Name = "List Continue 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo74 = new LatentStyleExceptionInfo() { Name = "Message Header", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo75 = new LatentStyleExceptionInfo() { Name = "Subtitle", UiPriority = 11, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo76 = new LatentStyleExceptionInfo() { Name = "Salutation", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo77 = new LatentStyleExceptionInfo() { Name = "Date", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo78 = new LatentStyleExceptionInfo() { Name = "Body Text First Indent", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo79 = new LatentStyleExceptionInfo() { Name = "Body Text First Indent 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo80 = new LatentStyleExceptionInfo() { Name = "Note Heading", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo81 = new LatentStyleExceptionInfo() { Name = "Body Text 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo82 = new LatentStyleExceptionInfo() { Name = "Body Text 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo83 = new LatentStyleExceptionInfo() { Name = "Body Text Indent 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo84 = new LatentStyleExceptionInfo() { Name = "Body Text Indent 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo85 = new LatentStyleExceptionInfo() { Name = "Block Text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo86 = new LatentStyleExceptionInfo() { Name = "Hyperlink", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo87 = new LatentStyleExceptionInfo() { Name = "FollowedHyperlink", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo88 = new LatentStyleExceptionInfo() { Name = "Strong", UiPriority = 22, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo89 = new LatentStyleExceptionInfo() { Name = "Emphasis", UiPriority = 20, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo90 = new LatentStyleExceptionInfo() { Name = "Document Map", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo91 = new LatentStyleExceptionInfo() { Name = "Plain Text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo92 = new LatentStyleExceptionInfo() { Name = "E-mail Signature", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo93 = new LatentStyleExceptionInfo() { Name = "HTML Top of Form", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo94 = new LatentStyleExceptionInfo() { Name = "HTML Bottom of Form", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo95 = new LatentStyleExceptionInfo() { Name = "Normal (Web)", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo96 = new LatentStyleExceptionInfo() { Name = "HTML Acronym", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo97 = new LatentStyleExceptionInfo() { Name = "HTML Address", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo98 = new LatentStyleExceptionInfo() { Name = "HTML Cite", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo99 = new LatentStyleExceptionInfo() { Name = "HTML Code", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo100 = new LatentStyleExceptionInfo() { Name = "HTML Definition", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo101 = new LatentStyleExceptionInfo() { Name = "HTML Keyboard", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo102 = new LatentStyleExceptionInfo() { Name = "HTML Preformatted", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo103 = new LatentStyleExceptionInfo() { Name = "HTML Sample", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo104 = new LatentStyleExceptionInfo() { Name = "HTML Typewriter", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo105 = new LatentStyleExceptionInfo() { Name = "HTML Variable", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo106 = new LatentStyleExceptionInfo() { Name = "Normal Table", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo107 = new LatentStyleExceptionInfo() { Name = "annotation subject", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo108 = new LatentStyleExceptionInfo() { Name = "No List", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo109 = new LatentStyleExceptionInfo() { Name = "Outline List 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo110 = new LatentStyleExceptionInfo() { Name = "Outline List 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo111 = new LatentStyleExceptionInfo() { Name = "Outline List 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo112 = new LatentStyleExceptionInfo() { Name = "Table Simple 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo113 = new LatentStyleExceptionInfo() { Name = "Table Simple 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo114 = new LatentStyleExceptionInfo() { Name = "Table Simple 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo115 = new LatentStyleExceptionInfo() { Name = "Table Classic 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo116 = new LatentStyleExceptionInfo() { Name = "Table Classic 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo117 = new LatentStyleExceptionInfo() { Name = "Table Classic 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo118 = new LatentStyleExceptionInfo() { Name = "Table Classic 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo119 = new LatentStyleExceptionInfo() { Name = "Table Colorful 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo120 = new LatentStyleExceptionInfo() { Name = "Table Colorful 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo121 = new LatentStyleExceptionInfo() { Name = "Table Colorful 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo122 = new LatentStyleExceptionInfo() { Name = "Table Columns 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo123 = new LatentStyleExceptionInfo() { Name = "Table Columns 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo124 = new LatentStyleExceptionInfo() { Name = "Table Columns 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo125 = new LatentStyleExceptionInfo() { Name = "Table Columns 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo126 = new LatentStyleExceptionInfo() { Name = "Table Columns 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo127 = new LatentStyleExceptionInfo() { Name = "Table Grid 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo128 = new LatentStyleExceptionInfo() { Name = "Table Grid 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo129 = new LatentStyleExceptionInfo() { Name = "Table Grid 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo130 = new LatentStyleExceptionInfo() { Name = "Table Grid 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo131 = new LatentStyleExceptionInfo() { Name = "Table Grid 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo132 = new LatentStyleExceptionInfo() { Name = "Table Grid 6", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo133 = new LatentStyleExceptionInfo() { Name = "Table Grid 7", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo134 = new LatentStyleExceptionInfo() { Name = "Table Grid 8", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo135 = new LatentStyleExceptionInfo() { Name = "Table List 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo136 = new LatentStyleExceptionInfo() { Name = "Table List 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo137 = new LatentStyleExceptionInfo() { Name = "Table List 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo138 = new LatentStyleExceptionInfo() { Name = "Table List 4", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo139 = new LatentStyleExceptionInfo() { Name = "Table List 5", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo140 = new LatentStyleExceptionInfo() { Name = "Table List 6", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo141 = new LatentStyleExceptionInfo() { Name = "Table List 7", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo142 = new LatentStyleExceptionInfo() { Name = "Table List 8", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo143 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo144 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo145 = new LatentStyleExceptionInfo() { Name = "Table 3D effects 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo146 = new LatentStyleExceptionInfo() { Name = "Table Contemporary", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo147 = new LatentStyleExceptionInfo() { Name = "Table Elegant", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo148 = new LatentStyleExceptionInfo() { Name = "Table Professional", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo149 = new LatentStyleExceptionInfo() { Name = "Table Subtle 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo150 = new LatentStyleExceptionInfo() { Name = "Table Subtle 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo151 = new LatentStyleExceptionInfo() { Name = "Table Web 1", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo152 = new LatentStyleExceptionInfo() { Name = "Table Web 2", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo153 = new LatentStyleExceptionInfo() { Name = "Table Web 3", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo154 = new LatentStyleExceptionInfo() { Name = "Balloon Text", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo155 = new LatentStyleExceptionInfo() { Name = "Table Grid", UiPriority = 59 };
            LatentStyleExceptionInfo latentStyleExceptionInfo156 = new LatentStyleExceptionInfo() { Name = "Table Theme", SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo157 = new LatentStyleExceptionInfo() { Name = "Placeholder Text", SemiHidden = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo158 = new LatentStyleExceptionInfo() { Name = "No Spacing", UiPriority = 1, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo159 = new LatentStyleExceptionInfo() { Name = "Light Shading", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo160 = new LatentStyleExceptionInfo() { Name = "Light List", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo161 = new LatentStyleExceptionInfo() { Name = "Light Grid", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo162 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo163 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo164 = new LatentStyleExceptionInfo() { Name = "Medium List 1", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo165 = new LatentStyleExceptionInfo() { Name = "Medium List 2", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo166 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo167 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo168 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo169 = new LatentStyleExceptionInfo() { Name = "Dark List", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo170 = new LatentStyleExceptionInfo() { Name = "Colorful Shading", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo171 = new LatentStyleExceptionInfo() { Name = "Colorful List", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo172 = new LatentStyleExceptionInfo() { Name = "Colorful Grid", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo173 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 1", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo174 = new LatentStyleExceptionInfo() { Name = "Light List Accent 1", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo175 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 1", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo176 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 1", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo177 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 1", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo178 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 1", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo179 = new LatentStyleExceptionInfo() { Name = "Revision", SemiHidden = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo180 = new LatentStyleExceptionInfo() { Name = "List Paragraph", UiPriority = 34, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo181 = new LatentStyleExceptionInfo() { Name = "Quote", UiPriority = 29, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo182 = new LatentStyleExceptionInfo() { Name = "Intense Quote", UiPriority = 30, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo183 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 1", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo184 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 1", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo185 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 1", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo186 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 1", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo187 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 1", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo188 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 1", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo189 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 1", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo190 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 1", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo191 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 2", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo192 = new LatentStyleExceptionInfo() { Name = "Light List Accent 2", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo193 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 2", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo194 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 2", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo195 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 2", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo196 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 2", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo197 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 2", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo198 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 2", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo199 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 2", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo200 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 2", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo201 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 2", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo202 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 2", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo203 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 2", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo204 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 2", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo205 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 3", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo206 = new LatentStyleExceptionInfo() { Name = "Light List Accent 3", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo207 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 3", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo208 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 3", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo209 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 3", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo210 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 3", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo211 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 3", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo212 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 3", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo213 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 3", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo214 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 3", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo215 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 3", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo216 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 3", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo217 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 3", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo218 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 3", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo219 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 4", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo220 = new LatentStyleExceptionInfo() { Name = "Light List Accent 4", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo221 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 4", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo222 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 4", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo223 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 4", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo224 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 4", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo225 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 4", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo226 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 4", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo227 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 4", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo228 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 4", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo229 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 4", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo230 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 4", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo231 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 4", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo232 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 4", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo233 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 5", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo234 = new LatentStyleExceptionInfo() { Name = "Light List Accent 5", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo235 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 5", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo236 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 5", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo237 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 5", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo238 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 5", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo239 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 5", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo240 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 5", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo241 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 5", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo242 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 5", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo243 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 5", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo244 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 5", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo245 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 5", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo246 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 5", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo247 = new LatentStyleExceptionInfo() { Name = "Light Shading Accent 6", UiPriority = 60 };
            LatentStyleExceptionInfo latentStyleExceptionInfo248 = new LatentStyleExceptionInfo() { Name = "Light List Accent 6", UiPriority = 61 };
            LatentStyleExceptionInfo latentStyleExceptionInfo249 = new LatentStyleExceptionInfo() { Name = "Light Grid Accent 6", UiPriority = 62 };
            LatentStyleExceptionInfo latentStyleExceptionInfo250 = new LatentStyleExceptionInfo() { Name = "Medium Shading 1 Accent 6", UiPriority = 63 };
            LatentStyleExceptionInfo latentStyleExceptionInfo251 = new LatentStyleExceptionInfo() { Name = "Medium Shading 2 Accent 6", UiPriority = 64 };
            LatentStyleExceptionInfo latentStyleExceptionInfo252 = new LatentStyleExceptionInfo() { Name = "Medium List 1 Accent 6", UiPriority = 65 };
            LatentStyleExceptionInfo latentStyleExceptionInfo253 = new LatentStyleExceptionInfo() { Name = "Medium List 2 Accent 6", UiPriority = 66 };
            LatentStyleExceptionInfo latentStyleExceptionInfo254 = new LatentStyleExceptionInfo() { Name = "Medium Grid 1 Accent 6", UiPriority = 67 };
            LatentStyleExceptionInfo latentStyleExceptionInfo255 = new LatentStyleExceptionInfo() { Name = "Medium Grid 2 Accent 6", UiPriority = 68 };
            LatentStyleExceptionInfo latentStyleExceptionInfo256 = new LatentStyleExceptionInfo() { Name = "Medium Grid 3 Accent 6", UiPriority = 69 };
            LatentStyleExceptionInfo latentStyleExceptionInfo257 = new LatentStyleExceptionInfo() { Name = "Dark List Accent 6", UiPriority = 70 };
            LatentStyleExceptionInfo latentStyleExceptionInfo258 = new LatentStyleExceptionInfo() { Name = "Colorful Shading Accent 6", UiPriority = 71 };
            LatentStyleExceptionInfo latentStyleExceptionInfo259 = new LatentStyleExceptionInfo() { Name = "Colorful List Accent 6", UiPriority = 72 };
            LatentStyleExceptionInfo latentStyleExceptionInfo260 = new LatentStyleExceptionInfo() { Name = "Colorful Grid Accent 6", UiPriority = 73 };
            LatentStyleExceptionInfo latentStyleExceptionInfo261 = new LatentStyleExceptionInfo() { Name = "Subtle Emphasis", UiPriority = 19, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo262 = new LatentStyleExceptionInfo() { Name = "Intense Emphasis", UiPriority = 21, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo263 = new LatentStyleExceptionInfo() { Name = "Subtle Reference", UiPriority = 31, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo264 = new LatentStyleExceptionInfo() { Name = "Intense Reference", UiPriority = 32, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo265 = new LatentStyleExceptionInfo() { Name = "Book Title", UiPriority = 33, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo266 = new LatentStyleExceptionInfo() { Name = "Bibliography", UiPriority = 37, SemiHidden = true, UnhideWhenUsed = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo267 = new LatentStyleExceptionInfo() { Name = "TOC Heading", UiPriority = 39, SemiHidden = true, UnhideWhenUsed = true, PrimaryStyle = true };
            LatentStyleExceptionInfo latentStyleExceptionInfo268 = new LatentStyleExceptionInfo() { Name = "Plain Table 1", UiPriority = 41 };
            LatentStyleExceptionInfo latentStyleExceptionInfo269 = new LatentStyleExceptionInfo() { Name = "Plain Table 2", UiPriority = 42 };
            LatentStyleExceptionInfo latentStyleExceptionInfo270 = new LatentStyleExceptionInfo() { Name = "Plain Table 3", UiPriority = 43 };
            LatentStyleExceptionInfo latentStyleExceptionInfo271 = new LatentStyleExceptionInfo() { Name = "Plain Table 4", UiPriority = 44 };
            LatentStyleExceptionInfo latentStyleExceptionInfo272 = new LatentStyleExceptionInfo() { Name = "Plain Table 5", UiPriority = 45 };
            LatentStyleExceptionInfo latentStyleExceptionInfo273 = new LatentStyleExceptionInfo() { Name = "Grid Table Light", UiPriority = 40 };
            LatentStyleExceptionInfo latentStyleExceptionInfo274 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo275 = new LatentStyleExceptionInfo() { Name = "Grid Table 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo276 = new LatentStyleExceptionInfo() { Name = "Grid Table 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo277 = new LatentStyleExceptionInfo() { Name = "Grid Table 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo278 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo279 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo280 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo281 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 1", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo282 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 1", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo283 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 1", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo284 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 1", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo285 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 1", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo286 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 1", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo287 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 1", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo288 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 2", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo289 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo290 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 2", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo291 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 2", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo292 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 2", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo293 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 2", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo294 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 2", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo295 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 3", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo296 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 3", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo297 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo298 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 3", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo299 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 3", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo300 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 3", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo301 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 3", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo302 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 4", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo303 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 4", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo304 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 4", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo305 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo306 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 4", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo307 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 4", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo308 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 4", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo309 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 5", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo310 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 5", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo311 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 5", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo312 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 5", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo313 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 5", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo314 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 5", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo315 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 5", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo316 = new LatentStyleExceptionInfo() { Name = "Grid Table 1 Light Accent 6", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo317 = new LatentStyleExceptionInfo() { Name = "Grid Table 2 Accent 6", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo318 = new LatentStyleExceptionInfo() { Name = "Grid Table 3 Accent 6", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo319 = new LatentStyleExceptionInfo() { Name = "Grid Table 4 Accent 6", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo320 = new LatentStyleExceptionInfo() { Name = "Grid Table 5 Dark Accent 6", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo321 = new LatentStyleExceptionInfo() { Name = "Grid Table 6 Colorful Accent 6", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo322 = new LatentStyleExceptionInfo() { Name = "Grid Table 7 Colorful Accent 6", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo323 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo324 = new LatentStyleExceptionInfo() { Name = "List Table 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo325 = new LatentStyleExceptionInfo() { Name = "List Table 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo326 = new LatentStyleExceptionInfo() { Name = "List Table 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo327 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo328 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo329 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo330 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 1", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo331 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 1", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo332 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 1", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo333 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 1", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo334 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 1", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo335 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 1", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo336 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 1", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo337 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 2", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo338 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 2", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo339 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 2", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo340 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 2", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo341 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 2", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo342 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 2", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo343 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 2", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo344 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 3", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo345 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 3", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo346 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 3", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo347 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 3", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo348 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 3", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo349 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 3", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo350 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 3", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo351 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 4", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo352 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 4", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo353 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 4", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo354 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 4", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo355 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 4", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo356 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 4", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo357 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 4", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo358 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 5", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo359 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 5", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo360 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 5", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo361 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 5", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo362 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 5", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo363 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 5", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo364 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 5", UiPriority = 52 };
            LatentStyleExceptionInfo latentStyleExceptionInfo365 = new LatentStyleExceptionInfo() { Name = "List Table 1 Light Accent 6", UiPriority = 46 };
            LatentStyleExceptionInfo latentStyleExceptionInfo366 = new LatentStyleExceptionInfo() { Name = "List Table 2 Accent 6", UiPriority = 47 };
            LatentStyleExceptionInfo latentStyleExceptionInfo367 = new LatentStyleExceptionInfo() { Name = "List Table 3 Accent 6", UiPriority = 48 };
            LatentStyleExceptionInfo latentStyleExceptionInfo368 = new LatentStyleExceptionInfo() { Name = "List Table 4 Accent 6", UiPriority = 49 };
            LatentStyleExceptionInfo latentStyleExceptionInfo369 = new LatentStyleExceptionInfo() { Name = "List Table 5 Dark Accent 6", UiPriority = 50 };
            LatentStyleExceptionInfo latentStyleExceptionInfo370 = new LatentStyleExceptionInfo() { Name = "List Table 6 Colorful Accent 6", UiPriority = 51 };
            LatentStyleExceptionInfo latentStyleExceptionInfo371 = new LatentStyleExceptionInfo() { Name = "List Table 7 Colorful Accent 6", UiPriority = 52 };

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
            latentStyles1.Append(latentStyleExceptionInfo275);
            latentStyles1.Append(latentStyleExceptionInfo276);
            latentStyles1.Append(latentStyleExceptionInfo277);
            latentStyles1.Append(latentStyleExceptionInfo278);
            latentStyles1.Append(latentStyleExceptionInfo279);
            latentStyles1.Append(latentStyleExceptionInfo280);
            latentStyles1.Append(latentStyleExceptionInfo281);
            latentStyles1.Append(latentStyleExceptionInfo282);
            latentStyles1.Append(latentStyleExceptionInfo283);
            latentStyles1.Append(latentStyleExceptionInfo284);
            latentStyles1.Append(latentStyleExceptionInfo285);
            latentStyles1.Append(latentStyleExceptionInfo286);
            latentStyles1.Append(latentStyleExceptionInfo287);
            latentStyles1.Append(latentStyleExceptionInfo288);
            latentStyles1.Append(latentStyleExceptionInfo289);
            latentStyles1.Append(latentStyleExceptionInfo290);
            latentStyles1.Append(latentStyleExceptionInfo291);
            latentStyles1.Append(latentStyleExceptionInfo292);
            latentStyles1.Append(latentStyleExceptionInfo293);
            latentStyles1.Append(latentStyleExceptionInfo294);
            latentStyles1.Append(latentStyleExceptionInfo295);
            latentStyles1.Append(latentStyleExceptionInfo296);
            latentStyles1.Append(latentStyleExceptionInfo297);
            latentStyles1.Append(latentStyleExceptionInfo298);
            latentStyles1.Append(latentStyleExceptionInfo299);
            latentStyles1.Append(latentStyleExceptionInfo300);
            latentStyles1.Append(latentStyleExceptionInfo301);
            latentStyles1.Append(latentStyleExceptionInfo302);
            latentStyles1.Append(latentStyleExceptionInfo303);
            latentStyles1.Append(latentStyleExceptionInfo304);
            latentStyles1.Append(latentStyleExceptionInfo305);
            latentStyles1.Append(latentStyleExceptionInfo306);
            latentStyles1.Append(latentStyleExceptionInfo307);
            latentStyles1.Append(latentStyleExceptionInfo308);
            latentStyles1.Append(latentStyleExceptionInfo309);
            latentStyles1.Append(latentStyleExceptionInfo310);
            latentStyles1.Append(latentStyleExceptionInfo311);
            latentStyles1.Append(latentStyleExceptionInfo312);
            latentStyles1.Append(latentStyleExceptionInfo313);
            latentStyles1.Append(latentStyleExceptionInfo314);
            latentStyles1.Append(latentStyleExceptionInfo315);
            latentStyles1.Append(latentStyleExceptionInfo316);
            latentStyles1.Append(latentStyleExceptionInfo317);
            latentStyles1.Append(latentStyleExceptionInfo318);
            latentStyles1.Append(latentStyleExceptionInfo319);
            latentStyles1.Append(latentStyleExceptionInfo320);
            latentStyles1.Append(latentStyleExceptionInfo321);
            latentStyles1.Append(latentStyleExceptionInfo322);
            latentStyles1.Append(latentStyleExceptionInfo323);
            latentStyles1.Append(latentStyleExceptionInfo324);
            latentStyles1.Append(latentStyleExceptionInfo325);
            latentStyles1.Append(latentStyleExceptionInfo326);
            latentStyles1.Append(latentStyleExceptionInfo327);
            latentStyles1.Append(latentStyleExceptionInfo328);
            latentStyles1.Append(latentStyleExceptionInfo329);
            latentStyles1.Append(latentStyleExceptionInfo330);
            latentStyles1.Append(latentStyleExceptionInfo331);
            latentStyles1.Append(latentStyleExceptionInfo332);
            latentStyles1.Append(latentStyleExceptionInfo333);
            latentStyles1.Append(latentStyleExceptionInfo334);
            latentStyles1.Append(latentStyleExceptionInfo335);
            latentStyles1.Append(latentStyleExceptionInfo336);
            latentStyles1.Append(latentStyleExceptionInfo337);
            latentStyles1.Append(latentStyleExceptionInfo338);
            latentStyles1.Append(latentStyleExceptionInfo339);
            latentStyles1.Append(latentStyleExceptionInfo340);
            latentStyles1.Append(latentStyleExceptionInfo341);
            latentStyles1.Append(latentStyleExceptionInfo342);
            latentStyles1.Append(latentStyleExceptionInfo343);
            latentStyles1.Append(latentStyleExceptionInfo344);
            latentStyles1.Append(latentStyleExceptionInfo345);
            latentStyles1.Append(latentStyleExceptionInfo346);
            latentStyles1.Append(latentStyleExceptionInfo347);
            latentStyles1.Append(latentStyleExceptionInfo348);
            latentStyles1.Append(latentStyleExceptionInfo349);
            latentStyles1.Append(latentStyleExceptionInfo350);
            latentStyles1.Append(latentStyleExceptionInfo351);
            latentStyles1.Append(latentStyleExceptionInfo352);
            latentStyles1.Append(latentStyleExceptionInfo353);
            latentStyles1.Append(latentStyleExceptionInfo354);
            latentStyles1.Append(latentStyleExceptionInfo355);
            latentStyles1.Append(latentStyleExceptionInfo356);
            latentStyles1.Append(latentStyleExceptionInfo357);
            latentStyles1.Append(latentStyleExceptionInfo358);
            latentStyles1.Append(latentStyleExceptionInfo359);
            latentStyles1.Append(latentStyleExceptionInfo360);
            latentStyles1.Append(latentStyleExceptionInfo361);
            latentStyles1.Append(latentStyleExceptionInfo362);
            latentStyles1.Append(latentStyleExceptionInfo363);
            latentStyles1.Append(latentStyleExceptionInfo364);
            latentStyles1.Append(latentStyleExceptionInfo365);
            latentStyles1.Append(latentStyleExceptionInfo366);
            latentStyles1.Append(latentStyleExceptionInfo367);
            latentStyles1.Append(latentStyleExceptionInfo368);
            latentStyles1.Append(latentStyleExceptionInfo369);
            latentStyles1.Append(latentStyleExceptionInfo370);
            latentStyles1.Append(latentStyleExceptionInfo371);

            Style style1 = new Style() { Type = StyleValues.Paragraph, StyleId = "a", Default = true };
            StyleName styleName1 = new StyleName() { Val = "Normal" };
            PrimaryStyle primaryStyle1 = new PrimaryStyle();
            Rsid rsid18 = new Rsid() { Val = "003A20E4" };

            StyleParagraphProperties styleParagraphProperties1 = new StyleParagraphProperties();
            OverflowPunctuation overflowPunctuation1 = new OverflowPunctuation() { Val = false };
            AutoSpaceDE autoSpaceDE1 = new AutoSpaceDE() { Val = false };
            AutoSpaceDN autoSpaceDN1 = new AutoSpaceDN() { Val = false };
            AdjustRightIndent adjustRightIndent1 = new AdjustRightIndent() { Val = false };
            SpacingBetweenLines spacingBetweenLines24 = new SpacingBetweenLines() { After = "0", Line = "240", LineRule = LineSpacingRuleValues.Auto };
            TextAlignment textAlignment1 = new TextAlignment() { Val = VerticalTextAlignmentValues.Baseline };

            styleParagraphProperties1.Append(overflowPunctuation1);
            styleParagraphProperties1.Append(autoSpaceDE1);
            styleParagraphProperties1.Append(autoSpaceDN1);
            styleParagraphProperties1.Append(adjustRightIndent1);
            styleParagraphProperties1.Append(spacingBetweenLines24);
            styleParagraphProperties1.Append(textAlignment1);

            StyleRunProperties styleRunProperties1 = new StyleRunProperties();
            RunFonts runFonts2 = new RunFonts() { Ascii = "Times New Roman", HighAnsi = "Times New Roman", EastAsia = "Times New Roman", ComplexScript = "Times New Roman" };
            FontSize fontSize323 = new FontSize() { Val = "20" };
            FontSizeComplexScript fontSizeComplexScript322 = new FontSizeComplexScript() { Val = "20" };
            Languages languages233 = new Languages() { Val = "en-US", EastAsia = "ru-RU" };

            styleRunProperties1.Append(runFonts2);
            styleRunProperties1.Append(fontSize323);
            styleRunProperties1.Append(fontSizeComplexScript322);
            styleRunProperties1.Append(languages233);

            style1.Append(styleName1);
            style1.Append(primaryStyle1);
            style1.Append(rsid18);
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
            TableIndentation tableIndentation1 = new TableIndentation() { Width = 0, Type = TableWidthUnitValues.Dxa };

            TableCellMarginDefault tableCellMarginDefault1 = new TableCellMarginDefault();
            TopMargin topMargin1 = new TopMargin() { Width = "0", Type = TableWidthUnitValues.Dxa };
            TableCellLeftMargin tableCellLeftMargin1 = new TableCellLeftMargin() { Width = 108, Type = TableWidthValues.Dxa };
            BottomMargin bottomMargin1 = new BottomMargin() { Width = "0", Type = TableWidthUnitValues.Dxa };
            TableCellRightMargin tableCellRightMargin1 = new TableCellRightMargin() { Width = 108, Type = TableWidthValues.Dxa };

            tableCellMarginDefault1.Append(topMargin1);
            tableCellMarginDefault1.Append(tableCellLeftMargin1);
            tableCellMarginDefault1.Append(bottomMargin1);
            tableCellMarginDefault1.Append(tableCellRightMargin1);

            styleTableProperties1.Append(tableIndentation1);
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

            styles1.Append(docDefaults1);
            styles1.Append(latentStyles1);
            styles1.Append(style1);
            styles1.Append(style2);
            styles1.Append(style3);
            styles1.Append(style4);

            styleDefinitionsPart1.Styles = styles1;
        }

        // Generates content of customFilePropertiesPart1.
        private void GenerateCustomFilePropertiesPart1Content(CustomFilePropertiesPart customFilePropertiesPart1)
        {
            Op.Properties properties2 = new Op.Properties();
            properties2.AddNamespaceDeclaration("vt", "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes");

            Op.CustomDocumentProperty customDocumentProperty1 = new Op.CustomDocumentProperty() { FormatId = "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}", PropertyId = 2, Name = "ContentTypeId" };
            Vt.VTLPWSTR vTLPWSTR1 = new Vt.VTLPWSTR();
            vTLPWSTR1.Text = "0x010100714B20FE7CA2F44885D5D702E37D73F4";

            customDocumentProperty1.Append(vTLPWSTR1);

            properties2.Append(customDocumentProperty1);

            customFilePropertiesPart1.Properties = properties2;
        }

        private void SetPackageProperties(OpenXmlPackage document)
        {
            document.PackageProperties.Creator = "Irina";
            document.PackageProperties.Revision = "6";
            document.PackageProperties.Created = System.Xml.XmlConvert.ToDateTime("2021-03-15T08:14:00Z", System.Xml.XmlDateTimeSerializationMode.RoundtripKind);
            document.PackageProperties.Modified = System.Xml.XmlConvert.ToDateTime("2021-03-19T06:49:00Z", System.Xml.XmlDateTimeSerializationMode.RoundtripKind);
            document.PackageProperties.LastModifiedBy = "Pavel Boltromyuk";
        }


    }
}
