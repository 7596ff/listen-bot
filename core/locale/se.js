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
                "disable": ":ok_hand: Triviakanal inaktiverad."
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
                    "\n`with <spelare>`: visar din vinstfrekvens med och mot någon annan",
                    "\n`of <spelare> as <hero>`: visar någons vinstfrekvens med en specifik hjälte",
                    "\n`as <hjälte>`: visar din vinstfrekvens med en hjälte"
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
                "summary": "fastställer vilotid för användare eller kanaler.",
                "text": [
                    "till exmpel: om kanalens vilotid är 10, så måste 10 sekunder gå innan ett nytt kommando behandlas.",
                    "alla kommandon mellan tiden för det första kommandot och nya kommandon ignoreras.", 
                    "\n\nrekomenderade vilotider: 10 sekunder för medlemmar och 5 sekunder för kanalen. \nstandard vilotid: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [kommandon]",
                "summary": "avaktiverar en lista av kommandon per kanal.",
                "text": [
                    "notera: du kan inte avaktivera kommandon från meta-, eller adminkategorierna.",
                    "använd adminkommandot ensamt för att se inaktiverade kommandon för en kanal."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [kommandon]",
                "summary": "återaktiverar en lista av kommandon för en kanal.",
                "text": [
                    "använd adminkommandot ensamt för att se en lista med avaktiverade kommandon."
                ],
                "example": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "konfigurerar kanalen där trivia äger rum.",
                "text": [
                    "\n`%sadmin trivia channel [#kanal]`: förlägger triviakanalen till #kanal.",
                    "\n`%sadmin trivia channel here`: anger den nuvarande kanalen som triviakanal.",
                    "\n`%sadmin trivia channel none`: avaktiverar trivia fullständigt."
                ]
            }, {
                "name": "admin locale",
                "summary": "ändrar bottens språk på denna server"
            }]
        },
        "history": {
            "main": {
                "error": "Ogiltig syntax."
            },
            "as": {
                "embed": {
                    "title": "%s som %s",
                    "wins": "**Vinster:** %s",
                    "games": "**Matcher:** %s",
                    "wr": "**Vinstfrekvens:** %s%%"
                }
            },
            "with": {
                "spelling": "Något gick fel. Kolla stavningen av spelarna och försök igen.",
                "nodata": "Jag har inte tillräcklig data för detta kommando!",
                "embed": {
                    "desc": "Historik mellan <@%s> och <@%s>",
                    "same": "Samma lag",
                    "wl": "**Vinst/Förlust:** %s/%s (%s matcher)",
                    "wr": "**Vinstfrekvens:** %s%%",
                    "diff": "Olika lag",
                    "wins": "**<@%s>'s vinster:** %s"
                }
            }
        }, 
        "info": {
            "me": "En Dota 2-relaterad bot. Kontakta %s for hjälp och frågor!",
            "onlinehelp": "Hjälp online",
            "invitelink": "Inbjudningslänk",
            "helpserver": "Hjälpserver (På engelska)", // say like (EN) here or something
            "specialthanks": "Särskilda tack",
            "alphatest": "Alfatestare",
            "translators": "Översättare",
            "githublog": "Github-logg",
            "links": "Länkar"
        },
        "item": {
            "noitem": "Kunde inte hitta det föremålet.",
            "conflicts": "Möjliga konflikter: %s"
        },
        "matches": {
            "header": "Använd `%smatchinfo` för att få mer om en specifik match."
        },
        "matchinfo": {
            "error": "Jag kunde inte hitta ett match-ID i ditt meddelande!"
        },
        "mmr": {
            "loading": "Håll i dig medan jag griper tag i den senaste datan.",
            "nomember": "Snälla specificera en medlem!",
            "cantmember": "Kunde inte hitta en medlem.",
            "notregistered": "%s har inte registrerat sig hos mig än! Försök med `%shelp register`."
        },
        "patch": {
            "noversion": "Kunde inte hitta den versionen! Här är den senaste:"
        },
        "playerinfo": {
            "nouser": "Den användaren har inte registrerat sig hos mig än! Försök med `%shelp register`.",
            "noid": "Jag kunde inte hitta ett konto-ID i ditt meddelande!"
        },
        "restart": {
            "message": "Botten går ner för en uppdatering. Vänta några sekunder och skriv `--trivia start` igen. Ursäkta besväret!"
        }
    },
    "generic": {
        "noheroerror": "Kunde inte hitta den hjälten.",
        "privateaccount": "Denna användares konto är privat.",
        "generic": "Något gick fel."
    },
    "resolve_dota_id": {
        "notregistered": "%s har inte registrerat sig hos mig än! Försök med `%shelp register`.",
        "badselect": "Något gick fel med att välja denna användare från databasen.",
        "noid": "Jag kunde inte hitta ett konto-ID i ditt meddelande!"
    }
};
