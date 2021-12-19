import { CompomentLink, ScraperArgs } from '../types';

export default async function headlessui({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://headlessui.dev/', { waitUntil: 'networkidle0' });

    const elements = await page.$$('.grid a[class]');

    for (const elementHandle of elements) {
        const { link, name } = await elementHandle.evaluate(x => ({
            name: x.textContent!,
            link: (x as HTMLAnchorElement).href,
        }));
        result.push({ link, name });
    }

    return result;
}
