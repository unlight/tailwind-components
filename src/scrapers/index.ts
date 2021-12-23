import fs from 'fs';

type GetScrapersArgs = { name?: string };

export async function getScrapers(args: GetScrapersArgs) {
    if (args.name) {
        return [await import(`./${args.name}`).then(m => m.default)];
    }
    const files = fs
        .readdirSync(__dirname)
        .map(x => x.slice(0, -3))
        .filter(x => x !== 'index')
        .map(file => import(`./${file}`).then(x => x.default));

    return Promise.all(files);
}
