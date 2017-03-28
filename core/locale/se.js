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
                "usage": "register <steam profile, dotabuff link or opendota link>",
                "summary": "register your steam profile with the bot.",
                "text": [
                    "accepts a steam profile link or a dotabuff/opendota link.",
                    "the bot account will send you a friend request on steam",
                    "along with a direct message on discord with instructions.",
                    "**make sure your steam account is public and you have discord set",
                    "to accept direct messages from other users before trying this!**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "removes your account with the bot."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <member>",
                "summary": "returns some basic player info for a specified person.",
                "text": [
                    "accepts a dotabuff or opendota link, as well as a username mention (if that user",
                    "has their profile linked.)"
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <link or match id>",
                "summary": "returns information about a specific dota match.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "looks up the last match someone played.",
                "text": [
                    "\n`with <player>`: adds you to the search of players",
                    "\n`of <player>`: only looks for the last match between these players",
                    "\n`as <hero>`: adds a hero filter to the first player in the search is"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["gameinfo"]
            }, {
                "name": "history",
                "usage": "history [with <person>] OR [of <person>] [as <hero>]",
                "summary": "looks up the history someone has on a hero, or history between two players. ",
                "text": [
                    "\n`with <player>`: shows winrate with and against you and someone else",
                    "\n`of <player> as <hero>`: shows someone's winrate on a specific hero",
                    "\n`as <hero>`: shows your winrate on a hero"
                ],
                "example": "history with frosty",
                "aliases": ["lastgame"]
            }, {
                "name": "matches",
                "usage": "matches [as <hero>] and/or with <person>] and/or [of <person>]",
                "summary": "returns the last 12 games of someone.",
                "text": [
                    "filter by hero or with a person."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "returns mmr of a member or of the server.",
                "text": [
                    "\n`%smmr`: returns your mmr.",
                    "\n`%smmr of [member]`: returns mmr of a registered member.",
                    "\n`%smmr all`: returns a leaderboard of the whole server."
                ]
            }],
            "fun": [{
                "name": "courage",
                "summary": "returns an item build challenge a la divine courage.",
            }, {
                "name": "trivia",
                "summary": "set of commands for the trivia game. ",
                "text": [
                    "\n`%strivia start`: starts the game.",
                    "\n`%strivia stop`: stops the game.",
                    "\n`%strivia top`: leaderboard of users in this server.",
                    "\n`%strivia top all`: leaderboard of all users.",
                    "\n`%strivia points`: your scores.",
                    "\n`%strivia points [member]`: scores of someone.",
                    "\n`%strivia stats`: stats about the trivia game."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "returns a random ixmikeism",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "returns some info about the bot.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "invite link for the bot"
            }, {
                "name": "botstats",
                "summary": "returns some stats about the bot"
            }, {
                "name": "help",
                "usage": "help [<topic>]",
                "summary": "return list of help topics, or specific help about a topic.",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "displays the current config for the server."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <new prefix>",
                "summary": "change the server specific prefix (note: will still respond to `--`)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <channel or member> <time in seconds>",
                "summary": "sets the cooldowns for the entire guild for members or channels.",
                "text": [
                    "for example: if the channel cooldown is 10, 10 seconds must pass before a new command is processed.",
                    "all commands in between the time of the first command and any new commands are ignored.", 
                    "\n\nrecommended cooldowns: 10 seconds for member and 5 seconds for channel. \ndefault cooldowns: 0."
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
