// https://coinmarketcap.com/api/

import * as request from "superagent";

import { Big } from 'big.js';

interface Prices {
    btc: Big;
    ltc: Big;
    eth: Big;
    rai: Big;
}

export interface Tickers {
    btc: CMCTicker;
    ltc: CMCTicker;
    eth: CMCTicker;
    rai: CMCTicker;
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
    const [btc, ltc, eth, rai] = [
        Big(tickers.btc.price_cad),
        Big(tickers.ltc.price_cad),
        Big(tickers.eth.price_cad),
        Big(tickers.rai.price_cad),
    ];

    return {
        btc,
        ltc,
        eth,
        rai
    };
}

export async function requestTickers(): Promise<Tickers> {
    const uBTC = `https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=CAD`;
    const uLTC = `https://api.coinmarketcap.com/v1/ticker/litecoin/?convert=CAD`;
    const uETH = `https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=CAD`;
    const uRAI = `https://api.coinmarketcap.com/v1/ticker/raiblocks/?convert=CAD`;

    const [btc, ltc, eth, rai] = await Promise.all([
        _getTicker(uBTC),
        _getTicker(uLTC),
        _getTicker(uETH),
        _getTicker(uRAI)
    ]);
    return {
        btc,
        ltc,
        eth,
        rai
    };
}

async function _getTicker(url) {
    return JSON.parse((await request(url)).text)[0];
}
