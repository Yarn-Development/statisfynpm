import fetch from "node-fetch";
import { exit } from "../utils.js";
/**
 * @class
 * @classdesc Handler for Youtube Channel and Video Statistics.
 *
*/
export const YouTube = class YouTube {
	constructor({ key }) {
		this.key = key;
	}
	/**
     * @async
     * @param {String} url The URL of the request to retrieve data from.
     * @returns The data object from the response.
     *
     */
	async req(url) {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${this.key}`,
				"Accept": "application/json",
			},
		});
		const body = await res.json();
		if (res.ok) {
			return body;
		}
		else {
			exit(`[Statisfy] ${body.status} ERROR: ${body.error} - ${body.message}`);
		}
	}


	/**
     * It takes in a channel ID and returns the data from the API.
     * @async
     * @param {String} channelID The ID of the channel to retrieve stats from
     * @returns The data object from the response.
     * @example
     * const data = await Youtube.channel({ channelID: "UC_x5XG1OV2P6uZZ5FSM9TQA" });
     * console.log(data.statistics.subscriberCount);
     * // => "1,000,000"
     * console.log(data.statistics.videoCount);
     * // => "100"
     * console.log(data.statistics.viewCount);
     * // => "1,000,000,000"
     * console.log(data.statistics.commentCount);
     * // => "1,000,000"
     * console.log(data.statistics.hiddenSubscriberCount);
     * // => "0"
     * console.log(data.statistics.hiddenViewCount);
     * // => "0"
     * console.log(data.statistics.hiddenCommentCount);
     * // => "0"
     * console.log(data.statistics.hiddenVideoCount);
     * // => "0"
        */
	async channel({ channelID }) {
		const info = await this.req(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelID}&key=${this.key}`);
		return info.items[0];
	}
	/**
     * It takes in a video ID and returns the data from the API.
     * @async
     * @param {String} videoID The ID of the video to retrieve stats from
     * @returns The data object from the response.
     * @example
     * const data = await Youtube.video({ videoID: "UC_x5XG1OV2P6uZZ5FSM9TQA" });
     * console.log(data.statistics.viewCount);
     * // => "1,000,000,000"
     * console.log(data.statistics.likeCount);
     * // => "1,000,000"
     * console.log(data.statistics.dislikeCount);
     * // => "1,000,000"
     * console.log(data.statistics.favoriteCount);
     * // => "1,000,000"
     * console.log(data.statistics.commentCount);
     * // => "1,000,000"
     * console.log(data.statistics.hiddenViewCount);
     * // => "0"
     * console.log(data.statistics.hiddenLikeCount);
     *  // => "0"
     * console.log(data.statistics.hiddenDislikeCount);
     * // => "0"
     * console.log(data.statistics.hiddenFavoriteCount);
     * // => "0"
     * console.log(data.statistics.hiddenCommentCount);
     * // => "0"
     */
	async video({ videoID }) {
		const info = await this.req(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoID}&key=${this.key}`);
		return info.items[0];
	}
	/**
     * It takes in a playlist ID and returns the data from the API.
     * @async
     * @param {String} playlistID The ID of the playlist to retrieve stats from
     * @returns The data object from the response.
     * @example
     * const data = await YouTube.playlist({ playlistID: "UC_x5XG1OV2P6uZZ5FSM9TQA" });
     * console.log(data.statistics.viewCount);
     * // => "1,000,000,000"
     * console.log(data.statistics.likeCount);
     * // => "1,000,000"
     * console.log(data.statistics.dislikeCount);
     * // => "1,000,000"
    */
	async playlist({ playlistID }) {
		const info = await this.req(`https://www.googleapis.com/youtube/v3/playlists?part=statistics&id=${playlistID}&key=${this.key}`);
		return info.items[0];
	}
	/**
     * It takes in a query and searches for a corresponding video.
     * @async
     * @param {String} query The query to search for.
     * @returns The data object from the response.
     * @example
     * const data = await YouTube.search({ query: "The Beatles" });
     * console.log(data.items[0].statistics.viewCount);
     * // => "1,000,000,000"
     * console.log(data.items[0].statistics.likeCount);
     * // => "1,000,000"
     * console.log(data.items[0].statistics.dislikeCount);
     * // => "1,000,000"
     */
	async search({ query, limit }) {
		const info = await this.req(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${limit}&q=${query}&key=${this.key}`);
		return info;
	}
};
