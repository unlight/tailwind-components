import { CompomentLink, ScraperArgs } from '../types';
import _ from 'lodash';

export default async function mynaui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://mynaui.com/', {
        waitUntil: 'networkidle2',
    });
    const sections = await page.$$eval('a[href].group', elements =>
        elements.map(a => ({
            sectionLink: (a as HTMLAnchorElement).href,
            category: a.querySelector('span.truncate')?.textContent,
        })),
    );
    for (const { sectionLink, category } of sections) {
        await page.goto(sectionLink, { waitUntil: 'networkidle2' });
        const elements = await page.$$('a[href][id]');

        for (const element of elements) {
            const info = await element.evaluate(node => {
                const anchor = node as HTMLAnchorElement;
                return {
                    link: anchor.href,
                    name: anchor?.textContent!,
                };
            });

            const name = `${category} ${_.trim(info.name)}`;

            result.push({ name, link: info.link });
        }
    }

    return result;
}
