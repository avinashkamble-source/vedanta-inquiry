import type { Article } from './articles';

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  articleSlugs: string[];
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'starting-with-self-inquiry',
    title: 'Starting with self-inquiry',
    description:
      'Move from asking a question to examining what is directly present in experience.',
    articleSlugs: [
      'the-value-of-a-question',
      'what-is-the-self',
      'not-an-escape',
    ],
  },
  {
    slug: 'bringing-inquiry-into-daily-life',
    title: 'Bringing inquiry into daily life',
    description:
      'Take careful attention into ordinary moments, decisions, and relationships.',
    articleSlugs: ['not-an-escape', 'the-value-of-a-question'],
  },
];

export interface ResolvedLearningPath extends LearningPath {
  articles: Article[];
}

export function resolveLearningPaths(
  publishedArticles: Article[],
): ResolvedLearningPath[] {
  const articleBySlug = new Map(
    publishedArticles.map((article) => [article.data.slug, article]),
  );
  const seenPaths = new Set<string>();

  return learningPaths.map((path) => {
    if (seenPaths.has(path.slug)) {
      throw new Error(`Duplicate learning path slug "${path.slug}".`);
    }
    seenPaths.add(path.slug);

    const articles = path.articleSlugs.map((slug) => {
      const article = articleBySlug.get(slug);
      if (!article) {
        throw new Error(
          `Learning path "${path.title}" references unpublished or missing article "${slug}".`,
        );
      }
      return article;
    });

    return { ...path, articles };
  });
}
