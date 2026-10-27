import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export function slugifyTaxonomy(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function assertUniqueArticleSlugs(articles: Article[]) {
  const seen = new Set<string>();

  for (const article of articles) {
    if (seen.has(article.data.slug)) {
      throw new Error(`Duplicate article slug "${article.data.slug}".`);
    }
    seen.add(article.data.slug);
  }
}

function assertUniqueTaxonomyRoutes(articles: Article[], label: 'category' | 'series') {
  const routeLabels = new Map<string, string>();
  const values = articles
    .map((article) => article.data[label])
    .filter((value): value is string => Boolean(value));

  for (const value of new Set(values)) {
    const routeSlug = slugifyTaxonomy(value);
    if (!routeSlug) {
      throw new Error(`The ${label} "${value}" does not produce a valid route.`);
    }

    const previousLabel = routeLabels.get(routeSlug);
    if (previousLabel && previousLabel !== value) {
      throw new Error(
        `The ${label} names "${previousLabel}" and "${value}" resolve to the same route.`,
      );
    }
    routeLabels.set(routeSlug, value);
  }
}

/**
 * Public pages use this single accessor so drafts never enter generated routes
 * or public listings.
 */
export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getCollection(
    'articles',
    ({ data }) => data.status === 'published',
  );

  assertUniqueArticleSlugs(articles);
  assertUniqueTaxonomyRoutes(articles, 'category');
  assertUniqueTaxonomyRoutes(articles, 'series');

  return articles.sort(
    (left, right) =>
      left.data.publicationDate.valueOf() - right.data.publicationDate.valueOf() ||
      left.data.slug.localeCompare(right.data.slug),
  );
}
