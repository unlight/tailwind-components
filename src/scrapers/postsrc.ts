import _ from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function postsrc({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://postsrc.com/components', {
        waitUntil: 'networkidle0',
    });

    const elements = await page.$$eval(
        'a[href*="/components/"][class="card "]',
        elements => {
            return elements.map(element => ({
                link: (element as HTMLAnchorElement).href,
                name: element.querySelector('h3')?.textContent,
            }));
        },
    );

    for (const element of elements) {
        let name = _.chain(element.name).replace('Tailwind CSS', '').trim().value();
        result.push({
            name,
            link: element.link,
        });
    }

    return result;
}
