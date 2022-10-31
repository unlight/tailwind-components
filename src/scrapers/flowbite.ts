import { CompomentLink, ScraperArgs } from '../types';

export default async function flowbite({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://flowbite.com/docs/components/alerts/', {
    waitUntil: 'networkidle0',
  });
  const links = await page.$$eval('a[href^="/docs/components/"]', elements => {
    return elements.map(a => {
      const category = a.textContent?.replace(' NEW', '').trim();
      return {
        category,
        link: (a as HTMLAnchorElement).href,
      };
    });
  });

  for (const { category, link } of links.slice(0, 2)) {
    await page.goto(link, { waitUntil: 'networkidle0' });
    const names = (
      await page.$$eval('main h2', elements => {
        return elements.map(e => e.childNodes[0].textContent?.trim());
      })
    ).filter(Boolean) as string[];

    for (const name of names) {
      result.push({ category, name: `${category} ${name}`, link });
    }
  }

  return result;
}
