import {npm,Twitch} from "statisfy";
import config from '../src/config.json';
const ttv = new Twitch({
    client_id:config.client_id,
    client_secret:config.secret
});
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