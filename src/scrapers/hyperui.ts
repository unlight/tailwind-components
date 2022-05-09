import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function hyperui({ page }: ScraperArgs): Promise<CompomentLink[]> {
  await page.goto('https://hyperui.dev/', {
    waitUntil: 'networkidle0',
  });

  const result: CompomentLink[] = [];

  const categories = await page.$$eval('a[href^="/components/"]', elements => {
    return elements.map(a => ({
      categoryLink: (a as HTMLAnchorElement).href,
    }));
  });

  for (const { categoryLink } of categories) {
    await page.goto(categoryLink);
    const header = await page.$eval('h1', element => {
      return element.textContent;
    });
    const categoryName = header?.replaceAll('Components', '').trim();

    const getNames = await page.$$eval('h2', elements => {
      return elements.map(e => e.textContent);
    });

    const names = uniq(getNames);

    for (const name of names) {
      result.push({
        name: `${categoryName} ${name}`,
        link: categoryLink,
      });
    }
  }

  return result;
}
