import puppeteer from 'puppeteer';
import { getScrapers } from './scrapers';
import { promises as fs } from 'fs';
import { CompomentLink } from './types';
import _ from 'lodash';
import { plural } from 'pluralize';
import yargs from 'yargs';

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
    for await (const scraper of scrapers) {
        items.push(...(await scraper({ page })));
    }
    await browser.close();
    const content = await generate({ items });
    await fs.writeFile('README.md', content);
}

/**
 * TODO:
 * [ ] several categories
 * RESOURCES:
 * https://treact.owaiskhan.me/
 * https://windmill-dashboard.vercel.app/
 * https://tailwindadmin.netlify.app/index.html
 * https://cruip.com/
 * https://a17t.miles.land/
 * https://github.com/tailwindlabs/headlessui
 * https://devdojo.com/tailwindcss/components
 * https://zeroblack-c.github.io/jakarta-lte/
 * https://tailwindcss-custom-forms.netlify.app/
 */

type CategoryListValue = {
    keywords?: string[];
    parent?: string;
};

class Category {
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
    private _plural: string = plural(this.value);
    constructor(public readonly value: string, public readonly weight = 1) {}

    isMatch(name: string) {
        const testLower = name.toLowerCase();
        const testPlural = plural(name);
        return (
            testLower === this.value ||
            testPlural === this._plural ||
            (/\s+/.test(name) &&
                name
                    .split(/\s+/)
                    .map((s) => new Keyword(s.toLowerCase()))
                    .some((k) => k.isMatch(this.value)))
        );
    }
}

const categoryList = [
    new Category({
        name: 'Accordion',
        keywords: [new Keyword('accordion'), new Keyword('collapsible')],
    }),
    new Category({ name: 'Alert', keywords: [new Keyword('toast')] }),
    new Category({ name: 'Avatar' }),
    new Category({ name: 'Badge' }),
    new Category({ name: 'Breadcrumb' }),
    new Category({ name: 'Button' }),
    new Category({ name: 'Card' }),
    new Category({ name: 'Dropdown', keywords: [new Keyword('flyout'), new Keyword('fly-out')] }),
    new Category({ name: 'Form' }),
    new Category({ name: 'Contact', parent: 'Form', keywords: [new Keyword('contact form', 10)] }),
    new Category({ name: 'Login', parent: 'Form', keywords: [new Keyword('login form', 10)] }),
    new Category({ name: 'Footer' }),
    new Category({ name: 'Hero' }),
    new Category({ name: 'Modal', keywords: [new Keyword('modal', 2)] }),
    new Category({
        name: 'Navigation',
        keywords: [new Keyword('navbar'), new Keyword('navabr'), new Keyword('navbars with', 5)],
    }),
    new Category({ name: 'Page' }),
    new Category({ name: 'Pricing', parent: 'Page' }),
    new Category({ name: 'Pagination' }),
    new Category({ name: 'Sidebar', keywords: [new Keyword('side panel', 2)] }),
    new Category({ name: 'Step' }),
    new Category({ name: 'Switch', keywords: [new Keyword('toggle')] }),
    new Category({ name: 'Table' }),
    new Category({ name: 'Tab' }),
    new Category({ name: 'Timeline' }),
    new Category({ name: 'Other' }),
];

function createLink(item: CompomentLink) {
    return `* ${item.name} - ${item.link}`;
}

type GenerateArgs = {
    items: CompomentLink[];
};

export async function generate({ items }: GenerateArgs) {
    let content: string[] = ['# Tailwind Components', '## Table of Contents'];
    const categories = groupItems(items);

    for (const [name, items] of Object.entries(categories)) {
        const hasParent = Boolean(categoryList.find((c) => c.name === name)?.parent);
        let section = `##${hasParent ? '#' : ''} ${name}\n` + items.map(createLink).join('\n');
        content.push(section);
    }
    return content.join('\n');
}

function groupItems(items: CompomentLink[]) {
    const [defaultCategory] = categoryList.slice(-1);
    let result: { [name: string]: CompomentLink[] } = {};
    for (const item of items) {
        const matches = _(categoryList)
            .map((category) => ({ category, weight: category.weight(item.name) }))
            .orderBy(['weight'], ['desc'])
            .takeWhile((c) => c.weight > 0)
            .thru((collection) =>
                collection.length === 0 ? [{ category: defaultCategory, weight: 0 }] : collection,
            )
            .value();
        for (const { category } of matches.slice(0, 1)) {
            result[category.name] = (result[category.name] || []).concat(item);
        }
    }
    const categoryNames = categoryList.map((c) => c.name);
    result = _(result)
        .toPairs()
        .sortBy(([name]) => categoryNames.indexOf(name))
        .fromPairs()
        .value();

    return result;
}
