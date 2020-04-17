## Pre requirements
npm, node v4 or higher

## Install dependencies for convertToExcel
1) cd <translations-folder>
2) npm i -g excel4node
3) npm link excel4node

## Install dependencies for convertToJSON
1) cd <translations-folder>
2) npm i -g exceljs
3) npm link exceljs


## Run script for convertToExcel
node convertToExcel.js

## Run script for convertToJSON
node convertToJson.js


## How to change localization file (Translations.xlsx):
1) Make relevant changes in json files (translations_en.json - for english locale, translations_ru.json - for russian locale)
2) run script
3) commit all changes (json files + excel file)
