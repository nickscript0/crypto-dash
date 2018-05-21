/**
 * TODO: CSS cards
 * - Semantic-ui: https://semantic-ui.com/examples/responsive.html or https://semantic-ui.com/elements/label.html
 * - https://getuikit.com/docs/label
 * - https://minicss.org/card
 * - https://picnicss.com/tests
 * 
 */

import { Big } from 'big.js';
import { formatDistance, isAfter, format } from 'date-fns';
import { h, createProjector, VNodeChild } from 'maquette';

import * as CoinMarketCap from "./CoinMarketCap";
import * as QuadrigaAPI from "./QuadrigaAPI";
import * as ShapeshiftIO from "./ShapeshiftIO";

class Field {
    name: string;
    values: ColoredValue[] | undefined;
    constructor(name, values: ColoredValue[] | undefined = undefined) {
        this.name = name;
        this.values = values;
    }
}

class ColoredValue {
    value: string;
    isPositive: boolean | undefined;

    constructor(value: string, isPositive: boolean | undefined = undefined) {
        this.value = value;
        this.isPositive = isPositive;
    }
}

async function main() {
    const dash = document.getElementById('dash');
    const boxes: Field[][] = [];

    if (dash) {
        // This is slightly faster than "await Promise.all" as it won't block waiting for all requests to complete
        const cmcTickersPromise = CoinMarketCap.requestTickers();
        const qcxPricesPromise = QuadrigaAPI.requestPrices();
        const ssCoinsPromise = ShapeshiftIO.requestShapeshiftCoins();
        const ssPairsPromise = ShapeshiftIO.requestMarketInfoPairs();

        const cmcTickers = await cmcTickersPromise;
        const qcxPrices = await qcxPricesPromise;
        const qcxDiffs = quadrigaDiffCoinMarketCap(cmcTickers, qcxPrices);


        zip([
            [cmcTickers.btc, cmcTickers.ltc, cmcTickers.eth, cmcTickers.nano, cmcTickers.ark, cmcTickers.salt, cmcTickers.trx],
            [qcxDiffs.btc, qcxDiffs.ltc, qcxDiffs.eth, null, null, null, null]
        ]).forEach(el => {
            const price: CoinMarketCap.CMCTicker = el[0];
            const qDiff: string = el[1];
            let boxStr = '';
            const box: Field[] = [];
            try {
                // boxStr = `${price.symbol}\n` +
                //     `Price: ${toCurrency(price.price_cad)}\n` +
                //     `1h: ${price.percent_change_1h}%\n1d: ${price.percent_change_24h}%\n` +
                //     `7d: ${price.percent_change_7d}%`;
                box.push(new Field(`${price.symbol}`));
                box.push(new Field(`Price: ${toCurrency(price.price_cad)}\n`));
                box.push(new Field(`1h:`, [new ColoredValue(`${price.percent_change_1h}%\n`, Big(price.percent_change_1h).gt(0))]));
                box.push(new Field(`1d:`, [new ColoredValue(`${price.percent_change_24h}%\n`, Big(price.percent_change_24h).gt(0))]));
                box.push(new Field(`7d:`, [new ColoredValue(`${price.percent_change_7d}%\n`, Big(price.percent_change_7d).gt(0))]));
                if (qDiff) boxStr += `\nQcx Price: ${qDiff}`;
            } catch (e) {
                // boxStr = `Error: unable to load ticker, see console for more info.`;
                box.push(new Field(`Error: unable to load ticker, see console for more info.`))
                console.log(e);
            }

            boxes.push(box);
        });

        boxes.push(shapeshiftPairStats(await ssPairsPromise, cmcTickers, qcxPrices));
        boxes.push(getShapeshiftStats(await ssCoinsPromise));
        boxes.push(nanoPerLtcText(cmcTickers));


        renderDom(boxes);
        updateLoadTime();
    }
}

function renderDom(fields2d: Field[][]) {
    const projector = createProjector();
    const vBoxes = fields2d.map(fields => {
        const lines = fields.map(field => {
            let els: VNodeChild = [field.name];
            if (field.values) {
                const valueEls = field.values.map(cv => h(cv.isPositive ? 'span.positive-val' : 'span.negative-val', [cv.value]));
                els = els.concat(valueEls);
            }
            return h('div', els);
        });
        return h('div.box', [lines]);
    });

    function render() {
        return h('div.wrapper', vBoxes);
    }
    const dash = document.getElementById('dash');
    if (!dash) throw Error('No dash id found');
    projector.append(dash, render);
}

