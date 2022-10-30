const { npm, Twitch, Twitter, TRN, Spotify, YouTube } = require("statisfy");
const config = require("../src/config.json");

const ttv = new Twitch({
	clientID:config.client_id,
	clientSecret:config.secret,
});
const twt = new Twitter({
	token: config.twitter,
});
const trn = new TRN({
	key: config.trnkey,
});
const spotify = new Spotify({
	clientID: config.spotifyCID,
	clientSecret: config.spotifyCS,
});
const yt = new YouTube({
	key:config.youtube,
});
const { createInterface } = require("readline");
const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

const question = (questionText) =>
	new Promise(resolve => rl.question(questionText, resolve))
		.finally(() => rl.close());

async function main() {
	try {
		const opt = await question("Select Statisfy Option:\n[01]: Twitch\n[02]: Twitter\n[03]: TRN\n[04]: Spotify\n[05]: NPM\n[06]: YouTube\nChoice: ");
		if(opt == "1" || opt == "01") {
			try {
				const user = await question("Enter Twitch Username: ").catch(err => console.error(err));
				console.log(await ttv.getUserByName(user));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "2" || opt == "02") {
			try {
				const user = await question("Enter Twitter Username: ");
				console.log(await twt.UserLookupByName(user));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "3" || opt == "03") {
			try {
				const game = await question("Select Game:\n[01]: Fortnite\n[02]: Apex Legends");
				if(game == "1" || game == "01") {
					try{
						const platform = await question("Select Platform:\n[01]: PC\n[02]: Console\n[03]:Mobile");
						if(platform == "1" || platform == "01") {
							try {
								const user = await question("Enter Epic Games Username: ");
								console.log(await trn.Fortnite({ user:user, platform:"kbm" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if(platform == "2" || platform == "02") {
							try {
								const user = await question("Enter Epic Games Username: ");
								console.log(await trn.Fortnite({ user:user, platform:"gamepad" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if(platform == "3" || platform == "03") {
							try {
								const user = await question("Enter Epic Games Username: ");
								console.log(await trn.Fortnite({ user:user, platform:"touch" }));
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
				else if (game == "2" || game == "02") {
					try {
						const platform = await question("Select Platform:\n[01]: PC\n[02]: PSN\n[03]: Xbox");
						if(platform == "1" || platform == "01") {
							try {
								const user = await question("Enter Origin Username: ");
								console.log(await trn.ApexLegends({ user:user, platform:"origin" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if (platform == "2" || platform == "02") {
							try{
								const user = await question("Enter PSN Gamertag: ");
								console.log(await trn.ApexLegends({ user:user, platform:"psn" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if (platform == "3" || platform == "03") {
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
		else if(opt == "4" || opt == "04") {
			try {
				const prompt = await question("Select Option to Statisfy:\n[01]: Playlist Stats\n[02]: Top Tracks [Unavailable for Cloud IDEs]\n[03]: Search");
				if(prompt == "1" || prompt == "01") {
					let playlist = await question("Enter Spotify Playlist URL: ");
					if(playlist.includes("/playlist/")) {
						playlist = playlist.split("/playlist/")[1];
					}
					if(playlist.includes("?si")) {
						playlist = playlist.split("?si")[0];
					}
					console.log(await spotify.getPlaylist(playlist));
				}
				else if(prompt == "2" || prompt == "02") {
					let time = await question("Enter Time Range:\n[01]: Short Term\n[02]: Medium Term\n[03]: Long Term");
					let limit = await question("Enter Limit:\n[01]: 1\n[02]: 5\n[03]: 10\n[04]: 15\n[05]: 25\n[06]: 50");
					let type = await question("Enter Type:\n[01]: Tracks\n[02]: Artists");
					if(time == "1" || time == "01") {
						time = "short_term";
					}
					else if(time == "2" || time == "02") {
						time = "medium_term";
					}
					else if(time == "3" || time == "03") {
						time = "long_term";
					}
					if(type == "1" || type == "01") {
						type = "tracks";
					}
					else if(type == "2" || type == "02") {
						type = "artists";
					}
					if(limit == "1" || limit == "01") {
						limit = 1;
					}
					else if(limit == "2" || limit == "02") {
						limit = 5;
					}
					else if(limit == "3" || limit == "03") {
						limit = 10;
					}
					else if(limit == "4" || limit == "04") {
						limit = 15;
					}
					else if(limit == "5" || limit == "05") {
						limit = 25;
					}
					else if(limit == "6" || limit == "06") {
						limit = 50;
					}
					console.log(await spotify.top({ time:time, limit:limit, type:type }));
				}
				else if(prompt == "3" || prompt == "03") {
					const search = await question("Enter Search Term: ");
					let type = await question("Enter Type:\n[01]: Tracks\n[02]: Artists\n[03]: Albums ");
					if(type == "1" || type == "01") {
						type = "track";
					}
					else if(type == "2" || type == "02") {
						type = "artist";
					}
					else if(type == "3" || type == "03") {
						type = "album";
					}
					console.log(search);
					console.log(await spotify.search({ query:search, type:type, limit:5 }));
				}
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "5" || opt == "05") {
			try {
				const pkg = await question("Enter NPM package to Statisfy: ");
				console.log(await npm(pkg));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "6" || opt == "06") {
			try {
				const method = await question("Enter Method to Statisfy:\n[01]: Search\n[02]: Video\n[03]: Channel\n[04]: Playlist ");
				if(method == "1" || method == "01") {
					const search = await question("Enter Search Term: ");
					const limit = await question("Enter Amount of Results to Return: ");
					console.log(await yt.search({ query:search, limit:limit }));
					console.log(await yt.getVideoByQuery(search));
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