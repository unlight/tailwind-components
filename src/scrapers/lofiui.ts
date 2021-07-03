import { CompomentLink, ScraperArgs } from '../types';

export default async function lofiui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://lofiui.co/', { waitUntil: 'networkidle2' });
    const result = await page.$$eval('#components-grid > a', elements =>
        elements.map(element => {
            const name = element.querySelector('h4')!.textContent!;
            const link = (element as HTMLAnchorElement).href;
            return { name, link };
        }),
    );

    return result;
}
