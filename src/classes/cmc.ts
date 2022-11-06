import fetch from "node-fetch";
import { exit } from "../utils";
import { URLSearchParams } from "url";
/**
 * @interface
 * Defining the type of the `options` used to initialize the Class.
 */
interface CMCOptions {
    key: string
}
/**
 * @interface
 *  Defining the type of the `options` parameter in the `req` method.
 */
interface reqOptions {
    ext: string
    body: Record<string, unknown>;

}

/**
 * @class
 * @classdesc Class used to fetch cryptocurrency information from the CoinMarketCap API.
 * @param {CMCOptions} options Class Options (CoinMarketCap API Key)
 */
export class CMC {
	key: string;
	url: string;
	constructor(options: CMCOptions) {
		this.key = options.key;
		this.url = "https://pro-api.coinmarketcap.com/v2/";
	}

	/**
 * Base Fetch Method to CMC API and Authentication
 * @private
 * @param {reqOptions} options - reqOptions
 * @returns Information on Specific Endpoint
 */
	async req(options: reqOptions) {
		const base_body = {
			"CMC_PRO_API_KEY":this.key,
		};
		const bod = (typeof options.body === "undefined") ? base_body : Object.assign(base_body, options.body);
		const url = `${this.url + options.ext}?${new URLSearchParams(bod).toString()}`;
		const res = await fetch(url);
		const info = await res.json();

		if(res.ok) {
			return info;
		}
		else {
			exit(`[Statisfy] ERROR: ${info.status} ${info.error} - ${info.message}`, "red");
		}
	}

