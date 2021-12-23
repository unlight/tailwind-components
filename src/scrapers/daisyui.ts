import _ from 'lodash';
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

    // todo: fix massive UnhandledPromiseRejectionWarning errors
    // ProtocolError: Protocol error (Page.createIsolatedWorld): No frame for given id found
    for (const { href, link, category } of links) {
        const navLink = await page.$(`li > a[href="${href}"]`);
        await navLink?.click();
        await page.waitForTimeout(1000);
        const names = await page.evaluate(() => {
            return Array.from(
                document.querySelectorAll('main .py-2 > .text-xs.pt-4'),
            ).map(element => element?.textContent?.trim());
        });
        const nextNames = _(names as string[])
            .uniq()
            .filter(Boolean)
            .value();
        for (let name of nextNames) {
            if (!name.startsWith(category)) {
                name = `${category} ${name}`;
            }
            result.push({ link, name });
        }
    }

    return result;
}
