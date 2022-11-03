import fetch from "node-fetch";
import { exit } from "../utils.js";
import { URLSearchParams } from "url";

interface YouTubeOptions {
	key: string;
}
interface reqOptions {
	ext: string;
	body: Record<string, unknown>;
}
interface searchOptions {
	query: string;
	type?: string;
	limit: number;
}

export class YouTube {
	key: string;
	url: string;
	constructor(options: YouTubeOptions) {
		this.key = options.key;
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
	async req(options: reqOptions) {
		const base_body = {
			"key":this.key,
		};
		const bod = (typeof options.body === "undefined") ? base_body : Object.assign(base_body, options.body);
		const url = `${this.url + options.ext}?${new URLSearchParams(bod).toString()}`;
		const res = await fetch(url);
		const info = await res.json();

		if(res.ok) {return info;}
		else {
			exit(`[Statisfy] ERROR: ${info.status} ${info.error} - ${info.message}`, "red");
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
	async search(options: searchOptions) {
		const data = this.req({ ext:"search",
			body: {
				"part":"snippet",
				"maxResults":options.limit,
				"q":options.query,
				"type":options.type ? options.type : "video,channel,playlist",
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
	async getChannelByName(name: string) {
		const searchres = await this.search({ type:"channel", query:name, limit:1 });
		const id = searchres.items[0].id.channelId;

		const data = await this.req({ ext: "channels",
			body: {
				"part":"snippet,contentDetails,statistics,brandingSettings",
				"id":id,
			},
		});
		return data.items[0];
	}
	/**
	 * It searches for a video, gets the video ID, and then gets the video's information
	 * @async
	 * @param query - The search query
	 * @returns The video information.
	 */
	async getVideoByQuery(query: string) {
		const data = await this.search({ type:"video", query:query, limit:1 });
		const vid_id = data.items[0].id.videoId;
		const info = await this.req({ ext: "videos",
			body:{
				"part":"snippet,statistics,contentDetails",
				"id":vid_id,
				"maxResults":1,
			},
		});
		return info.items[0];
	}
}

