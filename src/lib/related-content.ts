// ─────────────────────────────────────────────────────────────────────────────
// Shared "related content" picker for ArticleLayout and ComparisonLayout.
// Replaces the old hardcoded relatedArticles/moreNews placeholder arrays,
// which pointed at pages that were never published and 404'd. Pulls real
// entries from news/guides/comparisons: same-collection items first (most
// recent), then backfills from the other two collections by recency.
// ─────────────────────────────────────────────────────────────────────────────

import { getCollection } from 'astro:content';

export type RelatedCollection = 'news' | 'guides' | 'comparisons';

export interface RelatedCard {
  category: string;
  title: string;
  href: string;
  date: string;
  gradient: string;
}

const COLLECTION_BASE: Record<RelatedCollection, string> = {
  news: '/news',
  guides: '/guides',
  comparisons: '/comparisons',
};

const GRADIENTS = [
  'linear-gradient(135deg,#1a1520,#0d0d18)',
  'linear-gradient(135deg,#1f2010,#131708)',
  'linear-gradient(135deg,#101a20,#08131a)',
];

interface PoolItem {
  collection: RelatedCollection;
  slug: string;
  title: string;
  category: string;
  date: Date;
}

const byDateDesc = (a: PoolItem, b: PoolItem) => b.date.valueOf() - a.date.valueOf();

export async function getRelatedContent(
  currentCollection?: RelatedCollection,
  currentSlug?: string,
  limit = 3,
): Promise<RelatedCard[]> {
  const [news, guides, comparisons] = await Promise.all([
    getCollection('news'),
    getCollection('guides'),
    getCollection('comparisons'),
  ]);

  const pool: PoolItem[] = [
    ...news.map(e => ({ collection: 'news' as const, slug: e.slug, title: e.data.title, category: e.data.category, date: e.data.date })),
    ...guides.map(e => ({ collection: 'guides' as const, slug: e.slug, title: e.data.title, category: e.data.category, date: e.data.date })),
    ...comparisons.map(e => ({ collection: 'comparisons' as const, slug: e.slug, title: e.data.title, category: e.data.category, date: e.data.date })),
  ].filter(item => !(item.collection === currentCollection && item.slug === currentSlug));

  const sameCollection = pool
    .filter(item => item.collection === currentCollection)
    .sort(byDateDesc);
  const rest = pool
    .filter(item => item.collection !== currentCollection)
    .sort(byDateDesc);

  return [...sameCollection, ...rest].slice(0, limit).map((item, i) => ({
    category: item.category,
    title: item.title,
    href: `${COLLECTION_BASE[item.collection]}/${item.slug}`,
    date: item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
    gradient: GRADIENTS[i % GRADIENTS.length],
  }));
}
