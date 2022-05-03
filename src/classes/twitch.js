import fetch from "node-fetch";
import chalk from "chalk";
/**
 * @class
 * @classdesc Twitch Class, which handles all relevant statistical endpoints from the Twitch API
 * @param {String} client_id Twitch Client ID from Developer Portal
 * @param {String} client_secret Twitch Client Secret from Developer Portal 
 */
export const Twitch = class Twitch {
    constructor ({client_id,client_secret}){
       this.client = client_id;
       this.secret = client_secret;
   }
   /**
    * It gets a token from the Twitch API.
    * @async
    * @returns The access token.
    */
   async getToken() {
        let info = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.client}&client_secret=${this.secret}&grant_type=client_credentials`,{
                method:'POST'
        });
        let body = await info.json();
        if (info.ok) {
            if(body.access_token == null) {
                throw new Error(chalk.bold.red("[Statisfy] Token generation error."))
            }
            else  {
            return body.access_token;
            }
        }
        else {
            throw new Error(chalk.bold.red(`[Statisfy] ${body.status} ERROR: ${body.error}`) + ` - ${body.message}`)
        }
       
    }
   /**
    * It takes a URL, gets an access token, and then makes a GET request to the URL with the access
    * token.
    * @async
    * @param {String} url - The URL of the API endpoint you want to access.
    * @returns The data from the API call.
    */
   async req(url) {
       let token = await this.getToken();
       if (token == null) {
           throw new Error(`${chalk.bold.red("[Statisfy] ERROR:")} Access Token generation failed. Please try again.`)
       }
       if(this.client == null) {
           throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Client ID not provided."))
       }
       else if (this.secret == null){
           throw new Error(chalk.bold.red("[Statisfy] ERROR: Twitch Client Secret not provided."))
       }
       let res = await fetch(url,{
           method:'GET',
           headers:{
           "Authorization": `Bearer ${token}`,
           "Client-Id": `${this.client}`         
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
        * It gets the user's information by their username
        * @async
        * @param {String} username - The username of the user you want to get the info of.
        * @returns The user's information.
        */
       async getUserByName(username) {
        if(username == null) {
            throw new Error(chalk.bold.red("[Statisfy] ERROR: Username not provided."))
        }
           let info = await this.req(`https://api.twitch.tv/helix/users?login=${username.toLowerCase()}`);
           return info[0];
        }
/**
 * It gets a user's information by their ID
 * @async
 * @param {String} id - The user's ID.
 * @returns An object with the user's information.
 */
   async getUserByID(id) {
       let info = await this.req(`https://api.twitch.tv/helix/users?id=${id}`);
       return info[0];
   }
/**
 * It gets the channel info of a user
 * @async
 * @param {String} id - The channel ID of the channel you want to get the info of.
 * @returns An object with the channel info.
 */
   async getChannelInfo(id) {
       let info = await this.req(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`);
       return info[0];
   }

/**
 * It searches for a channel by username and returns the first result.
 * @async
 * @param {String} username - The username of the channel you want to get the information of.
 * @returns An object with the channel information.
 */
   async searchChannels(username) {
       let info = await this.req(`https://api.twitch.tv/helix/search/channels?query=${username}`);
       return info[0];
   } 
}