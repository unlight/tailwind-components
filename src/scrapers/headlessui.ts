import { CompomentLink, ScraperArgs } from '../types';

export default async function headlessui({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto(
        'https://github.com/tailwindlabs/headlessui/tree/develop/packages/%40headlessui-react',
    );

    const elements = await page.$x(
        '//h2[text()="Components"]/following-sibling::ul[1]/li',
    );
    for (const elementHandle of elements) {
        const { link, name } = await elementHandle.$eval('a', x => ({
            link: (x as HTMLAnchorElement).href,
            name: x.textContent!,
        }));
        result.push({ link, name });
    }

    return result;
}
