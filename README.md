# Инструкция по запуску проекта

## 1. Бэкенд

### Основной бэкенд (.NET Framework 4.8)

Эта инструкция описывает настройку основного бэкенда на локальном IIS.

#### Шаг 1: Настройка базы данных (Docker + MS SQL Server)

1.  Установите [Docker Desktop](https://www.docker.com/products/docker-desktop/). Он необходим для запуска базы данных в контейнере.

2.  Запустите контейнер MS SQL Server в Docker. Выполните в терминале команду:

    ```bash
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Password1" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
    ```

    _Эта команда скачает образ MS SQL Server 2022, запустит контейнер, установит пароль `Password1` для пользователя `sa` и пробросит порт `1433` на ваш локальный компьютер._

3.  Скопируйте файл бэкапа базы данных (`.bak`) внутрь контейнера.
    Чтобы узнать `id_контейнера`, выполните `docker ps`. Затем используйте команду `docker cp`:

    ```bash
    # Пример для Windows PowerShell
    docker cp <путь_к_файлу\LMPlatform.bak> <ID_контейнера>:/var/opt/mssql/data
    ```

4.  Восстановите базу данных из бэкапа. Выполните следующий SQL-запрос через любой удобный инструмент (Azure Data Studio или прямо из кода):
    ```sql
    USE [master]
    RESTORE DATABASE [LMPlatform] FROM DISK = N'/var/opt/mssql/data/LMPlatform.bak' WITH  FILE = 1,  NOUNLOAD,  REPLACE,  STATS = 5
    ```

#### Шаг 2: Настройка проекта в Visual Studio и IIS

5.  В файле `api/LMPlatform.UI/Web.config` замените `connectionString` на следующий:

    ```xml
    <connectionStrings>
      <add name="LMPlatform" connectionString="server=localhost,1433;database=LMPlatform;User ID=sa;password=Password1" providerName="System.Data.SqlClient" />
    </connectionStrings>
    ```

6.  Включите необходимые компоненты Windows.
    Перейдите в `Панель управления` -> `Программы` -> `Включение или отключение компонентов Windows` и убедитесь, что включены следующие компоненты:

    - **.NET Framework 4.8 Advanced Services** -> **Службы WCF** -> **Активация по HTTP**
    - **Службы IIS** (Internet Information Services)
      - **Службы Интернета** -> **Компоненты разработки приложений** -> **ASP.NET 4.8**
      - Убедитесь, что основные компоненты в **"Службы Интернета"** также включены (Общие компоненты HTTP и т.д.).
    - **Компоненты для работы с мультимедиа** -> **Проигрыватель Windows Media**

7.  Настройте права доступа для папки `api`.

    1.  Нажмите ПКМ на папке `api` -> `Свойства` -> вкладка `Безопасность`.
    2.  Нажмите `Изменить` (Edit), затем `Добавить` (Add).
    3.  В поле для имен введите `IIS_IUSRS;IIS APPPOOL\DefaultAppPool`, нажмите `Проверить имена` (Check Names) и `ОК`.
    4.  Для пользователя `DefaultAppPool` установите все галочки в колонке `Разрешить` (`Полный доступ` / Full control) и примените изменения.

8.  Если возникают проблемы с доступом, может потребоваться отредактировать файл `C:\Windows\System32\inetsrv\config\applicationHost.config`, заменив некоторые правила `Deny` на `Allow`. **Внимание:** Это изменение влияет на всю систему IIS.

9.  Откройте решение `api/LMPlatform.sln` в Visual Studio **от имени администратора**.

10. Настройте свойства проекта `LMPlatform.UI`:

    1.  В обозревателе решений нажмите ПКМ на проекте `LMPlatform.UI` -> `Свойства` (Properties).
    2.  Перейдите на вкладку `Веб` (Web).
    3.  В разделе `Серверы` (Servers) измените `IIS Express` на `Локальный IIS` (Local IIS).
    4.  URL-адрес проекта (Project Url) должен указывать на `https`, например `https://localhost/LMPlatform.UI`.

11. Нажмите кнопку `Создать виртуальный каталог` (Create Virtual Directory).
    - **Если возникает ошибка:** Скорее всего, для `https` не настроены привязки в IIS.
    - **Решение:**
      1.  Откройте `Диспетчер служб IIS` (IIS Manager).
      2.  В дереве слева раскройте `Сайты` (Sites) -> `Default Web Site`.
      3.  Справа выберите `Привязки` (Bindings).
      4.  Нажмите `Добавить` (Add), выберите тип `https`, порт `443`.
      5.  Вернитесь в Visual Studio и снова нажмите `Создать виртуальный каталог`.

### Микросервис чата (.NET 8)

1.  Скачайте и установите **[.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** с официального сайта Microsoft.
2.  Откройте файл `appsettings.Development.json` в проекте микросервиса (`ChatServer`).
3.  Измените строку подключения `DefaultConnection`, чтобы она указывала на вашу локальную базу данных (ту же, что и для основного бэкенда):

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Data Source=localhost,1433;Initial Catalog=LMPlatform;User ID=sa;Password=Password1;TrustServerCertificate=True"
      }
      // ...
    }
    ```

    _Примечание: `TrustServerCertificate=True` может быть необходим для подключения к SQL Server из .NET 8._

4.  В Visual Studio нажмите ПКМ на проекте `ChatServer` в Обозревателе решений и выберите `Пересобрать` (Rebuild), чтобы убедиться, что все зависимости установлены.
5.  Установите `ChatServer` в качестве запускаемого проекта (ПКМ на проекте -> `Set as Startup Project`).
6.  Запустите проект (клавиша `F5` или зеленая кнопка "Play"). После запуска должна открыться консоль микросервиса и новая вкладка в браузере. **Не закрывайте их**, пока пользуетесь приложением.

## 2. Фронтенд

#### Шаг 1: Подготовка окружения

1.  Клонируйте репозиторий:

    ```bash
    git clone https://github.com/hawkrai/CATSdesigner
    ```

2.  Установите [nvm](https://github.com/nvm-sh/nvm), затем установите нужную версию Node.js:

    ```bash
    nvm install 14.16.1
    nvm use 14.16.1
    ```

3.  Установите и соберите модули (результат — каталог `.temp` в корне проекта):

    - **MacOS:**

      ```bash
      scripts/build_modules.sh
      ```

    - **Windows:**
      ```bat
      scripts/build_modules.bat
      ```

#### Шаг 2: Связка с бэкендом

4.  Откройте файл `server/src/app.ts` для редактирования. В этом файле нужно указать локальные адреса для основного бэкенда и микросервиса чата.

    - **Настройте основной бэкенд:**
      Найдите константу `TARGET_DOMAIN` и замените ее значение на URL вашего локального IIS-сервера.

      ```typescript
      // Было:
      // const TARGET_DOMAIN = 'https://educats.by'

      // Стало:
      const TARGET_DOMAIN = 'https://localhost/LMPlatform.UI'
      ```

    - **Настройте микросервис чата:**
      Найдите константу `TARGET_CHAT_DOMAIN` и замените ее значение на URL, по которому запустился ваш микросервис чата (если он отличается).

#### Шаг 3: Запуск

5.  Запустите сервер разработки:

    ```bash
    cd server
    npm run start
    npm run watch
    ```

6.  Запустите сборку нужного модуля, например `container`:

    ```bash
    cd modules/container
    npm run build
    ```

7.  Убедитесь, что в вашей IDE установлены и настроены плагины ESLint и Prettier для форматирования кода при сохранении ([autosave](https://stackoverflow.com/questions/39494277/how-do-you-format-code-on-save-in-vs-code)).

## 3. Порядок запуска

Для полноценной работы приложения все компоненты должны быть запущены в правильном порядке:

1.  **База данных:** Убедитесь, что контейнер Docker с MS SQL Server запущен.
2.  **Основной бэкенд:** Запустите проект `LMPlatform.UI` из Visual Studio. Он будет работать на вашем локальном IIS.
3.  **Микросервис чата:** Запустите проект `ChatServer` из Visual Studio.
4.  **Фронтенд:** Запустите сервер разработки (`npm run watch`) и сборку необходимого модуля.
5.  Откройте в браузере адрес фронтенда (`http://localhost:3000`).
