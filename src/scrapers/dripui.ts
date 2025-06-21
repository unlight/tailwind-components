import { chain, trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function dripui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://dripui.vercel.app/', { waitUntil: 'networkidle2' });

  const categories = await page.$$eval('.component-listing-a', elements => {
    return elements.map(a => ({
      categoryLink: (a as HTMLAnchorElement).href,
    }));
  });

  for (const { categoryLink } of categories) {
    await page.goto(categoryLink, { waitUntil: 'networkidle2' });
    const category = await page.$eval('h1', h1 =>
      h1.textContent?.replace(' Components', ''),
    );
    const dirtyNames = await page.$$eval('h2,h3,p.pb-4.font-bold', elements =>
      elements.map(e => e.textContent?.trim()),
    );
    const name = chain(dirtyNames)
      .compact()
      .uniq()
      .map(x => trim(x, '. '))
      .join(' ')
      .value();

    result.push({ category, name: `${category} ${name}`, link: categoryLink });
  }

  return result;
}
