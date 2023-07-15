import { CompomentLink, ScraperArgs } from '../types';

// export default async function devdojo({ page }: ScraperArgs): Promise<CompomentLink[]> {
//     await page.goto('https://devdojo.com/tailwindcss/components', {
//         waitUntil: 'networkidle0',
//     });

//     while (true) {
//         const isEnd = await page.evaluate(() => {
//             const node = document
//                 .evaluate(
//                     '//*[text()="Those are all the components we have for now."]',
//                     document,
//                 )
//                 .iterateNext();
//             return node?.textContent;
//         });
//         if (isEnd) {
//             break;
//         }
//         await page.evaluate(() => {
//             const node = document
//                 .evaluate('//*[text()="Load More"]', document)
//                 .iterateNext();
//             (node as HTMLElement)?.click();
//         });
//     }
//     const result = page.$$eval('.container[x-data]', elements =>
//         elements.map(element => {
//             const name = element.querySelector('.w-full.text-center')?.textContent!;
//             const link = (element.querySelector('a[href]') as HTMLAnchorElement).href;
//             return { name, link };
//         }),
//     );

//     return result;
// }
