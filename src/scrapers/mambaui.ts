import { CompomentLink, ScraperArgs } from '../types';

export default async function mambaui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://mambaui.com/components', { waitUntil: 'networkidle0' });

    const result = await page.$$eval(
        'custom-components a[href^="/components/"]',
        elements => {
            return elements.map(x => {
                const name = x.querySelector(':nth-child(2)')!.textContent;
                return {
                    name,
                    link: (x as HTMLAnchorElement).href,
                };
            });
        },
    );

    return result;
}
