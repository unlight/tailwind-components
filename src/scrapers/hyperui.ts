import { CompomentLink, ScraperArgs } from '../types';

export default async function hyperui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://hyperui.dev/#componentGrid', {
        waitUntil: 'networkidle0',
    });
    const result = await page.$$eval('a[href^="/components/"]', elements => {
        return elements.map(a => ({
            link: (a as HTMLAnchorElement).href,
            name: a.querySelector('h2')!.textContent!,
        }));
    });

    return result;
}
