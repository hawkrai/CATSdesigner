# Educats CLI

Educats CLI представляет собой утилиту, которая помогает работать с модулями, 
а точнее, устанавливать/удалять библиотеки, собирает проект с нужной конфигурацией.

Ниже будет представлены команды и их применение, а также параметры, 
которые они принимают и их описание.

## Основы использования

Перед тем, как перейти к командам, необходимо знать общие сведения о том, 
как пользоваться Educats CLI. Чтобы запустить утилиту, необходимо открыть 
консоль так, чтобы путь указывал до местонахождения утилиты. Для проверки 
работоспособности утилиты, введем следующую команду:

```shell
.\educats.exe --help

# Вывод данной команды
Usage: educats.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  install    Installs the libraries specified in the package.a json file.
  uninstall  Deletes the folder node_modules and package-lock.json file...
  reinstall  Reinstalls the modules specified in the package.json file.
  build      Builds modules with the specified configuration.
  rebuild    Rebuilds modules with the specified configuration.
  list       Displays a list of found modules.
```

Для получения справки о конкретной команде, можно воспользоваться опцией --help.

```shell
Usage: educats.py install [OPTIONS]

  Installs the libraries specified in the package.a json file.

Options:
  -m, --modules TEXT  Specifies the name of the modules to be installed.
  -e, --exclude TEXT  Specifies the names of modules to be excluded.
  -s, --silent        Specifies whether to output npm logs to the console or
                      not.
  --help              Show this message and exit.
```

Так же работу утилиты можно настроить, изменив параметры конфигурационного файла. 
Подробности смотрите ниже.

## Команда ```install```

Команда ```install``` устанавливает библиотеки, указанные в файле ```package.json```.

Принимает:
1. ```-m, --modules TEXT```, где ```TEXT``` - список модулей.
2. ```-e, --exclude TEXT```, где ```TEXT``` - список модулей, которые надо исключить.
3. ```-s, --silent``` - флаг, указывает, выводить ли информацию в консоль или нет.

```shell
# Установить все модули
.\educats.exe install

# Установить нужный модуль
.\educats.exe install -m admin
.\educats.exe install --modules admin

# Установить несколько модулей
.\educats.exe install -m "container server"
.\educats.exe install --modules "container server"
```

## Команда ```uninstall```

Команда ```uninstall``` удаляет папку ```node_modules``` и файл ```package-lock.json```.

Принимает:
1. ```-m, --modules TEXT```, где `TEXT` - список модулей.
2. ```-e, --exclude TEXT```, где `TEXT` - список модулей, которые надо исключить.
3. ```-p, --package-lock``` - флаг, указывает, удалять ли `package-lock.json` или нет.

```shell
# Удалить все модули
.\educats.exe uninstall

# Удалить нужный модуль
.\educats.exe uninstall -m admin
.\educats.exe uninstall --modules admin

# Удалить несколько модулей
.\educats.exe uninstall -m "container server"
.\educats.exe uninstall --modules "container server"
```

## Команда ```reinstall```

Команда ```reinstall``` является объединением команды ```uninstall``` и ```install```. 
Она сначала удаляет ```node_modules``` и ```package-lock.json```, а затем устанавливает 
библиотеки из ```package.json```. 

Принимает:
1. ```-m, --modules TEXT```, где ```TEXT``` - список модулей.
2. ```-e, --exclude TEXT```, где ```TEXT``` - список модулей, которые надо исключить.
3. ```-s, --silent``` - флаг, указывает, выводить ли информацию в консоль или нет.
4. ```-p, --package-lock``` - флаг, указывает, удалять ли `package-lock.json` или нет.

```shell
# Переустановить все модули
.\educats.exe reinstall

# Переустановить нужный модуль
.\educats.exe reinstall -m admin
.\educats.exe reinstall --modules admin

# Переустановить несколько модулей
.\educats.exe reinstall -m "container server"
.\educats.exe reinstall --modules "container server"
```

## Команда ```build```

Команда ```build``` собирает проект нужной конфигурации.

Принимает:
1. ```-m, --modules TEXT```, где ```TEXT``` - список модулей.
2. ```-e, --exclude TEXT```, где ```TEXT``` - список модулей, которые надо исключить.
3. ```-c, --configuration [stage|production]```, где ```[stage|production]``` - варианты 
конфигурации, где ```stage``` является вариантом по умолчанию.

```shell
# Собрать все модули с конфигурацией stage
.\educats.exe build

# Собрать нужный модуль
.\educats.exe build -m admin
.\educats.exe build --modules admin

# Собрать нужный модуль с конфигурацией production
.\educats.exe build -m admin -c production
.\educats.exe build --modules admin --configuration production

# Собрать несколько модулей с конфигурацией production
.\educats.exe build -m "container server" -c production
.\educats.exe build --modules "container server" --configuration production
```

## Команда ```rebuild```

Команда ```rebuild``` является объединением команды ```uninstall```, ```install``` и 
```build```. Сначала удаляются ```node_modules``` и ```package-lock.json```, 
затем производиться скачивание библиотек из ```package.json```, и после 
скачивания, собирается сам модуль с нужной конфигурацией.

Принимает:
1. ```-m, --modules TEXT```, где ```TEXT``` - список модулей.
2. ```-e, --exclude TEXT```, где ```TEXT``` - список модулей, которые надо исключить.
3. ```-s, --silent``` - флаг, указывает, выводить ли информацию в консоль или нет.
4. ```-p, --package-lock``` - флаг, указывает, удалять ли `package-lock.json` или нет.
5. ```-c, --configuration [stage|production]```, где ```[stage|production]``` - варианты 
конфигурации, где ```stage``` является вариантом по умолчанию.


```shell
# Собрать все модули с конфигурацией stage
.\educats.exe rebuild

# Собрать нужный модуль
.\educats.exe rebuild -m admin
.\educats.exe rebuild --modules admin

# Собрать нужный модуль с конфигурацией production
.\educats.exe rebuild -m admin -c production
.\educats.exe rebuild --modules admin --configuration production

# Собрать несколько модулей с конфигурацией production
.\educats.exe rebuild -m "container server" -c production
.\educats.exe rebuild --modules "container server" --configuration production
```

## Команда ```list```

Команда ```list``` возвращает список модулей, которые были найдены.

Данная команда ничего не принимает.

```shell
# Выводит список найденных модулей.
.\educats.exe list
```

## Настройка ```config.toml```

Файл ```config.toml``` предназначен для настройки работы утилиты. Он имеет следующие поля:

* ```relative_modules_path_list``` - хранит относительные пути, в которых нужно 
искать модули.
* ```exclude_modules_for_install``` - хранит массив относительных путей до тех модулей, 
которые нужно исключить при установке.
* ```exclude_modules_for_uninstall``` - хранит массив относительных путей до тех модулей, 
которые нужно исключить при удалении.
* ```exclude_modules_for_reinstall``` - хранит массив относительных путей до тех модулей, 
которые нужно исключить при переустановке.
* ```exclude_modules_for_build``` - хранит массив относительных путей до тех модулей, 
которые нужно исключить при сборке.
* ```exclude_modules_for_rebuild``` - хранит массив относительных путей до тех модулей, 
которые нужно исключить при пересборке.

# О проекте

Данная утилита была разработана специально для упрощения и автоматизации работы с 
модулями для проекта [Educats](https://github.com/hawkrai/CATSdesigner). 

Ссылка на репозитории данного проекта [Educats CLI](https://github.com/notsecret32/educats-cli).