const excel = require('excel4node');
const fs = require('fs');

const readJsonFile = (filename) => {
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData);
};

const fillWorksheet = (worksheet, translations) => {
    const keys = Object.keys(translations);

    keys.forEach((key, index) => {
        worksheet.cell(index + 1, 1).string(key);
        worksheet.cell(index + 1, 2).string(translations[key]);
    });
};

const removeFile = (filename) => {
    try {
        fs.unlinkSync(filename);
    } catch (e) {}
};

const prettifyWorksheet = (worksheet) => {
    worksheet.column(1).setWidth(100);
    worksheet.column(2).setWidth(100);
};

const enTranslations = readJsonFile('translations_en.json');
const ruTranslations = readJsonFile('translations_ru.json');

const excelFilename = 'Translations.xlsx';

removeFile(excelFilename);

let workbook = new excel.Workbook();

let enWorksheet = workbook.addWorksheet('en');
let ruWorksheet = workbook.addWorksheet('ru');

prettifyWorksheet(enWorksheet);
prettifyWorksheet(ruWorksheet);

fillWorksheet(enWorksheet, enTranslations);
fillWorksheet(ruWorksheet, ruTranslations);

workbook.write(excelFilename);
