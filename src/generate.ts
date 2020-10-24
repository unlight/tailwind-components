import { CompomentLink } from './types';
import stringSimilarity from 'string-similarity';
import _ from 'lodash';
import { plural } from 'pluralize';

/**
 * TODO:
 * [ ] several categories
 * [ ] sub categories forms -> contacts
 * [ ] ranks of matches
 * RESOURCES:
 * https://github.com/tailwindlabs/tailwindcss-custom-forms
 * https://www.tailwindtoolbox.com/starter-components
 * https://tailwindtemplates.io/
 * https://component.tailwindow.com/collection
 * https://treact.owaiskhan.me/
 * https://lofiui.co/
 * https://windmill-dashboard.vercel.app/
 * https://tailwindadmin.netlify.app/index.html
 * https://cruip.com/
 * https://a17t.miles.land/
 * https://github.com/tailwindlabs/headlessui
 * https://devdojo.com/tailwindcss/components
 */

type CategoryListValue = {
    keywords?: string[];
    parent?: string;
};

const categoryList = new Map<string, CategoryListValue>([
    ['Alert', { keywords: ['toast'] }],
    ['Avatar', { keywords: [] }],
    ['Breadcrumb', { keywords: [] }],
    ['Button', { keywords: [] }],
    ['Badge', { keywords: [] }],
    ['Card', { keywords: [] }],
    ['Dropdown', { keywords: ['fly-out', 'flyout'] }],
    ['Form', { keywords: ['input'] }],
    ['Footer', { keywords: [] }],
    ['Hero', { keywords: [] }],
    ['Modal', { keywords: [] }],
    ['Navigation', { keywords: ['navbar'] }],
    ['Page', { keywords: ['layout'] }],
    // ['Login', { parent: 'Page' }],
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
        // const { parent } = categoryList.get(category)!;
        const categoryHeading = `## ${category}`;
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
