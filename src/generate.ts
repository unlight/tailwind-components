import { CompomentLink } from './types';
import stringSimilarity from 'string-similarity';
import _ from 'lodash';
import { plural } from 'pluralize';

/**
 * TODO:
 * - several categories
 * RESOURCES:
 * - https://github.com/aniftyco/awesome-tailwindcss
 * - https://github.com/tailwindlabs/headlessui
 */

const categoryList = new Map([
    ['Alert', ['toast']],
    ['Avatar', []],
    ['Breadcrumb', []],
    ['Button', []],
    ['Badge', []],
    ['Card', []],
    ['Dropdown', []],
    ['Form', []],
    ['Hero', []],
    ['Layout', []],
    ['Modal', []],
    ['Navigation', ['navbar']],
    ['Pagination', []],
    ['Sidebar', ['side panel']],
    ['Step', []],
    ['Switch', ['toggle']],
    ['Table', []],
    ['Tab', []],
    ['Timeline', []],
    ['Other', []],
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
        content.push(`## ${category}`);
        content.push(items.map(createLink).join('\n'));
    }
    return `# Tailwind Components\n## Table of Contents\n${content.join('\n')}`;
}

function getCategory(name: string) {
    for (const [category, keywords] of categoryList.entries()) {
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
                return wordLower === categoryLower || categoryPlural === plural(wordLower);
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
