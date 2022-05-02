const { npm, Twitch, Twitter, TRN, Spotify } = require("statisfy");
const config = require("../src/config.json")
const ttv = new Twitch({
    client_id:config.client_id,
    client_secret:config.secret
});
const twt = new Twitter({
    token:config.twitter
});
const trn = new TRN({
    key:config.trnkey
});
const spotify = new Spotify({
    client_id:config.spotifyCID,
    client_secret:config.spotifyCS
  })
async function ttvtest() {
const result = await ttv.getUserByName("Aspekts")
console.log(result)
}
ttvtest()
async function npmtest() {
    const result = await npm("statisfy")
    console.log(result)

}
npmtest()
async function twttest() {
    const result = await twt.UserLookupByName("POTUS")
    console.log(result)
}
twttest()
async function apextest() {
    const result = await trn.ApexLegends({
        username:'xAspekts',
        platform: "xbl"
    });
    console.log(result)
}
apextest() 
async function fntest(){
    const result = await trn.Fortnite({
        username:'bhakaani',
        platform:'kbm'
    })
    console.log(result)
}
fntest()

async function spot(){
    console.log(await spotify.getPlaylist("4XpJdPT0WpzN5qx0oEjX2u")); // id of playlist - open.spotify.com/playlist/x
    console.log(await spotify.top({
      time:"medium_term", // short_term (4 weeks), medium_term (6 months), or long_term (Lifetime)
      type:"artists", // artists or tracks
      limit:"1"// amount of artists to show 
    }));
  };
  spot()