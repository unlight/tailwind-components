import { CompomentLink, ScraperArgs } from '../types';

export default async function sailui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://sailui.github.io/');
    const categories = await page.$$eval('h2.font-bold:not(.text-center)', elements =>
        elements.map(h => h.textContent),
    );
    const result: CompomentLink[] = [];
    for (const category of categories) {
        result.push({
            name: category!,
            link: 'https://sailui.github.io/',
        });
    }
    return result;
}
