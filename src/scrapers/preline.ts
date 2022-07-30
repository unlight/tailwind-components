import { CompomentLink, ScraperArgs } from '../types';

const componentsSections = [
  'Base Components',
  'Navigations',
  'Basic Forms',
  'Overlays',
  'Tables',
];

export default async function preline({ page }: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://preline.co/docs/index.html', {
    waitUntil: 'networkidle2',
  });
  const componentLinks = await page.$$eval(
    '#docs-sidebar nav > ul',
    (elements, componentsSections) => {
      const result: CompomentLink[] = [];
      for (const element of elements) {
        const text = element.querySelector('h5')?.textContent;
        if (text && (componentsSections as string[]).includes(text)) {
          element.querySelectorAll('li a[href]').forEach((element: Element) => {
            const anchor = element as HTMLAnchorElement;
            if (anchor.textContent) {
              result.push({ name: anchor.textContent, link: anchor.href });
            }
          });
        }
      }

      return result;
    },
    componentsSections,
  );

  for (const { link, name } of componentLinks) {
    await page.goto(link, {
      waitUntil: 'networkidle2',
    });
    const variantions = await page.$$eval('#scrollspy h2', elements => {
      return elements
        .map(element => {
          return element.textContent?.trim();
        })
        .filter(Boolean);
    });

    for (const variantion of variantions) {
      const betterName = `${name} ${variantion}`
        .replace(/[<>#]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      result.push({
        name: `${name} ${variantion}`.trim(),
        link,
      });
    }
  }

  return result;
}
