import { CompomentLink, ScraperArgs } from '../types';

const itemSelector = '#app > .min-h-screen > main > div a.flex.flex-col';
const nextPageSelector = 'a[title="Next »"]';

export default async function tailwindcomponents({ page }: ScraperArgs) {
    await page.goto('https://tailwindcomponents.com/components');

    const items: CompomentLink[] = [];
    let nextPage: string | null = '';

    do {
        if (!(await page.$(nextPageSelector))) {
            break;
        }
        nextPage = await page.$eval(nextPageSelector, (a) => a.getAttribute('href'));
        await page.goto(nextPage!);
        const nextItems = await page.$$eval(itemSelector, (elements) => {
            return elements.map((a) => ({
                name: a.querySelector('h4')!.textContent as string,
                link: `https://tailwindcomponents.com${a.getAttribute('href')}`,
            }));
        });
        items.push(...nextItems);
    } while (nextPage);

    return items;
}