	/**
 * Fetches information on a specific cryptocurrency market or group of markets via their CoinMarketCap ID E.g 1 for Bitcoin, 2 for Ethereum. To fetch multiple markets seperate each identifier with a comma.
 * @example
 * ```ts
 * const cmc = new CMC({ key: "YOUR_API_KEY" });
 * const info = await cmc.getQuotesByID("1,2");
 * console.log(info);
 * ```
 * @param {string} id - The id of the cryptocurrency you want to get the quote for.
 * @returns An object/objects with the following properties:
 * @returns {number} id - The CoinMarketCap ID of the cryptocurrency.
 * @returns {string} name - The name of the cryptocurrency.
 * @returns {string} symbol - The symbol of the cryptocurrency.
 * @returns {string} slug - The slug of the cryptocurrency.
 * @returns {number} num_market_pairs - The number of markets the cryptocurrency is listed on.
 * @returns {number} date_added - The date the cryptocurrency was added to CoinMarketCap.
 * @returns {number} tags - A list of tags associated with the cryptocurrency.
 * @returns {number} max_supply - The maximum supply of the cryptocurrency.
 * @returns {number} circulating_supply - The circulating supply of the cryptocurrency.
 * @returns {number} total_supply - The total supply of the cryptocurrency.
 * @returns {number} platform - The platform the cryptocurrency is built on.
 * @returns {number} cmc_rank - The CoinMarketCap rank of the cryptocurrency.
 * @returns {number} last_updated - The last time the cryptocurrency was updated.
 * @returns {number} quote - The quote information for the cryptocurrency.
 * @returns {number} quote.USD - The USD quote information for the cryptocurrency.
 * @returns {number} quote.USD.price - The USD price of the cryptocurrency.
 * @returns {number} quote.USD.volume_24h - The USD volume of the cryptocurrency in the last 24 hours.
 * @returns {number} quote.USD.percent_change_1h - The percent change of the cryptocurrency in the last hour.
 * @returns {number} quote.USD.percent_change_24h - The percent change of the cryptocurrency in the last 24 hours.
 * @returns {number} quote.USD.percent_change_7d - The percent change of the cryptocurrency in the last 7 days.
 * @returns {number} quote.USD.percent_change_30d - The percent change of the cryptocurrency in the last 30 days.
 * @returns {number} quote.USD.percent_change_60d - The percent change of the cryptocurrency in the last 60 days.
 * @returns {number} quote.USD.percent_change_90d - The percent change of the cryptocurrency in the last 90 days.
 * @returns {number} quote.USD.market_cap - The USD market cap of the cryptocurrency.
 * @returns {number} quote.USD.last_updated - The last time the cryptocurrency was updated.
 */
	async getQuotesById(id: string) {

		const info = this.req({ ext: "cryptocurrency/quotes/latest", body: {
			id: id,
			aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat",
		},
		});
		return info;
	}
	/**
    * Fetches information on a specific cryptocurrency market or group of markets via their slug(name) E.g bitcoin, ethereum. To fetch multiple markets seperate each identifier with a comma.
    * @example
	* ```ts
	* const cmc = new CMC({ key: "YOUR_API_KEY" });
	* const info = await cmc.getQuotesBySlug("bitcoin,ethereum");
	* console.log(info);
	* ```
	* @param {string} slug - The slug of the cryptocurrency you want to get the quotes for.
    * @returns An object/objects with the following properties:
	* @returns {number} id - The CoinMarketCap ID of the cryptocurrency.
	* @returns {string} name - The name of the cryptocurrency.
	* @returns {string} symbol - The symbol of the cryptocurrency.
	* @returns {string} slug - The slug of the cryptocurrency.
	* @returns {number} num_market_pairs - The number of markets the cryptocurrency is listed on.
	* @returns {number} date_added - The date the cryptocurrency was added to CoinMarketCap.
	* @returns {number} tags - A list of tags associated with the cryptocurrency.
	* @returns {number} max_supply - The maximum supply of the cryptocurrency.
	* @returns {number} circulating_supply - The circulating supply of the cryptocurrency.
	* @returns {number} total_supply - The total supply of the cryptocurrency.
	* @returns {number} platform - The platform the cryptocurrency is built on.
	* @returns {number} cmc_rank - The CoinMarketCap rank of the cryptocurrency.
	* @returns {number} last_updated - The last time the cryptocurrency was updated.
	* @returns {number} quote - The quote information for the cryptocurrency.
	* @returns {number} quote.USD - The USD quote information for the cryptocurrency.
	* @returns {number} quote.USD.price - The USD price of the cryptocurrency.
	* @returns {number} quote.USD.volume_24h - The USD volume of the cryptocurrency in the last 24 hours.
	* @returns {number} quote.USD.percent_change_1h - The percent change of the cryptocurrency in the last hour.
	* @returns {number} quote.USD.percent_change_24h - The percent change of the cryptocurrency in the last 24 hours.
	* @returns {number} quote.USD.percent_change_7d - The percent change of the cryptocurrency in the last 7 days.
	* @returns {number} quote.USD.percent_change_30d - The percent change of the cryptocurrency in the last 30 days.
	* @returns {number} quote.USD.percent_change_60d - The percent change of the cryptocurrency in the last 60 days.
	* @returns {number} quote.USD.percent_change_90d - The percent change of the cryptocurrency in the last 90 days.
	* @returns {number} quote.USD.market_cap - The USD market cap of the cryptocurrency.
	* @returns {number} quote.USD.last_updated - The last time the cryptocurrency was updated.
	*/
	async getQuotesBySlug(slug: string) {
		const info = this.req({ ext: "cryptocurrency/quotes/latest", body: {
			slug: slug,
			aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat",
		},
		});
		return info;
	}
	/**
 * Fetches information on a specific cryptocurrency market or group of markets via their symbol E.g BTC, ETH. To fetch multiple markets seperate each identifier with a comma.
 * @example
 * ```ts
 * const cmc = new CMC({ key: "YOUR_API_KEY" });
 * const info = await cmc.getQuotesBySymbol("BTC,ETH");
 * console.log(info);
 * ```
 * @param {string} symbol - The symbol of the cryptocurrency you want to get quotes for.
 * @returns An object/objects with the following properties:
 * @returns {number} id - The CoinMarketCap ID of the cryptocurrency.
 * @returns {string} name - The name of the cryptocurrency.
 * @returns {string} symbol - The symbol of the cryptocurrency.
 * @returns {string} slug - The slug of the cryptocurrency.
 * @returns {number} num_market_pairs - The number of markets the cryptocurrency is listed on.
 * @returns {number} date_added - The date the cryptocurrency was added to CoinMarketCap.
 * @returns {number} tags - A list of tags associated with the cryptocurrency.
 * @returns {number} max_supply - The maximum supply of the cryptocurrency.
 * @returns {number} circulating_supply - The circulating supply of the cryptocurrency.
 * @returns {number} total_supply - The total supply of the cryptocurrency.
 * @returns {number} platform - The platform the cryptocurrency is built on.
 * @returns {number} cmc_rank - The CoinMarketCap rank of the cryptocurrency.
 * @returns {number} last_updated - The last time the cryptocurrency was updated.
 * @returns {number} quote - The quote information for the cryptocurrency.
 * @returns {number} quote.USD - The USD quote information for the cryptocurrency.
 * @returns {number} quote.USD.price - The USD price of the cryptocurrency.
 * @returns {number} quote.USD.volume_24h - The USD volume of the cryptocurrency in the last 24 hours.
 * @returns {number} quote.USD.percent_change_1h - The percent change of the cryptocurrency in the last hour.
 * @returns {number} quote.USD.percent_change_24h - The percent change of the cryptocurrency in the last 24 hours.
 * @returns {number} quote.USD.percent_change_7d - The percent change of the cryptocurrency in the last 7 days.
 * @returns {number} quote.USD.percent_change_30d - The percent change of the cryptocurrency in the last 30 days.
 * @returns {number} quote.USD.percent_change_60d - The percent change of the cryptocurrency in the last 60 days.
 * @returns {number} quote.USD.percent_change_90d - The percent change of the cryptocurrency in the last 90 days.
 * @returns {number} quote.USD.market_cap - The USD market cap of the cryptocurrency.
 * @returns {number} quote.USD.last_updated - The last time the cryptocurrency was updated.
 */
	async getQuotesBySymbol(symbol: string) {
		const info = await this.req({ ext: "cryptocurrency/quotes/latest", body: {
			symbol: symbol,
			aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat",
		},
		});
		return info;
	}
}