import { CompomentLink, ScraperArgs } from '../types';

export default async function ({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [];
    await page.goto('https://www.gustui.com/docs', {
        waitUntil: 'networkidle2',
    });
    const sectionLinks = await page.$$eval(
        'a[href^="/docs/application/"]',
        (elements) => elements.map((a) => a.getAttribute('href')),
    );
    for (const sectionLink of sectionLinks) {
        await page.goto(`https://www.gustui.com${sectionLink}`, {
            waitUntil: 'networkidle2',
        });
        const section = await page.$(`a[href="${sectionLink}"]`);
        const hrefs = (await section!
            .evaluateHandle((c) => {
                return Array.from(
                    c.nextElementSibling!.querySelectorAll(
                        'a[href^="/docs/application/"]',
                    ),
                ).map((element) => element.getAttribute('href'));
            })
            .then((hrefs) => hrefs.jsonValue())) as string[];
        for (const href of hrefs) {
            const link = `https://www.gustui.com${href}`;
            await page.goto(link, { waitUntil: 'networkidle2' });
            const category = await page.$eval('h1', (h) => h.textContent);
            const section = await page
                .$('h1')
                .then((x) => x!.evaluateHandle((h) => h.nextElementSibling));
            const names = (await section.evaluate((s) =>
                Array.from<Element>(
                    s.querySelectorAll('[id] span.text-lg'),
                ).map((x) => x.textContent!),
            )) as string[];
            for (const name of names) {
                result.push({ name: `${category} ${name}`, link });
            }
        }
    }
    return result;
}
