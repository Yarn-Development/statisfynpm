import fetch from "node-fetch";
import chalk from "chalk";
/**
 * @class
 * @classdesc Twitter Class, which handles all relevant statistical endpoints from the Twitter API
 * @param {String} token Twittter Developer Token 
 */
export const Twitter = class Twitter {
    constructor({token}) {
        this.token = token;
    }
   /**
    * It makes a request to the url, and if the response is ok, it returns the body data, otherwise it
    * throws an error.
    * @async
    * @param {String} url - The url you want to send the request to.
    * @returns The data from the API.
    */
    async req(url) {
       let res = await fetch(url, {
            method:'GET',
            headers: {
                "Authorization":`Bearer ${this.token}`
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
/**
 * It takes a Twitter username as a parameter, and returns a JSON object containing the user's
 * information.
 * @async
 * @param {String} user - The username of the user you want to look up.
 * @returns The user's information.
 */
  async UserLookupByName(user) {
      const info = await this.req(`https://api.twitter.com/2/users/by/username/${user}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld`);
      return info;
  }
}
