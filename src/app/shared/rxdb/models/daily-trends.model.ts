export interface DailyTrends {
    items: DailyTrendsItem[];
}

export interface DailyTrendsItem {
    title: Title | null;
    formattedTraffic: string | null;
    relatedQueries: RelatedQuery[];
    image: Image | null;
    articles: Article[] | null;
    shareUrl: string | null;
}

export interface Article {
    title: string | null;
    timeAgo: string | null;
    source: string | null;
    image: Image | null;
    url: string | null;
    snippet: string | null;
}

export interface Image {
    newsUrl: string | null;
    source: string | null;
    imageUrl: string | null;
}

export interface RelatedQuery {
    queries: RelatedQueries[];
}

export interface Title {
    exploreLink: string | null;
    query: string | null;
}

export interface RelatedQueries {
    queryItem: string | null;
}
