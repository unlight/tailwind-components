import expect from 'expect';
import { createLink, generateJson, generateMarkdown, groupItems } from './generate';
import { Category } from './category';

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
            link: 'https://example.com',
        },
    ];
    const result = await generateMarkdown({ items });
    expect(result).toEqual(
        expect.stringContaining('* Card: [example.com](https://example.com)'),
    );
});

it('get category from word', async () => {
    const items = [
        {
            name: 'curvy card',
            link: 'https://example.com',
        },
    ];
    const result = await generateMarkdown({ items });
    expect(result).toEqual(
        expect.stringContaining('curvy card: [example.com](https://example.com)'),
    );
});

it('get category exact pluralize', async () => {
    const items = [
        {
            name: 'Cards',
            link: 'https://example.com',
        },
    ];
    const result = await generateMarkdown({ items });

    expect(result).toEqual(expect.stringContaining(`## Card`));
    expect(result).toEqual(
        expect.stringContaining(`* Cards: [example.com](https://example.com)`),
    );
});

it('keywords exact', async () => {
    const items = [
        {
            name: 'toast',
            link: 'https://example.com',
        },
    ];
    const result = await generateMarkdown({ items });

    expect(result).toEqual(expect.stringContaining(`## Alert`));
    expect(result).toEqual(
        expect.stringContaining(`* toast: [example.com](https://example.com)`),
    );
});

it('keywords plurals', async () => {
    const items = [
        {
            name: 'Navbars With Search',
            link: 'https://example.com',
        },
    ];
    const result = await generateMarkdown({ items });

    expect(result).toEqual(expect.stringContaining(`## Navigation/Header`));
    expect(result).toEqual(
        expect.stringContaining(
            `Navbars With Search: [example.com](https://example.com)`,
        ),
    );
});

it('createLink', () => {
    expect(createLink({ name: 'wip', link: 'http://example.com/aaa' })).toEqual(
        '* wip: [example.com/aaa](http://example.com/aaa)',
    );
    expect(createLink({ name: 'wip', link: 'http://www.example.com/aaa' })).toEqual(
        '* wip: [example.com/aaa](http://www.example.com/aaa)',
    );
});

it('only link for several components', async () => {
    const items = [
        {
            name: 'Other',
            link: 'https://example.com/1',
        },
        {
            name: 'Dummy',
            link: 'https://example.com/1',
        },
    ];
    const result = await generateMarkdown({ items });
    expect(result).toEqual(
        expect.stringContaining(
            '* Other, Dummy: [example.com/1](https://example.com/1)',
        ),
    );
});

it('generateJson 1', async () => {
    const items = [
        {
            name: 'Dummy',
            link: 'https://example.com/1',
        },
        {
            name: 'Dummy2',
            link: 'https://example.com/1',
        },
    ];
    const result = await generateJson({ items });
});
