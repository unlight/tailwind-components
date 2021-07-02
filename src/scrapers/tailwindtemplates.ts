import { CompomentLink, ScraperArgs } from '../types';
import { Page } from 'puppeteer';

export default async function tailwindtemplates({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwindtemplates.io/welcome/');
    const pageUrls = await page
        .$x('//p[contains(@class,"text-base")][text()="Basic"]/following-sibling::*//a')
        .then(elementsHandle => {
            return Promise.all(
                elementsHandle.map(elementHandle =>
                    elementHandle.evaluate(
                        element => (element as HTMLAnchorElement).href,
                    ),
                ),
            );
        });
    for (const pageUrl of pageUrls) {
        await page.goto(pageUrl);
        const components = await page.$$eval('.sticky.top-0 a[href]', elements => {
            return elements.map(a => ({
                name: a.textContent!.trim(),
                link: (a as HTMLAnchorElement).href,
            }));
        });
        result.push(...components);
    }
    return result;
}
