import { trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function wickedtemplates({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://blocks.wickedtemplates.com/');
    const sections = await page.$$('section.text-left[id]');
    for (const section of sections) {
        const name1 = section.$eval('h2', x => x.textContent!.trim());
        const name2 = section.$eval('h1', x => x.textContent!.trim());
        const link = section.$eval('a[href]', x => (x as HTMLAnchorElement).href);
        result.push({
            link: await link,
            name: trim(await name1) + ' ' + trim(await name2, '. '),
        });
    }
    return result;
}
