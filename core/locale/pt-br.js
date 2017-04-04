module.exports = {
    "com": {
        "ability": {
            "conflict": "Habilidade não encontrada. Possíveis conflitos: %s",
            "nothing": "Nada foi encontrado."
        },
        "admin": {
            "main": {
                "cspcd": "Recarga específica do canal: `%s`",
                "mspcd": "Recarga específica de membro: `%s`",
                "cuspre": "Prefixo personalizado: `%s`",
                "tricha": "Canal de Curiosidades: %s",
                "notricha": "nenhum",
                "disa": "Desabilite os comandos aqui: %s",
                "nodisa": "Nenhum comando desativado neste canal."
            },
            "cooldowns": {
                "confirm": ":ok_hand: Coloque %1$s limite para %2%s segundos.", // Set [channel] limit to [3] seconds.
                "channel": "Canal",
                "member": "Membro"
            },
            "disable": {
                "confirmsome": ":ok_hand: Todos os comandos desativados neste canal: %s",
                "confirmnone": ":ok_hand: Não há comandos desativados neste canal.",
                "error": "Desabilite alguns comandos primeiro!"
            },
            "locale": {
                "confirm": ":ok_hand: Idioma modificado para `%s`.",
                "error": "Não é possível definir para este idioma! Idiomas disponíveis: `%s`"
            },
            "prefix": {
                "confirm": ":ok_hand: Prefixo modificado para `%s`."
            },
            "trivia": {
                "enable": ":ok_hand: Curiosidades habilitada em <#%s>.",
                "disable": ":ok_hand: Canal de Curiosidades desabilitado."
            }
        },
        "help": {
            "notfound": "Tópico de ajuda não encontrado: `%s`\n",
            "list": "Lista de comandos:"
        },
        "help_topics": { // for help, ignore everything but usage, text, and summary
            "static": [{
                "name": "Herói",
                "usage": "Herói <nome do herói>",
                "summary": "Retorna o status básico do herói e o nome das habilidades.",
                "aliases": ["abilities", "skills", "spells"],
                "example": "hero sf"
            }, {
                "name": "patch",
                "usage": "patch [<versão>] <nome do herói>",
                "summary": "Retorna a última mudança feita em um herói do Dota de uma última atualização de balanceamento.",
                "text": [
                    "\n`%spatch <Nome do Herói>`: Última atualização de balanceamento para um herói.",
                    "\n`%spatch <versão> <hero name>`: Atualização para um herói de uma versão."
                ],
                "aliases": ["patchnotes", "notes"],
                "example": "patch 7.01 monkey king"
            }, {
                "name": "talents",
                "usage": "talents <herói>",
                "summary": "Retorna o talento atual de um herói solicitado.",
                "aliases": ["talent"],
                "example": "talents spirit breaker"
            }, {
                "name": "ability",
                "usage": "ability [<herói>] <Habilidade>",
                "summary": "Retorna a informação acerca da habildiade do herói.",
                "text": [
                    "Existem múltiplos apelidos para habilidades, você pode descobrir todos eles. :)",
                    "Simples como usar comandos! Fornecer um herói não é necessário."
                ],
                "aliases": ["skill", "spell"],
                "example": "ability earthbind"
            }, {
                "name": "item",
                "usage": "item <Nome do item>",
                "summary": "Procure por um item e mostre o nome dele.",
                "example": "item skadi"
            }, {
                "name": "wiki",
                "usage": "wiki <nome do herói>",
                "summary": "Retorna o link do Dota2 wiki para um herói específico.",
                "example": "wiki techies"
            }, {
                "name": "list",
                "usage": "list <nome do herói>",
                "summary": "Retorna uma lista de todas as atualizações no banco de dados do herói que recebeu mudanças.",
                "example": "list beastmaster"
            }],
            "personal": [{
                "name": "register",
                "usage": "register <steam profile, dotabuff link or opendota link>",
                "summary": "Registre o seu perfil steam com o robô.",
                "text": [
                    "Aceite o link do perfil steam ou um link do dotabuff/opendota.",
                    "O robô irá lhe enviar uma requisição de amizade no steam",
                    "juntamente com uma mensagem direta no Discord com as devidas instruções",
                    "**Certifique-se de que sua conta na steam está configurada como pública e que você está com o Discord pronto",
                    "para receber mensagens diretas de outros usuários antes de tentar isso! ^^**"
                ],
                "example": "register https://www.dotabuff.com/players/103637655"
            }, {
                "name": "unregister",
                "summary": "Remove sua conta do robô."
            }, {
                "name": "playerinfo",
                "usage": "playerinfo <membro>",
                "summary": "Retorna uma informação básica de jogador a uma pessoa específica.",
                "text": [
                    "Aceita o link do dotabuff ou opendota, bem como uma menção ao nome de usuário (caso aquele usuário",
                    "esteja com o seu perfil linkado.)"
                ],
                "example": "playerinfo https://www.opendota.com/players/103637655",
                "aliases": ["profile"]
            }, {
                "name": "matchinfo",
                "usage": "matchinfo <link ou número da partida (match id)>",
                "summary": "Retorna uma informação sobre uma partida de dota específica.",
                "example": "matchinfo https://www.dotabuff.com/matches/2992668596",
                "aliases": ["gameinfo"]
            }, {
                "name": "lastmatch",
                "summary": "Busca uma partida que alguém tenha jogado.",
                "text": [
                    "\n`with <player>`: Adiciona você à pesquisa de jogadores",
                    "\n`of <player>`: apenas busca pela última partida entre os jogadores pesquisados",
                    "\n`as <hero>`: adiciona um filtro de herói ao primeiro jogador em que a busca está"
                ],
                "example": "lastmatch of Moo",
                "aliases": ["lastgame"]
            }, {
                "name": "history",
                "usage": "history [with <pessoa>] OR [of <pessoa>] [as <herói>]",
                "summary": "Procura no histório de alguém por um herói, ou o histórico entre 2 jogadores. ",
                "text": [
                    "\n`with <player>`: mostra o percentual de vitória com e contra você e mais alguém",
                    "\n`of <player> as <hero>`: mostra o percentual de vitória de alguém com um herói específico",
                    "\n`as <hero>`: mostra o seu percentual de vitória com um herói"
                ],
                "example": "history with frosty",
            }, {
                "name": "matches",
                "usage": "matches [as <herói>] and/or with <pessoa>] and/or [of <pessoa>]",
                "summary": "Retorna os últimos 12 jogos de alguém.",
                "text": [
                    "Filtro de herói ou com uma pessoa."
                ],
                "example": "matches of alexa as ember",
                "aliases": ["matchhistory", "games"]
            }, {
                "name": "mmr",
                "summary": "Mostra o mmr de um membro do servidor.",
                "text": [
                    "\n`%smmr`: Mostra o seu mmr.",
                    "\n`%smmr of [member]`: mostra o mmr de um membro registrado.",
                    "\n`%smmr all`: mostra uma tabela de classificação (leaderbord) de todo o servidor."
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
                "summary": "Mostra uma composição de items (build) para adivinhar.",
            }, {
                "name": "trivia",
                "summary": "Conjunto de comandos para o jogo de curiosidades.",
                "text": [
                    "\n`%strivia start`: começa o jogo.",
                    "\n`%strivia stop`: para o jogo.",
                    "\n`%strivia top`: tabela de classificação dos usuários neste servidor.",
                    "\n`%strivia top all`: tabela de classificação de todos os usuários.",
                    "\n`%strivia points`: Seu placar.",
                    "\n`%strivia points [membro]`: Placar de alguém.",
                    "\n`%strivia stats`: Stats about the trivia game."
                ],
                "aliases": ["t", "challenge"]
            }, {
                "name": "mike",
                "summary": "<:ixmikeW:256896118380691466>",
                "aliases": ["ixmike", "mikeism", "mikeisms"]
            }],
            "meta": [{
                "name": "info",
                "summary": "Mostra informações sobre o robô.",
                "aliases": ["about"]
            }, {
                "name": "invite",
                "summary": "Link de convite para o robô"
            }, {
                "name": "botstats",
                "summary": "Mostra alguns status sobre o robô"
            }, {
                "name": "help",
                "usage": "help [<topic>]",
                "summary": "Mostra uma lista de tópicos de ajuda, ou ajuda específica sobre um tópico.",
                "example": "help patch"
            }],
            "admin": [{
                "name": "admin",
                "summary": "Mostra a configuração atual do servidor."
            }, {
                "name": "admin prefix",
                "usage": "admin prefix <novo prefixo>",
                "summary": "Muda o prefixo específico do servidor (note: will still respond to `--`)",
                "example": "admin prefix &&"
            }, {
                "name": "admin cooldowns",
                "usage": "admin cooldowns <Canal ou membro> <tempo em segundos>",
                "summary": "Coloca a recarga para toda a guilda de membros ou canais.",
                "text": [
                    "por exemplo: se a recarga do canal é 10, 10 segundos precisam passar antes de um novo comando ser realizado.",
                    " Todos os comandos entre a hora do primeiro comando e quaisquer novos comandos são ignorados.",
                    "\n\nrecommended cooldowns: 10 segundos para membro e 5 segundos para o canal. \ntempo de recarga padrão: 0."
                ],
                "example": "admin cooldowns member 5"
            }, {
                "name": "admin disable",
                "usage": "admin disable [comandos]",
                "summary": "Desabilita a lista de comandos por canal.",
                "text": [
                    "Nota: você não pode desabilitar os comandos do meta ou das categorias administrativas.",
                    "usar o comando de administrador por si só para ver comandos desabilitados para um canal."
                ],
                "example": "admin disable lastmatch matchinfo"
            }, {
                "name": "admin enable",
                "usage": "admin enable [comandos]",
                "summary": "reabilita uma lista de comandos para um canal.",
                "text": [
                    "usar o comando de administrador por si só para ver uma lista de comandos desabilitados."
                ],
                "exemplo": "admin enable patch list wiki"
            }, {
                "name": "admin trivia",
                "summary": "Configura o canal no qual a curiosidade irá ocorrer.",
                "text": [
                    "\n`%sadmin trivia channel [#canal]`: Define o canal de curiosidades para #canal.",
                    "\n`%sadmin trivia channel here`: Define o canal de curiosidades para o canal atual.",
                    "\n`%sadmin trivia channel none`: Desabilita totalmente as curiosidades."
                ]
            }, {
                "name": "admin locale",
                "summary": "Altera o idioma do robô neste servidor"
            }]
        },
        "history": {
            "main": {
                "error": "Sintaxe inválida."
            },
            "as": {
                "embed": {
                    "title": "%s como %s",
                    "wins": "**Vitórias:** %s",
                    "games": "**Jogos:** %s",
                    "wr": "**Percentual de vitória:** %s%%"
                }
            },
            "with": {
                "spelling": "Algo deu errado. Verifique o nome dos jogadores e tente novamente.",
                "nodata": "Eu não tenho dados suficientes para este comando!",
                "embed": {
                    "desc": "História entre <@%s> e <@%s>",
                    "same": "Mesmo Time",
                    "wl": "**Vitória/Derrota:** %s/%s (%s jogos)",
                    "wr": "**Percentual de vitória:** %s%%",
                    "diff": "Times diferentes",
                    "wins": "**<@%s>'vitórias:** %s"
                }
            }
        },
        "info": {
            "me": "Um robô de ajuda do Dota 2. Contate %s para dúvidas e suporte!",
            "onlinehelp": "Ajuda Online",
            "invitelink": "Link de convite",
            "helpserver": "Ajude o Servidor (Somente em Inglês)", // say like (EN) here or something
            "specialthanks": "Agradecimentos Especiais",
            "alphatest": "Testadores Alpha",
            "translators": "Tradutores",
            "githublog": "Registro Github",
            "links": "Links"
        },
        "item": {
            "noitem": "Não foi possível encontrar este item.",
            "conflicts": "Possíveis conflitos: %s"
        },
        "matches": {
            "header": "Use `%smatchinfo` para saber mais sobre uma partida específica."
        },
        "matchinfo": {
            "error": "Eu não encontrei o ID da partida na sua mensagem! :("
        },
        "mmr": {
            "loading": "Relaxa aí enquanto eu pego os registros mais recentes... ;)",
            "nomember": "Por favor, insira um membro!",
            "cantmember": "Não encontrei esse membro. :(",
            "notregistered": "%s não tem registro comigo. Tente `%shelp register`."
        },
        "patch": {
            "noversion": "Não encontrei essa versão! x_x A última foi:"
        },
        "playerinfo": {
            "nouser": "Esse usuário ainda não está registrado comigo! Tente `%shelp register`.",
            "noid": "Não pude encontrar a conta com essa ID na sua mensagem! :("
        },
        "restart": {
            "message": "O robô será desligado agora para uma atualização. Espere alguns segundos e digite `--trivia start` novamente. Desculpe pela incoveniência! ^^'"
        }
    },
    "generic": {
        "noheroerror": "Não foi possível encontrar esse herói. :(",
        "privateaccount": "A conta desse usuário é privada.",
        "generic": "Algo deu errado.."
    },
    "resolve_dota_id": {
        "notregistered": "%s Esse usuário ainda não está registrado comigo! Tente `%shelp register`.",
        "badselect": "Algo deu errado ao selecionar esse usuário no banco de dados.",
        "noid": "Não pude encontrar a conta com essa ID na sua mensagem!"
    }
};