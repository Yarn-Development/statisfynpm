"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fetch = require("node-fetch");
var chalk = require("chalk");
module.exports = require('../dist');
exports.npm = async function (pkg) {
    try {
        if (!pkg) return console.log(chalk.bold.red("[Statisfy] ERROR: Package not provided."));
        var response = await fetch('https://api.npms.io/v2/search?q=' + pkg).then(function (res) {
            return res.json();
        });
        if (!response) return console.log("[Statisfy] ERROR: Failed to find package from npm. ");
        return response.results[0].package;
    } catch (err) {
        console.log("[Statisfy] ERROR: " + err);
    }
};

var Twitch = function () {
    function Twitch(_ref) {
        var client_id = _ref.client_id,
            token = _ref.token;

        _classCallCheck(this, Twitch);

        this.client = client_id;
        this.token = token;
    }

    _createClass(Twitch, [{
        key: "req",
        value: async function req(url) {
            if (this.client == null) {
                throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Client ID not provided."));
            } else if (this.token == null) {
                throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Token not provided."));
            }
            var res = await fetch(url, {
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + this.token,
                    "Client-Id": "" + this.client
                }
            });
            var body = await res.json();
            if (res.ok) {
                return body.data;
            } else {
                throw new Error(chalk.bold.red("[Statisfy] " + body.status + " ERROR: " + body.error) + (" - " + body.message));
            }
        }
    }, {
        key: "getUserByName",
        value: async function getUserByName(username) {
            if (username == null) {
                throw new Error(chalk.bold.red("[Statisfy] ERROR: Username not provided."));
            }
            var info = await this.req("https://api.twitch.tv/helix/users?login=" + username);
            return info[0];
        }
    }, {
        key: "getUserByID",
        value: async function getUserByID(id) {
            var info = await this.req("https://api.twitch.tv/helix/users?id=" + id);
            return info[0];
        }
    }, {
        key: "getChannelInfo",
        value: async function getChannelInfo(id) {
            var info = await this.req("https://api.twitch.tv/helix/channels?broadcaster_id=" + id);
            return info[0];
        }
    }, {
        key: "searchChannels",
        value: async function searchChannels(username) {
            var info = await this.req("https://api.twitch.tv/helix/search/channels?query=" + username);
        }
    }]);

    return Twitch;
}();

module.exports = { Twitch: Twitch };