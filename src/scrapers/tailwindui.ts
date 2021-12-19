import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwindui({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    await page.goto('https://tailwindui.com/preview', { waitUntil: 'networkidle0' });
    const result = await page.$$eval(
        '.max-w-container > section[id^=component]',
        elements =>
            elements.map(element => {
                const category = Array.from(element.querySelectorAll('nav a'))
                    .map(x => x.textContent!.trim())
                    .join(' ');
                const name = element.querySelector('h2')!.textContent!.trim();
                return {
                    name: `${category} ${name}`,
                    link: (element.querySelector('h2 a') as HTMLAnchorElement).href,
                };
            }),
    );

    return result;
}
