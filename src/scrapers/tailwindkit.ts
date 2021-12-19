import { CompomentLink, ScraperArgs } from '../types';

// todo: add templates https://www.tailwind-kit.com/templates

export default async function tailwindkit({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://www.tailwind-kit.com/components', {
        waitUntil: 'networkidle0',
    });
    const sectionLinks = await page.$$eval('main a[href^="/components"]', elements => {
        return elements.map(element => (element as HTMLAnchorElement).href);
    });
    for (const sectionLink of sectionLinks) {
        await page.goto(sectionLink);
        const sectionName = await page.$eval('h1', h => h.textContent);
        (
            await page.$$eval(
                '.flex.flex-col.items-center.justify-between p',
                elements => {
                    return elements.map(element => element.textContent!.trim());
                },
            )
        ).forEach(name => {
            result.push({
                name: `${sectionName} - ${name}`,
                link: sectionLink,
            });
        });
    }

    return result;
}
