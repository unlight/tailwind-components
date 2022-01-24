import _ from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function tailgrids({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailgrids.com/components', {
        waitUntil: 'networkidle2',
    });
    const sections = await page.$$eval(
        'a.capitalize.block[href^="/components/"]',
        elements => {
            return elements.map(a => ({
                href: a.getAttribute('href'),
                link: (a as HTMLAnchorElement).href,
                category: a.textContent!.trim(),
            }));
        },
    );

    for (const { href, link, category } of sections) {
        await page.goto(link, { waitUntil: 'networkidle2' });
        const elements = await page.$x(
            '//div[contains(@class,"block")]//span[@class="pl-1"][text() = "FREE"]/../../*[1]',
        );
        for (const element of elements) {
            const name = (await (
                await element.getProperty('textContent')
            ).jsonValue()) as string;

            result.push({ name, link });
        }
    }

    return result;
}
