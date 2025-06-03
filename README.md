# Инструкция по запуску фронтенда

## Подтянуть репозиторий

0) подтянуть репозиторий:
```
git clone https://github.com/hawkrai/CATSdesigner
```

1) установить [nvm](https://github.com/nvm-sh/nvm), далее установить node:
```
nvm install 14.16.1
nvm use 14.16.1
```

2) установка и билд модулей (результат - каталог .temp в корне проекта):
#### MacOS:
```
scripts/build_modules.sh
```

#### Windows:
```
scripts/build_modules.bat
```

3) запуск сервера:
```
cd server
npm run watch
```

4) запуск нужного модуля:
```
cd modules/container
npm run build
```

5) проверить, что в IDE установлены плагины eslint и prettier, а также срабатывают на [autosave](https://stackoverflow.com/questions/39494277/how-do-you-format-code-on-save-in-vs-code)