// TODO(content): confirm real tier names/prices/perks and add real sponsor
// logos before launch. See CLAUDE.md "Content TODOs".
export type SponsorTier = {
  name: string;
  price: string;
  perks: string[];
};

export const sponsorTiers: SponsorTier[] = [
  {
    name: "Community",
    price: "$250",
    perks: [
      "[Logo on event signage]",
      "[Mention in the post-event recap email]",
    ],
  },
  {
    name: "Supporter",
    price: "$1,000",
    perks: [
      "[Everything in Community]",
      "[Logo on event t-shirts]",
      "[Shoutout on our social media]",
    ],
  },
  {
    name: "Presenting",
    price: "$5,000",
    perks: [
      "[Everything in Supporter]",
      "[Named as Presenting Sponsor in all event marketing]",
      "[Booth space at the event]",
    ],
  },
];

export type Sponsor = {
  name: string;
  logoSrc: string;
};

// No confirmed sponsors yet — add real logos here as they're secured.
export const currentSponsors: Sponsor[] = [];
