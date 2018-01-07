// API functions for https://www.quadrigacx.com/api_info

import * as request from "superagent";
import { Big } from 'big.js';

export async function getCurrentBooks(): Promise<Books> {
    const REQ_TICKER = `https://api.quadrigacx.com/v2/ticker?book=`;
    const BTC_BOOK = 'btc_cad';
    const ETH_BOOK = 'eth_cad';
    const LTC_BOOK = 'ltc_cad';
    const BCH_BOOK = 'bch_cad';

    const [btc, eth, ltc, bch] = await Promise.all([
        request(REQ_TICKER + BTC_BOOK),
        request(REQ_TICKER + ETH_BOOK),
        request(REQ_TICKER + LTC_BOOK),
        request(REQ_TICKER + BCH_BOOK),
    ]);

    return {
        btc: JSON.parse(btc.text),
        eth: JSON.parse(eth.text),
        ltc: JSON.parse(ltc.text),
        bch: JSON.parse(bch.text),
    };
}


export async function getPrices() {
    const res = await getCurrentBooks();
    return {
        btc: Big(res.btc.last),
        eth: Big(res.eth.last),
        ltc: Big(res.ltc.last),
        bch: Big(res.bch.last),
    };
}

export interface QuadrigaBook {
    last: string;
    high: string;
    low: string;
    vwap: string;
    volume: string;
    ask: string;
    bid: string;
    timestamp: string;
}

export interface Books {
    btc: QuadrigaBook;
    eth: QuadrigaBook;
    ltc: QuadrigaBook;
    bch: QuadrigaBook;
}
