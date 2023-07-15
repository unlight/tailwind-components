import { CompomentLink, ScraperArgs } from '../types';

export default async function tailwindcssforms({
  page,
}: ScraperArgs): Promise<CompomentLink[]> {
  const result: CompomentLink[] = [
    {
      name: 'Form elements',
      link: 'https://tailwindcss-forms.vercel.app/kitchen-sink.html',
    },
  ];
  return result;
}
