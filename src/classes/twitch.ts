import fetch from "node-fetch";
import { exit } from "../utils.js";
interface TwitchOptions {
	clientID: string,
	clientSecret: string,
}
/**
 * @class
 * @classdesc Twitch Class, which handles all relevant statistical endpoints from the Twitch API
 * @param {String} client_id Twitch Client ID from Developer Portal
 * @param {String} client_secret Twitch Client Secret from Developer Portal
 */
export const Twitch = class Twitch {
	client: string;
	secret: string;

	constructor(options: TwitchOptions) {
		this.client = options.clientID;
		this.secret = options.clientSecret;
	}
	/**
    * It gets a token from the Twitch API.
    * @async
    * @returns The access token.
    */
	async getToken() {
		const info = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${this.client}&client_secret=${this.secret}&grant_type=client_credentials`, {
			method:"POST",
		});
		const body = await info.json();
		if (info.ok) {
			if(body.access_token == null) {
				exit("[Statisfy] Token generation error.", "red");
			}
			else {
				return body.access_token;
			}
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
		}

	}
	/**
    * It takes a URL, gets an access token, and then makes a GET request to the URL with the access
    * token.
	* @private
    * @async
    * @param {String} url - The URL of the API endpoint you want to access.
    * @returns The data from the API call.
    */
	async req(url: string) {
		const token = await this.getToken();
		if (token == null) {
			exit("[Statisfy] ERROR: Access Token generation failed. Please try again.", "red");
		}
		if(this.client == null) {
			exit("[Statisfy] ERROR: Twitch Client ID not provided.", "red");
		}
		else if (this.secret == null) {
			exit("[Statisfy] ERROR: Twitch Client Secret not provided.", "red");
		}
		const res = await fetch(url, {
			method:"GET",
			headers:{
				"Authorization": `Bearer ${token}`,
				"Client-Id": `${this.client}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body.data;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
		}
	}


	/**
        * It gets the user's information by their username
        * @async
        * @param {String} username - The username of the user you want to get the info of.
        * @returns The user's information.
        */
	async getUserByName(username: string) {
		if(username == null) {
			exit("[Statisfy] ERROR: Username not provided.", "red");
		}
		const info = await this.req(`https://api.twitch.tv/helix/users?login=${username.toLowerCase()}`);
		return info[0];
	}
	/**
 * It gets a user's information by their ID
 * @async
 * @param {String} id - The user's ID.
 * @returns An object with the user's information.
 */
	async getUserByID(id: string) {
		const info = await this.req(`https://api.twitch.tv/helix/users?id=${id}`);
		return info[0];
	}
	/**
 * It gets the channel info of a user
 * @async
 * @param {String} id - The channel ID of the channel you want to get the info of.
 * @returns An object with the channel info.
 */
	async getChannelInfo(id: string) {
		const info = await this.req(`https://api.twitch.tv/helix/channels?broadcaster_id=${id}`);
		return info[0];
	}

	/**
 * It searches for a channel by username and returns the first result.
 * @async
 * @param {String} username - The username of the channel you want to get the information of.
 * @returns An object with the channel information.
 */
	async searchChannels(username: string) {
		const info = await this.req(`https://api.twitch.tv/helix/search/channels?query=${username}`);
		return info[0];
	}
};