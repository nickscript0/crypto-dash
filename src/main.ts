import { Big } from 'big.js';

import { getTickers as getCMCTickers, getCadPrices } from "./CoinMarketCap";
import { getPrices as getQuadrigaPrices } from "./QuadrigaAPI";
import { getShapeshiftCoins, availabilityCount, xrbAvailable, addedRemovedCoins } from "./ShapeshiftIO";

async function main() {
    const dash = document.getElementById('dash');

    if (dash) {
        const [cmcTickers, qcxPrices, ssStats] = await Promise.all([
            getCMCTickers(),
            getQuadrigaPrices(),
            getShapeshiftStats()
        ]);

        const qcxDiffs = quadrigaDiffCoinMarketCap(cmcTickers, qcxPrices);
        zip([
            [cmcTickers.btc, cmcTickers.ltc, cmcTickers.eth, cmcTickers.rai],
            [qcxDiffs.btc, qcxDiffs.ltc, qcxDiffs.eth, null]
        ]).forEach(el => {
            const price = el[0];
            const qDiff = el[1];
            let boxStr = `${price.symbol}\n` +
                `Price: ${toCurrency(price.price_cad)}\n` +
                `1h: ${price.percent_change_1h}%\n1d: ${price.percent_change_24h}%\n` +
                `7d: ${price.percent_change_7d}%`;
            if (qDiff) boxStr += `\nQcx Price: ${qDiff}`;
            addBox(boxStr, dash, true);
        });

        addBox(ssStats, dash, true);

    }
}

function addBox(text: string, dash: HTMLElement, pre = false) {
    const tagName = pre ? 'pre' : 'div';
    const div = document.createElement(tagName);
    div.textContent = text;
    div.className = 'box';
    dash.appendChild(div);
}

const CURRENCIES = ['BTC', 'LTC', 'ETH'];

function quadrigaDiffCoinMarketCap(cmcTickers, qcxPrices) {

    // Calculate how different Quadriga price is from CoinMarketCap
    const btcCMC = getCadPrices(cmcTickers);
    const btcQuad = qcxPrices;
    const btcCMCArr = [btcCMC.btc, btcCMC.ltc, btcCMC.eth];
    const btcQuadArr = [btcQuad.btc, btcQuad.ltc, btcQuad.eth];
    const prices = zip([CURRENCIES, btcQuadArr, btcCMCArr]);

    const [btc, ltc, eth]: string = prices.map(p => percentMore(p[1], p[2]));
    return {
        btc,
        ltc,
        eth
    };
}

async function getShapeshiftStats() {
    // Shapeshift.io stats
    const shapeshiftCoins = await getShapeshiftCoins();
    const ssCounts = availabilityCount(shapeshiftCoins);
    const { addedCoins, removedCoins } = addedRemovedCoins(shapeshiftCoins);
    const addedCoinsText = addedCoins.size > 0 ? `\nAdded Coins: ${[...addedCoins].join(',')}` : '';
    const removedCoinsText = removedCoins.size > 0 ? `\nRemoved Coins: ${[...removedCoins].join(',')}` : '';
    const xrbExistTextFrag = xrbAvailable(shapeshiftCoins) ? 'exists on' : 'does not exist on';
    const xrbExistText = `\nRaiBlocks (XRB) ${xrbExistTextFrag} Shapeshift.io`;
    return `Shapeshift.io has ${ssCounts.percentAvailable}% coins available (${ssCounts.unavailable} unavailable)` +
        xrbExistText + addedCoinsText + removedCoinsText;
}

function zip(rows) {
    return rows[0].map((_, c) => rows.map(row => row[c]));
}

function percentMore(a: Big, b: Big): string {
    return a.minus(b).div(b).times(100).toFixed(2) + '%';
}

function toCurrency(n: string) {
    return parseFloat(n).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}

main();
