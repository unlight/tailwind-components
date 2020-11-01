import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result = await page.$$eval('ul a.portal', (elements) => {
        return elements.map((x) => {
            return {
                name: x.textContent!,
                link: (x as HTMLAnchorElement).href,
            };
        });
    });
    return result;
}
