import puppeteer from 'puppeteer';
import { getScrapers } from './scrapers';
import { promises as fs } from 'fs';
import _ from 'lodash';
import yargs from 'yargs';
import { generate } from './generate';
import { CompomentLink } from './types';

/**
 * RESOURCES:
 * https://tailwindcss-custom-forms.netlify.app/
 * https://kamona-wd.github.io/kwd-dashboard/
 * https://www.creative-tim.com/
 * https://www.vechaiui.com/
 */

if (require.main?.filename === __filename) {
    program(yargs.argv as ProgramOptions);
}

type ProgramOptions = {
    only?: string;
    slowmo?: number;
};

async function program(options?: ProgramOptions) {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: options?.slowmo,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    const [page] = await browser.pages();
    const scrapers = await getScrapers({ name: options?.only });
    const items: CompomentLink[] = [];
    for await (const [index, scraper] of scrapers.entries()) {
        let tryCount = 3;
        while (tryCount--) {
            process.stdout.write(
                `\nProgress: ${scraper.name} ${index + 1}/${scrapers.length} ...`,
            );
            try {
                let scraperItems = await scraper({ page });
                process.stdout.write(` +${scraperItems.length}`);
                items.push(...scraperItems);
                break;
            } catch (error) {
                console.error(error);
                console.log(`Tries left: ${tryCount}`);
            }
        }
        process.stdout.write(` Total: ${items.length}`);
    }
    await browser.close();
    const content = await generate({ items });
    await fs.writeFile('README.md', content);
}
