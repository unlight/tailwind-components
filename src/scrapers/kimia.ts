import { uniq } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function kimia({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://kimia-ui.vercel.app/components/accordion', {
    waitUntil: 'networkidle0',
  });
  const sections = await page.$$eval(
    'a.font-medium[href^="/components/"]',
    elements => {
      return elements.map(a => ({
        link: (a as HTMLAnchorElement).href,
        category: a.textContent!.trim(),
      }));
    },
  );

  for (const { link, category } of sections) {
    await page.goto(link, { waitUntil: 'networkidle0' });
    const category = await (
      await page.$('main h1')
    )?.evaluate(x => x.textContent);

    if (!category) {
      continue;
    }

    let names = await page.$$eval('main h2.font-bold', elements => {
      return elements.map(element => element.textContent!.trim());
    });
    names = uniq(names);

    if (names.length === 0) {
      result.push({ link, name: category });
      continue;
    }

    for (let name of names) {
      if (!name.startsWith(category)) {
        name = `${category} ${name}`;
      }
      result.push({ link, name });
    }
  }

  return result;
}
