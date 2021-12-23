import { CompomentLink } from './types';
import { Category } from './category';
import { Keyword } from './keyword';
import _ from 'lodash';

type GenerateArgs = {
    items: CompomentLink[];
};

const categoryList = [
    new Category({
        name: 'Accordion',
        keywords: [
            new Keyword('accordion'),
            new Keyword('collapsible'),
            new Keyword('collapse'),
        ],
    }),
    new Category({
        name: 'Alert/Notification',
        keywords: [
            new Keyword('Alert'),
            new Keyword('notification'),
            new Keyword('toast'),
            new Keyword('snackbar'),
            new Keyword('Callout'),
        ],
    }),
    new Category({ name: 'Avatar' }),
    new Category({ name: 'Badge' }),
    new Category({ name: 'Breadcrumb' }),
    new Category({ name: 'Button' }),
    new Category({ name: 'Card' }),
    new Category({
        name: 'Dashboard Widgets',
        keywords: [
            new Keyword('dashboard widgets', 2),
            new Keyword('statistic cards', 2),
            new Keyword('statistic widgets', 2),
            new Keyword('statistic'),
            new Keyword('weather ui component', 5),
        ],
    }),
    new Category({
        name: 'Slider/Carousel',
        keywords: [new Keyword('carousel'), new Keyword('slider')],
    }),
    new Category({
        name: 'Cookies',
        keywords: [new Keyword('Cookie Policy'), new Keyword('cookie')],
    }),
    new Category({
        name: 'Date/Time',
        keywords: [
            new Keyword('calendar'),
            new Keyword('datepicker'),
            new Keyword('date picker'),
            new Keyword('date picker'),
            new Keyword('timepicker'),
            new Keyword('time picker'),
        ],
    }),
    new Category({
        name: 'Dropdown',
        keywords: [
            new Keyword('flyout'),
            new Keyword('fly-out'),
            new Keyword('multi select'),
            new Keyword('drop down'),
            new Keyword('select'),
            new Keyword('popover'),
        ],
    }),
    new Category({
        name: 'Form',
        keywords: [
            new Keyword('input', 1),
            new Keyword('textfield', 2),
            new Keyword('text field', 2),
            new Keyword('textarea', 1),
            new Keyword('checkbox', 1),
        ],
    }),
    new Category({
        name: 'Contact',
        parent: 'Form',
        keywords: [new Keyword('contact form', 10)],
    }),
    new Category({
        name: 'Login',
        parent: 'Form',
        keywords: [
            new Keyword('login form', 10),
            new Keyword('sign-in', 5),
            new Keyword('sign in', 5),
            new Keyword('form login', 5),
            new Keyword('login with', 3),
        ],
    }),
    new Category({
        name: 'Register',
        parent: 'Form',
        keywords: [
            new Keyword('registration', 2),
            new Keyword('sign-up', 2),
            new Keyword('sign up', 2),
            new Keyword('signup', 2),
            new Keyword('auth components', 2),
        ],
    }),
    new Category({
        name: 'Search',
        parent: 'Form',
        keywords: [new Keyword('search box', 5)],
    }),

    new Category({
        name: 'Upload',
        parent: 'Form',
        keywords: [new Keyword('file upload', 8)],
    }),
    new Category({ name: 'Footer', keywords: [new Keyword('footer', 2)] }),
    new Category({ name: 'Hero' }),
    new Category({
        name: 'Loading/Spinner',
        keywords: [
            new Keyword('spinner'),
            new Keyword('loading'),
            new Keyword('loader dot'),
        ],
    }),
    new Category({
        name: 'Modal',
        keywords: [
            new Keyword('modal'),
            new Keyword('popup'),
            new Keyword('popup box', 2),
        ],
    }),
    new Category({
        name: 'Navigation/Header',
        keywords: [
            new Keyword('navigation'),
            new Keyword('header'),
            new Keyword('navbar', 2),
            new Keyword('nav menu'),
            new Keyword('navabr'),
            new Keyword('navbars with', 5),
            new Keyword('responsive navbar', 8),
            new Keyword('navigation bar', 10),
            new Keyword('navs'),
        ],
    }),
    new Category({ name: 'Page' }),
    new Category({
        name: '404',
        parent: 'Page',
        keywords: [new Keyword('404'), new Keyword('not found', 2)],
    }),
    new Category({
        name: 'Pricing',
        parent: 'Page',
        keywords: [new Keyword('pricing', 2)],
    }),
    new Category({
        name: 'Testimonial',
        parent: 'Page',
        keywords: [new Keyword('testimonial', 2), new Keyword('testimony', 2)],
    }),
    new Category({ name: 'Pagination' }),
    new Category({ name: 'Progress Bar', keywords: [new Keyword('progress')] }),
    new Category({
        name: 'Skeleton',
        keywords: [new Keyword('skeleton')],
    }),
    new Category({
        name: 'Sidebar',
        keywords: [
            new Keyword('side panel', 2),
            new Keyword('side nav', 2),
            new Keyword('slide-overs', 2),
            new Keyword('drawer', 2),
            new Keyword('sliding', 2),
            new Keyword('Sidenav', 2),
        ],
    }),
    new Category({ name: 'Comment', keywords: [new Keyword('comment form', 2)] }),
    new Category({ name: 'Step', keywords: [new Keyword('multistep')] }),
    new Category({
        name: 'Switch',
        keywords: [
            new Keyword('toggle'),
            new Keyword('toogle'),
            new Keyword('toggle button', 2),
        ],
    }),
    new Category({
        name: 'Tags',
        keywords: [
            new Keyword('tagline'),
            new Keyword('pills'),
            new Keyword('tag line'),
            new Keyword('chips'),
            new Keyword('label-tag'),
        ],
    }),
    new Category({
        name: 'Tooltips',
        keywords: [new Keyword('tooltip')],
    }),
    new Category({ name: 'Table' }),
    new Category({ name: 'List' }),
    new Category({ name: 'Tab' }),
    new Category({ name: 'Timeline' }),
    new Category({ name: 'Other' }),
];

export async function generate({ items }: GenerateArgs) {
    let content: string[] = ['# Tailwind Components', '## Table of Contents'];
    const categories = groupItems(items);

    for (const category of categoryList) {
        const items = categories[category.name] || [];
        const section =
            `##${category.parent ? '#' : ''} ${category.name}\n` +
            items.map(createLink).join('\n');
        content.push(section);
    }
    return content.join('\n');
}

export function groupItems(items: CompomentLink[]) {
    const [defaultCategory] = categoryList.slice(-1);
    const result: { [name: string]: CompomentLink[] } = {};
    for (const item of items) {
        const matches = _(categoryList)
            .map(category => ({
                category,
                weight: category.weight(item.name),
            }))
            .orderBy(['weight'], ['desc'])
            .takeWhile(c => c.weight > 0)
            .thru(collection =>
                collection.length === 0
                    ? [{ category: defaultCategory, weight: 0 }]
                    : collection,
            )
            .value();
        for (const { category } of matches.slice(0, 1)) {
            result[category.name] = (result[category.name] || []).concat(item);
        }
    }
    return result;
}

export function createLink({ name, link }: CompomentLink) {
    let description = link.split('//')[1];
    if (description.startsWith('www.')) {
        description = description.slice(4);
    }
    return `* ${name} - [${description}](${link})`;
}
