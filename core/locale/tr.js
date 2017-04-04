module.exports = {
    "com": {
        "ability": {
            "conflict": "Yetenek bulunamadı. Olası eşleşmeler: %s",
            "nothing": "Bir şey bulunamadı."
        },
        "admin": {
            "main": {
                "cspcd": "Kanala özgü bekleme süreleri: `%s`",
                "mspcd": "Üyeye özgü bekleme süreleri: `%s`",
                "cuspre": "Özel önek: `%s`",
                "tricha": "Trivia kanalı: %s",
                "notricha": "hiç",
                "disa": "Buradaki devredışı komutlar: %s",
                "nodisa": "Bu kanalda devredışı bir komut yok."
            },
            "cooldowns": {
                "confirm": ":ok_hand: %1$s limiti %2%s saniye olarak ayarlandı.", // Set [channel] limit to [3] seconds.
                "channel": "kanal",
                "member": "üye"
            },
            "disable": {
                "confirmsome": ":ok_hand: Bu kanaldaki tüm devredışı komutlar: %s",
                "confirmnone": ":ok_hand: Bu kanalda devredışı bir komut yok.",
                "error": "Önce bazı komutları devredışı bırakın!"
            },
            "locale": {
                "confirm": ":ok_hand: Dil `%s` olarak seçildi.",
                "error": "Bu dil seçilemez! Mevcut diller: `%s`"
            },
            "prefix": {
                "confirm": ":ok_hand: Önek `%s` olarak ayarlandı."
            },
            "trivia": {
                "enable": ":ok_hand: Trivia <#%s> kanalında etkinleştirildi.",
                "disable": ":ok_hand: Trivia kanalı devredışı bırakıldı."
            }
        },
        "help": {
            "notfound": "Yardım konusu bulunamadı: `%s`\n",
            "list": "Komut listesi:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "hero",
                "usage": "hero <kahraman adı>",
                "summary": "kahramanın temel istatistiklerini ve yetenek isimlerini getirir.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<versiyon>] <kahraman adı>",
                "summary": "son dengeleme yamasında kahramana gelen güncellemeleri getirir.",
                "text": [
                    "\n`%spatch <kahraman adı>`: kahraman için son dengeleme yaması.",
                    "\n`%spatch <versiyon> <kahraman adı>`: kahraman için bir versiyondaki değişiklikler."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <kahraman>",
                "summary": "kahramanın şu anki yeteneklerini getirir.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<kahraman>] <yetenek>",
                "summary": "bir kahramanın yeteneği hakkında bilgi getirir.",
                "text": [
                    "yetenekler için birden fazla isim var, hepsini komutları kullanarak",
                    "keşfedebilirsiniz! kahraman ismi vermek zorunlu değil."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <eşya adı>",
                "summary": "bir eşya adı ara ve göster.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <kahraman adı>",
                "summary": "belirtilen dota 2 kahramanı için wiki linki getirir.",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <kahraman adı>",
                "summary": "belirtilen kahramanın güncellendiği, veri tabanındaki tüm yamaların listesini getirir.",
                "example": "list beastmaster"
            }],
            "personal": [{
                "name": "register",
                "usage": "register <steam profili, dotabuff linki veya opendota linki>",
                "summary": "bota steam profilinizi kaydettirin.",
                "text": [
                    "bir steam profil linki veya dotabuff/opendota linki kabul eder.",
                    "bot hesabı size steam üzerinden arkadaşlık isteği ve discord",
                    "üzerinden yönlendirmeleri gönderecek.",
                    "**steam hesabınızın genele açık olduğundan ve discord'da başka",
                    "kullanıcılardan mesaj kabul ettiğinize emin olmadan bunu denemeyin!**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "bottan hesabınızı kaldırır."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <üye>",
                "summary": "belirtilen üye hakkında bir takım oyuncu bilgileri getirir.",
                "text": [
                    "dotabuff veya opendota linki ve a kullanıcı adı etiketi (eğer",
                    "kullanıcı profilini kaydettirdiyse.) kabul eder."
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <link ya da maç idsi>",
                "summary": "belirtilen dota maçı hakkında bilgileri getirir.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "birinin oynadığı son maçı arar.",
                "text": [
                    "\n`with <oyuncu>`: sizi oyuncu aramasına ekler",
                    "\n`of <oyuncu>`: sadece bu oyuncular arasındaki son maçı arar",
                    "\n`as <kahraman>`: aramadaki ilk oyuncuya kahraman filtresi ekler"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["lastgame"]
            }, {
                "name": "history",
                "usage": "history [with <oyuncu>] YA DA [of <oyuncu>] [as <kahraman>]",
                "summary": "birinin bir kahramanla olan ya da iki oyuncunun arasındaki geçmişi arar. ",
                "text": [
                    "\n`with <oyuncu>`: birinin sizle ya da size karşı kazanma oranını gösterir.",
                    "\n`of <oyuncu> as <hero>`: birinin belirtilen kahraman ile kazanma oranını gösterir.",
                    "\n`as <kahraman>`: sizin bir kahramandaki kazanma oranınızı gösterir."
                ],
                "example": "history with frosty"
            }, {
                "name": "matches",
                "usage": "matches [as <kahraman>] veya with <oyuncu>] veya [of <oyuncu>]",
                "summary": "birinin son 12 maçını getirir.",
                "text": [
                    "kahraman veya kişiye göre filtreleyin."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "bir üyenin ya da sunucunun mmr'ını getirir.",
                "text": [
                    "\n`%smmr`: mmr'ınızı getirir.",
                    "\n`%smmr of [üye]`: kayıtlı üyenin mmr'ını getirir.",
                    "\n`%smmr all`: tüm sunucu için sıralama getirir."
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
                "summary": "returns an item build challenge a la divine courage.",
            }, {
                "name": "trivia",
                "summary": "trivia oyunları için komutların listesi. ",
                "text": [
                    "\n`%strivia start`: oyunu başlatır.",
                    "\n`%strivia stop`: oyunu sonlandırır.",
                    "\n`%strivia top`: bu sunucudaki kullanıcıların sırlaması.",
                    "\n`%strivia top all`: tüm kullanıcıların sıralaması.",
                    "\n`%strivia points`: sizin skorlarınız.",
                    "\n`%strivia points [üye]`: birinin skorları.",
                    "\n`%strivia stats`: trive oyunu hakkında istatistikler."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "<:ixmikeW:256896118380691466>",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "bot hakkında bilgileri getirir.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "bot için davet linki"
            }, {
                "name": "botstats",
                "summary": "bot hakkında bazı istatistikler getirir"
            }, {
                "name": "help",
                "usage": "help [<konu>]",
                "summary": "yardım konularını, ya da istenen konu hakkındaki yardımı getirir.",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "sunucu için şu an ki yapılandırmayı gösterir."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <yeni önek>",
                "summary": "sunucuya özel öneki değiştirin (not: yine de `--`ye cevap verecek)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <channel ya da member> <saniye>",
                "summary": "tüm sunucu için üyelere ya da kanala has bekleme sürelerini ayarlar.",
                "text": [
                    "örneğin: eğer kanalın bekleme süresi 10 ise, yeni bir komutun işlenmesi için 10 saniye geçmesi gerekir.",
                    "ilk komut ile yeni komut arasında yollanan tüm komutlar göz ardı edilir.",
                    "\n\nönerilen bekleme süreleri: üyeler için 10 saniye ve kanal için 5 saniye. \nvarsayılan bekleme süresi: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [komutlar]",
                "summary": "listesi verilen komutları kanal için devredışı bırakır.",
                "text": [
                    "not: meta veya admin kategorisindeki komutları devredışı bırakamazsınız.",
                    "kanal için devredışı komutları görmek için sadece admin komutunu kullanın."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [komutlar]",
                "summary": "listesi verilen komutları kanal için tekrar aktifleştirir.",
                "text": [
                    "devredışı komutları görmek için sadece admin komutunu kullanın."
                ],
                "example": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "trivia'nın olacağı kanalı yapılandırır.",
                "text": [
                    "\n`%sadmin trivia channel [#kanal]`: trivia kanalını #kanal olarak atar.",
                    "\n`%sadmin trivia channel here`: trivia kanalını bu kanal olarak atar.",
                    "\n`%sadmin trivia channel none`: trivia'yı devredışı bırakır."
                ]
            }, {
                "name": "admin locale",
                "summary": "botun bu sunucudaki dilini değiştirir"
            }]
        },
        "history": {
            "main": {
                "error": "Geçersiz sözdizimi."
            },
            "as": {
                "embed": {
                    "title": "%s %s ile",
                    "wins": "**Galibiyetler:** %s",
                    "games": "**Oyunlar:** %s",
                    "wr": "**Kazanma oranı:** %s%%"
                }
            },
            "with": {
                "spelling": "Bir şeyler yanlış gitti. Oyuncuların yazımına dikkat edip tekrar deneyin.",
                "nodata": "Bu komut için yeterli verim yok!",
                "embed": {
                    "desc": "<@%s> ve <@%s> arasındaki geçmiş",
                    "same": "Aynı Takım",
                    "wl": "**Galibiyet/Mağlubiyet:** %s/%s (%s oyun)",
                    "wr": "**Kazanma Oranı:** %s%%",
                    "diff": "Farkı Takımlar",
                    "wins": "**<@%s>'nin galibiyetleri:** %s"
                }
            }
        },
        "info": {
            "me": "Dota 2 ile ilgili bir bot. Destek ve sorular için %s ile iletişime geçin!",
            "onlinehelp": "Online Destek",
            "invitelink": "Davet Linki",
            "helpserver": "Destek Sunucusu (İngilizce)", // say like (EN) here or something
            "specialthanks": "Teşekkürler",
            "alphatest": "Alfa Testçileri",
            "translators": "Çevirmenler",
            "githublog": "Github Günlüğü",
            "links": "Linkler"
        },
        "item": {
            "noitem": "Eşya bulunamadı.",
            "conflicts": "Olası eşleşmeler: %s"
        },
        "matches": {
            "header": "Bir maç hakkında daha fazlası için `%smatchinfo` komutunu kullanın."
        },
        "matchinfo": {
            "error": "Mesajınızda bir maç IDsi bulamadım!"
        },
        "mmr": {
            "loading": "Son verileri çekiyorum, sıkı tutunun.",
            "nomember": "Lütfen bir üye belirtin!",
            "cantmember": "Bir üye bulunamadı.",
            "notregistered": "%s henüz bana kayıt olmadı. `%shelp register` komutunu deneyin."
        },
        "patch": {
            "noversion": "O versiyon bulunamadı! İşte sonuncusu:"
        },
        "playerinfo": {
            "nouser": "O kullanıcı henüz bana kayıt olmadı! `%shelp register` komutunu deneyin.",
            "noid": "Mesajınızda bir hesap IDsi bulamadım!"
        },
        "restart": {
            "message": "Bot bir güncelleme için kapanacak. Birkaç saniye bekleyip tekrar `--trivia start` yazın. Rahatsızlık için özür dilerim!"
        }
    },
    "generic": {
        "noheroerror": "O kahraman bulunamadı.",
        "privateaccount": "Bu kullanıcının hesabı gizli.",
        "generic": "Bir şeyler ters gitti."
    },
    "resolve_dota_id": {
        "notregistered": "%s henüz bana kayıt olmadı. `%shelp register` komutunu deneyin.",
        "badselect": "Bu kullanıcıyı veritabanından çekerken bir şeyler ters gitti.",
        "noid": "Mesajınızda bir hesap IDsi bulamadım!"
    }
};
