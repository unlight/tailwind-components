import { trim, snakeCase } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function besoeasy({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://tailwind.besoeasy.com/', {
    waitUntil: 'networkidle0',
  });
  const links = await page.$$eval('.container > a[href]', elements => {
    return elements.map(a => (a as HTMLAnchorElement).href);
  });
  for (const link of links) {
    const url = new URL(link);
    const name = snakeCase(url.pathname.replaceAll('.html', ''))
      .replaceAll('_', ' ')
      .toLowerCase();

    result.push({ link, name });
  }

  return result;
}
