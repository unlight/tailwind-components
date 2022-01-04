import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function tinywind({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tinywind.dev/components/', {
        waitUntil: 'networkidle0',
    });
    const sections = await page.$$eval('a[href^="/components/"]', elements => {
        return elements.map(a => ({
            link: (a as HTMLAnchorElement).href,
            category: a.querySelector('h3')!.textContent!,
        }));
    });

    for (const { link, category } of sections) {
        await page.goto(link, {
            waitUntil: 'networkidle0',
        });
        let names = await page.$$eval(
            'main .space-y-2 > .items-center > h3',
            elements => {
                return elements.map(element => {
                    return element.textContent!;
                });
            },
        );
        names = uniq(names);

        names.forEach(name => {
            result.push({ link, name: `${category} ${name}` });
        });
    }

    console.log('result', result);

    return result;
}
