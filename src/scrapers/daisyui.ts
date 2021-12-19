import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function daisyui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://daisyui.com/components/button', {
        waitUntil: 'networkidle0',
    });
    const links = await page.$$eval('li > a[href^="/components/"]', elements => {
        return elements.map(a => ({
            href: a.getAttribute('href'),
            link: (a as HTMLAnchorElement).href,
            category: a.textContent!.trim(),
        }));
    });

    for (const { href, link, category } of links) {
        await page.goto(link);
        // const navLink = await page.$(`li > a[href^="${href}"]`);
        // await navLink?.click();
        // await page.waitForNetworkIdle();
        let names = await page.$$eval('main .py-2 > .text-xs.pt-4', elements => {
            return elements.map(element => {
                return element.textContent!.trim();
            });
        });
        names = uniq(names);
        for (let name of names) {
            if (!name.startsWith(category)) {
                name = `${category} ${name}`;
            }
            result.push({ link, name });
        }
    }

    return result;
}
