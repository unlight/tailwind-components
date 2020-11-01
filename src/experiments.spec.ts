import assert from 'assert';
import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser;
let page: Page;

before(async () => {
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    [page] = await browser.pages();
});

after(async () => {
    await browser.close();
});

it.skip('experiments', async () => {
    const scraper = await import('./scrapers/devdojo').then((m) => m.default);
    const result = await scraper({ page });
    console.log('result', result);
});
