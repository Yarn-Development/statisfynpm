import fetch from "node-fetch";
import { exit } from "../utils.js";
export const YouTube = class YouTube {
	constructor({ key }) {
		this.key = key;
		this.url = "https://www.googleapis.com/youtube/v3/";
	}
	/**
      * It takes an extension ID as a parameter, and returns a JSON object containing the extension's required information
      * @async
      * @private
      * @param ext - The extension of the base URL.
      * @param body - The body of the request.
      * @returns a promise.
      */
	async req(ext, { body }) {
		const base_body = {
			"key":this.key,
		};
		const bod = (typeof body === "undefined") ? base_body : Object.assign(base_body, body);
		const url = `${this.url + ext}?${new URLSearchParams(bod).toString()}`;
		const res = await fetch(url);
		const info = res.json();

		if(res.ok) {return info;}
		else {
			exit(`[Statisfy] ERROR: ${info.status} ${info.error} - ${info.message}`);
		}
	}
	/**
      * It searches for a query and returns the results
      * @async
      * @param type - The type of the search query.
      * @param query - The query you want to search for.
      * @param limit - The limit of the results.
      * @returns The data is being returned.
      */
	async search({ type, query, limit }) {
		const data = this.req("search", {
			body: {
				"part":"snippet",
				"maxResults":limit,
				"q":query,
				"type":type ? type : "video,channel,playlist",
			},
		});
		return data;
	}
	/**
      * It searches for a channel by name, gets the channel ID, and then gets the channel data
      * @async
      * @param name - The name of the channel you want to get.
      * @returns The channel object.
      */
	async getChannelByName(name) {
		const searchres = await this.search({ type:"channel", query:name, limit:1 });
		const id = searchres.items[0].id.channelId;

		const data = await this.req("channels", {
			body: {
				"part":"snippet,contentDetails,statistics,brandingSettings",
				"id":id,
			},
		});
		return data.items[0];
	}
};

