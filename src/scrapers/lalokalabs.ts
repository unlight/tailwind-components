import { CompomentLink, ScraperArgs } from '../types';

export default async function lalokalabs({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];

    await page.goto('https://layoutsfortailwind.lalokalabs.dev/', {
        waitUntil: 'networkidle0',
    });

    const elements = await page.$$('a.base-card');

    for (const elementHandle of elements) {
        const { link, name } = await elementHandle.evaluate(x => {
            return {
                name: x.querySelector('h4')?.textContent!.trim()!,
                link: (x as HTMLAnchorElement).href,
            };
        });
        result.push({ link, name });
    }

    return result;
}
