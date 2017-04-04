// Polish translation by Emzi0767 (https://github.com/Emzi0767)

module.exports = {
    "com": {
        "ability": {
            "conflict": "Dana umiejętność nie została znaleziona. Możliwe konflikty: %s",
            "nothing": "Nic nie znaleziono."
        },
        "admin": {
            "main": {
                "cspcd": "Czas odpoczynku komend dla kanałów: `%s`",
                "mspcd": "Czas odpoczynku komend dla użytkowników: `%s`",
                "cuspre": "Własny prefiks: `%s`",
                "tricha": "Kanał zgadywanek: %s",
                "notricha": "brak",
                "disa": "Komendy wyłączone w tym kanale: %s",
                "nodisa": "Brak komend wyłączonych w tym kanale."
            },
            "cooldowns": {
                "confirm": ":ok_hand: Limit kanału %1$s został ustawiony na %2%s sekund(y).", // Set [channel] limit to [3] seconds.
                "channel": "kanał",
                "member": "użytkownik"
            },
            "disable": {
                "confirmsome": ":ok_hand: Wszystkie komendy wyłączone w tym kanale: %s",
                "confirmnone": ":ok_hand: W tym kanale nie ma wyłączonych komend.",
                "error": "Najpierw musisz wyłączyć jakiekolwiek komendy!"
            },
            "locale": {
                "confirm": ":ok_hand: Język zmieniony na `%s`.",
                "error": "Nie można zmienić na ten język! Dostępne języki: `%s`"
            },
            "prefix": {
                "confirm": ":ok_hand: Prefix został zmieniony na `%s`."
            },
            "trivia": {
                "enable": ":ok_hand: Zgadywanka włączona w kanale <#%s>.",
                "disable": ":ok_hand: Kanał zgadywanki został wyłączony."
            }
        },
        "help": {
            "notfound": "Temat pomocy nie został znaleziony: `%s`\n",
            "list": "Lista komend:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "hero",
                "usage": "hero <nazwa bohatera>",
                "summary": "zwraca informacje o podstawowych statystykach i nazwach umiejętności danego bohatera.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<wersja>] <nazwa bohatera>",
                "summary": "zwraca informacje o najnowszych zmianach dla danego bohatera z najnowszego patcha balansującego.",
                "text": [
                    "\n`%spatch <nazwa bohatera>`: zmiany dla danego bohatera z ostatniego patcha balansującego.",
                    "\n`%spatch <wersja> <nazwa bohatera>`: zmiany dla bohatera z podanej wersji."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <bohater>",
                "summary": "zwraca obecne talenty danego bohatera.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<bohater>] <umiejętność>",
                "summary": "zwraca informacje o umiejętności bohatera.",
                "text": [
                    "istnieje wiele różnych aliasów dla różnych umiejętności. możesz je wszystkie",
                    "odkryć używając komend! nie jest wymagane podanie bohatera."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <nazwa przedmiotu>",
                "summary": "szuka przedmiotu według nazwy i wyświetla o nim informacje.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <nazwa bohatera>",
                "summary": "zwraca link do artykułu o bohaterze na wiki Doty 2.",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <nazwa bohatera>",
                "summary": "zwraca listę wszystkich patchów w których dany bohater został zmodyfikowany.",
                "example": "list beastmaster"
            }],
            "personal": [{
                "name": "register",
                "usage": "register <profil steam, link dotabuff lub opendota>",
                "summary": "zarejestruj swój profil w bazie danych bota.",
                "text": [
                    "przyjmuje link do profilu steam, dotabuff lub opendota. konto bota",
                    "wyśle zaproszenie do listy przyjaciół na steamie, jak również wiadomość",
                    "bezpośrednią z instrukcjami poprzez Discorda. **upewnij się, że twój",
                    "profil na steamie jest publiczny, oraz że możesz przyjmować wiadomości",
                    "bezpośrednie od innych użytkowników Discorda zanim spróbujesz tego użyć!**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "wyrejestrowuje Cię z bota."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <użytkownik>",
                "summary": "zwraca podstawowe informacje o danym użytkowniku.",
                "text": [
                    "przyjmuje link dotabuff lub opendota, jak również oznaczenie użytkownika",
                    "(jeżeli zarejestrował on swój profil)."
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <link lub ID rozgrywki>",
                "summary": "zwraca informacje o rozgrywce w Docie 2.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "wyszukuje ostatnią rozgrywkę gracza o podanych parametrach.",
                "text": [
                    "\n`with <gracz>`: dodaje ciebie do filtrów rozgrywek",
                    "\n`of <gracz>`: wyszukuje tylko rozgrywek z tym graczem",
                    "\n`as <bohater>`: dodaje bohatera do filtrów rozgrywek"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["lastgame"]
            }, {
                "name": "history",
                "usage": "history [with <gracz>] OR [of <gracz>] [as <bohater>]",
                "summary": "przegląda historie gracza danym bohaterem lub historię rozgrywek z danymi graczami.",
                "text": [
                    "\n`with <gracz>`: pokazuje stosunek zwycięstw z i przeciwko tobie oraz innemu graczowi",
                    "\n`of <gracz> as <bohater>`: pokazuje stosunek zwycięstw",
                    "\n`as <bohater>`: pokazuje twój stosunek zwycięstw bohaterem"
                ],
                "example": "history with frosty",
            }, {
                "name": "matches",
                "usage": "matches [as <bohater>] and/or with <gracz>] and/or [of <gracz>]",
                "summary": "zwraca 12 ostatnich rozgrywek z danym graczem.",
                "text": [
                    "filtruj po graczu lub bohaterze."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "zwraca mmr użytkownika na tym serwerze.",
                "text": [
                    "\n`%smmr`: zwraca twój mmr.",
                    "\n`%smmr of [użytkownik]`: zwraca mmr zarejestrowanego użytkownika.",
                    "\n`%smmr all`: zwraca tabelę wyników tego serwera."
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
            }],
            "fun": [{
                "name": "courage",
                "summary": "zwraca losowy build.",
            }, {
                "name": "trivia",
                "summary": "komendy do zgadywanki. Zgadywanka jest dostępna tylko w języku angielskim. ",
                "text": [
                    "\n`%strivia start`: rozpoczyna grę.",
                    "\n`%strivia stop`: zatrzymuje grę.",
                    "\n`%strivia top`: tabela wyników użytkowników na tym serwerze.",
                    "\n`%strivia top all`: globalna tabela wyników.",
                    "\n`%strivia points`: twoje wyniki.",
                    "\n`%strivia points [użytkownik]`: wyniki danego użytkownika.",
                    "\n`%strivia stats`: statystyki zgadywanki."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "<:ixmikeW:256896118380691466>",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "zwraca informacje o bocie.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "link do dodawania bota do serwera"
            }, {
                "name": "botstats",
                "summary": "zwraca statystyki o bocie"
            }, {
                "name": "help",
                "usage": "help [<topic>]",
                "summary": "zwraca listę tematów pomocy, lub pomoc na podany temat.",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "wyświetla obecną konfigurację serwera."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <nowy prefiks>",
                "summary": "zmienia prefiks kommend dla tego serwera (bot wciąż będzie reagował na prefiks `--`)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <kanał lub użytkownik> <czas w sekundach>",
                "summary": "zmienia opóźnienia komend dla kanałów lub użytkowników na tym serwerze.",
                "text": [
                    "przykładowo: jeżeli opóźnienie komend w kanale wynosi 10, 10 sekund musi upłynąć od wykonania ostatniej komendy, ",
                    "żeby można było wykonać kolejną. wszystkie komendy wykonane przed upływem tego czasu będą ignorowane.", 
                    "\n\nrekomendowane opóżnienie: 10 sekund dla użytkowników oraz 5 sekund dla kanału. \ndomyślne opóźnienia: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [komendy]",
                "summary": "wyłącza podane komendy w tym kanale.",
                "text": [
                    "uwaga: komendy z kategorii meta oraz admin nie mogą zostać wyłączone.",
                    "użyj komendy admin żeby zobaczyć komendy wyłączone w tym kanale."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [komendy]",
                "summary": "włącza podane komendy w tym kanale.",
                "text": [
                    "użyj komendy admin żeby zobaczyć komendy wyłączone w tym kanale."
                ],
                "example": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "zmienia kanał, w którym odbywa się zgadywanka.",
                "text": [
                    "\n`%sadmin trivia channel [#kanał]`: zmienia kanał zgadywanki na #kanał.",
                    "\n`%sadmin trivia channel here`: zmienia kanał zgadywanki na obecny kanał.",
                    "\n`%sadmin trivia channel none`: kompletne wyłącza zgadywankę."
                ]
            }, {
                "name": "admin locale",
                "summary": "zmienia język bota na tym serwerze"
            }]
        },
        "history": {
            "main": {
                "error": "Niepoprawna składnia."
            },
            "as": {
                "embed": {
                    "title": "%s jako %s",
                    "wins": "**Zwycięstwa:** %s",
                    "games": "**Rozgrywki:** %s",
                    "wr": "**Stosunek zwycięstw:** %s%%"
                }
            },
            "with": {
                "spelling": "Coś poszło nie tak. Sprawdź pisownię graczy i spróbuj ponownie.",
                "nodata": "Nie mam wystarczająco danych dla tej komendy!",
                "embed": {
                    "desc": "Historia pomiędzy <@%s> oraz <@%s>",
                    "same": "Ta sama drużyna",
                    "wl": "**Zwycięstwa/Porażki:** %s/%s (%s rozgrywek)",
                    "wr": "**Stosunek zwycięstw:** %s%%",
                    "diff": "Przeciwne drużyny",
                    "wins": "**Zwycięstwa gracza <@%s>:** %s"
                }
            }
        }, 
        "info": {
            "me": "Bot związany z Dotą 2. Jeżeli masz pytania lub potrzebujesz pomocy, skontaktuj się z %s!",
            "onlinehelp": "Pomoc Online",
            "invitelink": "Link do dodania bota do serwera",
            "helpserver": "Server Pomocy (tylko po Angielsku)", // say like (EN) here or something
            "specialthanks": "Specjalnie podziękowania",
            "alphatest": "Alpha Testerzy",
            "translators": "Tłumacze",
            "githublog": "Log na GitHubie",
            "links": "Linki"
        },
        "item": {
            "noitem": "Nie znaleziono takiego przedmiotu.",
            "conflicts": "Możliwe konflikty: %s"
        },
        "matches": {
            "header": "Użyj `%smatchinfo` aby uzyskać więcej informacji o danym przedmiocie."
        },
        "matchinfo": {
            "error": "Twoja wiadomość nie zawierała ID rozgrywki!"
        },
        "mmr": {
            "loading": "Zbieram najnowsze dane, proszę czekać.",
            "nomember": "Musisz sprecyzować użytkownika!",
            "cantmember": "Nie można znaleźć danego użytkownika.",
            "notregistered": "%s jeszcze nie został u mnie zarejestrowany! Spróbuj `%shelp register`."
        },
        "patch": {
            "noversion": "Nie można znaleźć podanej wersji! Oto najnowsza:"
        },
        "playerinfo": {
            "nouser": "Ten użytkownik jeszcze nie został u mnie zarejestrowany! Spróbuj `%shelp register`.",
            "noid": "Twoja wiadomość nie zawierała ID konta!"
        },
        "restart": {
            "message": "Bot jest restartowany celem aktualizacji. Poczekaj chwilę, a potem wykonaj `--trivia start` ponownie. Przepraszam za niedogodność!"
        }
    },
    "generic": {
        "noheroerror": "Nie znaleziono danego bohatera.",
        "privateaccount": "Profil tego użytkownika jest prywatny.",
        "generic": "Coś poszło nie tak."
    }
};