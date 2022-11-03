import fetch from "node-fetch";
import * as http from "http";
import { exit } from "../utils.js";
import { URLSearchParams } from "url";
import { QuickDB } from "quick.db";
import { resolve, join } from "path";
interface SpotifyOptions {
	clientID: string;
	clientSecret: string;
}
type Spot = {
	id?: string;
	secret?: string;
	[other: string]: any;
}
interface SpotifyToken {
	scopes: string[];
	uri: string;
}
interface SpotifyTokenResponse {
	access_token: string;
	token_type: "Bearer";
	scope: string;
	expires_in: number;
	refresh_token: string;
}
interface DBOptions {
	client_id: string;
	client_secret: string;
	oauth_token: {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	}
	expires_at: number;
}
interface top {
	time: string | void;
	type: string | void;
	limit: string | number | void;
}
interface searchOptions {
	query: string;
	type: string | void;
	limit: number | void;
}

/**
 * @class
 * @classdec Spotify Class, which handles all relevant statistical endpoints from the Spotify API
 * @param {String} clientID Spotify client ID
 * @param {String} clientSecret Spotify client secret
 */
export class Spotify {
	id: string;
	secret: string;
	db: QuickDB;
	oauth_token : Promise<string> | string | object;
	constructor(options: SpotifyOptions) {
		const db = new QuickDB({ filePath: join(resolve("./"), "src", "data", "creds.sqlite") });
		const token_obj: Spot = {};
		this.id = options.clientID;
		this.secret = options.clientSecret;
		this.db = db;
		this.oauth_token = token_obj;
	}

	async DatabaseManager() {
		const instance: Spot | null = await this.db.get(`instance_${this.id}_${this.secret}`);
		if(instance) {
			console.log(instance);
			if(typeof instance == "object") {
				if(instance.id == this.id && instance.secret == this.secret) {
					if(instance.expires_at < Date.now()) {
						const token = await this.refresh_token();
						this.oauth_token = token;
						await this.db.set("instance", {
							id: this.id,
							secret: this.secret,
							oauth_token: token,
							expires_at: Date.now() + 3600000,
						});
					}
					this.oauth_token = instance.oauth_token.access_token;
				}
				else {
					exit("[Statisfy] DatabaseManager: Instance Object failed to fetch.", "red");
				}
			}
			else {
				exit("[Statisfy] ERROR: Database Manager failed to initialize.", "red");
			}
		}
		else {
			this.oauth_token = await this.oauth({ scopes:["user-top-read"], uri:"http://localhost:8888" });
		}
		return this.oauth_token;
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
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
		}
	}
	/**
 * @async
 * @param {String} scopes Scopes required to authenticate
 * @param {String} uri Redirect URL to callback following authentication
 * @returns Access Token
 */
	async oauth(options: SpotifyToken) {
		/**
     * It creates a server on the given port, and returns a promise that resolves to the url that the
     * server receives a request on.
     * @async
     * @param {Integer} port - The port number to listen on.
     * @returns A promise that resolves to a string.
     */
		if(!options.scopes) {
			exit("[Statisfy] Please provide a scope for the OAuth2.0 process.", "red");
		}
		if(!options.uri) {
			exit("[Statisfy] Please provide a redirect URI for the OAuth2.0 process.", "red");
		}
		const getLocalhostUrl = async (port: number): Promise<string> => {
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
        new URLSearchParams({ response_type: "code", show_dialog: "true",	state, client_id: this.id, redirect_uri: options.uri, scope: options.scopes[0] }).toString();
		console.info("You appear to be using Statisfy for the first time.\nPlease click the link to login to Spotify in the browser. You will not have to do this again.\n");
		console.info(spotifyUrl + "\n");
		const portURL: number = parseInt(new URL(options.uri).port) || 8888;
		const authUrl = await getLocalhostUrl(portURL);
		const params = new URLSearchParams(authUrl);
		const receivedCode = params.get("code");
		const receivedState = params.get("state");

		if (receivedState !== state) {
			exit("Received and original state do not match", "red");
		}

		if (!receivedCode) {
			exit("No code received", "yellow");
		}

		console.info("Login successful! Cleaning up...\n");
		const tokenRequestBody = new URLSearchParams("grant_type=authorization_code");
		tokenRequestBody.append("code", receivedCode ? receivedCode : "");
		tokenRequestBody.append("redirect_uri", options.uri);
		const body: SpotifyTokenResponse = await fetch("https://accounts.spotify.com/api/token", {
			method:"POST",
			headers:{
				"Content-type": "application/x-www-form-urlencoded",
				"Authorization":
        "Basic " +
        Buffer.from(this.id + ":" + this.secret).toString("base64"),
			},
			body:tokenRequestBody.toString(),
		}).then (result => result.json());
		const date = Date.now();
		const expire_time = date + (body.expires_in * 1000);
		await this.db.set(`instance_${this.id}_${this.secret}`, { client_id: this.id, client_secret:this.secret, oauth_token:body, expires_in:expire_time });
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
	async req(url: string) {
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
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
		}
	}
	/**
	 * It takes the refresh token and sends it to the Spotify API to get a new access token
	 * @async
	 * @returns The access token.
	 */
	async refresh_token() {
		const instance: DBOptions| null = await this.db.get(`instance_${this.id}_${this.secret}`);
		const params = new URLSearchParams();
		params.append("grant_type", "refresh_token");
		if(instance) params.append("refresh_token", instance.oauth_token.refresh_token || "");
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
			await this.db.set("instance", { id: this.id, secret:this.secret, oauth_token:body, expires_at:expire_time });
			return body.access_token;
		}
		else {
			console.log(body);
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`, "red");
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

	async top(options: top) {
		const token = await this.DatabaseManager();
		console.log(token);
		console.log(this.oauth_token);
		const res = await fetch(`https://api.spotify.com/v1/me/top/${options.type}?time_range=${options.time}&limit=${options.limit}&offset=0`, {
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
	async getPlaylist(playlist: string) {
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
	async search(options: searchOptions) {
		const formattedQuery = options.query.replace(/ /g, "%20");
		const token = await this.access_token();
		const res = await fetch(`https://api.spotify.com/v1/search?q=${formattedQuery}&type=${options.type}&limit=${options.limit}&market=GB`, {
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
}