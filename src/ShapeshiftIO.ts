// https://shapeshift.io/getcoins

import * as request from "superagent";

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

export async function getShapeshiftCoins(): Promise<Coins> {
    const url = `https://shapeshift.io/getcoins`;
    return _getPriceRaw(url);
}

async function _getPriceRaw(url) {
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

export function xrbAvailable(coins: Coins): boolean {
    const XRB_NAME = 'raiblocks';
    const XRB_SYMBOL = 'xrb';
    const filterXrb = Object.values(coins)
        .filter(c => c.name.toLowerCase().includes(XRB_NAME) ||
            c.symbol.toLowerCase().includes(XRB_SYMBOL));
    return filterXrb.length > 0;
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