function nanoPerLtcText(cmcTickers: CoinMarketCap.Currencies<CoinMarketCap.CMCTicker>): Field[] {
    const ltcNow = Big(cmcTickers.ltc.price_cad);
    const nanoNow = Big(cmcTickers.nano.price_cad);
    const nanoPerLtcNow = ltcNow.div(nanoNow);

    function nanoLtcPercentChange(percentChangePropname: string): string {
        const ltcBefore = ltcNow.div(Big(cmcTickers.ltc[percentChangePropname]).div(100).plus(1));
        const nanoBefore = nanoNow.div(Big(cmcTickers.nano[percentChangePropname]).div(100).plus(1));
        const nanoPerLtcBefore = ltcBefore.div(nanoBefore);
        return percentMore(nanoPerLtcNow, nanoPerLtcBefore, true);
    }
    const week = nanoLtcPercentChange('percent_change_7d');
    const day = nanoLtcPercentChange('percent_change_24h');
    const hour = nanoLtcPercentChange('percent_change_1h');
    return [
        new Field(`NANO per LTC`),
        new Field(`Value: ${nanoPerLtcNow.toFixed(2)}`),
        new Field(`1h:`, [new ColoredValue(`${hour}`, Big(hour.slice(0, -1).trim()).lt(0))]),
        new Field(`1d:`, [new ColoredValue(`${day}`, Big(day.slice(0, -1).trim()).lt(0))]),
        new Field(`7d:`, [new ColoredValue(`${week}`, Big(week.slice(0, -1).trim()).lt(0))]),
        // new Field(`7d: ${week}\n(higher NANO cheaper`)
    ];
}

function shapeshiftPairStats(pairs: ShapeshiftIO.MarketInfoPairs, tickers: CoinMarketCap.Currencies<CoinMarketCap.CMCTicker>, qcxPrices: QuadrigaAPI.Prices): Field[] {
    // Withdraw Price (plus miner fee) minus Deposit Price. This is the cut that shapeshift takes compared to market price.
    // The lower this number the better (i.e. the closer it is to market price).
    function tradeCost(
        depositTicker: CoinMarketCap.CMCTicker,
        withdrawTicker: CoinMarketCap.CMCTicker,
        qcxDepositPrice: Big,
        qcxMarketPrice: Big,
        pair: ShapeshiftIO.MarketInfo): { name: string, percent: string, qcxPercent: string, minerFee: string } {
        const minerFee = pair.minerFee.times(withdrawTicker.price_cad);
        const depositPrice = Big(depositTicker.price_cad);
        const withdrawPrice = Big(withdrawTicker.price_cad).times(pair.rate).plus(minerFee);
        const percent = percentMore(withdrawPrice, depositPrice, true);
        const qcxWithdrawPrice = qcxMarketPrice.times(pair.rate).plus(minerFee);
        const qcxPercent = percentMore(qcxWithdrawPrice, qcxDepositPrice, true);
        const name = `${depositTicker.symbol} -> ${withdrawTicker.symbol}`;
        return {
            name,
            percent,
            qcxPercent,
            minerFee: toCurrency(minerFee)
        };
    }
    const results = [
        tradeCost(tickers.btc, tickers.ltc, qcxPrices.btc, qcxPrices.ltc, pairs.btc_ltc),
        tradeCost(tickers.ltc, tickers.btc, qcxPrices.ltc, qcxPrices.btc, pairs.ltc_btc),
        tradeCost(tickers.btc, tickers.eth, qcxPrices.btc, qcxPrices.eth, pairs.btc_eth),
        tradeCost(tickers.eth, tickers.btc, qcxPrices.eth, qcxPrices.btc, pairs.eth_btc),
        tradeCost(tickers.ltc, tickers.eth, qcxPrices.ltc, qcxPrices.eth, pairs.ltc_eth),
        tradeCost(tickers.eth, tickers.ltc, qcxPrices.eth, qcxPrices.ltc, pairs.eth_ltc),
    ].map(r => `${r.name}: ${r.percent} (Qcx: ${r.qcxPercent}) (Miner Fee: ${r.minerFee})`);
    const fields = results.map(r => new Field(r));
    fields.unshift(new Field('Shapeshift.io premiums (incl. miner fee):'));
    return fields;
}

function updateLoadTime(loadTime: Date | null = null) {
    const tsEl = document.getElementById('timestamp');
    if (!loadTime) loadTime = new Date();
    if (tsEl) {
        const absTime = format(loadTime, 'MMMM Do YYYY, h:mm:ss a');
        const relTime = fromNow(loadTime);
        tsEl.textContent = `Updated: ${absTime} (${relTime})`;
    }
    setTimeout(updateLoadTime, 10000, loadTime);
}

function fromNow(otherDate: Date) {
    const now = new Date();
    const relString = formatDistance(now, otherDate);
    return isAfter(otherDate, now) ? `in ${relString}` : `${relString} ago`;
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
    const nanoExistTextFrag = ShapeshiftIO.nanoAvailable(shapeshiftCoins) ? 'exists on' : 'does not exist on';
    const nanoExistText = `\nNano (NANO) ${nanoExistTextFrag} Shapeshift.io`;
    return [
        new Field(`Shapeshift.io has ${ssCounts.percentAvailable}% coins available (${ssCounts.unavailable} unavailable)`),
        new Field(nanoExistText),
        new Field(addedCoinsText),
        new Field(removedCoinsText)
    ];
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
