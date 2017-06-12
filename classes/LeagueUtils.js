const needle = require("needle");
const dc = require("dotaconstants");

class LeagueUtils {
    constructor(key) {
        this.key = key;
        this.matches = new Map();
        this.channels = new Map();
    }

    _formatAbilities(abilities) {
        if (Array.isArray(abilities)) {
            return abilities.map((ability) => {
                if (Array.isArray(ability.ability)) {
                    let ret = {};
                    for (let item of ability.ability) { // valve
                        ret[item.ability_id] = item.ability_level;
                    }
                    return ret;
                } else {
                    let ret = {};
                    ret[ability.ability_id] = ability.ability_level;
                    return ret;
                }
            });
        } else {
            if (Array.isArray(abilities.ability)) {
                let ret = {};
                for (let item of abilities.ability) { // valve
                    ret[item.ability_id] = item.ability_level;
                }
                return [ret];
            } else {
                let ret = {};
                ret[abilities.ability.ability_id] = abilities.ability.ability_level;
                return [ret];
            }
        }
    }

    _formatPlayer(player, abilities) {
        if (typeof player != "object") return;

        for (let key in player) {
            if (key != "account_id" && !isNaN(player[key])) {
                player[key] = Number(player[key]);
            }
        }

        if (!abilities) return player;

        try {
            for (let ability of abilities) {
                let name = dc.ability_ids[Object.keys(ability)[0]];
                if (!name) continue;

                let hero = Object.values(dc.hero_abilities).find((h) => {
                    if (h.abilities.includes(name)) return true;
                    if (h.talents.find((talent) => talent.name == name)) return true;
                    return false;
                });
                if (!hero) continue;

                let hero_name = Object.keys(dc.hero_abilities)[Object.values(dc.hero_abilities).indexOf(hero)];
                if (!hero_name) continue;

                let id = dc.hero_names[hero_name].id;

                if (player.hero_id == id) {
                    player.abilities = ability;
                    break;
                }
            }

            return player;
        } catch (err) {
            console.error(err);
            console.error("what the fuck");
            console.error(abilities);
        }
    }

    _formatTeam(team) {
        let abil = team.abilities ? this._formatAbilities(team.abilities) : null;

        let nuteam = {
            score: Number(team.score),
            tower_state: Number(team.tower_state),
            barracks_state: Number(team.barracks_state),
            picks: team.picks ? Object.values(team.picks.pick).map((pick) => pick.hero_id) : [],
            bans: team.bans ? Object.values(team.bans.ban).map((ban) => ban.hero_id) : [],
            players: team.players ? Object.values(team.players.player).map((player) => this._formatPlayer(player, abil)) : []
        };

        return nuteam;
    }

    _formatScoreboard(scoreboard) {
        if (!scoreboard) {
            return {};
        } else {
            let nuscoreboard = {
                duration: Number(scoreboard.duration),
                roshan_respawn_timer: Number(scoreboard.roshan_respawn_timer),
                radiant: this._formatTeam(scoreboard.radiant),
                dire: this._formatTeam(scoreboard.dire)
            };

            return nuscoreboard;
        }
    }

    _formatGame(game) {
        let nugame = {
            players: game.players.player,
            radiant_team: game.radiant_team || {
                team_name: "Unknown Team",
                team_id: 0,
                team_logo: 0,
                complete: false
            },
            dire_team: game.dire_team || {
                team_name: "Unknown Team",
                team_id: 0,
                team_logo: 0,
                complete: false
            },
            lobby_id: game.lobby_id,
            match_id: game.match_id,
            spectators: Number(game.spectators),
            series_id: Number(game.series_id),
            game_number: Number(game.game_number),
            league_id: Number(game.league_id),
            stream_delay_s: Number(game.stream_delay_s),
            radiant_series_wins: Number(game.radiant_series_wins),
            dire_series_wins: Number(game.dire_series_wins),
            series_type: Number(game.series_type),
            league_series_id: Number(game.league_series_id),
            league_game_id: Number(game.league_game_id),
            stage_name: game.stage_name,
            league_tier: Number(game.league_tier),
            scoreboard: this._formatScoreboard(game.scoreboard)
        };

        return nugame;
    }

    _getMatches(override, cb) {
        if (!override && this.expires > Date.now()) return cb();

        let url = `http://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=${this.key}&format=xml`;
        needle.get(url, (err, response, body) => {
            if (err) {
                return cb(err);
            } else {
                try {
                    if (body.result.status !== "200") return cb(new Error(body.result.status));
                    let matches = body.result.games.game.map((game) => this._formatGame(game));

                    let oldMatches = Array.from(this.matches.keys());
                    let toDelete = oldMatches.filter((matchID) => matches.indexOf(matchID) == -1);

                    toDelete.forEach((item) => {
                        this.matches.set(item, {
                            match_id: item,
                            completed: true
                        });
                    });

                    for (let match of matches) {
                        this.matches.set(match.match_id, match);
                    }

                    this.expires = Date.now() + 60000;

                    return cb();
                } catch (err) {
                    return cb(err);
                }
            }
        });
    }

    getAllData() {
        return new Promise((resolve, reject) => {
            this._getMatches(true, (err) => {
                if (err) return reject(err);

                return resolve();
            });
        });
    }

    getList() {
        return new Promise((resolve, reject) => {
            this._getMatches(false, (err) => {
                if (err) return reject(err);

                let list = Array.from(this.matches.values())
                    .filter((match) => !match.completed)
                    .map((match) => {
                        return {
                            match_id: match.match_id,
                            radiant_team: match.radiant_team,
                            dire_team: match.dire_team,
                            spectators: match.spectators,
                            league_id: match.league_id,
                            duration: match.scoreboard && match.scoreboard.duration
                        };
                    })
                    .sort((a, b) => b.spectators - a.spectators);

                return resolve(list);
            });
        });
    }

    getMatch(channelID, matchID) {
        return new Promise((resolve, reject) => {
            this._getMatches(false, (err) => {
                if (err) return reject(err);

                if (channelID) matchID = this.channels.get(channelID);
                return resolve(this.matches.get(matchID));
            });
        });
    }

    associate(channelID, matchID) {
        return Promise.resolve(this.channels.set(channelID, matchID));
    }

    getMatchHeroes(match) {
        return match.scoreboard.radiant.players.concat(match.scoreboard.dire.players);
    }
}

module.exports = LeagueUtils;
