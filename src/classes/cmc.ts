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
export const CMC = class CMC {
    key: string
    url: string
    constructor(options: CMCOptions) {
        this.key = options.key
        this.url = "https://pro-api.coinmarketcap.com/v2/"
    }

/**
 * Base Fetch Method to CMC API and Authentication
 * @private
 * @param {reqOptions} options - reqOptions
 * @returns Information on Specific Endpoint
 */
    async req(options: reqOptions){
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
 * @param {string} id - The id of the cryptocurrency you want to get the quote for.
 * @returns An object with the following properties:
 */
    async getQuotesById(id: string) {
      
            const info = this.req({ext: "cryptocurrency/quotes/latest", body: {
                id: id,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
   /**
    * Fetches information on a specific cryptocurrency market or group of markets via their slug(name) E.g bitcoin, ethereum. To fetch multiple markets seperate each identifier with a comma.
    * @param {string} slug - The slug of the cryptocurrency you want to get the quotes for.
    * @returns the info variable.
    */
    async getQuotesBySlug(slug: string) {
            const info = this.req({ext: "cryptocurrency/quotes/latest", body: {
                slug: slug,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
/**
 * Fetches information on a specific cryptocurrency market or group of markets via their symbol E.g BTC, ETH. To fetch multiple markets seperate each identifier with a comma.
 * @param {string} symbol - The symbol of the cryptocurrency you want to get quotes for.
 * @returns An object with the following properties:
 */
    async getQuotesBySymbol(symbol: string) {
            const info = await this.req({ext: "cryptocurrency/quotes/latest", body: {
                symbol: symbol,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
}