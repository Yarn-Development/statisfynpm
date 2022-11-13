#!/usr/bin/env node
import { npm, Twitch, Twitter, TRN, Spotify, YouTube, CMC } from "../src/index";
import * as config from "../src/config.json";

const ttv = new Twitch({
	clientID:config.client_id,
	clientSecret:config.secret,
});
const twt = new Twitter({
	token: config.twitter,
});
const trn = new TRN(config.trnkey);
const spotify = new Spotify({
	clientID: config.spotifyCID,
	clientSecret: config.spotifyCS,
});
const yt = new YouTube({
	key:config.youtube,
});
const cmc = new CMC({
	key: config.cmc,
});
import { createInterface } from "readline";
const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});
import { promisify } from "util";
const question = promisify(rl.question).bind(rl);


async function main() {
	try {
		const opt = await question("Select Statisfy Option:\n[01]: Twitch\n[02]: Twitter\n[03]: TRN\n[04]: Spotify\n[05]: NPM\n[06]: YouTube\n[07]: CoinMarketCap\nChoice: ");
		if((typeof opt === "string") && (opt === "1" || opt === "01")) {
			try {
				const username: string | void = await question("Enter Twitch Username: ").catch(err => console.error(err));
				if (typeof username === "string") console.log(await ttv.getUserByName(username));
				else return;
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "2" || opt === "02")) {
			try {
				const user = await question("Enter Twitter Username: ");
				if (typeof user === "string") console.log(await twt.UserLookupByName(user));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "3" || opt === "03")) {
			try {
				const game: string | void = await question("Select Game:\n[01]: Fortnite\n[02]: Apex Legends\nChoice: ");
				if((typeof game === "string") && (game === "1" || game === "01")) {
					try{
						const platform: string | void = await question("Select Platform:\n[01]: PC\n[02]: Console\n[03]:Mobile\nChoice: ");
						if((typeof platform === "string") && (platform === "1" || platform === "01")) {
							try {
								const user: string | void = await question("Enter Epic Games Username: ");
								if (typeof user === "string") {
									console.log(user);
									console.log(await trn.Fortnite({ user, platform:"kbm" }));
								}
							}
							catch(err) {
								console.log(err);
							}
						}
						else if((typeof platform === "string") && (platform === "2" || platform === "02")) {
							try {
								const user = await question("Enter Epic Games Username: ");
								console.log(await trn.Fortnite({ user, platform:"gamepad" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if((typeof platform === "string") && (platform === "3" || platform === "03")) {
							try {
								const username = await question("Enter Epic Games Username: ");
								console.log(await trn.Fortnite({ user:username, platform:"touch" }));
							}
							catch(err) {
								console.log(err);
							}
						}
					}
					catch(err) {
						console.log(err);
					}
				}
				else if ((typeof game === "string") && (game === "2" || game === "02")) {
					try {
						const platform: string | void = await question("Select Platform:\n[01]: PC\n[02]: PSN\n[03]: Xbox\nChoice: ");
						if((typeof platform === "string") && (platform === "1" || platform === "01")) {
							try {
								const user = await question("Enter Origin Username: ");
								console.log(await trn.ApexLegends({ user:user, platform:"origin" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if ((typeof platform === "string") && (platform === "2" || platform === "02")) {
							try{
								const user = await question("Enter PSN Gamertag: ");
								console.log(await trn.ApexLegends({ user:user, platform:"psn" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if ((typeof platform === "string") && (platform === "3" || platform === "03")) {
							try {
								const user = await question("Enter Xbox Gamertag: ");
								console.log(await trn.ApexLegends({ user:user, platform: "xbl" }));
							}
							catch(err) {
								console.log(err);
							}
						}
					}
					catch (err) {
						console.log(err);
					}
				}
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "4" || opt === "04")) {
			try {
				const prompt: string | void = await question("Select Option to Statisfy:\n[01]: Playlist Stats\n[02]: Top Tracks [Unavailable for Cloud IDEs]\n[03]: Search\nChoice: ");
				if((typeof prompt === "string") && (prompt === "1" || prompt === "01")) {
					let playlist: unknown = await question("Enter Spotify Playlist URL: ");
					if((typeof playlist === "string") && (playlist.includes("/playlist/"))) {
						playlist = playlist.split("/playlist/")[1];
					}
					if((typeof playlist === "string") && (playlist.includes("?si"))) {
						playlist = playlist.split("?si")[0];
					}
					if(typeof playlist === "string") console.log(await spotify.getPlaylist(playlist));
				}
				else if((typeof prompt === "string") && (prompt === "2" || prompt === "02")) {
					let time: string | void = await question("Enter Time Range:\n[01]: Short Term\n[02]: Medium Term\n[03]: Long Term\nChoice: ");
					let limit : string | void = await question("Enter Limit:\n[01]: 1\n[02]: 5\n[03]: 10\n[04]: 15\n[05]: 25\n[06]: 50\nChoice: ");
					let type: string | void = await question("Enter Type:\n[01]: Tracks\n[02]: Artists");
					if((typeof time === "string") && (time === "1" || time === "01")) {
						time = "short_term";
					}
					else if((typeof time === "string") && (time === "2" || time === "02")) {
						time = "medium_term";
					}
					else if((typeof time === "string") && (time === "3" || time === "03")) {
						time = "long_term";
					}
					if((typeof type === "string") && (type === "1" || type === "01")) {
						type = "tracks";
					}
					else if((typeof type === "string") && (type === "2" || type === "02")) {
						type = "artists";
					}
					if((typeof limit === "string") && (limit === "1" || limit === "01")) {
						limit = "1";
					}
					else if((typeof limit === "string") && (limit === "2" || limit === "02")) {
						limit = "5";
					}
					else if((typeof limit === "string") && (limit === "3" || limit === "03")) {
						limit = "10";
					}
					else if((typeof limit === "string") && (limit === "4" || limit === "04")) {
						limit = "15";
					}
					else if((typeof limit === "string") && (limit === "5" || limit === "05")) {
						limit = "25";
					}
					else if((typeof limit === "string") && (limit === "6" || limit === "06")) {
						limit = "50";
					}
					if(typeof limit === "string") console.log(await spotify.top({ time:time, limit:parseInt(limit), type:type }));
				}
				else if((typeof prompt === "string") && (prompt === "3" || prompt === "03")) {
					const search = await question("Enter Search Term: ");
					let type: string | void = await question("Enter Type:\n[01]: Tracks\n[02]: Artists\n[03]: Albums ");
					if((typeof type === "string") && (type === "1" || type === "01")) {
						type = "track";
					}
					else if((typeof type === "string") && (type === "2" || type === "02")) {
						type = "artist";
					}
					else if((typeof type === "string") && (type === "3" || type === "03")) {
						type = "album";
					}
					if(typeof search === "string") console.log(await spotify.search({ query:search, type:type, limit:5 }));
				}
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "5" || opt === "05")) {
			try {
				const pkg = await question("Enter NPM package to Statisfy: ");
				if(typeof pkg === "string") console.log(await npm(pkg));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "6" || opt === "06")) {
			try {
				const method = await question("Enter Method to Statisfy:\n[01]: Search\n[02]: Video\n[03]: Channel\n[04]: Playlist ");
				if((typeof method === "string") && (method === "1" || method === "01")) {
					const search = await question("Enter Search Term: ");
					const limit = await question("Enter Amount of Results to Return: ");
					if (typeof search === "string" && typeof limit === "string") console.log(await yt.search({ query:search, limit:parseInt(limit) }));
					if (typeof search === "string")console.log(await yt.getVideoByQuery(search));
				}
			}
			catch(err) {
				console.log(err);
			}
		}
		else if((typeof opt === "string") && (opt === "7" || opt === "07")) {
			try {
				const type = await question("Enter identifier type:\n[01]: ID\n[02]: Slug\n[03]: Symbol\nChoice: ");
				if((typeof type === "string") && (type === "1" || type === "01")) {
					const id = await question("Enter ID of Coin to fetch:  ");
					if(typeof id === "string") {
						const info = await cmc.getQuotesById(id);
						console.log(info, info.data["1"].quote);
					}
				}
				else if((typeof type === "string") && (type === "2" || type === "02")) {
					const slug = await question("Enter Slug of Coin to fetch:  ");
					if(typeof slug === "string") {
						const info = await cmc.getQuotesBySlug(slug);
						console.log(info, info.data["1"].quote);
					}
				}
				else if((typeof type === "string") && (type === "3" || type === "03")) {
					const symbol = await question("Enter Symbol of Coin to fetch:  ");
					if(typeof symbol === "string") {
						const info = await cmc.getQuotesBySymbol(symbol);
						console.log(info, info.data["1"].quote);
					}
				}
			}
			catch(err) {
				console.log(err);
			}
		}
	}
	catch (err) {
		console.log(err);
	}
}
main();