import fetch from "node-fetch";
import http from "http";
import { exit } from "../utils.js";
/**
 * @class
 * @classdec Spotify Class, which handles all relevant statistical endpoints from the Spotify API
 * @param {String} client_id Spotify client ID
 * @param {String} client_secret Spotify client secret
 */
export const Spotify = class Spotify {
	constructor({ client_id, client_secret }) {
		this.id = client_id;
		this.secret = client_secret;
	}

	

	/**
   * It takes the client id and secret, encodes them into base64, and sends them to the Spotify API to
   * get an access token.
   * @async
   * @returns The access token is being returned.
   */
	async access_token() {
		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		const message = (Buffer.from(`${this.id}:${this.secret}`).toString("base64"));
		const res = await fetch("https://accounts.spotify.com/api/token", {
			method:"POST",
			body: params,
			headers:{
				"Authorization":`Basic ${message}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body.access_token;
		}
		else {
			console.log(body);
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`);
		}
	}
	
	
	/**
   * It takes a url, gets an access token, and then makes a request to the url with the access token.
   * You can use <code>async/await</code> to make it easier to read.
   * @private
   * @async
   * @param {String} url - The url you want to request.
   * @returns The response body.
   */
	async req(url) {
		const token = await this.access_token();
		const res = await fetch(url, {
			headers:{
				"Authorization":`Bearer ${token}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`);
		}
	}
	/**
	 * It takes the refresh token and sends it to the Spotify API to get a new access token
	 * @async
	 * @returns The access token.
	 */
	async refresh_token() {
		const params = new URLSearchParams();
		params.append("grant_type", "refresh_token");
		params.append("refresh_token", this.oauth_token.refresh_token);
		const message = (Buffer.from(`${this.id}:${this.secret}`).toString("base64"));
		const res = await fetch("https://accounts.spotify.com/api/token", {
			method:"POST",
			body: params,
			headers:{
				"Authorization":`Basic ${message}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			const date = Date.now();
			const expire_time = date + (body.expires_in * 1000);
			await this.db.insertOne({ client_id: this.id, client_secret:this.secret, oauth_token:body, expires_in:expire_time });
			return body.access_token;
		}
		else {
			console.log(body);
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`);
		}
	}
	
	/**
  * It takes a playlist ID and returns the playlist's data.
  * @async
  * @param {String} playlist - The Spotify ID of the playlist you want to get.
  * @returns The data from the request.
  */
	async getPlaylist(playlist) {
		const data = await this.req(`https://api.spotify.com/v1/playlists/${playlist}`);
		return data;
	}
	/**
	 * It searches for a song, artist, album, or playlist
	 * @async
	 * @param {String} query - The query you want to search for.
	 * @param {String} type - The type of data you want to search for.
	 * @param {Integer} limit - The amount of results you want to get.
	 * @returns The search function returns the body of the response.
	 */
	async search({ query, type, limit }) {
		const formattedQuery = query.replace(/ /g, "%20");
		console.log(formattedQuery);
		const token = await this.access_token();
		console.log(token);
		const res = await fetch(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=${type}&limit=${limit}&market=GB`, {
			headers:{
				"Authorization":`Bearer ${token}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} -  ${body.message}`, "red");
		}
	}
};
