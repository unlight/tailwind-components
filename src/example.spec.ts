import assert from 'assert';
import { graphql } from 'graphql';
import schema from 'graphql-scraper';

it('example', async () => {
    const query = /* GraphQL */ `
        {
            page(url: "http://news.ycombinator.com") {
                items: queryAll(selector: "tr.athing") {
                    rank: text(selector: "td span.rank")
                    title: text(selector: "td.title a")
                    sitebit: text(selector: "span.comhead a")
                    url: attr(selector: "td.title a", name: "href")
                    #                     attrs: next {
                    #                         score: text(selector: "span.score")
                    #                         user: text(selector: "a:first-of-type")
                    #                         comments: text(selector: "a:nth-of-type(3)")
                    #                     }
                }
            }
        }
    `;
    const result = await graphql(schema, query);
    // console.log('result', JSON.stringify(result, null, 2));
    console.log('result', result.data.page);
});

it.skip('gustui', async () => {
    const query = /* GraphQL */ `
        {
            page(url: "https://www.gustui.com/docs") {
                items: queryAll(selector: "tr.athing") {
                    rank: text(selector: "td span.rank")
                    title: text(selector: "td.title a")
                    sitebit: text(selector: "span.comhead a")
                    url: attr(selector: "td.title a", name: "href")
                    attrs: next {
                        score: text(selector: "span.score")
                        user: text(selector: "a:first-of-type")
                        comments: text(selector: "a:nth-of-type(3)")
                    }
                }
            }
        }
    `;
    const result = await graphql(schema, query);
    // console.log('result', JSON.stringify(result, null, 2));
    console.log('result', result.data.page);
});
