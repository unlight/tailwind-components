import { uniq, trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function windstatic({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://windstatic.com/', {
    waitUntil: 'networkidle0',
  });
  const categories = await page.$$eval('h2 a[href]', elements => {
    return elements.map(a => ({
      categoryLink: (a as HTMLAnchorElement).href,
      categoryName: a.textContent!,
    }));
  });

  for (const { categoryName, categoryLink } of categories) {
    const category = trim(categoryName);
    result.push({
      category: category,
      name: category,
      link: categoryLink,
    });
  }

  return result;
}
