import { CompomentLink, ScraperArgs } from '../types';

export default async function wickedtemplates({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://blocks.wickedtemplates.com/');
    const sections = await page.$$('section .container');
    for (const section of sections) {
        const category = await section.$eval('header', x => x.textContent!.trim());
        for (const block of await section.$$('a')) {
            const name = await section.$eval('figcaption p', x =>
                x.textContent!.trim(),
            );
            const link = await block.evaluate(x => (x as HTMLAnchorElement).href);
            result.push({
                name: `${category} ${name}`,
                link,
            });
        }
    }

    return result;
}
