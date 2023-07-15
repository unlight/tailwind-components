import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function floatui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  await page.goto('https://floatui.com/components', {
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
    const getNames = await page.$$eval('h3', elements => {
      return elements.map(e => e.textContent);
    });
    const names = uniq(getNames);

    for (const name of names) {
      result.push({
        name: `${name}`,
        link: categoryLink,
      });
    }
  }

  return result;
}
