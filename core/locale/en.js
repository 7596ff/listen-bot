module.exports = {
    "com": {
        "ability": {
            "conflict": "Ability not found. Possible conflicts: %s",
            "nothing": "Couldn't find anything."
        },
        "admin": {
            "main": {
                "cspcd": "Channel-specific cooldowns: `%s`",
                "mspcd": "Member-specific cooldowns: `%s`",
                "cuspre": "Custom prefix: `%s`",
                "tricha": "Trivia channel: %s",
                "notricha": "none",
                "disa": "Disabled commands here: %s",
                "nodisa": "No disabled commands in this channel."
            },
            "cooldowns": {
                "confirm": ":ok_hand: Set %1$s limit to %2%s seconds.", // Set [channel] limit to [3] seconds.
                "channel": "channel",
                "member": "member"
            },
            "disable": {
                "confirmsome": ":ok_hand: All disabled commands in this channel: %s",
                "confirmnone": ":ok_hand: No disabled commands in this channel.",
                "error": "Disable some commands first!"
            },
            "prefix": {
                "confirm": ":ok_hand: Prefix set to `%s`."
            },
            "trivia": {
                "enable": ":ok_hand: Trivia enabled in <#%s>.",
                "disable": ":ok_hand: Trivia channel disabled."
            }
        },
        "help": {
            "notfound": "Help topic not found: `%s`\n",
            "list": "List of commands:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "hero",
                "usage": "hero <hero name>",
                "summary": "returns hero's basic stats and ability names.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<version>] <hero name>",
                "summary": "returns the latest changes to a hero in dota from the latest balance patch.",
                "text": [
                    "\n`%spatch <hero name>`: latest balance patch for a hero.",
                    "\n`%spatch <version> <hero name>`: patch for a hero from a version."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <hero>",
                "summary": "returns the current talents of a requested hero.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<hero>] <ability>",
                "summary": "returns info about a hero's ability.",
                "text": [
                    "there are multiple aliases for abilites, you can discover them all",
                    "simply by using commands! supplying a hero is not required."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <item name>",
                "summary": "search for an item name and display it.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <hero name>",
                "summary": "returns the dota 2 wiki link for a specified hero.",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <hero name>",
                "summary": "returns a list of all the patches in the database that a hero recieved changes in.",
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
            "translators": "Translators"
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
    }
};