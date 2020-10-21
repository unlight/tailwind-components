export async function getScrapers() {
    const result = Promise.all([import('./tailwindcomponents').then((m) => m.default)]);
    return result;
}
