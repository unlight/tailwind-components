import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwindelements({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://tw-elements.com/quick-start/', {
    waitUntil: 'domcontentloaded',
  });
  const links = await page.$$eval('a[href^="/docs/standard/"]', elements => {
    return elements.map(a => ({
      link: (a as HTMLAnchorElement).href,
      category: a.textContent!.trim(),
    }));
  });
  for (const { link, category } of links) {
    await page.goto(link, { waitUntil: 'domcontentloaded' });
    let names = await page.$$eval(
      'main section > h2[id]:not([id=""]',
      elements => {
        return elements.map(element => element.textContent!.trim());
      },
    );
    names = uniq(names.filter(Boolean));
    for (let name of names) {
      if (!name.startsWith(category)) {
        name = `${category} ${name}`;
      }
      result.push({ link, name });
    }
  }

  return result;
}
