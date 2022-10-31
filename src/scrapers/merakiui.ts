import { CompomentLink, ScraperArgs } from '../types';
import _ from 'lodash';

export default async function merakiui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://merakiui.com/components', {
    waitUntil: 'networkidle0',
  });
  const sections = await page.$$eval('a[href^="/components/"]', elements =>
    elements.map(a => {
      const category = a.querySelector('h2')?.textContent?.trim();
      const link = (a as HTMLAnchorElement).href;

      return { category, link };
    }),
  );

  for (const section of sections) {
    await page.goto(section.link);
    let names = (await page.$$eval('main h2', elements => {
      return elements.map(e => e.textContent?.trim());
    })) as string[];
    names = _(names).filter(Boolean).uniq().value();

    for (const name of names) {
      result.push({
        category: section.category,
        name: `${section.category} ${name}`,
        link: section.link,
      });
    }
  }

  return result;
}
