import fetch from "node-fetch";
import http from "http";
import { exit } from "../utils.js";
import { QuickDB } from "quick.db";

/**
 * @class
 * @classdec Spotify Class, which handles all relevant statistical endpoints from the Spotify API
 * @param {String} client_id Spotify client ID
 * @param {String} client_secret Spotify client secret
 */
export const Spotify = class Spotify {
	constructor({ client_id, client_secret }) {
		const db = new QuickDB({ filePath:"./src/data/creds.sqlite" });
		this.id = client_id;
		this.secret = client_secret;
		this.db = db;
	}

	async DatabaseManager() {
		const instance = await this.db.get("instance");
		if(!instance) {
			this.oauth_token = this.oauth({ scopes:"user-top-read", uri:"http://localhost:8888" });

			return this.oauth_token;
		}
		else if (instance.expires_in < Date.now()) {
			this.oauth_token = this.oauth({ scopes:"user-top-read", uri:"http://localhost:8888" });
			return this.oauth_token;
		}
		else {
			this.oauth_token = instance.oauth_token.access_token;
			return this.oauth_token;
		}
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
 * @async
 * @param {String} scopes Scopes required to authenticate
 * @param {String} uri Redirect URL to callback following authentication
 * @returns Access Token
 */
	async oauth({ scopes, uri }) {
		/**
     * It creates a server on the given port, and returns a promise that resolves to the url that the
     * server receives a request on.
     * @async
     * @param {Integer} port - The port number to listen on.
     * @returns A promise that resolves to a string.
     */
		const getLocalhostUrl = async function(port) {
			return new Promise((resolve, reject) => {
				const server = http
					.createServer((req, res) => {
						res.writeHead(200, { "Content-Type": "text/plain" });
						res.end("You can now close this window");
						res.once("finish", () => {
							server.close();
							if (req.url) {
								resolve(req.url.slice(1));
							}
							reject("Couldn't get code or state");
						});
					})
					.listen(port);
			});
		};
		/* Getting the access token. */
		const state = Math.random().toString(36).slice(2);
		const spotifyUrl =
        "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({ response_type: "code", show_dialog: "true",	state, client_id: this.id, redirect_uri: uri, scope: scopes }).toString();
		console.info("You appear to be using Statisfy for the first time.\nPlease click the link to login to Spotify in the browser. You will not have to do this again.\n");
		console.info(spotifyUrl + "\n");
		const authUrl = await getLocalhostUrl((new URL(uri).port) || 8888);
		const params = new URLSearchParams(authUrl);
		const receivedCode = params.get("code");
		const receivedState = params.get("state");

		if (receivedState !== state) {
			exit("Received and original state do not match");
		}

		if (!receivedCode) {
			exit("No code received");
		}

		console.info("Login successful! Cleaning up...\n");
		const tokenRequestBody = new URLSearchParams({
			grant_type: "authorization_code",
			code: receivedCode,
			redirect_uri: uri,
		});
		const res = await fetch("https://accounts.spotify.com/api/token", {
			method:"POST",
			headers:{
				"Content-type": "application/x-www-form-urlencoded",
				"Authorization":
        "Basic " +
        Buffer.from(this.id + ":" + this.secret).toString("base64"),
			},
			body:tokenRequestBody.toString(),
		});
		const body = await res.json();
		const date = Date.now();
		const expire_time = date + (body.expires_in * 1000);
		await this.db.set("instance", { client_id: this.id, client_secret:this.secret, oauth_token:body, expires_in:expire_time });
		return body.access_token;
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
			await this.db.set("instance", { client_id: this.id, client_secret:this.secret, oauth_token:body, expires_in:expire_time });
			return body.access_token;
		}
		else {
			console.log(body);
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`);
		}
	}
	/**
 * It gets the top tracks/artists from the user's account
 * @async
 * @param {String} time Period of time to fetch top stats for: short_term(4 weeks), medium_term(6 months) or long_term(lifetime)
 * @param {String} type Type of Data fetched: Either artists or tracks
 * @param {Integer} limit Amount of top artists/tracks to be fetched
 * @returns An array of objects.
 */
	async top({ time, type, limit }) {
		const token = await this.DatabaseManager();
		const res = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${time}&limit=${limit}&offset=0`, {
			headers:{
				"Authorization":`Bearer ${token}`,
			},
		});
		const body = await res.json();
		if(res.ok) {
			return body.items;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} -  ${body.message}`, "red");
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