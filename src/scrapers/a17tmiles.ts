import { CompomentLink, ScraperArgs } from '../types';

export default async function a17tmiles({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://a17t.miles.land/', { waitUntil: 'networkidle0' });
    const result = await page.$$eval('main ul a.portal', elements => {
        return elements.map(x => {
            return {
                name: x.textContent!,
                link: (x as HTMLAnchorElement).href,
            };
        });
    });
    return result;
}
