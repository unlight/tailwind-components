import { generate } from './program';
import { expect } from 'earljs';

it('get category exact match', async () => {
    const items = [
        {
            name: 'Card',
            link: 'https://tailwindcomponents.com/component/card-1',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching('\\* Card - https://tailwindcomponents.com/component/card-1'),
    );
});

it('get category from word', async () => {
    const items = [
        {
            name: 'curvy card',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(expect.stringMatching('\\* curvy card - https://example.com'));
});

it('get category exact pluralize', async () => {
    const items = [
        {
            name: 'Cards',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(expect.stringMatching('## Card\n\\* Cards - https://example.com'));
});

it('sorted categories', async () => {
    const items = [
        {
            name: 'Other',
            link: 'https://example.com',
        },
        {
            name: 'Card',
            link: 'https://example.com',
        },
        {
            name: 'Button',
            link: 'https://example.com',
        },
        {
            name: 'Tab',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching(
            `## Button\n\\* Button - https://example.com\n## Card\n\\* Card - https://example.com`,
        ),
    );
    expect(result).toEqual(
        expect.stringMatching(
            `## Tab\n\\* Tab - https://example.com\n## Other\n\\* Other - https://example.com`,
        ),
    );
});

it('keywords exact', async () => {
    const items = [
        {
            name: 'toast',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(expect.stringMatching(`## Alert\n\\* toast - https://example.com`));
});

it('keywords plurals', async () => {
    const items = [
        {
            name: 'Navbars With Search',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching(`## Navigation\n\\* Navbars With Search - https://example.com`),
    );
});

it('rank of keywords', async () => {
    const items = [
        {
            name: 'login form 1',
            link: 'link',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(expect.stringMatching(`### Login\n\\* login form 1 - link`));
});
