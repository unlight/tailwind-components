import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwindesign({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://tailwindesign.com/components/alert', {
    waitUntil: 'networkidle0',
  });

  const links = await page.$$eval(
    'a[href^="/components"], a[href^="/advances"]',
    elements => {
      return elements.map(element => ({
        href: (element as HTMLAnchorElement).href,
        name: String(element.textContent).trim(),
      }));
    },
  );

  for (const { href, name } of links) {
    result.push({
      link: href,
      name,
    });
  }

  return result;
}
