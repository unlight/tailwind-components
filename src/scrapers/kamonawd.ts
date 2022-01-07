import { trim, uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function kamonawd({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://kamona-wd.github.io/kwd-dashboard/', {
        waitUntil: 'networkidle0',
    });

    const sections = await page.$$('aside div[x-data]');

    for (const section of sections) {
        // const category = await section.$eval('> a', a => a.textContent);
        let category = await section.asElement()?.evaluate(node => {
            return node.querySelector(':scope > a')?.textContent;
        });
        category = trim(category!);

        const items = await section.$$eval('a[role="menuitem"]', elements => {
            return elements.map(element => {
                return {
                    link: (element as HTMLAnchorElement).href,
                    href: element.getAttribute('href'),
                    name: element.textContent!,
                };
            });
        });

        for (const item of items) {
            if (item.href === '#') {
                continue;
            }
            const name = `${category} ${trim(item.name)}`;

            result.push({ name, link: item.link });
        }
    }

    return result;
}
