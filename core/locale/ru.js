module.exports = {
    "com": {
        "ability": {
            "conflict": "Способность не найдена. Возможные конфликты: %s",
            "nothing": "Ничего не нашлось."
        },
        "admin": {
            "main": {
                "cspcd": "Задержки по каналам: `%s`",
                "mspcd": "Задержки по пользователям: `%s`",
                "cuspre": "Свой префикс: `%s`",
                "tricha": "Канал для игр: %s",
                "notricha": "нет",
                "disa": "Отключенные в этом канале команды: %s",
                "nodisa": "В этом канале нет отключенных команд."
            },
            "cooldowns": {
                "confirm": ":ok_hand: Задана задержка канала %1$s: %2$s секунд.", // Set [channel] limit to [3] seconds.
                "channel": "канал",
                "member": "пользователь"
            },
            "disable": {
                "confirmsome": ":ok_hand: Отключенные в этом канале команды: %s",
                "confirmnone": ":ok_hand: В этом канале нет отключенных команд.",
                "error": "Для начала отключи какие-нибудь команды!"
            },
            "locale": {
                "confirm": ":ok_hand: Language set to `%s`.",
                "error": "Can't set to this language! Available langauges: `%s`"
            },
            "prefix": {
                "confirm": ":ok_hand: Префикс теперь будет `%s`."
            },
            "trivia": {
                "enable": ":ok_hand: Канал для игр теперь <#%s>.",
                "disable": ":ok_hand: Канал ля игр отключен."
            }
        },
        "help": {
            "notfound": "Неизвестная тема помощи: `%s`\n",
            "list": "Список команд:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "hero",
                "usage": "hero <имя героя>",
                "summary": "выдает простую статиску и названия способностей героя.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<версия>] <имя героя>",
                "summary": "выдает последние изменения над героем в доте из последнего балансирующего патча.",
                "text": [
                    "\n`%spatch <имя героя>`: последний балансирующий патч для героя.",
                    "\n`%spatch <версия> <имя героя>`: патч для героя из определенной версии."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <герой>",
                "summary": "выдает текущие таланты определенного героя.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<герой>] <способность>",
                "summary": "выдает информацию о способности героя.",
                "text": [
                    "существует несколько алиасов для способностей, Вы можете найти их все",
                    "просто используя команды! героя не обязательно указывать."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <название вещи>",
                "summary": "ищет и выдает вещь по названию.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <имя героя>",
                "summary": "выдает ссылку на определенного героя в dota 2 вики.",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <имя героя>",
                "summary": "выдает список всех патчей из базы данных в которых герой получил изменения.",
                "example": "list beastmaster"
            }],
            "personal": [{
                "name": "register",
                "usage": "register <профиль в steam, ссылка на dotabuff или opendota>",
                "summary": "регистрирует в боте Ваш профиль steam.",
                "text": [
                    "принимает ссылку на профиль в steam или dotabuff/opendota.",
                    "бот отправит вам запрос в друзья в steam",
                    "и личное сообщение с инструкциями в discord.",
                    "**убедитесь в том что ваш steam профиль публичен и в discord",
                    "Вы не запретили аккаунтам писать вам в личные сообщения!**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "отменяет регистрацию вашего аккаунта в боте."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <пользователь>",
                "summary": "возвращает простую информацию из профиля определенного человека.",
                "text": [
                    "принимает ссылку на dotabuff/opendota или упоминание юзернейма (если пользователь",
                    "зарегистрирован.)"
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <ссылка на матч или его ID>",
                "summary": "возвращает информацию об определенном матче.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "находит последний матч сыгранный кем-то.",
                "text": [
                    "\n`with <игроком>`: добавляет Вас в поиск игроков",
                    "\n`of <игрока>`: только ищет определенный матч между этими игроками",
                    "\n`as <игрок>`: добавляет фильтр по герою к первому найденному пользователю"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["lastgame"]
            }, {
                "name": "history",
                "usage": "history [with <человеком>] OR [of <человека>] [as <герой>]",
                "summary": "Ищет историю кого-то как героя или историю между двумя игроками.",
                "text": [
                    "\n`with <игроком>`: показывает частоту побед с или против Вас и кого-то еще",
                    "\n`of <игрока> as <герой>`: показывает чью-то частоту побед на определенном герое",
                    "\n`as <герой>`: показывает Вашу частоту побед за определенного героя"
                ],
                "example": "history with frosty",
            }, {
                "name": "matches",
                "usage": "matches [as <герой>] and/or with <человеком>] and/or [of <человека>]",
                "summary": "возвращает чьи-либо последние 12 игр.",
                "text": [
                    "фильтр по герою или человеку."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "возвращает ммр пользователя или сервера.",
                "text": [
                    "\n`%smmr`: возвращает Ваш ммр.",
                    "\n`%smmr of [пользователь]`: возвращает ммр зарегистрированного пользователя.",
                    "\n`%smmr all`: возвращает топ всего сервера."
                ]
            }],
            "esports": [{
                "name": "gosu",
                "summary": "some commands for pro games",
                "text": [
                    "\n`%sgosu list`: lists 8 upcoming pro games"
                ]
            }, {
                "name": "prommr",
                "summary": "lists highest mmr players on valve's leaderboards",
                "example": "prommr europe",
                "usage": "prommr <region>"
            }, {
                "name": "twitch",
                "summary": "commands for twitch.tv",
                "text": [
                    "\n`%stwitch clip`: returns a random twitch clip from trending clips.",
                    "\nlist updated every hour.",
                    "\n`%stwitch list [<locale>]`: returns top 5 streams. optional: 2 char language code."
                ]
            }],
            "fun": [{
                "name": "courage",
                "summary": "возвращает случайно образованный набор вещей.",
            }, {
                "name": "trivia",
                "summary": "набор команд для игры в викторину.",
                "text": [
                    "\n`%strivia start`: начинает игру.",
                    "\n`%strivia stop`: останавливает её.",
                    "\n`%strivia top`: топ всех пользователей в этом сервере.",
                    "\n`%strivia top all`: топ всех пользователей везде.",
                    "\n`%strivia points`: Ваша статистика.",
                    "\n`%strivia points [пользователь]`: чья-либо статистика.",
                    "\n`%strivia stats`: статистика о самой игре."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "<:ixmikeW:256896118380691466>",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "возвращает информацию о боте.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "возвращает ссылку для добавления бота на свой сервер"
            }, {
                "name": "botstats",
                "summary": "возвращает статистику о боте"
            }, {
                "name": "help",
                "usage": "help [<тема>]",
                "summary": "возвращает список тем команд, которые можно использовать чтобы получить специфичную информацию о теме.",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "возвращает текущую конфигурацию сервера."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <новый префикс>",
                "summary": "изменяет префикс на сервере (но бот также будет отвечать на `--`)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <канал или пользователь> <время в секундах>",
                "summary": "задает задержки на сервере для пользователей или каналов.",
                "text": [
                    "например, если задержка канала - 10 - то 10 секунд должно пройти до того как следующая команда будет произведена.",
                    "все ранее написанные команды будут проигнорированы.",
                    "\n\nрекомендованые задержки: 10 секунд на пользователя и 5 секунд на канал. \nстандарная задержка: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [команды]",
                "summary": "отключает набор команд в канале.",
                "text": [
                    "но: нельзя отключить команды из групп admin и meta.",
                    "используйте команду admin саму по себе чтобы увидеть выключенные в канале команды."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [команды]",
                "summary": "включает список выключенных команд в канале.",
                "text": [
                    "используйте команду admin саму по себе чтобы увидеть выключенные в канале команды."
                ],
                "example": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "настраивает канал в котором проходит игра в викторину.",
                "text": [
                    "\n`%sadmin trivia channel [#канал]`: задает #канал для игр.",
                    "\n`%sadmin trivia channel here`: делает текущий канал каналом для игр.",
                    "\n`%sadmin trivia channel none`: вообще отключает игру."
                ]
            }, {
                "name": "admin locale",
                "summary": "changes language of bot on this server"
            }]
        },
        "history": {
            "main": {
                "error": "Неправильный синтакс."
            },
            "as": {
                "embed": {
                    "title": "%s за %s",
                    "wins": "**Победы:** %s",
                    "games": "**Игры:** %s",
                    "wr": "**Частота побед:** %s%%"
                }
            },
            "with": {
                "spelling": "Что-то пошло не так. Перепроверьте названия игроков и попробуйте снова.",
                "nodata": "Мне не хватает информации для этой команды!",
                "embed": {
                    "desc": "История между <@%s> и <@%s>",
                    "same": "Та же команда",
                    "wl": "**Победы/Проигрыши:** %s/%s (%s игр)",
                    "wr": "**Частота побед:** %s%%",
                    "diff": "Разные команды",
                    "wins": "**Победы <@%s>:** %s"
                }
            }
        },
        "info": {
            "me": "Бот с командами для Dota 2. Свяжитесь с %s по вопросам и помощи (На Английском)!",
            "onlinehelp": "Помощь Онлайн",
            "invitelink": "Ссылка для добавления",
            "helpserver": "Сервер для помощи (Англ.)", // say like (EN) here or something
            "specialthanks": "Благодарности",
            "alphatest": "Альфа-тестировщики",
            "translators": "Переводчики",
            "githublog": "История GitHub",
            "links": "Ссылки"
        },
        "item": {
            "noitem": "Вещь не нашлась.",
            "conflicts": "Возможные конфликты: %s"
        },
        "matches": {
            "header": "Используйте `%smatchinfo` чтобы получить больше информации об определенном матче."
        },
        "matchinfo": {
            "error": "Я не нашел ID матча в этом сообщении!"
        },
        "mmr": {
            "loading": "Подождите, я загружаю последнюю информацию.",
            "nomember": "Пожалуйста задайте пользователя.",
            "cantmember": "Данный пользователь не нашелся.",
            "notregistered": "%s еще не зарегистрировался! Попробуйте `%shelp register`."
        },
        "patch": {
            "noversion": "Эта версия не нашлась. Вот последняя:"
        },
        "playerinfo": {
            "nouser": "Этот пользователь еще не зарегистрировался! Попробуйте `%shelp register`.",
            "noid": "Я не нашел ID аккаунта в этом сообщении!"
        },
        "restart": {
            "message": "Бот отключен для обновления. Подождите пару секунд и напишите `--trivia start` снова. Прошу прощения за неудобства!"
        }
    },
    "generic": {
        "noheroerror": "Этот герой не нашелся.",
        "privateaccount": "Аккаунт этого пользователя приватен.",
        "generic": "Что-то пошло не так."
    },
    "resolve_dota_id": {
        "notregistered": "%s еще не зарегистрировался! Попробуйте `%shelp register`.",
        "badselect": "Something went wrong selecting this user from the database.",
        "noid": "Я не нашел ID аккаунта в этом сообщении!"
    }
};
