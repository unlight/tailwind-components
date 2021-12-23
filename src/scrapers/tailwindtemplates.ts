import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwindtemplates({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwindtemplates.io/templates', {
        waitUntil: 'networkidle0',
    });
    const urls = await page
        .$x(
            '//h2[contains(text(), "Categories")][contains(@class, "select-none")]/../..//a',
        )
        .then(elementsHandle => {
            return Promise.all(
                elementsHandle.map(elementHandle =>
                    elementHandle.evaluate(
                        element => (element as HTMLAnchorElement).href,
                    ),
                ),
            );
        });

    const getNames = async () => {
        return await page.$$eval('section h1', elements => {
            return elements.map(a => a.textContent!.trim());
        });
    };

    for (const url of urls) {
        await page.goto(url, { waitUntil: 'networkidle0' });
        const names = uniq(await getNames());
        for (const name of names) {
            result.push({ name, link: url });
        }
        // Go to next page
        for (let p = 2; ; p++) {
            await page.goto(`${url}&page=${p}`, { waitUntil: 'networkidle0' });
            const names = uniq(await getNames());
            if (names.length === 0) {
                break;
            }
            for (const name of names) {
                result.push({ name, link: `${url}&page=${p}` });
            }
        }
    }
    return result;
}
