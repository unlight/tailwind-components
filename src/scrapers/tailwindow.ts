import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwindow.github.io/component-tailwindcss/');
    const sections = await page.$$eval('li a[href]', (elements) =>
        elements.map((x) => ({
            name: x.textContent!,
            href: (x as HTMLAnchorElement).href,
        })),
    );
    for (const section of sections) {
        await page.goto(section.href, { waitUntil: 'networkidle0' });
        let names = await page.$$eval('p.text-sm.font-light', (elements) =>
            elements.map((x) => x.textContent),
        );
        if (names.length > 0) {
            names = [...new Set(names.filter(Boolean))];
            names.forEach((name) => {
                result.push({ name: `${section.name} ${name}`.trim(), link: section.href });
            });
        } else {
            result.push({ name: section.name, link: section.href });
        }
    }
    return result;
}
