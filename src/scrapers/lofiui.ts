import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://lofiui.co/');
    const sections = await page.$$('.grid > .items-center.justify-between');
    for (const section of sections) {
        const name$ = section.evaluate((s) => {
            return s.querySelector('h4')!.textContent;
        });
        const link$ = section.evaluate(
            (s) => (s.querySelector('a[href]') as HTMLAnchorElement).href,
        );
        result.push({
            name: (await name$) as string,
            link: (await link$) as string,
        });
    }
    return result;
}
