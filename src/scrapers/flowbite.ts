import { CompomentLink, ScraperArgs } from '../types';

export default async function flowbite({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://flowbite.com/docs/components/alerts/', {
        waitUntil: 'networkidle0',
    });
    const links = await page.$$eval('a[href^="/docs/components/"]', elements =>
        elements.map(a => {
            return {
                category: a.textContent!.trim(),
                link: (a as HTMLAnchorElement).href,
            };
        }),
    );
    for (const { category, link } of links) {
        await page.goto(link, { waitUntil: 'networkidle0' });
        const elements = await page.$x(
            '//h5[contains(text(), "On this page")]/../..//a',
        );
        for (const element of elements) {
            const anchorName = await element.evaluate(x => {
                return x.textContent!.trim();
            });
            if (anchorName === 'JavaScript') {
                continue;
            }
            result.push({
                name: `${category} ${anchorName}`,
                link,
            });
        }
    }

    return result;
}
