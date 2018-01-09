// https://coinmarketcap.com/api/

import * as request from "superagent";

import { Big } from 'big.js';


const TICKERS = ['BTC', 'ETH', 'LTC', 'XRB', 'ARK', 'SALT', 'TRX'];

export interface Currencies<T> {
    btc: T;
    ltc: T;
    eth: T;
    xrb: T;
    ark: T;
    salt: T;
    trx: T;
}

export interface CMCTicker {
    "id": string;
    "name": string;
    "symbol": string;
    "rank": string;
    "price_usd": string;
    "price_btc": string;
    "24h_volume_usd": string;
    "market_cap_usd": string;
    "available_supply": string;
    "total_supply": string;
    "max_supply": string;
    "percent_change_1h": string;
    "percent_change_24h": string;
    "percent_change_7d": string;
    "last_updated": string;
    "price_cad": string;
    "24h_volume_cad": string;
    "market_cap_cad": string;
}

export function getCadPrices(tickers: Currencies<CMCTicker>): Currencies<Big> {
    const o = {};
    Object.entries(tickers).forEach( (e: [string, CMCTicker]) => {
        const [k, v] = e;
        o[k] = Big(v.price_cad);
    });
    return <Currencies<Big>> o;
}


export async function requestTickers(): Promise<Currencies<CMCTicker>> {
    const uAll = `https://api.coinmarketcap.com/v1/ticker/?convert=CAD`;

    const allTickers: CMCTicker[] = await _getTicker(uAll);

    const filteredTickers = {};
    let filterCount = 0;
    for (const t of allTickers) {
        if (TICKERS.includes(t.symbol)) {
            filteredTickers[t.symbol.toLowerCase()] = t;
            filterCount += 1;
        }
        if (filterCount === TICKERS.length) break;
    }
    return <Currencies<CMCTicker>>filteredTickers;
}

async function _getTicker(url) {
    return JSON.parse((await request(url)).text);
}
