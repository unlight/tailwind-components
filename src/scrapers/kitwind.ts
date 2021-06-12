import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://kitwind.io/products/kometa/components', {
        waitUntil: 'networkidle0',
    });

    const result = await page.$$eval(
        '.grid a[href^="/products/kometa/components/"]',
        elements => {
            return elements.map(x => {
                const name = x.querySelector('header')!.textContent;
                return {
                    name,
                    link: (x as HTMLAnchorElement).href,
                };
            });
        },
    );

    return result;
}
