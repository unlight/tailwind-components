import puppeteer from 'puppeteer';
import { getScrapers } from './scrapers';
import { promises as fs } from 'fs';
import { CompomentLink } from './types';
import _ from 'lodash';
import { plural } from 'pluralize';
import yargs from 'yargs';

/**
 * RESOURCES:
 * https://www.vechaiui.com/
 * https://tailwind-css-components.appseed.us/
 * https://tailwindcss-custom-forms.netlify.app/
 * https://kamona-wd.github.io/kwd-dashboard/
 * https://tailwinduikit.com/components
 * https://www.creative-tim.com/
 */

if (require.main?.filename === __filename) {
    program(yargs.argv as ProgramOptions);
}

type ProgramOptions = {
    only?: string;
    slowmo?: number;
};

async function program(options?: ProgramOptions) {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: options?.slowmo,
        defaultViewport: null,
        args: ['--start-maximized'],
    });
    const [page] = await browser.pages();
    const scrapers = await getScrapers({ name: options?.only });
    const items: CompomentLink[] = [];
    for await (const [index, scraper] of scrapers.entries()) {
        let tryCount = 3;
        while (--tryCount >= 0) {
            process.stdout.write(
                `\nProgress: ${scraper.name} ${index + 1}/${scrapers.length} ...`,
            );
            try {
                let scraperItems = await scraper({ page });
                process.stdout.write(` +${scraperItems.length}`);
                items.push(...scraperItems);
                break;
            } catch (error) {
                console.error(error);
                console.log(`Tries left: ${tryCount}`);
            }
        }
        process.stdout.write(` Total: ${items.length}`);
    }
    await browser.close();
    const content = await generate({ items });
    await fs.writeFile('README.md', content);
}

export class Category {
    private _keywords: Keyword[] = [];
    public readonly name: string;
    public readonly parent?: string;
    constructor({
        name,
        parent,
        keywords,
    }: {
        name: string;
        parent?: string;
        keywords?: Keyword[];
    }) {
        this.name = name;
        this.parent = parent;
        if (!keywords) {
            keywords = [];
        }
        keywords.unshift(new Keyword(name));
        this._keywords = keywords;
    }

    weight(test: string) {
        return this._keywords.reduce((result, keyword) => {
            if (keyword.isMatch(test)) {
                result += keyword.weight;
            }
            return result;
        }, 0);
    }
}

class Keyword {
    private plural: string;
    public readonly value: string;
    constructor(value: string, public readonly weight = 1) {
        this.value = value.toLowerCase();
        this.plural = plural(this.value);
    }

    isMatch(test: string) {
        const testLower = test.toLowerCase();
        const testPlural = plural(testLower);
        return (
            testLower === this.value ||
            testPlural === this.plural ||
            this.matchPhrase(test) ||
            this.matchWord(test)
        );
    }

    matchPhrase(test: string) {
        const testLower = test.toLowerCase();
        return testLower.includes(this.value);
    }

    matchWord(test: string) {
        const result =
            test
                .split(/\s+/)
                .map(s => s.toLowerCase())
                .find(s => {
                    return s === this.value || plural(s) === this.plural;
                }) !== undefined;
        return result;
    }
}

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
        name: 'Sidebar',
        keywords: [
            new Keyword('side panel', 2),
            new Keyword('side nav', 2),
            new Keyword('slide-overs', 2),
            new Keyword('drawer', 2),
            new Keyword('sliding', 2),
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

export function createLink({ name, link }: CompomentLink) {
    let description = link.split('//')[1];
    if (description.startsWith('www.')) {
        description = description.slice(4);
    }
    return `* ${name} - [${description}](${link})`;
}

type GenerateArgs = {
    items: CompomentLink[];
};

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
