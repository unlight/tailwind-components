import { trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function besoeasy({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  // todo: fix me
  const result: CompomentLink[] = [];
  await page.goto('https://tailwind.besoeasy.com/', {
    waitUntil: 'networkidle0',
  });
  const sections = await page.$$eval('#files > li a[href]', elements => {
    return elements.map(a => ({
      link: (a as HTMLAnchorElement).href,
      category: a.textContent!.trim(),
    }));
  });
  for (const section of sections) {
    await page.goto(section.link, { waitUntil: 'networkidle0' });
    const links = await page.$$eval('#files > li a[href]', elements => {
      return elements.map(element => {
        const a = element as HTMLAnchorElement;
        return { href: a.href, title: a.title };
      });
    });
    for (let { href, title } of links) {
      const name = trim(title, '/').replace(/\//g, ' ');
      result.push({ link: href, name });
    }
  }

  return result;
}
