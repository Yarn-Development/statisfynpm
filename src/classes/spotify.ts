import fetch from "node-fetch";
import * as http from "http";
import { exit } from "../utils.js";
import { URLSearchParams } from "url";
import { QuickDB } from "quick.db";
import { getAppRootDir } from "../utils.js";
import { join } from "path";
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
	limit?: number | void;
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
		const db = new QuickDB({ filePath: join(getAppRootDir(), "data", "creds.sqlite") });
		const token_obj: Spot = {};
		this.id = options.clientID;
		this.secret = options.clientSecret;
		this.db = db;
		this.oauth_token = token_obj;
	}

	async DatabaseManager() {
		const instance: Spot | null = await this.db.get(`instance_${this.id}_${this.secret}`);
		if(instance) {
			if(typeof instance == "object") {
				if(instance.client_id === this.id && instance.client_secret === this.secret) {
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
	 * @example
	 * ```ts
	 * const spotify = new Spotify({
	 * 	clientID: "clientID",
	 * 	clientSecret: "clientSecret",
	 * });
	 * const token = await spotify.oauth({ scopes:["user-top-read"], uri:"http://localhost:8888" });
	 * ```
     * @param {Integer} port - The port number to listen on.
     * @returns {Promise} A promise that resolves to the url that the server receives a request on, and an access token once the user has authenticated.
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
		console.info("You appear to be using Spotify for Statisfy for the first time.\nPlease click the link to login to Spotify in the browser. You will not have to do this again.\n");
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
 * @example
 * ```ts
 * const spotify = new Spotify({
 * 	 clientID: "clientID",
 *	 clientSecret: "clientSecret",
 * });
 * const topTracks = await spotify.top({ type: "tracks", limit: 10, time: "short_term" });
 * console.log(topTracks);
 * ```
 * @param {String} time Period of time to fetch top stats for: short_term(4 weeks), medium_term(6 months) or long_term(lifetime)
 * @param {String} type Type of Data fetched: Either artists or tracks
 * @param {Integer} limit Amount of top artists/tracks to be fetched
 * @returns An array of objects.
 * @returns {string} album.album_type The type of the album: one of "album", "single", or "compilation".
 * @returns {string} album.artists The artists of the album. Each artist object includes a link in href to more detailed information about the artist.
 * @returns {string} album.available_markets The markets in which the album is available: ISO 3166-1 alpha-2 country codes. Note that an album is considered available in a market when at least 1 of its tracks is available in that market.
 * @returns {string} album.external_urls Known external URLs for this album.
 * @returns {string} album.href A link to the Web API endpoint providing full details of the album.
 * @returns {string} album.id The Spotify ID for the album.
 * @returns {string} album.images The cover art for the album in various sizes, widest first.
 * @returns {string} album.name The name of the album. In case of an album takedown, the value may be an empty string.
 * @returns {string} album.release_date The date the album was first released, for example "1981-12-15". Depending on the precision, it might be shown as "1981" or "1981-12".
 * @returns {string} album.release_date_precision The precision with which release_date value is known: "year", "month", or "day".
 * @returns {string} album.total_tracks The total number of tracks in the album.
 * @returns {string} album.type The object type: "album"
 * @returns {string} album.uri The Spotify URI for the album.
 * @returns {string} artists The artists who performed the track. Each artist object includes a link in href to more detailed information about the artist.
 * @returns {string} available_markets The markets in which the track is available: ISO 3166-1 alpha-2 country codes. Note that an album is considered available in a market when at least 1 of its tracks is available in that market.
 * @returns {string} disc_number The disc number (usually 1 unless the album consists of more than one disc).
 * @returns {string} duration_ms The track length in milliseconds.
 * @returns {string} explicit Whether or not the track has explicit lyrics ( true = yes it does; false = no it does not OR unknown).
 * @returns {string} external_ids Known external IDs for the track.
 * @returns {string} external_urls Known external URLs for this track.
 * @returns {string} href A link to the Web API endpoint providing full details of the track.
 * @returns {string} id The Spotify ID for the track.
 * @returns {string} is_local Whether or not the track is from a local file.
 * @returns {string} name The name of the track.
 * @returns {string} popularity The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.
 * @returns {string} preview_url A link to a 30 second preview (MP3 format) of the track. Can be null.
 * @returns {string} track_number The number of the track. If an album has several discs, the track number is the number on the specified disc.
 * @returns {string} type The object type: "track".
 * @returns {string} uri The Spotify URI for the track.
 * @throws {Error} If the type is not tracks or artists.
 * @throws {Error} If the time is not short_term, medium_term or long_term.
 * @throws {Error} If the limit is not between 1 and 50.
 * @throws {Error} If the user is not logged in.
 * @throws {Error} If the user has no top tracks/artists.
 */

	async top(options: top) {
		const token = await this.DatabaseManager();
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
	 * @example
	 * ```ts
	 * const spotify = new Spotify({
	 * 	 clientID: "clientID",
	 * 	 clientSecret: "clientSecret",
	 * });
	 * const search = await spotify.search({ query: "Never Gonna Give You Up", type: "track", limit: 10 });
	 * console.log(search);
	 * ```
	 * @param {String} query - The query you want to search for.
	 * @param {String} type - The type of data you want to search for.
	 * @param {Integer} limit - The amount of results you want to get. (Default: 5)
	 * @returns The search function returns the body of the response.
	 * @returns {string} tracks.href A link to the Web API endpoint returning the full result of the request.
	 * @returns {string} tracks.items The requested data.
	 * @returns {string} tracks.limit The maximum number of items in the response (as set in the query or by default).
	 * @returns {string} tracks.next URL to the next page of items. (null if none)
	 * @returns {string} tracks.offset The offset of the items returned (as set in the query or by default).
	 * @returns {string} tracks.previous URL to the previous set of items (null if none)
	 * @returns {string} tracks.total Total
	 * @throws {Error} If the type is not track, artist, album or playlist.
	 * @throws {Error} If the limit is not between 1 and 50.
	 */
	async search(options: searchOptions) {
		if(!options.limit) options.limit = 5;
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