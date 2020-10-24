import puppeteer from 'puppeteer';
import { getScrapers } from './scrapers';
import { CompomentLink } from './types';
import { generate } from './generate';
import { promises as fs } from 'fs';
import yargs from 'yargs';

type ProgramOptions = {
    only?: string;
};

async function main(options?: ProgramOptions) {
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 0,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    const [page] = await browser.pages();
    const scrapers = await getScrapers({ name: options?.only });
    const items: CompomentLink[] = [];
    for await (const scraper of scrapers) {
        items.push(...(await scraper({ page })));
    }
    await browser.close();
    const content = await generate({ items });
    await fs.writeFile('README.md', content);
}

main(yargs.argv as ProgramOptions);
