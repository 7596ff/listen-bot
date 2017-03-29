module.exports = {
    "com": {
        "ability": {
            "conflict": "Förmåga ej funnen. Möjliga konflikter: %s",
            "nothing": "Kunde inte hitta något."
        },
        "admin": {
            "main": {
                "cspcd": "Kanalspecifik vilotid: `%s`",
                "mspcd": "Medlemsspecifik vilotid: `%s`",
                "cuspre": "Specialanpassat prefix: `%s`",
                "tricha": "Triviakanal: %s",
                "notricha": "inget",
                "disa": "Inaktiverade kommandon här: %s",
                "nodisa": " Inga inaktiverade kommandon i denna kanal."
            },
            "cooldowns": {
                "confirm": ":ok_hand: Sätt %1$s begränsning till %2%s sekunder.", // Set [channel] limit to [3] seconds.
                "channel": "kanal",
                "member": "medlem"
            },
            "disable": {
                "confirmsome": ":ok_hand: Alla inaktiverade kommandon i denna kanal: %s",
                "confirmnone": ":ok_hand: Inga inaktiverade kommandon i denna kanal.",
                "error": "Inaktivera några kommandon först!"
            },
            "locale": {
                "confirm": ":ok_hand: Språk ändrat till `%s`.",
                "error": "Kan inte att ändra till detta språk! Tillgängliga språk: `%s`"
            },
            "prefix": {
                "confirm": ":ok_hand: Prefix ändrat till `%s`."
            },
            "trivia": {
                "enable": ":ok_hand: Trivia aktiverat i <#%s>.",
                "disable": ":ok_hand: Triviakanal inaktiverat."
            }
        },
        "help": {
            "notfound": "Hjälpämne hittades inte: `%s`\n",
            "list": "Kommandolista:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "hero",
                "usage": "hero <hjältens namn>",
                "summary": "återger en hjältes statistik och förmågor.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<version>] <hjältens namn>",
                "summary": "återger de senaste ändringarna till en dotahjälte från den senaste balanspatchen.",
                "text": [
                    "\n`%spatch <hjältens namn>`: senaste balanspatchen för en hjälte.",
                    "\n`%spatch <version> <hjältens namn>`:  patch för en hjälte från en version."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <hjälte>",
                "summary": "återger den begärda hjältens nuvarande talanger.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<hjälte>] <förmåga>",
                "summary": "återger information om en hjältes förmågor.",
                "text": [
                    "förmågor har flera alias, du kan upptäckta dem alla",
                    "enkelt genom att använda kommandon! att tillföra en hjälte behövs inte."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <föremålets namn>",
                "summary": "sök efter ett föremåls namn och visa upp det.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <hjältens namn>",
                "summary": "återger en länk till dota 2-wikin för den specificerade hjälten",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <hjältens namn>",
                "summary": "återger en lista på alla patcher i databsen där hjälten ändrades.",
                "example": "list beastmaster"
            }],
            "dynamic": [{
                "name": "register",
                "usage": "register <steamprofil, länk till dotabuff eller opendota>",
                "summary": "registrera din steamprofil med botten.",
                "text": [
                    "accepterar en länk till en steamprofil eller en länk till dotabuff/opendota",
                    "bottens konto kommer att skicka en vänförfrågan till dig på steam",
                    "samt ett direkt meddelande på discord med instruktioner.",
                    "**se till att din steamprofil är offentlig och att du har discord inställt",
                    "att acceptera direkta meddelanden från andra användare innan du prövar detta!**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "tar bort ditt konto från botten."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <medlem>",
                "summary": "återger viss grundläggande information för en specificerad person.",
                "text": [
                    "accepterar en länk från dotabuff eller opendota samt nämnande av användarnamn (om den användaren",
                    "har länkat sin profil.)"
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <länk eller matchens id>",
                "summary": "återger information om en specifik dotamatch.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "kollar upp den senaste matchen som någon har spelat.",
                "text": [
                    "\n`with <spelare>`: lägger till dig sökandet av spelare",
                    "\n`of <spelare>`: söker enbart efter den sista matchen mellan dessa spelare",
                    "\n`as <hjälte>`: lägger till ett hjältefilter till vilken den första spelaren i sökningen är"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["gameinfo"]
            }, {
                "name": "history",
                "usage": "history [with <person>] OR [of <person>] [as <hjälte>]",
                "summary": "kollar upp någons historik med en hjälte, eller historiken mellan två spelare. ",
                "text": [
                    "\n`with <spelare>`: visar hur ofta du vinner med och mot någon annan",
                    "\n`of <spelare> as <hero>`: visar hur ofta någon vinner med en specifik hjälte",
                    "\n`as <hjälte>`: visar hur ofta du vinner som en hjälte"
                ],
                "example": "history with frosty",
                "aliases": ["lastgame"]
            }, {
                "name": "matches",
                "usage": "matches [as <hjälte>] and/or with <person>] and/or [of <person>]",
                "summary": "återger någons tolv senaste matcher.",
                "text": [
                    "filtrera för hjälte eller med en person."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "återger en medlem på serverns mmr.",
                "text": [
                    "\n`%smmr`: återger din mmr.",
                    "\n`%smmr of [medlem]`: återger en registrerad medlems mmr.",
                    "\n`%smmr all`: återger en rangordning för hela servern."
                ]
            }],
            "fun": [{
                "name": "courage",
                "summary": "återger en hjältestruktursutmaning a la divine courage.",
            }, {
                "name": "trivia",
                "summary": "kommandon för triviaspelet. ",
                "text": [
                    "\n`%strivia start`: startar spelet.",
                    "\n`%strivia stop`: stoppar spelet.",
                    "\n`%strivia top`: rangordning av användarna på denna server.",
                    "\n`%strivia top all`: rangordning av alla användare.",
                    "\n`%strivia points`: dina poäng.",
                    "\n`%strivia points [member]`: någons poäng.",
                    "\n`%strivia stats`: statistik om triviaspelet."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "återger en slumpmässig ixmikeism",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "återger viss information om botten.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "inbjudningslänk för botten."
            }, {
                "name": "botstats",
                "summary": "återger viss statisik om botten."
            }, {
                "name": "help",
                "usage": "help [<topic>]",
                "summary": "återger en lista med hjälpämnen, eller specifik hjälp om ett ämne",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "visar den nuvarande konfigurationen för severn."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <nytt prefix>",
                "summary": "ändrar det serverspecifika prefixet (notera att den fortfarande kommer svara på `--`)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <kanal eller medlem> <tid i sekunder>",
                "summary": "sätter vilotid för användare eller kanaler. sets the cooldowns for the entire guild for members or channels.",
                "text": [
                    "till exmpel: om kanalens vilotid är 10, så måste 10 sekunder gå innan ett nytt kommando behandlas.",
                    "alla kommandon mellan tiden för det första kommandot och nya kommandon ignoreras.", 
                    "\n\nrekomenderade vilotider: 10 sekunder för medlemmar och 5 sekunder för kanalen. \nstandard vilotid: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [commands]",
                "summary": "disables a list of commands per channel.",
                "text": [
                    "note: you can not disable commands from the meta or admin categories.",
                    "use the admin command by itself to see disabled commands for a channel."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [commands]",
                "summary": "re enables a list of commands for a channel.",
                "text": [
                    "use the admin command by itself to see a list of disabled commands."
                ],
                "example": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "configures the channel in which trivia takes place.",
                "text": [
                    "\n`%sadmin trivia channel [#channel]`: sets the trivia channel to #channel.",
                    "\n`%sadmin trivia channel here`: sets the trivia channel to the current channel.",
                    "\n`%sadmin trivia channel none`: disables trivia entirely."
                ]
            }, {
                "name": "admin locale",
                "summary": "changes language of bot on this server"
            }]
        },
        "history": {
            "main": {
                "error": "Invalid syntax."
            },
            "as": {
                "embed": {
                    "title": "%s as %s",
                    "wins": "**Wins:** %s",
                    "games": "**Games:** %s",
                    "wr": "**Winrate:** %s%%"
                }
            },
            "with": {
                "spelling": "Something went wrong. Check the spelling of the players and try again.",
                "nodata": "I don't have enough data for this command!",
                "embed": {
                    "desc": "History between <@%s> and <@%s>",
                    "same": "Same Team",
                    "wl": "**Win/Loss:** %s/%s (%s games)",
                    "wr": "**Winrate:** %s%%",
                    "diff": "Different Teams",
                    "wins": "**<@%s>'s wins:** %s"
                }
            }
        }, 
        "info": {
            "me": "A Dota 2 related bot. Contact %s for support and questions!",
            "onlinehelp": "Online Help",
            "invitelink": "Invite Link",
            "helpserver": "Help Server", // say like (EN) here or something
            "specialthanks": "Special Thanks",
            "alphatest": "Alpha Testers",
            "translators": "Translators",
            "githublog": "Github Log",
            "links": "Links"
        },
        "item": {
            "noitem": "Couldn't find that item.",
            "conflicts": "Possible conflicts: %s"
        },
        "matches": {
            "header": "Use `%smatchinfo` to get more about a specific match."
        },
        "matchinfo": {
            "error": "I couldn't find a match ID in your message!"
        },
        "mmr": {
            "loading": "Hold tight while I grab the latest data.",
            "nomember": "Please specify a member!",
            "cantmember": "Couldn't find a member.",
            "notregistered": "%s has not registered with me yet! Try `%shelp register`."
        },
        "patch": {
            "noversion": "Cant find that version! Here's the latest:"
        },
        "playerinfo": {
            "nouser": "That user has not registered with me yet! Try `%shelp register`.",
            "noid": "I couldn't find an account ID in your message!"
        },
        "restart": {
            "message": "The bot is going down for an update. Wait a few seconds and type `--trivia start` again. Sorry for the inconvenience!"
        }
    },
    "generic": {
        "noheroerror": "Couldn't find that hero.",
        "privateaccount": "This user's account is private.",
        "generic": "Something went wrong."
    },
    "resolve_dota_id": {
        "notregistered": "%s has not registered with me yet! Try `%shelp register`.",
        "badselect": "Something went wrong selecting this user from the database.",
        "noid": "I couldn't find an account ID in your message!"
    }
};
