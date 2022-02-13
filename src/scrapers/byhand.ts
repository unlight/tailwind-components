import { CompomentLink, ScraperArgs } from '../types';

export default async function articles({
    page,
}: ScraperArgs): Promise<CompomentLink[]> {
    const result: CompomentLink[] = [
        {
            name: 'Contact Me Card',
            link: 'https://codepen.io/stackdiary/pen/zYPozeb',
        },
        {
            name: 'Digital Product Card',
            link: 'https://codepen.io/stackdiary/pen/MWObvgz',
        },
        {
            name: 'Product Features Card',
            link: 'https://codepen.io/stackdiary/pen/QWOGMGV',
        },
        {
            name: 'Product Pricing Card',
            link: 'https://codepen.io/stackdiary/pen/BamQdZr',
        },
        {
            name: 'Membership Pricing Card',
            link: 'https://codepen.io/stackdiary/pen/xxPRLjV',
        },
        {
            name: 'Testimonial Card',
            link: 'https://codepen.io/stackdiary/pen/jOaVLQR',
        },
        {
            name: 'Blog Post Card',
            link: 'https://codepen.io/stackdiary/pen/rNYWzEx',
        },
        {
            name: 'Instagram Card',
            link: 'https://codepen.io/stackdiary/pen/VwrmWxw',
        },
        {
            name: 'eCommerce Product Card',
            link: 'https://codepen.io/stackdiary/pen/XWzNedN',
        },
        {
            name: 'Latest Project Card',
            link: 'https://codepen.io/stackdiary/pen/yLPVzbe',
        },
        {
            name: 'Statistics Card',
            link: 'https://codepen.io/stackdiary/pen/MWObENo',
        },
        {
            name: 'Blog Article Card',
            link: 'https://codepen.io/stackdiary/pen/GRONyKr',
        },
        {
            name: 'Tweet Card (Small)',
            link: 'https://codepen.io/stackdiary/pen/PoObjxW',
        },
        {
            name: 'Team Members Card',
            link: 'https://codepen.io/stackdiary/pen/vYWypNy',
        },
        {
            name: 'Cookie Notice Card',
            link: 'https://codepen.io/stackdiary/pen/bGYBawv',
        },
    ];
    return result;
}
