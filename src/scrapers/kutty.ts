import { CompomentLink, ScraperArgs } from '../types';

export default async function kutty({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://kutty.netlify.app/components/');
    const sections = await page.$$('a.card');
    for (const section of sections) {
        const category = section.evaluate(
            (s) => (s.parentNode as Element).previousElementSibling!.textContent,
        );
        const link = section.getProperty('href').then((x) => x.jsonValue());
        const name = section.$eval('.card-header', (s) => s.textContent);
        result.push({
            name: `${await category} ${await name}`,
            link: (await link) as string,
        });
    }
    return result;
}
