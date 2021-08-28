const { npm, Twitch, Twitter, TRN } = require("statisfy");
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