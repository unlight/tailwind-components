import { CompomentLink, ScraperArgs } from '../types';

export default async function fancytailwind({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://fancytailwind.com/browse-components', {
        waitUntil: 'networkidle2',
    });
    const sections = await page.$$eval(
        'a[href^="/app/fancy-laboratory/"].items-center',
        elements =>
            elements.map(a => ({
                sectionLink: (a as HTMLAnchorElement).href,
                category: a.querySelector('span.transform')?.textContent,
            })),
    );
    for (const { sectionLink, category } of sections) {
        await page.goto(sectionLink, { waitUntil: 'networkidle2' });
        const elements = await page.$$('main > div > .mx-auto > div[id]');

        for (const element of elements) {
            const info = await element.evaluate(node => {
                return {
                    link: (node.querySelector('a') as HTMLAnchorElement).href,
                    name: node.querySelector('h2')?.textContent!,
                    badge: node
                        .querySelector('.tracking-wider')
                        ?.textContent?.toLowerCase(),
                };
            });
            if (info.badge !== 'free') {
                continue;
            }

            result.push({
                category: category ? category : undefined,
                link: info.link,
                name: info.name,
            });
        }
    }
    return result;
}
