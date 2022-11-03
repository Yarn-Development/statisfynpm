import fetch from "node-fetch";
import { exit } from "../utils.js";

interface GameOptions {
		user: any;
		platform: string;
}
/**
 * @class
 * @classdesc Handler for game statistics supplied via the Tracker Network API.
 * @param {String} key Tracker Network Key to authenticate API Requests
 */
export const TRN = class TRN {
	key: string;
	constructor(key: string) {
		this.key = key;
	}
	/**
     * It takes a URL, makes a GET request to it, and returns the body of the response
	 * @private
     * @async
     * @param url - The URL to send the request to.
     * @returns The response from the API.
     */
	async req(url: string) {
		const res = await fetch(url, {
			method:"GET",
			headers: {
				"TRN-Api-Key": this.key,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
		}
	}
	/**
    * It takes in a username and platform and returns the data from the API.
    * @async
    * @param {String} user The username of the player
    * @param {String} platform The platform of the player retrieving stats from
    * @returns The data object from the response.
    */
	async ApexLegends(options: GameOptions) {
		const platforms: string[] = ["xbl", "psn", "origin"];
		if(!platforms.includes(options.platform)) {
			exit(`[Statisfy] ERROR: Invalid platform provided. Options include ${platforms}`, "red");
		}
		const info = await this.req(`https://public-api.tracker.gg/v2/apex/standard/profile/${options.platform}/${options.user}`);
		return info.data;
	}
	/**
     * It takes in a username and platform, and returns the stats of the user.
     * @async
     * @param {String} user The username of the player
    *  @param {String} platform The platform of the player retrieving stats from
     * @returns the info object from the response.
     */

	async Fortnite(options: GameOptions) {
		const platforms: string[] = ["kbm", "gamepad", "touch"];
		if(!platforms.includes(options.platform)) {
			exit(`[Statisfy] ERROR: Invalid platform provided. Options include ${platforms}`, "red");
		}
		const info = await this.req(`https://api.fortnitetracker.com/v1/profile/${options.platform}/${options.user}`);
		return info;

	}
};