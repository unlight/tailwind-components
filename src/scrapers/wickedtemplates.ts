import assert from 'assert';
import { CompomentLink, ScraperArgs } from '../types';

export default async function wickedtemplates({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://www.wickedblocks.dev/original', {
    waitUntil: 'networkidle0',
  });
  const blocks = await page.$$eval('a[href*=block]', elements =>
    elements.map(a => a.href),
  );

  for (const link of blocks) {
    await page.goto(link);
    const name = await page.$eval('h1', e => e.textContent?.trim());

    assert.ok(name);

    result.push({
      name,
      link,
    });
  }

  return result;
}
