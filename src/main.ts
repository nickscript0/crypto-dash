import { Big } from 'big.js';

import { getTickers as getCMCTickers, getPrices as getCMCPrices } from "./CoinMarketCap";
import { getPrices as getQuadrigaPrices } from "./QuadrigaAPI";
import { getShapeshiftCoins, availabilityCount, xrbAvailable, addedRemovedCoins } from "./ShapeshiftIO";

async function main() {
    const dash = document.getElementById('dash');

    if (dash) {
        const prices = await getCMCTickers();
        [prices.btc, prices.eth, prices.ltc, prices.rai].forEach(p => {
            addBox(`${p.symbol}\n` +
                `Price: ${toCurrency(p.price_cad)}\n` +
                `1h: ${p.percent_change_1h}%\n1d: ${p.percent_change_24h}%\n7d: ${p.percent_change_7d}%`, dash);
        });

        addBox((await quadrigaDiffCoinMarketCap()).join('\n'), dash);
        addBox(await getShapeshiftStats(), dash);

    }
}

function addBox(text: string, dash: HTMLElement) {
    const div = document.createElement('pre');
    div.textContent = text;
    div.className = 'box';
    dash.appendChild(div);
}

const CURRENCIES = ['BTC', 'LTC', 'ETH'];
async function quadrigaDiffCoinMarketCap(): Promise<string[]> {

    // Calculate how different Quadriga price is from CoinMarketCap
    const btcCMC = await getCMCPrices();
    const btcQuad = await getQuadrigaPrices();
    const btcCMCArr = [btcCMC.btc, btcCMC.ltc, btcCMC.eth];
    const btcQuadArr = [btcQuad.btc, btcQuad.ltc, btcQuad.eth];
    const prices = zip([CURRENCIES, btcQuadArr, btcCMCArr]);

    const pricesStr = prices.map(p => `${p[0]}: Quadriga=${toCurrency(p[1])} ` +
        `CoinMarketCap=${toCurrency(p[2])} (${percentMore(p[1], p[2])} more expensive)`);
    return pricesStr;

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
