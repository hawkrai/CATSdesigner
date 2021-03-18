const Excel = require('exceljs');
const fs = require('fs');

const writeFile = (filename, json) => {
    fs.writeFile(filename, JSON.stringify(json), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing " + filename);
            return console.log(err);
        }
        console.log(filename + "file has been saved.");
    });
};

const convert = () => {
    const workbook = new Excel.Workbook();
    let jsonEn = {};
    let jsonRu = readJsonFile('translations_ru.json');
    workbook.xlsx.readFile('Translations.xlsx')
        .then(function () {
            const worksheetEn = workbook.getWorksheet(1);
            const worksheetRu = workbook.getWorksheet(2);
            worksheetEn._rows.forEach(value => {
                jsonEn[value.getCell(1).text] = value.getCell(2).text;
            });
            worksheetRu._rows.forEach(value => {
                if (value.getCell(1).style.fill) {
                    jsonRu[value.getCell(1).text] = value.getCell(2).text;
                }
            });
            writeFile("translations_en.json" , jsonEn);
            writeFile("translations_ru.json" , jsonRu);
        })
};


const readJsonFile = (filename) => {
    const rawData = fs.readFileSync(filename);
    return JSON.parse(rawData);
};

convert();

