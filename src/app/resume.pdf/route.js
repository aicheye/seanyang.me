import { inlineFetch } from '@/src/components/inline-fetch';

const UPSTREAM = 'https://docs.seanyang.me/Sean_Yang_resume/Sean_Yang_resume.pdf';

export async function GET(request) {
  return await inlineFetch(request, UPSTREAM);
}
