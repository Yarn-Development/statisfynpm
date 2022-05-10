const { npm, Twitch, Twitter, TRN, Spotify } = require("statisfy");
const config = require("../src/config.json");
const ttv = new Twitch({
	client_id:config.client_id,
	client_secret:config.secret,
});
const twt = new Twitter({
	token:config.twitter,
});
const trn = new TRN({
	key:config.trnkey,
});
const spotify = new Spotify({
	client_id:config.spotifyCID,
	client_secret:config.spotifyCS,
});
function question(query) {
	const readline = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	return new Promise(resolve => readline.question(query, ans => {
		readline.close();
		resolve(ans);
	}));
}
async function main() {
	try {
		const opt = await question("Select Statisfy Option:\n[01]: Twitch\n[02]: Twitter\n[03]: TRN\n[04]: Spotify\n[05]: NPM\nChoice: ", console.log);
		if(opt == "1") {
			try {
				const user = await question("Enter Twitch Username: ", console.log).catch(err => console.error(err));
				console.log(await ttv.getUserByName(user));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "2") {
			try {
				const user = await question("Enter Twitter Username: ", console.log);
				console.log(await twt.UserLookupByName(user));
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "3") {
			try {
				const game = await question("Select Game:\n[01]: Fortnite\n[02]: Apex Legends", console.log);
				if(game == "1") {
					try{
						const platform = await question("Select Platform:\n[01]: PC\n[02]: Console\n[03]:Mobile", console.log);
						if(platform == "1") {
							try {
								const user = await question("Enter Epic Games Username: ", console.log);
								console.log(await trn.Fortnite({ user:user, platform:"kbm" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if(platform == "2") {
							try {
								const user = await question("Enter Epic Games Username: ", console.log);
								console.log(await trn.Fortnite({ user:user, platform:"gamepad" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if(platform == "3") {
							try {
								const user = await question("Enter Epic Games Username: ", console.log);
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
				else if (game == "2") {
					try {
						const platform = await question("Select Platform:\n[01]: PC\n[02]: PSN\n[03]: Xbox", console.log);
						if(platform == "1") {
							try {
								const user = await question("Enter Origin Username: ", console.log);
								console.log(await trn.ApexLegends({ user:user, platform:"origin" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if (platform == "2") {
							try{
								const user = await question("Enter PSN Gamertag: ", console.log);
								console.log(await trn.ApexLegends({ user:user, platform:"psn" }));
							}
							catch(err) {
								console.log(err);
							}
						}
						else if (platform == 3) {
							try {
								const user = await question("Enter Xbox Gamertag: ", console.log);
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
		else if(opt == "4") {
			try {
				const prompt = await question("Select Option to Statisfy:\n[01]: Playlist Stats\n[02]: Top Tracks [Unavailable for Cloud IDEs]", console.log);
				if(prompt == "1") {
					let playlist = await question("Enter Spotify Playlist URL: ", console.log);
					if(playlist.includes("/playlist/")) {
						playlist = playlist.split("/playlist/")[1];
					}
					if(playlist.includes("?si")) {
						playlist = playlist.split("?si")[0];
					}
					console.log(await spotify.getPlaylist(playlist));
				}
			}
			catch(err) {
				console.log(err);
			}
		}
		else if(opt == "5") {
			try {
				const pkg = await question("Enter NPM package to Statisfy: ", console.log);
				console.log(await npm(pkg));
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