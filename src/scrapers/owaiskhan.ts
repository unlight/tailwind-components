import { CompomentLink, ScraperArgs } from '../types';

export default async function ({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://treact.owaiskhan.me/', { waitUntil: 'networkidle0' });
    await autoScroll(page);
    const sections = await page.$$(
        '#componentDemos [class^="MainLandingPage__ComponentsContainer"] [class^="MainLandingPage___StyledDiv2"]',
    );
    for (const section of sections) {
        const heading = await section.evaluate((s) => s.querySelector('h3')?.textContent);
        const componentHeadings = await section.$$('[class^="MainLandingPage__ComponentHeading"]');
        for (const componentHeading of componentHeadings) {
            const name = componentHeading!.$eval('h6', (x) => x.textContent);
            const link = componentHeading!.$eval('a[href', (x) => (x as HTMLAnchorElement).href);
            result.push({
                name: `${heading} ${await name}`,
                link: await link,
            });
        }
    }

    return result;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 800;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
