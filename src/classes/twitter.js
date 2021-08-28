import fetch from "node-fetch";
import chalk from "chalk";

export const Twitter = class Twitter {
    constructor({token}) {
        this.token = token;
    }
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
  async UserLookupByName(user) {
      const info = await this.req(`https://api.twitter.com/2/users/by/username/${user}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld`);
      return info;
  }
}
