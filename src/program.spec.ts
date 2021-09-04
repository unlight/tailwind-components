import { Category, createLink, generate, groupItems } from './program';
import expect from 'expect';

const link = 'https://example.com';

it('match words', () => {
    const category = new Category({ name: 'Button' });
    const result = category.weight('Button Component');
    expect(result).toEqual(1);
});

it('match plural words', () => {
    const category = new Category({ name: 'Button' });
    const result = category.weight('Buttons with foo');
    expect(result).toEqual(1);
});

it('group items general', () => {
    const result = groupItems([{ name: 'Button Component', link }]);
    expect(result).toEqual({ Button: [{ link, name: 'Button Component' }] });
});

it('group items phrase', () => {
    const result = groupItems([{ name: 'Login form 1', link }]);
    expect(result).toEqual({ Login: [{ link, name: 'Login form 1' }] });
});

it('get category exact match', async () => {
    const items = [
        {
            name: 'Card',
            link: 'https://tailwindcomponents.com/component/card-1',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching(
            '\\* Card - https://tailwindcomponents.com/component/card-1',
        ),
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
    expect(result).toEqual(
        expect.stringMatching('\\* curvy card - https://example.com'),
    );
});

it('get category exact pluralize', async () => {
    const items = [
        {
            name: 'Cards',
            link: 'https://example.com',
        },
    ];
    const result = await generate({ items });
    expect(result).toEqual(
        expect.stringMatching('## Card\n\\* Cards - https://example.com'),
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
    expect(result).toEqual(
        expect.stringMatching(`## Alert\n\\* toast - https://example.com`),
    );
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
        expect.stringMatching(
            `## Navigation\n\\* Navbars With Search - https://example.com`,
        ),
    );
});

it('createLink', () => {
    expect(createLink({ name: 'wip', link: 'http://example.com/aaa' })).toEqual(
        '* wip - [example.com/aaa](http://example.com/aaa)',
    );
    expect(createLink({ name: 'wip', link: 'http://www.example.com/aaa' })).toEqual(
        '* wip - [example.com/aaa](http://www.example.com/aaa)',
    );
});
