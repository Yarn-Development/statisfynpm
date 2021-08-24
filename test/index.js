const statisfy = require("statisfy");
const {npm} = require("statisfy")
const {client_id,token} = require("../src/config.json")

const ttv = new statisfy.Twitch({
    client_id:client_id,
    token:token
});
let ttvtest = async function() {
const result = await ttv.getUserByName("ludwig")
console.log(result)
}
ttvtest()