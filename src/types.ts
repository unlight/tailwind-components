import { Page } from 'puppeteer';

export type ScraperArgs = {
    page: Page;
};

export type CompomentLink = {
    category?: string;
    name: string;
    link: string;
};
