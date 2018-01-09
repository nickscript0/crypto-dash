// https://coinmarketcap.com/api/

import * as request from "superagent";

import { Big } from 'big.js';


const TICKERS = ['BTC', 'ETH', 'LTC', 'XRB', 'ARK', 'SALT', 'TRX'];

interface Prices {
    btc: Big;
    ltc: Big;
    eth: Big;
    xrb: Big;
    ark: Big;
    salt: Big;
    trx: Big;
}

export interface Tickers {
    btc: CMCTicker;
    ltc: CMCTicker;
    eth: CMCTicker;
    xrb: CMCTicker;
    ark: CMCTicker;
    salt: CMCTicker;
    trx: CMCTicker;
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


export function getCadPrices(tickers: Tickers): Prices {
    const [btc, ltc, eth, xrb, ark, salt, trx] = [
        Big(tickers.btc.price_cad),
        Big(tickers.ltc.price_cad),
        Big(tickers.eth.price_cad),
        Big(tickers.xrb.price_cad),
        Big(tickers.ark.price_cad),
        Big(tickers.salt.price_cad),
        Big(tickers.trx.price_cad),
    ];

    return {
        btc,
        ltc,
        eth,
        xrb,
        ark,
        salt,
        trx
    };
}


export async function requestTickers(): Promise<Tickers> {
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
    return <Tickers>filteredTickers;
}

async function _getTicker(url) {
    return JSON.parse((await request(url)).text);
}
