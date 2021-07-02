import { CompomentLink, ScraperArgs } from '../types';

export default async function jakarta({ page }: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [
        {
            name: 'Dashboard widgets',
            link: 'https://zeroblack-c.github.io/jakarta-lte/',
        },
        {
            name: 'UI Buttons, Button Icon Rounded, Button Group',
            link: 'https://zeroblack-c.github.io/jakarta-lte/pages/components/button.html',
        },
        {
            name: 'Cards',
            link: 'https://zeroblack-c.github.io/jakarta-lte/pages/components/card.html',
        },
    ];
    return result;
}
