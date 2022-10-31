import _ from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function daisyui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://daisyui.com/components/button', {
    waitUntil: 'networkidle2',
  });
  const links = await page.$$eval('li > a[href^="/components/"]', elements => {
    return elements.map(a => ({
      href: a.getAttribute('href'),
      link: (a as HTMLAnchorElement).href,
      category: a.textContent!.trim(),
    }));
  });

  // ProtocolError: Protocol error (Page.createIsolatedWorld): No frame for given id found
  for (const { href, link, category } of links) {
    await page.goto(link, { waitUntil: 'load' });
    const names = (await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('.component-preview-title'),
      ).map(element => element?.textContent?.trim());
    })) as string[];
    const nextNames = _(names).filter(Boolean).uniq().value();
    for (let name of nextNames) {
      if (!name.startsWith(category)) {
        name = `${category} ${name}`;
      }
      result.push({ link, name });
    }
  }

  return result;
}
