import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwindadmin.netlify.app');
    const links = await page.$$eval('aside[class*="md:block"] li a:not(.mx-4)', (elements) =>
        elements.slice(1).map((element) => ({
            section: element.textContent!.trim(),
            href: (element as HTMLAnchorElement).href,
        })),
    );
    for (const { href, section } of links) {
        await page.goto(href);
        const names = await page.$$eval(
            '.border-solid.rounded.border.w-full > div:first-child',
            (elements) => elements.map((x) => x.textContent!.trim()),
        );
        names.forEach((name) => {
            result.push({ name: `${section} ${name}`, link: href });
        });
    }
    // Pages
    const pageLinks = await page.$$eval('aside[class*="md:block"] li a.mx-4', (elements) =>
        elements.slice(1).map((element) => ({
            name: element.textContent!.trim(),
            link: (element as HTMLAnchorElement).href,
        })),
    );

    result.push(...pageLinks);

    return result;
}
