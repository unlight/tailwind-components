import { trim } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function besoeasy({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://tailwind.besoeasy.com/', {
    waitUntil: 'networkidle0',
  });
  const elements = await page.$$eval('.m-5 a[href]', elements => {
    let categoryName: string | undefined;
    const result: { name: string; href: string; categoryName?: string }[] = [];
    for (const element of elements) {
      // Find parent
      for (
        let e = element.parentElement as Element | null | undefined;
        e;
        e = e?.previousElementSibling
      ) {
        const foundParent = e.getAttribute('class')?.includes('text-4xl');
        if (foundParent) {
          categoryName = e.textContent!;
          break;
        }
      }

      result.push({
        name: element.textContent!,
        href: (element as HTMLAnchorElement).href,
        categoryName,
      });
    }

    return result;
  });

  for (const element of elements) {
    result.push({
      name: trim(`${element.categoryName} ${element.name}`),
      link: element.href,
      category: element.categoryName,
    });
  }

  return result;
}
