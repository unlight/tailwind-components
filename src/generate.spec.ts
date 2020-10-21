import { generate } from './generate';
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

it('sorted alphabetically', async () => {
    const items = [
        {
            name: 'Cards',
            link: 'https://example.com',
        },
        {
            name: 'Button',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching(
            '## Button\n\\* Button - https://example.com\n## Card\n\\* Cards - https://example.com',
        ),
    );
});
