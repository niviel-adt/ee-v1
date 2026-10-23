export type NewsPost = {
 id: string;
 date: string;
 category: string;
 title: string;
 summary: string;
 paragraphs: string[];
 link: {href: string; label: string};
};

// Use the actual announcement date and a permanent, unique ID for each post.
export const news: NewsPost[] = [{
 id: 'community-recruitment-october-2026',
 date: '2026-10-21',
 category: 'Community',
 title: 'A place in the collective: 10 community slots announced',
 summary: 'Exalted Era announced 10 community slots. Get to know the team and ask about joining our community.',
 paragraphs: [
  'This recruitment announcement is for community membership. Competitive player positions have not been announced as part of this update.',
  'Visit our recruitment page for an introduction to the process and useful details to prepare. Contact the team on Discord to confirm remaining availability and any joining requirements.',
  'The number reflects the original announcement, not a live availability counter. Joining Discord does not submit an application or reserve a slot.',
 ],
 link: {href: '/recruitment', label: 'Explore community recruitment'},
}];
