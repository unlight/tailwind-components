import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://tailwindui.com/preview');
    return page.$$eval('div.mt-16 > div.space-y-16 > div', (elements) =>
        elements.map((element) => {
            const category = element.querySelector('h2')!.textContent!.trim();
            const name = element.querySelector('h3')!.textContent!.trim();
            return {
                name: `${category} ${name}`,
                link: `https://tailwindui.com/preview${element
                    .querySelector('h3 a')!
                    .getAttribute('href')}`,
            };
        }),
    );
}
