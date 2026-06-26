// Single source of truth lives in public/data so the data is also served
// statically over HTTP (e.g. for the SSH TUI at tui.seanyang.me).
import data from '../../public/data/socials.json'

export interface Social {
  name: string;
  label: string;
  url: string;
  handle: string;
}

export interface Email {
  label: string;
  href: string;
}

export const primaryEmail: Email = data.primaryEmail;

export const socials: Social[] = data.socials;
