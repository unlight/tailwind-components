import { CompomentLink, ScraperArgs } from '../types';

export default async function lofiui({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://lofiui.co/');
    const sections = await page.$$('.grid > .items-center.justify-between');
    for (const section of sections) {
        const name = section.evaluate(s => {
            return s.querySelector('h4')!.textContent;
        });
        const link = section.evaluate(
            s => (s.querySelector('a[href][target=_blank]') as HTMLAnchorElement).href,
        );
        result.push({
            name: (await name) as string,
            link: removeRef(await link),
        });
    }
    return result;
}

export function removeRef(link: string) {
    const urlObject = new URL(link);
    urlObject.searchParams.delete('ref');
    return urlObject.toString();
}
