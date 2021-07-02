import { CompomentLink, ScraperArgs } from '../types';

export default async function merakiui({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://merakiui.com/');
    const sections = await page.$$('.container button.cursor-pointer');
    const result: CompomentLink[] = [];
    for (const section of sections) {
        await section.click();
        const category = await page.$eval('h1.capitalize', h => h.textContent);
        const names = await page.$$eval('h3.capitalize', elements =>
            elements.map(h => h.textContent),
        );
        names.forEach(name => {
            result.push({
                name: `${category} ${name}`,
                link: 'https://merakiui.com/',
            });
        });
    }
    return result;
}
