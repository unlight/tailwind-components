import { CompomentLink, ScraperArgs } from '../types';

export default async function besoeasy({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://tailwind.besoeasy.com/', {
    waitUntil: 'networkidle0',
  });

  const categories = await page.$$eval('a[href].folder', elements => {
    const result: { name: string; href: string; categoryName?: string }[] = [];
    for (const element of elements) {
      result.push({
        name: element.textContent!,
        href: (element as HTMLAnchorElement).href,
      });
    }

    return result;
  });

  for (const category of categories) {
    await page.goto(category.href);
    const elements = await page.$$eval('a[href].file', elements => {
      return elements.map(a => ({
        href: a.href,
        name: a.getAttribute('href')!,
      }));
    });

    for (const { href, name: dirtyName } of elements) {
      const name = decodeURIComponent(dirtyName.replaceAll('/', '')).replaceAll(
        '.html',
        '',
      );

      result.push({
        category: category.name,
        name,
        link: href,
      });
    }
  }

  console.log('result', result);

  return result;
}
