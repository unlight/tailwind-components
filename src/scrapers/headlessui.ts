import assert from 'assert';
import { CompomentLink, ScraperArgs } from '../types';

export default async function headlessui({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [];
  await page.goto('https://headlessui.com/', { waitUntil: 'networkidle0' });

  const elements = await page.$$('.grid a[class]');

  for (const elementHandle of elements) {
    const name = await elementHandle.$eval(
      ':scope > div:last-child',
      e => e.textContent,
    );
    assert.ok(name);
    const link = await elementHandle.evaluate(a => a.href);

    result.push({ link, name });
  }

  return result;
}
