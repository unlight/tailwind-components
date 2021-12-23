import { plural } from 'pluralize';

export class Keyword {
    private plural: string;
    public readonly value: string;
    constructor(value: string, public readonly weight = 1) {
        this.value = value.toLowerCase();
        this.plural = plural(this.value);
    }

    isMatch(test: string) {
        const testLower = test.toLowerCase();
        const testPlural = plural(testLower);
        return (
            testLower === this.value ||
            testPlural === this.plural ||
            this.matchPhrase(test) ||
            this.matchWord(test)
        );
    }

    matchPhrase(test: string) {
        const testLower = test.toLowerCase();
        return testLower.includes(this.value);
    }

    matchWord(test: string) {
        const result =
            test
                .split(/\s+/)
                .map(s => s.toLowerCase())
                .find(s => {
                    return s === this.value || plural(s) === this.plural;
                }) !== undefined;
        return result;
    }
}
