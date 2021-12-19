import { CompomentLink, ScraperArgs } from '../types';

export default async function appseed({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwind-css-components.appseed.us', {
        waitUntil: 'networkidle0',
    });
    const elements = await page.$$eval(
        '#directory-listing li a[href$=".html"]',
        elements => {
            return elements.map(a => ({
                link: (a as HTMLAnchorElement).href,
                name: a.getAttribute('data-name'),
            }));
        },
    );
    for (const element of elements) {
        const name = element.name!.slice(0, -5).replace(/-/g, ' ');

        result.push({ link: element.link, name });
    }

    return result;
}
