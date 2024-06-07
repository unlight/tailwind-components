import { Keyword } from './keyword';
console.log('object')
export class Category {
    private _keywords: Keyword[] = [];
    public readonly name: string;
    public readonly parent?: string;
    constructor({
        name,
        parent,
        keywords,
    }: {
        name: string;
        parent?: string;
        keywords?: Keyword[];
    }) {
        this.name = name;
        this.parent = parent;
        if (!keywords) {
            keywords = [];
        }
        keywords.unshift(new Keyword(name));
        this._keywords = keywords;
    }

    weight(test: string) {
        return this._keywords.reduce((result, keyword) => {
            if (keyword.isMatch(test)) {
                result += keyword.weight;
            }
            return result;
        }, 0);
    }
}
