import type { VercelRequest, VercelResponse } from '@vercel/node';
import { inlineFetch } from './_inline-fetch.ts';

const UPSTREAM = 'https://docs.seanyang.me/Sean_Yang_resume/Sean_Yang_resume.pdf';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await inlineFetch(req, res, UPSTREAM);
}
