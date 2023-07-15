import { trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';
import { setTimeout } from 'timers/promises';

export default async function dqlkab({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto(
    'https://codepen.io/collection/DqLkab?grid_type=list&sort_order=desc&sort_by=id',
    {
      waitUntil: 'networkidle0',
    },
  );

  while (true) {
    const elements = await page.$$eval(
      '[data-component=PaginationContainer] th a[href]',
      elements =>
        elements.map(element => {
          const name = element.textContent!;
          const link = (element as HTMLAnchorElement).href;
          return { name, link };
        }),
    );

    for (const { name, link } of elements) {
      result.push({
        name: name,
        link: link,
      });
    }

    const next = await page.$('[data-direction="next"]');

    if (!next) {
      break;
    }

    await next.click();
  }

  return result;
}
