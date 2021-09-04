import { snakeCase } from 'lodash';
import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwinduikit({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://tailwinduikit.com/components', {
        waitUntil: 'networkidle0',
    });
    const [elementHandle] = await page.$x(
        "(//p[text()='Web application UI Kit'])[2]/..",
    );
    await elementHandle.focus();
    await elementHandle.click();
    const sections = await page.$$eval('a[href^="/components/webapp/"]', elements => {
        return elements.map(a => {
            return {
                href: (a as HTMLAnchorElement).href,
                name: a.querySelector('button')!.textContent,
            };
        });
    });
    for (const section of sections) {
        await page.goto(section.href, { waitUntil: 'networkidle0' });
        const components = await page.$$eval('.w-full > .mt-8', elements =>
            elements.map(element => {
                const hasPricing = Boolean(element.querySelector('a[href="/pricing"]'));
                const name = element.querySelector('h2')!.textContent!;
                return { isFree: !hasPricing, name };
            }),
        );
        for (const component of components.filter(x => x.isFree)) {
            const link = section.href + '#' + snakeCase(component.name);
            const name = section.name + ' ' + component.name;

            result.push({ link, name });
        }
    }

    return result;
}
