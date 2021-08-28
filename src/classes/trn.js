import fetch from "node-fetch";
import chalk from "chalk";
import cheerio from "cheerio";
export const TRN  = class TRN {
    constructor({key}) {
        this.key = key
    } 
    async req(url) {
        let res = await fetch(url, {
            method:'GET',
            headers: {
                    "TRN-Api-Key": this.key
            }
        });
        let body = await res.json();
        if(res.ok){
            return body.data;
        }
        else {
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
    }
    async ApexLegends({username,platform}) {
        const platforms = ["xbl","psn","origin"];
        if(!platforms.includes(platform)){ 
            throw new TypeError(chalk.bold.red(`[Statisfy] ERROR: Invalid platform provided. Options include ${platforms}`))
        }
       let info = await this.req(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`);
       return info;
    }
}