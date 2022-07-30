import assert from 'assert';
import { CompomentLink, ScraperArgs } from '../types';

const itemSelector = '#app main .grid > div > div.flex a[href^="/component"]';
const nextPageSelector = 'a[title="Next »"]';

export default async function tailwindcomponents({ page }: ScraperArgs) {
  await page.goto('https://tailwindcomponents.com/components', {
    waitUntil: 'networkidle2',
  });
  page.setDefaultNavigationTimeout(60_000);

  const items: CompomentLink[] = [];
  let nextPage: string | null = '';

  do {
    if (!(await page.$(nextPageSelector))) {
      break;
    }
    nextPage = await page.$eval(nextPageSelector, a => a.getAttribute('href'));
    await page.goto(nextPage!, { waitUntil: 'networkidle2', timeout: 60_000 });
    const nextItems = await page.$$eval(itemSelector, elements => {
      return elements.map(a => ({
        name: a.textContent as string,
        link: (a as HTMLAnchorElement).href,
      }));
    });
    assert(nextItems.length);
    items.push(...nextItems);
  } while (nextPage);

  return items;
}
