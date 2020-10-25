import { CompomentLink, ScraperArgs } from '../types';
import { Page } from 'puppeteer';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://www.tailwindtoolbox.com/starter-components');
    result.push(...(await getCards(page)));
    await page.goto('https://www.tailwindtoolbox.com/starter-templates');
    result.push(...(await getCards(page)));
    return result;
}

async function getCards(page: Page) {
    return page.$$eval('.card', (elements) =>
        elements.map((card) => {
            const link = (card.querySelector('a[href]') as HTMLAnchorElement).href;
            const name = card.querySelector('.card-title')!.textContent!.trim();
            return { name, link };
        }),
    );
}
