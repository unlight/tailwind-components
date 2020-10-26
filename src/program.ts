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
};

async function program(options?: ProgramOptions) {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
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
 * [ ] ranks of matches
 * RESOURCES:
 * https://component.tailwindow.com/collection
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

const categoryList = new Map<string, CategoryListValue>([
    ['Accordion', { keywords: ['accordion', 'collapsible'] }],
    ['Alert', { keywords: ['toast'] }],
    ['Avatar', { keywords: [] }],
    ['Badge', { keywords: [] }],
    ['Breadcrumb', { keywords: [] }],
    ['Button', { keywords: [] }],
    ['Card', { keywords: [] }],
    ['Dropdown', { keywords: ['fly-out', 'flyout'] }],
    ['Form', { keywords: ['input'] }],
    ['Contact', { parent: 'Form', keywords: ['contact form'] }],
    ['Login', { parent: 'Form', keywords: ['login form'] }],
    ['Footer', { keywords: [] }],
    ['Hero', { keywords: [] }],
    ['Modal', { keywords: [] }],
    ['Navigation', { keywords: ['navbar', 'navabr'] }],
    ['Page', { keywords: ['layout'] }],
    ['Pricing', { parent: 'Page' }],
    ['Pagination', { keywords: [] }],
    ['Sidebar', { keywords: ['side panel'] }],
    ['Step', { keywords: [] }],
    ['Switch', { keywords: ['toggle'] }],
    ['Table', { keywords: [] }],
    ['Tab', { keywords: [] }],
    ['Timeline', { keywords: [] }],
    ['Other', { keywords: [] }],
]);

const categoryNames = [...categoryList.keys()];

type GenerateArgs = {
    items: CompomentLink[];
};

export async function generate({ items }: GenerateArgs) {
    const byCategory = _(items)
        .groupBy((item) => getCategory(item.category || item.name))
        .toPairs()
        .sortBy(([category]) => categoryNames.indexOf(category))
        .fromPairs()
        .value();
    const content: string[] = [];
    for (const [category, items] of Object.entries(byCategory)) {
        const { parent } = categoryList.get(category)!;
        let categoryHeading = `## ${category}`;
        if (parent) {
            categoryHeading = `#${categoryHeading}`;
        }
        content.push(categoryHeading);
        content.push(items.map(createLink).join('\n'));
    }
    return `# Tailwind Components\n## Table of Contents\n${content.join('\n')}`;
}

function getCategory(name: string) {
    for (const [category, mapValue] of categoryList.entries()) {
        const { keywords = [] } = mapValue;
        const categoryLower = category.toLowerCase();
        const categoryPlural = plural(categoryLower);
        if (
            categoryLower === name.toLowerCase() ||
            keywords.find((keyword) => {
                return (
                    keyword === name.toLowerCase() || plural(keyword) === plural(name.toLowerCase())
                );
            })
        ) {
            return category;
        }
        const words = name.split(/\s+/);
        if (
            words.find((word) => {
                const wordLower = word.toLowerCase();
                return (
                    wordLower === categoryLower ||
                    categoryPlural === plural(wordLower) ||
                    keywords.find((keyword) => {
                        return keyword === wordLower || plural(keyword) === wordLower;
                    })
                );
            })
        ) {
            return category;
        }
    }
    return 'Other';
}

function createLink(item: CompomentLink) {
    return `* ${item.name} - ${item.link}`;
}
