import { Big } from 'big.js';

import * as CoinMarketCap from "./CoinMarketCap";
import * as QuadrigaAPI from "./QuadrigaAPI";
import * as ShapeshiftIO from "./ShapeshiftIO";

async function main() {
    const dash = document.getElementById('dash');

    if (dash) {
        const [cmcTickers, qcxPrices, ssCoins, ssPairs] = await Promise.all([
            CoinMarketCap.requestTickers(),
            QuadrigaAPI.requestPrices(),
            ShapeshiftIO.requestShapeshiftCoins(),
            ShapeshiftIO.requestMarketInfoPairs()
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

        addBox(shapeshiftPairStats(ssPairs, cmcTickers, qcxPrices), dash, true);
        addBox(getShapeshiftStats(ssCoins), dash, true);
    }
}

function shapeshiftPairStats(pairs: ShapeshiftIO.MarketInfoPairs, tickers: CoinMarketCap.Tickers, qcxPrices: QuadrigaAPI.Prices) {
    // Withdraw Price minus Deposit Price. This is the cut that shapeshift takes compared to market price.
    // The lower this number the better (i.e. the closer it is to market price).
    function tradeCost(
        depositTicker: CoinMarketCap.CMCTicker,
        withdrawTicker: CoinMarketCap.CMCTicker,
        qcxDepositPrice: Big,
        qcxMarketPrice: Big,
        pairRate: Big): { name: string, percent: string, qcxPercent: string } {
        const depositPrice = Big(depositTicker.price_cad);
        const withdrawPrice = Big(withdrawTicker.price_cad).times(pairRate);
        const percent = percentMore(withdrawPrice, depositPrice, true);
        const qcxWithdrawPrice = qcxMarketPrice.times(pairRate);
        const qcxPercent = percentMore(qcxWithdrawPrice, qcxDepositPrice, true);
        const name = `${depositTicker.symbol} -> ${withdrawTicker.symbol}`;
        return {
            name,
            percent,
            qcxPercent
        };
    }
    const results = [
        tradeCost(tickers.btc, tickers.ltc, qcxPrices.btc, qcxPrices.ltc, pairs.btc_ltc.rate),
        tradeCost(tickers.ltc, tickers.btc, qcxPrices.ltc, qcxPrices.btc, pairs.ltc_btc.rate),
        tradeCost(tickers.btc, tickers.eth, qcxPrices.btc, qcxPrices.eth, pairs.btc_eth.rate),
        tradeCost(tickers.eth, tickers.btc, qcxPrices.eth, qcxPrices.btc, pairs.eth_btc.rate),
        tradeCost(tickers.ltc, tickers.eth, qcxPrices.ltc, qcxPrices.eth, pairs.ltc_eth.rate),
        tradeCost(tickers.eth, tickers.ltc, qcxPrices.eth, qcxPrices.ltc, pairs.eth_ltc.rate),
    ].map(r => `${r.name}: ${r.percent} (Qcx: ${r.qcxPercent})`);
    return 'Shapeshift.io premiums:\n' + results.join('\n');
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
    const btcCMC = CoinMarketCap.getCadPrices(cmcTickers);
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

function getShapeshiftStats(shapeshiftCoins) {
    const ssCounts = ShapeshiftIO.availabilityCount(shapeshiftCoins);
    const { addedCoins, removedCoins } = ShapeshiftIO.addedRemovedCoins(shapeshiftCoins);
    const addedCoinsText = addedCoins.size > 0 ? `\nAdded Coins: ${[...addedCoins].join(',')}` : '';
    const removedCoinsText = removedCoins.size > 0 ? `\nRemoved Coins: ${[...removedCoins].join(',')}` : '';
    const xrbExistTextFrag = ShapeshiftIO.xrbAvailable(shapeshiftCoins) ? 'exists on' : 'does not exist on';
    const xrbExistText = `\nRaiBlocks (XRB) ${xrbExistTextFrag} Shapeshift.io`;
    return `Shapeshift.io has ${ssCounts.percentAvailable}% coins available (${ssCounts.unavailable} unavailable)` +
        xrbExistText + addedCoinsText + removedCoinsText;
}

function zip(rows) {
    return rows[0].map((_, c) => rows.map(row => row[c]));
}

function percentMore(a: Big, b: Big, padPlus = false): string {
    const res = a.minus(b).div(b).times(100);
    const prefix = (padPlus && res.gt(0)) ? ' ' : '';
    return prefix + res.toFixed(2) + '%';
}

function toCurrency(n: string | Big) {
    if (n instanceof Big) n = n.toString();
    return parseFloat(n).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}

main();
