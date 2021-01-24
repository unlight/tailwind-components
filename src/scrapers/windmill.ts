import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://windmill-dashboard.vercel.app');

    const sections = await page.$$eval(
        'aside[class*="md:block"] ul a[href]',
        (elements) => {
            return elements.map((element) => {
                return {
                    category: element.textContent,
                    link: (element as HTMLAnchorElement).href,
                };
            });
        },
    );

    for (const { link } of sections) {
        await page.goto(link);
        const category = await page.$eval('h2', (x) => x.textContent!.trim());
        const elements = await page.$$eval('h4', (elements) => {
            return elements.map((element) => element.textContent!.trim());
        });
        for (const element of elements) {
            const name = `${category} ${element}`;
            result.push({
                link,
                name,
            });
        }
    }

    return result;
}
