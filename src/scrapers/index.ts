type GetScrapersArgs = { name?: string };

export async function getScrapers(args: GetScrapersArgs) {
    if (args.name) {
        return [await import(`./${args.name}`).then((m) => m.default)];
    }
    const result = Promise.all([
        import('./tailwindcomponents').then((m) => m.default),
        import('./tailwindui').then((m) => m.default),
        import('./merakiui').then((m) => m.default),
        import('./sailui').then((m) => m.default),
        import('./tailblocks').then((m) => m.default),
        import('./kutty').then((m) => m.default),
        import('./gustui').then((m) => m.default),
        import('./lofiui').then((m) => m.default),
        import('./tailwindtoolbox').then((m) => m.default),
    ]);
    return result;
}
