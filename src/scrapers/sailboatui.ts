import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function sailboatui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://sailboatui.com/docs/components/accordion/', {
    waitUntil: 'networkidle0',
  });
  const categories = await page.$$eval(
    'a[href^="/docs/components/"]',
    elements => {
      return elements.map(a => ({
        categoryLink: (a as HTMLAnchorElement).href,
        categoryName: a.textContent,
      }));
    },
  );
  (
    await page.$$eval('a[href^="/docs/forms/"]', elements => {
      return elements.map(a => ({
        categoryLink: (a as HTMLAnchorElement).href,
        categoryName: a.textContent,
      }));
    })
  ).forEach(element => {
    categories.push(element);
  });

  for (const { categoryName, categoryLink } of categories) {
    await page.goto(categoryLink);
    const elements = await page.$$eval('h2 a[href]', elements => {
      return elements.map(a => ({
        href: (a as HTMLAnchorElement).href,
        name: a.textContent,
      }));
    });

    for (const element of elements) {
      result.push({
        category: categoryName!,
        name: element.name!,
        link: element.href,
      });
    }
  }

  return result;
}
