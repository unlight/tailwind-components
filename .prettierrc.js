module.exports = {
    printWidth: 100,
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    overrides: [
        {
            files: '*.{json,yml}',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
