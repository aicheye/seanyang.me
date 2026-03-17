interface Social {
  label: string;
  href: string;
}

interface Email {
  label: string;
  href: string;
}

export const primaryEmail: Email = {
  label: "sean@seanyang.me",
  href: "mailto:sean@seanyang.me",
};

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/aicheye" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/syang07/" },
  { label: "Twitter/X", href: "https://x.com/aicheye" },
  { label: "Instagram", href: "https://instagram.com/seanyang_esports_gaming" },
  { label: "Letterboxd", href: "https://letterboxd.com/aicheye/" },
  { label: "Bluesky", href: "https://bsky.app/profile/seanyang.me" },
];
