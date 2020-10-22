export async function getScrapers() {
    const result = Promise.all([
        import('./tailwindui').then((m) => m.default),
        import('./tailwindcomponents').then((m) => m.default),
    ]);
    return result;
}
