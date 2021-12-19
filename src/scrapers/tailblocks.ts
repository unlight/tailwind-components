import { CompomentLink, ScraperArgs } from '../types';

export default async function tailblocks({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://mertjf.github.io/tailblocks/', {
        waitUntil: 'networkidle0',
    });
    const result: CompomentLink[] = await page.$$eval(
        '#root aside > .blocks',
        elements =>
            elements.map(element => {
                const name = element.querySelector('.block-category')!.textContent;
                return {
                    name: `Page ${name}`,
                    link: 'https://mertjf.github.io/tailblocks',
                };
            }),
    );
    return result;
}
