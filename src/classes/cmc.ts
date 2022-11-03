import fetch from "node-fetch";
import { exit } from "../utils";
import { URLSearchParams } from "url";
interface CMCOptions {
    key: string
}
interface reqOptions {
    ext: string
    body: Record<string, unknown>;

}

export const CMC = class CMC {
    key: string
    url: string
    constructor(options: CMCOptions) {
        this.key = options.key
        this.url = "https://pro-api.coinmarketcap.com/v2/"
    }

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

    async getQuotesById(id: string) {
      
            const info = this.req({ext: "cryptocurrency/quotes/latest", body: {
                id: id,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
    async getQuotesBySlug(slug: string) {
            const info = this.req({ext: "cryptocurrency/quotes/latest", body: {
                slug: slug,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
    async getQuotesBySymbol(symbol: string) {
            const info = await this.req({ext: "cryptocurrency/quotes/latest", body: {
                symbol: symbol,
                aux: "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat"
            }
        });
        return info;
    }
}