import fetch from "node-fetch";
import chalk from "chalk";
export const TRN  = class TRN {
    constructor({key}) {
        this.key = key
    } 
    /**
     * It takes a URL, makes a GET request to it, and returns the body of the response
     * @param url - The URL to send the request to.
     * @returns The response from the API.
     */
    async req(url) {
        let res = await fetch(url, {
            method:'GET',
            headers: {
                    "TRN-Api-Key": this.key
            }
        });
        let body = await res.json();
        if(res.ok){
            return body;
        }
        else {
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
    }
   /**
    * It takes in a username and platform and returns the data from the API.
    * @returns The data object from the response.
    */
    async ApexLegends({username,platform}) {
        const platforms = ["xbl","psn","origin"];
        if(!platforms.includes(platform)){ 
            throw new TypeError(chalk.bold.red(`[Statisfy] ERROR: Invalid platform provided. Options include ${platforms}`))
        }
       let info = await this.req(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`);
       return info.data;
    }
    /**
     * It takes in a username and platform, and returns the stats of the user.
     * @returns the info object from the response.
     */
    async Fortnite({username,platform}) {
        const platforms = ["kbm","gamepad","touch"];
        if(!platforms.includes(platform)){ 
            throw new TypeError(chalk.bold.red(`[Statisfy] ERROR: Invalid platform provided. Options include ${platforms}`))
        }
        let info = await this.req(`https://api.fortnitetracker.com/v1/profile/${platform}/${username}`);
        return info;
       
    }
}