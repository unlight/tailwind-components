import { promises as fs } from 'fs';
import _ from 'lodash';
import { CompomentLink } from './types';
import { generateMarkdown } from './generate';

program();

async function program() {
    const items: CompomentLink[] = require(process.cwd() + '/components.json');
    const content = await generateMarkdown({ items });
    await fs.writeFile(process.cwd() + '/README.md', content);
}
