// https://shapeshift.io/getcoins

import * as request from "superagent";
import { Big } from 'big.js';

interface Coins {
    [key: string]: Coin;
}

interface Coin {
    "name": string;
    "symbol": string;
    "image": string;
    "imageSmall": string;
    "status": string;
}

// "A coin pair is of the format deposit_withdrawal. Example: 'btc_ltc'."
export interface MarketInfo {
    "pair": string;
    "rate": Big;
    "limit": Big;
    "min": Big;
    "minerFee": Big;
}

export interface MarketInfoPairs {
    btc_ltc: MarketInfo;
    ltc_btc: MarketInfo;
    eth_btc: MarketInfo;
    btc_eth: MarketInfo;
    ltc_eth: MarketInfo;
    eth_ltc: MarketInfo;
}

export async function requestShapeshiftCoins(): Promise<Coins> {
    const url = `https://shapeshift.io/getcoins`;
    return _getJson(url);
}

const PAIRS_ARR = [
    'btc_ltc',
    'ltc_btc',
    'eth_btc',
    'btc_eth',
    'ltc_eth',
    'eth_ltc',
];

/**
 * @returns an array of MarketInfo pairs indexed by PAIRS
 */
export async function requestMarketInfoPairs(): Promise<MarketInfoPairs> {
    const base = `https://shapeshift.io/marketinfo/`;
    const results = await Promise.all(PAIRS_ARR.map(p => request(base + p)));
    const pairsArr = results.map(r => <MarketInfo>_attrToBig(JSON.parse(r.text), ['rate', 'limit', 'min', 'minerFee']));
    const miPairs = {};
    pairsArr.forEach((p, i) => {
        miPairs[PAIRS_ARR[i]] = p;
    });
    return <MarketInfoPairs>miPairs;
}

function _attrToBig(src: object, attrs: string[]) {
    const dst = {};
    Object.entries(src).forEach(a => {
        const [k, v] = a;
        dst[k] = attrs.includes(k) ? Big(v) : v;
    });
    return dst;
}

async function _getJson(url) {
    return JSON.parse((await request(url)).text);
}

export function availabilityCount(coins: Coins) {
    const total = Object.values(coins).length;
    const available = Object.values(coins).filter(c => c.status === 'available').length;
    const unavailable = total - available;
    const percentAvailable = ((available / total) * 100).toFixed(1);
    return {
        available,
        unavailable,
        percentAvailable
    };
}

export function nanoAvailable(coins: Coins): boolean {
    const NANO_NAME = 'nano';
    const NANO_SYMBOL = 'nano';
    const filterNano = Object.values(coins)
        .filter(c => c.name.toLowerCase().includes(NANO_NAME) ||
            c.symbol.toLowerCase().includes(NANO_SYMBOL));
    return filterNano.length > 0;
}

// All shapeshift.io coins updated Jan 3, 2017 from
// JSON.stringify(Object.values(coins).map(c => c.symbol));
const ALL_COINS = ["BTC", "1ST", "ANT", "BAT", "BNT", "BCH", "BCY", "BLK", "BTCD", "BTS", "CVC", "CLAM", "DASH", "DCR", "DGB", "DNT", "DOGE", "EMC", "EDG", "EOS", "ETH", "ETC", "FCT", "FUN", "GAME", "GNO", "GNT", "GUP", "KMD", "LBC", "LSK", "LTC", "MAID", "MLN", "MTL", "MONA", "MSC", "NEO", "NBT", "NMC", "XEM", "NMR", "NVC", "NXT", "OMG", "POT", "PPC", "QTUM", "REP", "RDD", "RCN", "RLC", "SALT", "SC", "SNT", "STORJ", "START", "STEEM", "SNGLS", "SWT", "TRST", "USDT", "VOX", "VRC", "VTC", "WAVES", "WINGS", "XCP", "XMR", "XRP", "ZEC", "ZRX"];

export function addedRemovedCoins(coins: Coins): { addedCoins: Set<string>, removedCoins: Set<string> } {
    const savedSet = new Set(ALL_COINS);
    const currentSet = new Set(Object.values(coins).map(c => c.symbol));

    const diff = (a, b) => new Set([...a].filter(x => !b.has(x)));
    const addedCoins = diff(currentSet, savedSet);
    const removedCoins = diff(savedSet, currentSet);

    return {
        addedCoins,
        removedCoins
    };
}
